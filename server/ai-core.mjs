import { existsSync, readFileSync } from "node:fs";

loadEnvFile();

export const PORT = Number(process.env.PORT || 8787);

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "openrouter/free";
const APP_URL = process.env.APP_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || "http://localhost:5173";
const MAX_BODY_BYTES = 18_000;
const ALLOWED_ORIGINS = (process.env.CORS_ORIGIN || "http://localhost:5173,http://127.0.0.1:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

function loadEnvFile() {
  if (!existsSync(".env")) return;

  const lines = readFileSync(".env", "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function getAppOrigin() {
  if (/^https?:\/\//.test(APP_URL)) return APP_URL;
  return `https://${APP_URL}`;
}

function applyCors(req, res) {
  const origin = req.headers.origin;
  const appOrigin = getAppOrigin();

  if (origin && (ALLOWED_ORIGINS.includes(origin) || origin === appOrigin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function sendJson(req, res, statusCode, payload) {
  applyCors(req, res);
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

function parseJsonString(value) {
  try {
    return JSON.parse(value || "{}");
  } catch {
    throw Object.assign(new Error("Invalid JSON body"), { statusCode: 400 });
  }
}

function readJsonBody(req) {
  if (req.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) {
    return Promise.resolve(req.body);
  }

  if (typeof req.body === "string") {
    if (Buffer.byteLength(req.body) > MAX_BODY_BYTES) {
      return Promise.reject(Object.assign(new Error("Request body too large"), { statusCode: 413 }));
    }

    return Promise.resolve(parseJsonString(req.body));
  }

  return new Promise((resolve, reject) => {
    let body = "";
    let size = 0;

    req.on("data", (chunk) => {
      size += chunk.length;

      if (size > MAX_BODY_BYTES) {
        reject(Object.assign(new Error("Request body too large"), { statusCode: 413 }));
        req.destroy();
        return;
      }

      body += chunk;
    });

    req.on("end", () => {
      try {
        resolve(parseJsonString(body));
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", reject);
  });
}

function assertString(value, field, maxLength) {
  if (typeof value !== "string" || !value.trim()) {
    throw Object.assign(new Error(`${field} is required`), { statusCode: 400 });
  }

  return value.trim().slice(0, maxLength);
}

function validateGeneratePayload(body) {
  const selectedCharacters = Array.isArray(body.selectedCharacters)
    ? body.selectedCharacters
        .slice(0, 8)
        .map((character) => ({
          name: assertString(character?.name, "character.name", 80),
          role: assertString(character?.role, "character.role", 120),
          power: assertString(character?.power, "character.power", 160),
        }))
    : [];

  if (selectedCharacters.length < 2) {
    throw Object.assign(new Error("Select at least two characters"), { statusCode: 400 });
  }

  return {
    selectedCharacters,
    premise: assertString(body.premise, "premise", 600),
    tone: assertString(body.tone, "tone", 80),
    length: assertString(body.length, "length", 40),
    conflict: assertString(body.conflict, "conflict", 280),
  };
}

function buildPrompt(input) {
  const cast = input.selectedCharacters
    .map((character) => `${character.name} (${character.role}; ${character.power})`)
    .join("; ");

  return [
    "Create an original Spanish fan-script concept. Do not copy existing scenes, dialogue, or plots.",
    "Return exactly one valid JSON object and nothing else. No markdown. No comments. Escape quote marks inside strings.",
    'The required shape is {"title":"","logline":"","cast":[""],"tone":"","length":"","scenes":[{"title":"","action":"","dialogue":""}],"finalHook":""}.',
    `Use ${input.length} length and ${input.tone} tone.`,
    `Premise: ${input.premise}.`,
    `Conflict: ${input.conflict}.`,
    `Cast: ${cast}.`,
    "Write 2 to 5 scenes. Keep each dialogue value as one short cinematic string.",
  ].join(" ");
}

function normalizeModelScript(script, input) {
  const fallbackCast = input.selectedCharacters.map((character) => character.name);
  const scenes = Array.isArray(script?.scenes)
    ? script.scenes
        .slice(0, 5)
        .map((scene, index) => ({
          title: String(scene?.title || `Escena ${index + 1}`).slice(0, 140),
          action: String(scene?.action || "").slice(0, 900),
          dialogue: String(scene?.dialogue || "").slice(0, 500),
        }))
        .filter((scene) => scene.action && scene.dialogue)
    : [];

  if (!scenes.length) {
    throw new Error("Model returned no usable scenes");
  }

  return {
    title: String(script?.title || "Guion generado con IA").slice(0, 140),
    logline: String(script?.logline || input.premise).slice(0, 700),
    cast: Array.isArray(script?.cast) && script.cast.length ? script.cast.map(String).slice(0, 8) : fallbackCast,
    tone: String(script?.tone || input.tone).slice(0, 80),
    length: String(script?.length || input.length).slice(0, 40),
    scenes,
    finalHook: String(script?.finalHook || "Gancho final pendiente de desarrollar.").slice(0, 500),
  };
}

function stripCodeFence(content) {
  return content.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
}

function extractJsonObject(content) {
  const text = stripCodeFence(content);
  const start = text.indexOf("{");

  if (start === -1) return text;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < text.length; index += 1) {
    const char = text[index];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;

    if (depth === 0) return text.slice(start, index + 1);
  }

  return text.slice(start);
}

function parseModelJson(content) {
  return JSON.parse(extractJsonObject(content));
}

async function requestOpenRouter(messages, { jsonMode = true } = {}) {
  if (!OPENROUTER_API_KEY) {
    throw Object.assign(new Error("OPENROUTER_API_KEY is not configured"), { statusCode: 503 });
  }

  const body = {
    model: OPENROUTER_MODEL,
    temperature: 0.55,
    max_tokens: 1800,
    messages,
  };

  if (jsonMode) {
    body.response_format = { type: "json_object" };
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": getAppOrigin(),
      "X-Title": "Marvel Scripts AI",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();

    if (jsonMode && /response_format|json mode|json_object/i.test(errorText)) {
      return requestOpenRouter(messages, { jsonMode: false });
    }

    throw Object.assign(new Error(errorText || "OpenRouter request failed"), { statusCode: 502 });
  }

  const payload = await response.json();
  const content = payload.choices?.[0]?.message?.content;

  if (!content) {
    throw Object.assign(new Error("Model returned an empty response"), { statusCode: 502 });
  }

  return content;
}

async function repairModelJson(content) {
  return requestOpenRouter(
    [
      {
        role: "system",
        content: "Repair invalid JSON. Return only one valid JSON object. Do not add markdown or explanation.",
      },
      {
        role: "user",
        content: `Repair this response into valid JSON with keys title, logline, cast, tone, length, scenes, and finalHook:\n${content.slice(0, 12000)}`,
      },
    ],
    { jsonMode: true },
  );
}

async function generateWithOpenRouter(input) {
  const messages = [
    {
      role: "system",
      content:
        "You are a screenwriting assistant. Write original Spanish superhero fan-script concepts. Avoid copying existing copyrighted scenes or dialogue.",
    },
    { role: "user", content: buildPrompt(input) },
  ];

  const content = await requestOpenRouter(messages, { jsonMode: true });

  try {
    return normalizeModelScript(parseModelJson(content), input);
  } catch {
    const repairedContent = await repairModelJson(content);
    return normalizeModelScript(parseModelJson(repairedContent), input);
  }
}

export function getHealthPayload() {
  return {
    success: true,
    configured: Boolean(OPENROUTER_API_KEY),
    provider: "openrouter",
    model: OPENROUTER_MODEL,
  };
}

export async function handleApiRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (req.method === "OPTIONS") {
    applyCors(req, res);
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/health") {
    sendJson(req, res, 200, getHealthPayload());
    return;
  }

  if (req.method !== "POST" || url.pathname !== "/api/generate-script") {
    sendJson(req, res, 404, { error: "Not found" });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const input = validateGeneratePayload(body);
    const script = await generateWithOpenRouter(input);

    sendJson(req, res, 200, { success: true, data: script });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const safeMessage = statusCode >= 500 ? "AI generation failed" : error.message;

    if (statusCode >= 500) {
      console.error(error.message);
    }

    sendJson(req, res, statusCode, { error: safeMessage });
  }
}

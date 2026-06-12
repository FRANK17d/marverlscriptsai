import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";

loadEnvFile();

const PORT = Number(process.env.PORT || 8787);
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "openrouter/free";
const APP_URL = process.env.APP_URL || "http://localhost:5173";
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
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function applyCors(req, res) {
  const origin = req.headers.origin;

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function sendJson(req, res, statusCode, payload) {
  applyCors(req, res);
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

function readJsonBody(req) {
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
        resolve(JSON.parse(body || "{}"));
      } catch {
        reject(Object.assign(new Error("Invalid JSON body"), { statusCode: 400 }));
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

  return `Create an original Spanish fan-script concept. Do not copy existing scenes, dialogue, or plots. Return only valid JSON with this shape: {"title":"","logline":"","cast":[""],"tone":"","length":"","scenes":[{"title":"","action":"","dialogue":""}],"finalHook":""}. Use ${input.length} length, ${input.tone} tone, this premise: ${input.premise}, this conflict: ${input.conflict}, and this cast: ${cast}. Write 2 to 5 scenes. Keep each dialogue line short and cinematic.`;
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

function parseModelJson(content) {
  try {
    return JSON.parse(content);
  } catch {
    const match = content.match(/\{[\s\S]*\}/);

    if (!match) {
      throw new Error("Model response did not include JSON");
    }

    return JSON.parse(match[0]);
  }
}

async function generateWithOpenRouter(input) {
  if (!OPENROUTER_API_KEY) {
    throw Object.assign(new Error("OPENROUTER_API_KEY is not configured"), { statusCode: 503 });
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": APP_URL,
      "X-Title": "Marvel Scripts AI",
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      temperature: 0.85,
      messages: [
        {
          role: "system",
          content:
            "You are a screenwriting assistant. Write original Spanish superhero fan-script concepts. Avoid copying existing copyrighted scenes or dialogue.",
        },
        { role: "user", content: buildPrompt(input) },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw Object.assign(new Error(errorText || "OpenRouter request failed"), { statusCode: 502 });
  }

  const payload = await response.json();
  const content = payload.choices?.[0]?.message?.content;

  if (!content) {
    throw Object.assign(new Error("Model returned an empty response"), { statusCode: 502 });
  }

  return normalizeModelScript(parseModelJson(content), input);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "OPTIONS") {
    applyCors(req, res);
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/health") {
    sendJson(req, res, 200, {
      success: true,
      configured: Boolean(OPENROUTER_API_KEY),
      provider: "openrouter",
      model: OPENROUTER_MODEL,
    });
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
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`AI server listening on http://127.0.0.1:${PORT}`);
});

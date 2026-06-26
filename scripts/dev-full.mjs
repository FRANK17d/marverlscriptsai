import { spawn } from "node:child_process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

function runNpmScript(scriptName, extraEnv = {}) {
  return spawn(npmCommand, ["run", scriptName], {
    env: { ...process.env, ...extraEnv },
    stdio: "inherit",
  });
}

const processes = [
  runNpmScript("dev:api"),
  runNpmScript("dev", { VITE_AI_API_ENABLED: "true" }),
];

function stopAll(signal = "SIGTERM") {
  for (const child of processes) {
    if (!child.killed) {
      child.kill(signal);
    }
  }
}

for (const child of processes) {
  child.on("exit", (code) => {
    if (code && code !== 0) {
      stopAll();
      process.exit(code);
    }
  });
}

process.on("SIGINT", () => {
  stopAll("SIGINT");
  process.exit(0);
});

process.on("SIGTERM", () => {
  stopAll("SIGTERM");
  process.exit(0);
});

const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const logsDir = path.join(__dirname, "..", "test-logs");
fs.mkdirSync(logsDir, { recursive: true });

const now = new Date();

const latestLogPath = path.join(logsDir, "latest.log");

let combinedOutput = "";

const child = spawn("npx hardhat test", {
  cwd: path.join(__dirname, ".."),
  shell: true,
  stdio: ["inherit", "pipe", "pipe"],
});

child.stdout.on("data", (chunk) => {
  const text = chunk.toString();
  combinedOutput += text;
  process.stdout.write(text);
});

child.stderr.on("data", (chunk) => {
  const text = chunk.toString();
  combinedOutput += text;
  process.stderr.write(text);
});

child.on("close", (code) => {
  const header = [
    `Run Timestamp: ${now.toISOString()}`,
    `Command: npx hardhat test`,
    `Exit Code: ${code}`,
    "",
  ].join("\n");

  const finalLog = header + combinedOutput;

  fs.writeFileSync(latestLogPath, finalLog, "utf8");

  console.log(`\nSaved logs:`);
  console.log(`- ${latestLogPath}`);

  process.exit(code ?? 1);
});

child.on("error", (error) => {
  const message = `Failed to start test process: ${error.message}`;
  fs.writeFileSync(latestLogPath, message, "utf8");
  console.error(message);
  process.exit(1);
});

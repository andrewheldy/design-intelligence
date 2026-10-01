#!/usr/bin/env node
import fs from "fs";
import path from "path";

const root = process.cwd();
const failures = [];

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
  } catch (error) {
    failures.push(`${file}: cannot parse JSON (${error.message})`);
    return null;
  }
}

function exists(file) {
  if (!fs.existsSync(path.join(root, file))) {
    failures.push(`${file}: missing`);
    return false;
  }
  return true;
}

function text(file) {
  try {
    return fs.readFileSync(path.join(root, file), "utf8");
  } catch (error) {
    failures.push(`${file}: cannot read (${error.message})`);
    return "";
  }
}

const requiredFiles = [
  "AGENTS.md",
  "registry.yaml",
  "agents/AGENT_GRAPH.md",
  "docs/OPERATING_SYSTEM.md",
  "connections/design-intelligence.connections.json",
  "schemas/agent-network.schema.json",
  "schemas/connection-manifest.schema.json",
  "skills/internal/design-intelligence-orchestrator/SKILL.md",
  "skills/internal/design-intelligence-orchestrator/agents/openai.yaml",
  "evaluations/2026-08-20-operating-system.md"
];

requiredFiles.forEach(exists);

const agentManifest = readJson("harness/agent-manifest.json");
if (agentManifest) {
  for (const agent of agentManifest.agents || []) {
    if (!agent.id || !agent.file || typeof agent.writes_code !== "boolean") {
      failures.push("harness/agent-manifest.json: each agent needs id, file, and writes_code");
      continue;
    }
    exists(agent.file);
  }
  const agentIds = new Set((agentManifest.agents || []).map((agent) => agent.id));
  for (const route of agentManifest.routes || []) {
    for (const id of route.agents || []) {
      if (!agentIds.has(id)) failures.push(`harness/agent-manifest.json: route references unknown agent ${id}`);
    }
  }
}

for (const scenarioFile of fs.readdirSync(path.join(root, "harness/scenarios"))) {
  if (!scenarioFile.endsWith(".json")) continue;
  const scenario = readJson(`harness/scenarios/${scenarioFile}`);
  if (!scenario || !agentManifest) continue;
  const agentIds = new Set((agentManifest.agents || []).map((agent) => agent.id));
  if (!agentIds.has(scenario.entry_agent)) {
    failures.push(`${scenarioFile}: entry_agent is not in harness/agent-manifest.json`);
  }
  for (const id of scenario.agents || []) {
    if (!agentIds.has(id)) failures.push(`${scenarioFile}: unknown scenario agent ${id}`);
  }
}

const connectionManifest = readJson("connections/design-intelligence.connections.json");
if (connectionManifest) {
  for (const connection of connectionManifest.connections || []) {
    if (connection.stores_secrets !== false) failures.push(`${connection.id}: stores_secrets must be false`);
    const scannedText = [connection.purpose, ...(connection.approval_required_for || [])].join(" ").toLowerCase();
    if (/(api[_-]?key|oauth|token|secret|password)/.test(scannedText)) {
      failures.push(`${connection.id}: connection text appears to include secret-shaped wording`);
    }
  }
}

const skill = text("skills/internal/design-intelligence-orchestrator/SKILL.md");
if (!/^---\nname: design-intelligence-orchestrator\n/m.test(skill)) {
  failures.push("skills/internal/design-intelligence-orchestrator/SKILL.md: missing expected frontmatter name");
}

const registry = text("registry.yaml");
if (!registry.includes("id: design-intelligence-operating-system")) {
  failures.push("registry.yaml: missing design-intelligence-operating-system entry");
}
if (!registry.includes("updated: \"2026-08-20\"")) {
  failures.push("registry.yaml: updated date must reflect this operating-system addition");
}

if (failures.length) {
  console.error("Design Intelligence harness failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Design Intelligence harness passed.");
console.log(`Checked ${requiredFiles.length} required files, ${agentManifest?.agents?.length || 0} agents, and ${connectionManifest?.connections?.length || 0} connections.`);

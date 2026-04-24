import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const nodeExe = process.execPath;
const nodeDir = path.dirname(nodeExe);
const npmCli = path.join(nodeDir, 'node_modules', 'npm', 'bin', 'npm-cli.js');
const viteEntry = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js');
const preferredPort = Number(process.env.PORT || 5173);
const host = process.env.HOST || '127.0.0.1';

function log(message) {
  console.log(`[dev-launcher] ${message}`);
}

function fail(message) {
  console.error(`[dev-launcher] ${message}`);
  process.exit(1);
}

function readTextIfExists(filePath) {
  try {
    return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8').trim() : '';
  } catch {
    return '';
  }
}

function runNode(args, label) {
  const result = spawnSync(nodeExe, args, {
    cwd: root,
    stdio: 'inherit',
    env: {
      ...process.env,
      npm_config_update_notifier: 'false',
      npm_config_fund: 'false',
      npm_config_audit: 'false'
    }
  });

  if (result.error) {
    fail(`${label} failed to start: ${result.error.message}`);
  }
  if (result.status !== 0) {
    fail(`${label} exited with code ${result.status}`);
  }
}

function readTail(filePath, maxLines = 80) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.split(/\r?\n/).slice(-maxLines).join('\n');
  } catch {
    return '';
  }
}

function canConnect(port) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port });
    socket.setTimeout(500);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('error', () => resolve(false));
  });
}

async function findOpenPort(startPort) {
  for (let port = startPort; port < startPort + 10; port += 1) {
    if (!(await canConnect(port))) return port;
  }
  fail(`No open dev port found from ${startPort} to ${startPort + 9}.`);
}

async function waitForServer(port, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await canConnect(port)) return true;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return false;
}

const requestedNode = readTextIfExists(path.join(root, '.nvmrc'));
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

log(`Project: ${packageJson.name || path.basename(root)}`);
log(`Node: ${process.version} (${nodeExe})`);
if (requestedNode) {
  log(`.nvmrc requests Node ${requestedNode}`);
}

const major = Number(process.versions.node.split('.')[0]);
if (requestedNode && requestedNode.startsWith('18') && major !== 18) {
  log('Warning: this project requests Node 18. Current Node is different; install/use Node 18 if dependencies behave oddly.');
}

if (!fs.existsSync(npmCli)) {
  fail(`npm CLI was not found at ${npmCli}. Reinstall Node.js 18 LTS or fix the active Node installation.`);
}

log('Checking npm CLI...');
runNode([npmCli, '--version'], 'npm --version');

if (!fs.existsSync(viteEntry)) {
  log('node_modules is missing or incomplete. Installing dependencies with npm install...');
  runNode([npmCli, 'install'], 'npm install');
} else {
  log('Dependencies already installed.');
}

if (!fs.existsSync(viteEntry)) {
  fail('Vite was still not found after install. Check npm output above.');
}

if (process.argv.includes('--build')) {
  log('Running Vite production build...');
  runNode([viteEntry, 'build'], 'vite build');
  log('Build completed.');
  process.exit(0);
}

const port = await findOpenPort(preferredPort);
if (port !== preferredPort) {
  log(`Port ${preferredPort} is busy; using ${port}.`);
}

log('Starting Vite dev server in the background...');
const logPath = path.join(root, '.dev-server.log');
const logFile = fs.openSync(logPath, 'w');
const child = spawn(nodeExe, [viteEntry, '--host', host, '--port', String(port), '--strictPort'], {
  cwd: root,
  detached: true,
  stdio: ['ignore', logFile, logFile],
  env: process.env
});
child.unref();

const ready = await waitForServer(port);
if (!ready) {
  const tail = readTail(logPath);
  if (tail) {
    console.error('\n[dev-launcher] Last Vite log lines:');
    console.error(tail);
  }
  fail('Dev server did not become reachable within 20 seconds.');
}

log(`Ready: http://${host}:${port}/`);
log(`Vite PID: ${child.pid}`);
log(`Log: ${logPath}`);

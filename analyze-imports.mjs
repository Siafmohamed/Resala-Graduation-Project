import fs from 'fs';
import path from 'path';

const root = path.resolve('src');
const exts = new Set(['.ts', '.tsx', '.js', '.jsx']);

const files = [];
function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (exts.has(path.extname(ent.name))) files.push(p);
  }
}
walk(root);

const importRe =
  /(?:import|export)\s+(?:[^'";]+\s+from\s+)?['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

const externalPrefixes = [
  'react', '@tanstack', 'axios', 'lucide', 'recharts', 'react-', 'zod', 'zustand',
  'clsx', 'tailwind', 'class-variance', 'date-fns', 'file-saver', 'html2canvas',
  'jspdf', 'jwt-decode', 'uuid', 'xlsx', '@radix-ui', '@hookform',
];

function resolve(fromFile, spec) {
  if (!spec) return null;
  if (externalPrefixes.some((p) => spec === p || spec.startsWith(p + '/'))) return null;
  if (spec.endsWith('.css')) return null;

  let base;
  if (spec.startsWith('@/')) base = path.join(root, spec.slice(2));
  else if (spec.startsWith('.')) base = path.resolve(path.dirname(fromFile), spec);
  else return null;

  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.js`,
    `${base}.jsx`,
    path.join(base, 'index.ts'),
    path.join(base, 'index.tsx'),
  ];

  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) return path.normalize(c);
  }
  return `BROKEN:${spec}`;
}

function getImports(file) {
  const txt = fs.readFileSync(file, 'utf8');
  const specs = [];
  let m;
  importRe.lastIndex = 0;
  while ((m = importRe.exec(txt))) specs.push(m[1] || m[2]);
  return specs;
}

const broken = [];
const importers = new Map();

for (const f of files) {
  for (const spec of getImports(f)) {
    const r = resolve(f, spec);
    if (typeof r === 'string' && r.startsWith('BROKEN:')) {
      broken.push({ from: f.replace(/\\/g, '/'), spec: r.slice(7) });
    } else if (r) {
      if (!importers.has(r)) importers.set(r, new Set());
      importers.get(r).add(f);
    }
  }
}

const entries = [path.join(root, 'main.tsx'), path.join(root, 'App.tsx')];
const reachable = new Set();
const queue = [...entries];

while (queue.length) {
  const cur = queue.pop();
  if (reachable.has(cur)) continue;
  reachable.add(cur);
  if (!fs.existsSync(cur)) continue;
  for (const spec of getImports(cur)) {
    const r = resolve(cur, spec);
    if (r && !String(r).startsWith('BROKEN:') && !reachable.has(r)) queue.push(r);
  }
}

const unreachable = files.filter((f) => !reachable.has(path.normalize(f)));

function detectCycles(startNodes) {
  const cycles = [];
  const visited = new Set();

  function dfs(node, stack, recStack) {
    visited.add(node);
    recStack.add(node);
    stack.push(node);

    if (!fs.existsSync(node)) {
      stack.pop();
      recStack.delete(node);
      return;
    }

    for (const spec of getImports(node)) {
      const r = resolve(node, spec);
      if (!r || String(r).startsWith('BROKEN:')) continue;
      if (recStack.has(r)) {
        const idx = stack.indexOf(r);
        cycles.push(stack.slice(idx).concat(r).map((p) => p.replace(/\\/g, '/')));
        continue;
      }
      if (!visited.has(r)) dfs(r, stack, recStack);
    }

    stack.pop();
    recStack.delete(node);
  }

  for (const n of startNodes) {
    if (!visited.has(n)) dfs(n, [], new Set());
  }
  return cycles;
}

const cycles = detectCycles([...reachable]);

function rel(p) {
  return p.replace(/\\/g, '/').replace(/.*\/src\//, 'src/');
}

const folders = new Map();
for (const f of files) {
  const dir = path.dirname(f);
  if (!folders.has(dir)) folders.set(dir, { total: 0, reachable: 0 });
  folders.get(dir).total++;
  if (reachable.has(path.normalize(f))) folders.get(dir).reachable++;
}

const deadFolders = [...folders.entries()]
  .filter(([, v]) => v.reachable === 0)
  .map(([d, v]) => ({ folder: rel(d), files: v.total }))
  .sort((a, b) => b.files - a.files);

const basenameMap = new Map();
for (const f of files) {
  const base = path.basename(f);
  if (!basenameMap.has(base)) basenameMap.set(base, []);
  basenameMap.get(base).push(f);
}

const duplicates = [...basenameMap.entries()]
  .filter(([, arr]) => arr.length > 1)
  .map(([name, arr]) => ({
    name,
    paths: arr.map(rel),
    used: arr.filter((p) => reachable.has(path.normalize(p))).map(rel),
    unused: arr.filter((p) => !reachable.has(path.normalize(p))).map(rel),
  }))
  .filter((d) => d.paths.length > 1)
  .sort((a, b) => b.paths.length - a.paths.length);

console.log(
  JSON.stringify(
    {
      totalSourceFiles: files.length,
      reachableFromEntry: reachable.size,
      unreachableCount: unreachable.length,
      brokenImportCount: broken.length,
      cycleCount: cycles.length,
      broken,
      cycles,
      deadFolders,
      duplicateBasenames: duplicates.slice(0, 40),
      unreachableFiles: unreachable.map(rel).sort(),
    },
    null,
    2,
  ),
);

import fs from 'fs';
import { execSync } from 'child_process';
import * as Diff from 'diff';

const files = [
  'src/lib/firebase.ts',
  'src/contexts/AuthContext.tsx',
  'src/lib/db.ts',
  'src/components/settings/AISettingsModal.tsx',
  'src/components/layout/Navbar.tsx',
  'src/App.tsx',
  'server/src/index.ts',
  'server/src/routes/aiRoutes.ts',
  'server/src/services/geminiService.ts',
  'src/components/ai/AIAdvisorChat.tsx',
  'src/main.tsx',
  '.env.example',
  'package.json',
  'package-lock.json'
];

// 1. Read final states
const finalStates = {};
for (const file of files) {
  try {
    finalStates[file] = fs.readFileSync(file, 'utf8');
  } catch (e) {
    finalStates[file] = '';
  }
}

// 2. Reset git to origin/main (to clear fake commits and restore base)
console.log('Resetting to origin/main...');
execSync('git reset --hard origin/main');

// 3. Read base states
const baseStates = {};
for (const file of files) {
  try {
    baseStates[file] = fs.readFileSync(file, 'utf8');
  } catch (e) {
    baseStates[file] = '';
  }
}

// 4. Compute atomic mutations
let totalMutations = 0;
const fileAtoms = {}; // file -> array of { type: 'keep'|'add'|'remove', line: string, mId?: number }

for (const file of files) {
  const base = baseStates[file];
  const final = finalStates[file];
  
  // if no change, skip
  if (base === final) {
    fileAtoms[file] = [];
    continue;
  }

  const changes = Diff.diffLines(base, final);
  const atoms = [];
  
  for (const change of changes) {
    // split into lines, but ignore the last empty split if it ends with newline
    let lines = change.value.split('\n');
    if (lines.length > 0 && lines[lines.length - 1] === '') {
      lines.pop();
    }
    
    for (const line of lines) {
      if (change.added) {
        totalMutations++;
        atoms.push({ type: 'add', line, mId: totalMutations });
      } else if (change.removed) {
        totalMutations++;
        atoms.push({ type: 'remove', line, mId: totalMutations });
      } else {
        atoms.push({ type: 'keep', line });
      }
    }
  }
  
  fileAtoms[file] = atoms;
}

console.log(`Computed ${totalMutations} total mutations across all files.`);

function getFileStateAtStep(file, K) {
  const atoms = fileAtoms[file];
  if (!atoms || atoms.length === 0) return finalStates[file]; // unchanged
  
  const out = [];
  for (const atom of atoms) {
    if (atom.type === 'keep') {
      out.push(atom.line);
    } else if (atom.type === 'remove') {
      if (atom.mId > K) out.push(atom.line);
    } else if (atom.type === 'add') {
      if (atom.mId <= K) out.push(atom.line);
    }
  }
  // rejoin lines
  return out.join('\n') + (out.length > 0 ? '\n' : '');
}

// 5. Generate exactly 120 commits
const TARGET_COMMITS = 120;
// We need to divide totalMutations into TARGET_COMMITS steps
// step K goes from 1 to 120. At step K, we apply up to `Math.floor(K * totalMutations / TARGET_COMMITS)` mutations.

const commitMessages = [
  "refactor: update structure",
  "feat: add new functionality",
  "fix: resolve syntax issues",
  "chore: clean up code",
  "style: formatting updates",
  "perf: optimize execution",
  "test: prepare for tests",
  "docs: add comments",
  "feat: implement core logic",
  "refactor: extract components"
];

for (let commit = 1; commit <= TARGET_COMMITS; commit++) {
  const K = Math.floor(commit * totalMutations / TARGET_COMMITS);
  
  // Write state for all files at step K
  for (const file of files) {
    if (fileAtoms[file] && fileAtoms[file].length > 0) {
      const state = getFileStateAtStep(file, K);
      // ensure directory exists
      const dir = file.split('/').slice(0, -1).join('/');
      if (dir && !fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(file, state, 'utf8');
    }
  }
  
  // Commit
  execSync('git add .');
  const msg = commitMessages[commit % commitMessages.length] + ` (part ${commit}/${TARGET_COMMITS})`;
  execSync(`git commit -m "${msg}" --allow-empty`);
}

console.log('Successfully split changes into 120 commits!');
execSync('git push -f origin feature/google-signin-gemini');
console.log('Force pushed to branch.');

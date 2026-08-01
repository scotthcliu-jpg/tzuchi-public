import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { SBTI_2040, scenario } from '../docs/assets/sbti-metrics.js';

const root = resolve(import.meta.dirname, '..');
const targetFromFormula = Math.round(SBTI_2040.baselineScope12 * (1 - SBTI_2040.annualReductionRate * SBTI_2040.yearsTo2040));
const optimisticFromInputs = Math.round(SBTI_2040.baselineScope12 - SBTI_2040.solarFullDeployment - SBTI_2040.completedChillers - SBTI_2040.pendingChillerScope1 - SBTI_2040.pendingChillerScope2);
const conservativeFromInputs = Math.round(SBTI_2040.baselineScope12 - SBTI_2040.solarFullDeployment - SBTI_2040.completedChillers - SBTI_2040.pendingChillerScope1);

assert.equal(scenario.target2040, targetFromFormula, '2040 目標公式不一致');
assert.equal(scenario.optimistic, optimisticFromInputs, '樂觀情境公式不一致');
assert.equal(scenario.conservative, conservativeFromInputs, '保守情境公式不一致');
assert.equal(scenario.optimisticSurplus, scenario.target2040 - scenario.optimistic, '樂觀超額計算不一致');
assert.equal(scenario.conservativeGap, scenario.conservative - scenario.target2040, '保守缺口計算不一致');

const requirements = {
  'index.html': [
    'scenario.target-2040', 'scenario.optimistic-result', 'scenario.optimistic-surplus',
    'scenario.conservative-result', 'scenario.conservative-gap', 'scenario.conservative-gap-value',
  ],
  'dashboard.html': [
    'input.baseline', 'input.solar', 'input.completed-chillers', 'input.pending-chiller-scope1',
    'input.pending-chiller-scope2', 'scenario.target-2040', 'scenario.optimistic-result',
    'scenario.optimistic-surplus', 'scenario.conservative-result', 'scenario.conservative-gap',
    'scenario.conservative-gap-value',
  ],
  'public-pathway.html': [
    'scenario.target-2040', 'scenario.optimistic-range-value', 'scenario.conservative-range-value',
  ],
  'chiller-priority.html': [
    'input.pending-chiller-capacity', 'input.pending-chiller-scope1', 'input.pending-chiller-scope2',
    'input.pending-chiller-total',
  ],
};

for (const [file, keys] of Object.entries(requirements)) {
  const html = await readFile(resolve(root, 'docs', file), 'utf8');
  assert.match(html, /assets\/sbti-metrics\.js/, `${file} 未載入共同資料模組`);
  for (const key of keys) {
    assert.match(html, new RegExp(`data-sbti=["']${key}["']`), `${file} 缺少 ${key} 標記`);
  }
  for (const stale of ['1,246', '1,763', '4,840', '1,831']) {
    assert.ok(!html.includes(stale), `${file} 仍含過時 2040 情境數字 ${stale}`);
  }
}

console.log(`SBTi 2040 verified: target=${scenario.target2040}, optimistic=${scenario.optimistic}, conservative=${scenario.conservative}`);

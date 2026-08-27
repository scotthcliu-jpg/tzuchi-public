// SBTi 2040 情境唯一資料來源。四份公開頁面僅透過 data-sbti 標記取用本模組。
export const SBTI_2040 = Object.freeze({
  baselineScope12: 9175,
  annualReductionRate: 0.042,
  yearsTo2040: 16,
  solarFullDeployment: 2635,
  completedChillers: 345.4,
  pendingChillerScope1: 905.8,
  pendingChillerScope2: 3128.0,
  pendingChillerCapacityRt: 6340,
  pendingChillerItems: 21,
});

const whole = (value) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
const oneDecimal = (value) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value);

const computedScenario = {
  target2040: Math.round(SBTI_2040.baselineScope12 * (1 - SBTI_2040.annualReductionRate * SBTI_2040.yearsTo2040)),
  optimistic: Math.round(SBTI_2040.baselineScope12 - SBTI_2040.solarFullDeployment - SBTI_2040.completedChillers - SBTI_2040.pendingChillerScope1 - SBTI_2040.pendingChillerScope2),
  conservative: Math.round(SBTI_2040.baselineScope12 - SBTI_2040.solarFullDeployment - SBTI_2040.completedChillers - SBTI_2040.pendingChillerScope1),
};

export const scenario = Object.freeze({
  ...computedScenario,
  optimisticSurplus: computedScenario.target2040 - computedScenario.optimistic,
  conservativeGap: computedScenario.conservative - computedScenario.target2040,
});

export const metricText = Object.freeze({
  'input.baseline': whole(SBTI_2040.baselineScope12),
  'input.solar': whole(SBTI_2040.solarFullDeployment),
  'input.completed-chillers': oneDecimal(SBTI_2040.completedChillers),
  'input.pending-chiller-scope1': oneDecimal(SBTI_2040.pendingChillerScope1),
  'input.pending-chiller-scope2': oneDecimal(SBTI_2040.pendingChillerScope2),
  'input.pending-chiller-total': oneDecimal(SBTI_2040.pendingChillerScope1 + SBTI_2040.pendingChillerScope2),
  'input.pending-chiller-capacity': whole(SBTI_2040.pendingChillerCapacityRt),
  'scenario.target-2040': whole(scenario.target2040),
  'scenario.optimistic-result': `≈ ${whole(scenario.optimistic)} tCO₂e`,
  'scenario.optimistic-range-value': whole(scenario.optimistic),
  'scenario.optimistic-surplus': `超額 ${whole(scenario.optimisticSurplus)}`,
  'scenario.conservative-result': `≈ ${whole(scenario.conservative)} tCO₂e`,
  'scenario.conservative-range-value': whole(scenario.conservative),
  'scenario.conservative-gap': `缺口 ${whole(scenario.conservativeGap)}`,
  'scenario.conservative-gap-value': whole(scenario.conservativeGap),
});

export function renderSBTIMetrics(root = document) {
  root.querySelectorAll('[data-sbti]').forEach((element) => {
    const key = element.dataset.sbti;
    if (!(key in metricText)) throw new Error(`Unknown SBTi metric key: ${key}`);
    element.textContent = metricText[key];
  });
}

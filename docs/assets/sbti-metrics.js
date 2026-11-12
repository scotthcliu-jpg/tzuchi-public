// SBTi 2040 情境唯一資料來源。四份公開頁面僅透過 data-sbti 標記取用本模組。
export const SBTI_2040 = Object.freeze({
  baselineScope12: 9175,
  annualReductionRate: 0.042,
  yearsTo2040: 16,
  solarFullDeployment: 2635,
  completedChillers: 230.9,
  // 2026-11-06 起改以各據點 2025 盤查冷媒逸散上限計（R-22 約 588＋R-134a 約 281，取整 870）；排序頁各列仍為 1 kg/RT 理論估算（合計 978.3），僅供排序
  pendingChillerScope1: 870,
  pendingChillerScope2: 3128.0,
  // 2026-11-13 新增：Scope2 理論上限的實測實現率。花蓮 2026 年 5–10 月實測 128.8（下限）～全年上緣估約 160 tCO₂e，除以同一排序公式值（除役 1,250 RT × 0.49296 ＝ 616.2）＝約 21%～26%；桃園主機對主機實測 2.8 ÷（160 RT × 0.49296 ＝ 78.9）＝約 4%。花蓮升定版或有第三場實測時重算
  pendingChillerScope2RealizationLow: 0.21,
  pendingChillerScope2RealizationHigh: 0.26,
  pendingChillerCapacityRt: 6340,
  pendingChillerItems: 21,
});

const whole = (value) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
const oneDecimal = (value) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value);

const tens = (value) => Math.round(value / 10) * 10;
const measuredScope2Low = tens(SBTI_2040.pendingChillerScope2 * SBTI_2040.pendingChillerScope2RealizationLow);
const measuredScope2High = tens(SBTI_2040.pendingChillerScope2 * SBTI_2040.pendingChillerScope2RealizationHigh);

const computedScenario = {
  target2040: Math.round(SBTI_2040.baselineScope12 * (1 - SBTI_2040.annualReductionRate * SBTI_2040.yearsTo2040)),
  optimistic: Math.round(SBTI_2040.baselineScope12 - SBTI_2040.solarFullDeployment - SBTI_2040.completedChillers - SBTI_2040.pendingChillerScope1 - SBTI_2040.pendingChillerScope2),
  conservative: Math.round(SBTI_2040.baselineScope12 - SBTI_2040.solarFullDeployment - SBTI_2040.completedChillers - SBTI_2040.pendingChillerScope1),
};

export const scenario = Object.freeze({
  ...computedScenario,
  measuredBest: tens(computedScenario.conservative - measuredScope2High),
  measuredWorst: tens(computedScenario.conservative - measuredScope2Low),
  optimisticSurplus: computedScenario.target2040 - computedScenario.optimistic,
  conservativeGap: computedScenario.conservative - computedScenario.target2040,
});

export const metricText = Object.freeze({
  'input.baseline': whole(SBTI_2040.baselineScope12),
  'input.solar': whole(SBTI_2040.solarFullDeployment),
  'input.completed-chillers': oneDecimal(SBTI_2040.completedChillers),
  'input.pending-chiller-scope1': whole(SBTI_2040.pendingChillerScope1),
  'input.pending-chiller-scope2': oneDecimal(SBTI_2040.pendingChillerScope2),
  'input.pending-chiller-scope2-measured': `約 ${whole(measuredScope2Low)}–${whole(measuredScope2High)}`,
  'input.pending-chiller-total': whole(SBTI_2040.pendingChillerScope1 + SBTI_2040.pendingChillerScope2),
  'input.pending-chiller-capacity': whole(SBTI_2040.pendingChillerCapacityRt),
  'scenario.target-2040': whole(scenario.target2040),
  'scenario.optimistic-result': `≈ ${whole(scenario.optimistic)} tCO₂e`,
  'scenario.optimistic-range-value': whole(scenario.optimistic),
  'scenario.optimistic-surplus': `超額 ${whole(scenario.optimisticSurplus)}`,
  'scenario.measured-result': `≈ ${whole(scenario.measuredBest)}–${whole(scenario.measuredWorst)} tCO₂e`,
  'scenario.measured-gap': `缺口約 ${whole(tens(scenario.measuredBest - scenario.target2040))}–${whole(tens(scenario.measuredWorst - scenario.target2040))}`,
  'scenario.measured-gap-value': `${whole(tens(scenario.measuredBest - scenario.target2040))}–${whole(tens(scenario.measuredWorst - scenario.target2040))}`,
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

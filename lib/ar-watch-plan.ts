// Conditional research levels only. These are not executed trade data.
export const arWatchPlan={referencePrice:41.14,stop:40,target:45,asOf:'2026-10-29'};
export function arRewardRisk(reference=arWatchPlan.referencePrice){return ((arWatchPlan.target-reference)/(reference-arWatchPlan.stop)).toFixed(2)+':1';}

// 饮食方法元数据
// 每种方法定义：分组 / 周期(日/周) / 默认分配方式 / 默认配比(比例% 与 g/kg 两套) / 赤字或盈余 / 来源 / 可靠度 / 注意事项
//
// 关键设计：每种日方法同时提供两套默认配比
//   - macroPct（比例模式用）：按总热量百分比，属"健康比例"哲学（DRI 风格）
//   - proteinGPerKg / fatGPerKg（g/kg 模式用）：按每公斤体重，属"运动营养"哲学（保瘦体重）
// 用户可自由切换两种模式。

export const METHODS = [
  // ===== 减脂期 =====
  {
    id: 'carb_cycle',
    name: '碳水循环（周）',
    group: 'cut',
    period: 'week',
    defaultAllocation: 'week', // 周循环，不走日方法的两种模式
    source: '凯圣王笔记（用户提供）',
    reliability: 'unverified',
    citation: '来源：凯圣王碳水循环笔记。未在线核验。',
    note: '通过调整每天碳水/脂肪比例减脂。高碳日 2 天（各占周碳水 50%/2）、中碳日 3 天（35%/3）、低碳日 2 天（15%/2）；脂肪与碳水反向（高碳日脂肪 15%、中碳 35%、低碳 50%）。蛋白固定 0.8-1 g/kg，凯圣王强调分餐（小肠吸收速度约 10g/h）。默认排班 高-中-中-高-中-低-低，避免连续低碳（会饿 + 代谢补偿）。热量每天不同，周均接近 TDEE − 赤字。',
    defaults: {
      proteinGPerKg: 1.0,
      weeklyCarbGPerKg: 2.0,
      weeklyFatGPerKg: 0.8,
      carbSplit: { high: 0.5, mid: 0.35, low: 0.15 },
      fatSplit: { high: 0.15, mid: 0.35, low: 0.5 },
      highDays: 2, midDays: 3, lowDays: 2,
      defaultSchedule: ['high', 'mid', 'mid', 'high', 'mid', 'low', 'low'],
      deficitKcal: 0,
    },
  },
  {
    id: 'carb_decrease',
    name: '碳水渐降（日）',
    group: 'cut',
    period: 'day',
    defaultAllocation: 'gkg',
    source: '橙子减脂（用户描述）',
    reliability: 'unverified',
    citation: '基于用户描述实现。橙子减脂原始触发条件未核验，待用户喂料。',
    note: '蛋白与脂肪按 g/kg 固定，碳水 = 剩余热量。每周用户重新输入当前体重，随体重下降 TDEE 降低，蛋白/脂肪 g/kg 不变 → 碳水自然下降。减脂停滞时用户可手动下调碳水。赤字默认 −500 kcal。',
    defaults: {
      proteinGPerKg: 1.8,
      fatGPerKg: 1.0,
      deficitKcal: -500,
      carbManualDecrease: 0,
      macroPct: { protein: 30, carb: 45, fat: 25 },
    },
  },
  {
    id: 'calorie_deficit',
    name: '热量赤字（日）',
    group: 'cut',
    period: 'day',
    defaultAllocation: 'ratio',
    source: '通用方法',
    reliability: 'verified',
    citation: '通用减脂方法，控总热量为主。',
    note: '只控总热量：TDEE − 赤字（默认 500）。三大营养素由联动滑块自由配比，默认蛋白 25% / 碳水 45% / 脂肪 30%。',
    defaults: {
      deficitKcal: -500,
      macroPct: { protein: 25, carb: 45, fat: 30 },
      proteinGPerKg: 1.8,
      fatGPerKg: 1.0,
    },
  },
  {
    id: 'high_protein',
    name: '高蛋白减脂（日）',
    group: 'cut',
    period: 'day',
    defaultAllocation: 'gkg',
    source: '运动营养学',
    reliability: 'unverified',
    citation: '高于 ISSN 推荐上限，保瘦体重效果好但执行难度大。',
    note: '蛋白 2.0-2.4 g/kg（默认 2.2，高于 ISSN 上限），脂肪 0.8 g/kg，碳水补足。赤字 −500 kcal。注意分餐吸收。',
    defaults: {
      proteinGPerKg: 2.2,
      fatGPerKg: 0.8,
      deficitKcal: -500,
      macroPct: { protein: 35, carb: 40, fat: 25 },
    },
  },
  // ===== 增肌期 =====
  {
    id: 'lean_bulk',
    name: '干净增肌（日）',
    group: 'bulk',
    period: 'day',
    defaultAllocation: 'gkg',
    source: 'ISSN / ACSM',
    reliability: 'unverified',
    citation: 'ISSN 立场声明 (Jager 2017)；ACSM/AND/DC 联合立场 (2016)。DOI 见 references。',
    note: '小幅盈余 +300 kcal，蛋白 1.6-2.0 g/kg（默认 1.8），脂肪 1.0 g/kg，碳水补足。长肌为主、少长脂肪。',
    defaults: {
      proteinGPerKg: 1.8,
      fatGPerKg: 1.0,
      surplusKcal: 300,
      macroPct: { protein: 25, carb: 50, fat: 25 },
    },
  },
  {
    id: 'dirty_bulk',
    name: '脏增肌（日）',
    group: 'bulk',
    period: 'day',
    defaultAllocation: 'gkg',
    source: '健身实践',
    reliability: 'unverified',
    citation: '健身实践方法，无强循证支持。',
    note: '大幅盈余 +800 kcal，长肉快但脂肪同步增长。建议谨慎使用。',
    defaults: {
      proteinGPerKg: 1.8,
      fatGPerKg: 1.0,
      surplusKcal: 800,
      macroPct: { protein: 20, carb: 55, fat: 25 },
    },
  },
]

export const DEFAULT_METHOD_ID = 'lean_bulk'

export const GROUP_LABELS = {
  cut: '减脂期',
  bulk: '增肌期',
}

// 分配方式标签
export const ALLOCATION_LABELS = {
  ratio: '按比例 %',
  gkg: '按 g/kg 体重',
}

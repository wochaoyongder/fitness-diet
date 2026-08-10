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
      // 赤字控制：用户填 targetDeficit 后，按 TDEE − targetDeficit 反推周碳水总量
      // 不填则用凯圣王原公式（体重×2×7），但会警告赤字过大
      targetDeficit: null, // null=用原公式；填了=按目标赤字反推
    },
  },
  {
    id: 'carb_decrease',
    name: '碳水渐降（日）',
    group: 'cut',
    period: 'day',
    defaultAllocation: 'gkg',
    source: '橙子减脂（用户描述）+ 陈石平台期逻辑',
    reliability: 'partial',
    citation: '橙子减脂（用户描述，蛋白/脂肪 g/kg 固定，碳水随体重降自然降）+ 陈石平台期排查：先看 ≥2 周体重均值，确认真停滞再调一个变量，每天减 100-200 kcal。',
    note: '蛋白与脂肪按 g/kg 固定，碳水 = 剩余热量。每周重输体重，随体重下降 TDEE 降低、碳水自然下降。减脂停滞时手动下调碳水（陈石建议每天 100-200 kcal 幅度，先确认真停滞）。赤字默认 −500 kcal。',
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
    source: '通用方法（陈石温和缺口逻辑）',
    reliability: 'verified',
    citation: '通用减脂方法，控总热量为主；陈石主张温和缺口 10-20%，不要一开始就极端节食。',
    note: '只控总热量：TDEE − 赤字（默认 500，约 TDEE 的 15-18%）。三大营养素由联动滑块自由配比，默认蛋白 25% / 碳水 45% / 脂肪 30%。陈石：减脂先区分减重/减脂，蛋白质优先保肌，低碳不更减脂。',
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
    source: 'ISSN / ACSM / 凯圣王×陈石综合',
    reliability: 'partial',
    citation: 'ISSN 立场 (Jager 2017)；ACSM/AND/DC (2016)；凯圣王×陈石综合模板：蛋白 1.6-2.2 g/kg 分 3-5 餐，小幅盈余 5-10%，碳水服务训练。',
    note: '小幅盈余 +300 kcal（约维持热量上方 5-10%），蛋白 1.6-2.2 g/kg（默认 1.8）分 3-5 餐，脂肪 1.0 g/kg，碳水补足并支持训练。高训练日前后多碳水，休息日少。每周看 3-7 天晨重均值，连续 2-3 周不涨且力量不进步，每天加 100-200 kcal 再观察。练后立即补蛋白并非决定性（陈石）。',
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

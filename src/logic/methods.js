// 饮食方法计算逻辑
// 输入：methodId、methodInput（含用户覆盖参数）、tdee、weight
// 输出：{ targetKcal, dailyMacros: {protein, carb, fat}, note }
//
// 两种分配方式：
//   ratio（比例模式）：按总热量百分比，碳水/脂肪/蛋白由滑块决定；属"健康比例"哲学
//   gkg  （克重模式）：蛋白/脂肪按 g/kg 固定，碳水 = 剩余；属"运动营养"哲学（保瘦体重）
// 用户可切换两种模式（碳水循环周方法除外）。
import { METHODS } from '../data/methods.js'
import { KCAL_PER_GRAM } from './macros.js'

// 碳水循环（周）— 凯圣王
function calcCarbCycle(methodInput) {
  const { weight, schedule, carbSplit, fatSplit, proteinGPerKg, weeklyCarbGPerKg, weeklyFatGPerKg } = methodInput
  const highDays = schedule.filter((d) => d === 'high').length
  const midDays = schedule.filter((d) => d === 'mid').length
  const lowDays = schedule.filter((d) => d === 'low').length

  const weeklyCarbTotal = weight * weeklyCarbGPerKg * 7
  const weeklyFatTotal = weight * weeklyFatGPerKg * 7

  const carbPerHigh = weeklyCarbTotal * carbSplit.high / (highDays || 1)
  const carbPerMid = weeklyCarbTotal * carbSplit.mid / (midDays || 1)
  const carbPerLow = weeklyCarbTotal * carbSplit.low / (lowDays || 1)

  const fatPerHigh = weeklyFatTotal * fatSplit.high / (highDays || 1)
  const fatPerMid = weeklyFatTotal * fatSplit.mid / (midDays || 1)
  const fatPerLow = weeklyFatTotal * fatSplit.low / (lowDays || 1)

  const protein = weight * proteinGPerKg

  const carbByLevel = { high: carbPerHigh, mid: carbPerMid, low: carbPerLow }
  const fatByLevel = { high: fatPerHigh, mid: fatPerMid, low: fatPerLow }

  const weeklyTable = schedule.map((level, i) => {
    const carb = Math.round(carbByLevel[level])
    const fat = Math.round(fatByLevel[level])
    const p = Math.round(protein)
    const kcal = Math.round(p * KCAL_PER_GRAM.protein + carb * KCAL_PER_GRAM.carb + fat * KCAL_PER_GRAM.fat)
    return { day: i + 1, level, protein: p, carb, fat, kcal }
  })

  const avgKcal = Math.round(weeklyTable.reduce((s, d) => s + d.kcal, 0) / 7)

  return {
    targetKcal: avgKcal,
    dailyMacros: {
      protein: Math.round(protein),
      carb: Math.round(weeklyCarbTotal * 0.35 / 3),
      fat: Math.round(weeklyFatTotal * 0.35 / 3),
    },
    weeklyTable,
    note: `周均约 ${avgKcal} kcal/天（高碳 ${Math.round(carbPerHigh)}g / 中碳 ${Math.round(carbPerMid)}g / 低碳 ${Math.round(carbPerLow)}g 碳水）`,
  }
}

// 日方法 · g/kg 模式：蛋白/脂肪按 g/kg，碳水 = 剩余
function calcGkgMode(methodInput, tdee, offsetKcal) {
  const { weight, proteinGPerKg, fatGPerKg, carbManualDecrease } = methodInput
  const targetKcal = tdee + offsetKcal
  const protein = Math.round(weight * proteinGPerKg)
  const fat = Math.round(weight * fatGPerKg)
  let carb = Math.round((targetKcal - protein * KCAL_PER_GRAM.protein - fat * KCAL_PER_GRAM.fat) / KCAL_PER_GRAM.carb)
  carb = Math.max(0, carb - (carbManualDecrease || 0))
  return {
    targetKcal,
    dailyMacros: { protein, carb, fat },
    note: `蛋白/脂肪按 g/kg 体重固定，碳水补足剩余热量。`,
  }
}

// 日方法 · 比例模式：三大营养素按总热量百分比
function calcRatioMode(methodInput, tdee, offsetKcal) {
  const { macroPct } = methodInput
  const targetKcal = tdee + offsetKcal
  const protein = Math.round((targetKcal * (macroPct.protein / 100)) / KCAL_PER_GRAM.protein)
  const carb = Math.round((targetKcal * (macroPct.carb / 100)) / KCAL_PER_GRAM.carb)
  const fat = Math.round((targetKcal * (macroPct.fat / 100)) / KCAL_PER_GRAM.fat)
  return {
    targetKcal,
    dailyMacros: { protein, carb, fat },
    note: `按总热量百分比分配。`,
  }
}

// 主入口
// methodInput 包含方法 id、用户覆盖参数、分配方式
export function calcMethod(methodId, methodInput, tdee) {
  const method = METHODS.find((m) => m.id === methodId)
  if (!method) throw new Error(`未知方法: ${methodId}`)

  const merged = { ...method.defaults, ...methodInput, weight: methodInput.weight }

  // 碳水循环周方法独立处理
  if (methodId === 'carb_cycle') {
    return calcCarbCycle(merged)
  }

  // 日方法：根据 allocation 决定走哪种模式
  // offsetKcal：赤字为负、盈余为正
  let offsetKcal = 0
  if ('deficitKcal' in merged) offsetKcal = merged.deficitKcal
  else if ('surplusKcal' in merged) offsetKcal = merged.surplusKcal

  if (merged.allocation === 'ratio') {
    return calcRatioMode(merged, tdee, offsetKcal)
  }
  // 默认 g/kg 模式
  return calcGkgMode(merged, tdee, offsetKcal)
}

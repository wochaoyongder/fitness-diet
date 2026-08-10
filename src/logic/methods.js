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
// 两种碳水总量来源：
//   1) 原公式：weeklyCarbTotal = weight × weeklyCarbGPerKg × 7（凯圣王原法）
//   2) 赤字控制：若用户填 targetDeficit，按 TDEE − targetDeficit 反推周碳水总量
function calcCarbCycle(methodInput, tdee) {
  const { weight, schedule, carbSplit, fatSplit, proteinGPerKg,
          weeklyCarbGPerKg, weeklyFatGPerKg, targetDeficit } = methodInput
  const highDays = schedule.filter((d) => d === 'high').length
  const midDays = schedule.filter((d) => d === 'mid').length
  const lowDays = schedule.filter((d) => d === 'low').length

  // 周脂肪、蛋白固定（凯圣王原法）
  const weeklyFatTotal = weight * weeklyFatGPerKg * 7
  const protein = weight * proteinGPerKg

  // 周碳水总量：可由赤字控制覆盖
  let weeklyCarbTotal = weight * weeklyCarbGPerKg * 7
  let carbSource = 'original' // 原公式
  if (targetDeficit !== null && targetDeficit !== undefined) {
    // 按目标周均热量 = TDEE − targetDeficit 反推周碳水
    // 周均热量 = (蛋白周热量 + 脂肪周热量 + 周碳水×4) / 7
    const weeklyProteinKcal = protein * 4 * 7
    const weeklyFatKcal = weeklyFatTotal * 9
    const targetWeeklyKcal = (tdee - targetDeficit) * 7
    weeklyCarbTotal = Math.max(0, (targetWeeklyKcal - weeklyProteinKcal - weeklyFatKcal) / 4)
    carbSource = 'deficit'
  }

  const carbPerHigh = weeklyCarbTotal * carbSplit.high / (highDays || 1)
  const carbPerMid = weeklyCarbTotal * carbSplit.mid / (midDays || 1)
  const carbPerLow = weeklyCarbTotal * carbSplit.low / (lowDays || 1)

  const fatPerHigh = weeklyFatTotal * fatSplit.high / (highDays || 1)
  const fatPerMid = weeklyFatTotal * fatSplit.mid / (midDays || 1)
  const fatPerLow = weeklyFatTotal * fatSplit.low / (lowDays || 1)

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
  const deficit = tdee - avgKcal

  // 安全警告：赤字过大
  let warning = null
  if (deficit > 500) {
    warning = `周均 ${avgKcal} kcal/天，赤字达 ${deficit} kcal/天，远超安全范围（建议 ≤500）。建议在下方「目标赤字」中填 300-500，或减少周碳水。`
  } else if (deficit > 700) {
    warning = `赤字 ${deficit} kcal/天偏大，注意监测体力与饥饿感。`
  }

  return {
    targetKcal: avgKcal,
    dailyMacros: {
      protein: Math.round(protein),
      carb: Math.round(weeklyCarbTotal * 0.35 / 3),
      fat: Math.round(weeklyFatTotal * 0.35 / 3),
    },
    weeklyTable,
    avgKcal,
    deficit,
    warning,
    carbSource, // 'original' 凯圣王原法 / 'deficit' 赤字控制
    note: `周均约 ${avgKcal} kcal/天${deficit > 0 ? `（赤字 ${deficit}）` : ''} · 高碳 ${Math.round(carbPerHigh)}g / 中碳 ${Math.round(carbPerMid)}g / 低碳 ${Math.round(carbPerLow)}g 碳水${carbSource === 'deficit' ? ' · 按目标赤字反推' : ''}`,
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

// 碳水渐降（日·橙子减脂）— 含下周递减预测
// 蛋白/脂肪 g/kg 固定，碳水补足。下周按新体重重算 TDEE → 碳水自然下降
// methodInput.nextTdee（可选）：App 层用新体重重算好的下周 TDEE
function calcCarbDecrease(methodInput, tdee, offsetKcal) {
  const { weight, proteinGPerKg, fatGPerKg, carbManualDecrease, nextWeekWeight, nextTdee } = methodInput
  const targetKcal = tdee + offsetKcal
  const protein = Math.round(weight * proteinGPerKg)
  const fat = Math.round(weight * fatGPerKg)
  let carb = Math.round((targetKcal - protein * KCAL_PER_GRAM.protein - fat * KCAL_PER_GRAM.fat) / KCAL_PER_GRAM.carb)
  carb = Math.max(0, carb - (carbManualDecrease || 0))

  const result = {
    targetKcal,
    dailyMacros: { protein, carb, fat },
    note: `蛋白/脂肪按 g/kg 固定，碳水补足剩余热量。`,
  }

  // B: 下周递减预测（需 nextWeekWeight + nextTdee）
  if (nextWeekWeight != null && nextWeekWeight > 0 && nextTdee != null) {
    const nextTargetKcal = nextTdee + offsetKcal
    const nextProtein = Math.round(nextWeekWeight * proteinGPerKg)
    const nextFat = Math.round(nextWeekWeight * fatGPerKg)
    let nextCarb = Math.round((nextTargetKcal - nextProtein * KCAL_PER_GRAM.protein - nextFat * KCAL_PER_GRAM.fat) / KCAL_PER_GRAM.carb)
    nextCarb = Math.max(0, nextCarb - (carbManualDecrease || 0))
    const carbDecrease = carb - nextCarb
    result.nextWeek = {
      weight: nextWeekWeight,
      tdee: nextTdee,
      targetKcal: nextTargetKcal,
      macros: { protein: nextProtein, carb: nextCarb, fat: nextFat },
      carbDecrease,
    }
    if (carbDecrease > 0) {
      result.note = `本周碳水 ${carb}g → 下周（${nextWeekWeight}kg）${nextCarb}g，自然下降 ${carbDecrease}g。`
    } else if (carbDecrease < 0) {
      result.note = `本周碳水 ${carb}g → 下周（${nextWeekWeight}kg）${nextCarb}g，因体重上升需增加 ${-carbDecrease}g。`
    } else {
      result.note = `本周与下周碳水持平 ${carb}g。`
    }
  }

  return result
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
    return calcCarbCycle(merged, tdee)
  }

  // 日方法：根据 allocation 决定走哪种模式
  // offsetKcal：赤字为负、盈余为正
  let offsetKcal = 0
  if ('deficitKcal' in merged) offsetKcal = merged.deficitKcal
  else if ('surplusKcal' in merged) offsetKcal = merged.surplusKcal

  // 碳水渐降走专属函数（含下周递减）
  if (methodId === 'carb_decrease') {
    return calcCarbDecrease(merged, tdee, offsetKcal)
  }

  if (merged.allocation === 'ratio') {
    return calcRatioMode(merged, tdee, offsetKcal)
  }
  // 默认 g/kg 模式
  return calcGkgMode(merged, tdee, offsetKcal)
}

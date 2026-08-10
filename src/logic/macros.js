// 三大营养素换算工具
// 1g 蛋白 = 4 kcal；1g 碳水 = 4 kcal；1g 脂肪 = 9 kcal
export const KCAL_PER_GRAM = { protein: 4, carb: 4, fat: 9 }

// 由热量 + 三大营养素百分比 → 克数
// macroPct: { protein: 30, carb: 45, fat: 25 }（百分比，和应为 100）
export function macrosFromPct(totalKcal, macroPct) {
  return {
    protein: Math.round((totalKcal * (macroPct.protein / 100)) / KCAL_PER_GRAM.protein),
    carb: Math.round((totalKcal * (macroPct.carb / 100)) / KCAL_PER_GRAM.carb),
    fat: Math.round((totalKcal * (macroPct.fat / 100)) / KCAL_PER_GRAM.fat),
  }
}

// 由克数 → 供能百分比（用于展示）
export function pctFromMacros(grams) {
  const kcal = {
    protein: grams.protein * KCAL_PER_GRAM.protein,
    carb: grams.carb * KCAL_PER_GRAM.carb,
    fat: grams.fat * KCAL_PER_GRAM.fat,
  }
  const total = kcal.protein + kcal.carb + kcal.fat || 1
  return {
    protein: Math.round((kcal.protein / total) * 1000) / 10,
    carb: Math.round((kcal.carb / total) * 1000) / 10,
    fat: Math.round((kcal.fat / total) * 1000) / 10,
  }
}

// 热量从克数反算
export function kcalFromMacros(grams) {
  return (
    grams.protein * KCAL_PER_GRAM.protein +
    grams.carb * KCAL_PER_GRAM.carb +
    grams.fat * KCAL_PER_GRAM.fat
  )
}

// 联动滑块：拖动一个滑块时，其余两个按比例自动调整，保持和=100
// changed: 'protein' | 'carb' | 'fat'
export function rebalanceMacroPct(macroPct, changed) {
  const keys = ['protein', 'carb', 'fat']
  const others = keys.filter((k) => k !== changed)
  const changedVal = macroPct[changed]
  let remaining = 100 - changedVal
  if (remaining < 0) remaining = 0

  const othersSum = macroPct[others[0]] + macroPct[others[1]]
  let r0, r1
  if (othersSum <= 0) {
    // 其余都是 0，均分剩余
    r0 = remaining / 2
    r1 = remaining / 2
  } else {
    r0 = (macroPct[others[0]] / othersSum) * remaining
    r1 = (macroPct[others[1]] / othersSum) * remaining
  }
  const result = {}
  result[changed] = changedVal
  result[others[0]] = Math.round(r0 * 10) / 10
  result[others[1]] = Math.round(r1 * 10) / 10
  return result
}

// BMR 公式实现
// 输入：{ sex: 'male'|'female', age: 年岁, height: cm, weight: kg, bodyFat: 体脂率(小数,0-1) }

// Mifflin-St Jeor (1990) — 已在线核验
function mifflinStJeor({ sex, age, height, weight }) {
  const base = 10 * weight + 6.25 * height - 5 * age
  return sex === 'male' ? base + 5 : base - 161
}

// Harris-Benedict 1919 原版 — 已在线核验
function harrisBenedict1919({ sex, age, height, weight }) {
  if (sex === 'male') {
    return 66.4730 + 13.7516 * weight + 5.0033 * height - 6.7550 * age
  }
  return 655.0955 + 9.5634 * weight + 1.8496 * height - 4.6756 * age
}

// Harris-Benedict 1984 修订版 (Roza & Shizgal) — 部分核验
function harrisBenedict1984({ sex, age, height, weight }) {
  if (sex === 'male') {
    return 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
  }
  return 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age
}

// Katch-McArdle（基于瘦体重）— 部分核验；需体脂率
// BMR = 370 + 21.6 × LBM，LBM = 体重 × (1 - 体脂率)
function katchMcArdle({ weight, bodyFat }) {
  const lbm = weight * (1 - (bodyFat || 0))
  return 370 + 21.6 * lbm
}

// WHO/FAO/UNU 1985 — 已在线核验；仅成人三段
function who1985({ sex, age, weight }) {
  // 根据年龄选分段
  let segment
  if (age >= 18 && age < 30) segment = '18-30'
  else if (age >= 30 && age < 60) segment = '30-60'
  else if (age >= 60) segment = '60+'
  else segment = '18-30' // 18 岁以下用成人最近段（App 面向成人）

  const table = {
    male: {
      '18-30': () => 15.3 * weight + 679,
      '30-60': () => 11.6 * weight + 879,
      '60+': () => 13.5 * weight + 487,
    },
    female: {
      '18-30': () => 14.7 * weight + 496,
      '30-60': () => 8.7 * weight + 829,
      '60+': () => 10.5 * weight + 596,
    },
  }
  return table[sex][segment]()
}

const CALCULATORS = {
  mifflin_st_jeor: mifflinStJeor,
  harris_benedict_1919: harrisBenedict1919,
  harris_benedict_1984: harrisBenedict1984,
  katch_mcardle: katchMcArdle,
  who_1985: who1985,
}

// 计算入口
export function calcBMR(formulaId, input) {
  const fn = CALCULATORS[formulaId]
  if (!fn) throw new Error(`未知 BMR 公式: ${formulaId}`)
  return Math.round(fn(input))
}

// TDEE 活动系数 5 档
// 系数表从 NASM 核出；原始研究出处未能从同行评审文献核到
// 1919 Harris-Benedict 原论文不含此 5 档；WHO 1985 用的是不同 3 档系数

export const ACTIVITY_LEVELS = [
  {
    id: 'sedentary',
    label: '久坐',
    factor: 1.2,
    desc: '几乎不运动，无锻炼习惯。日常多为办公室或居家，无规律运动。',
    stepsPerDay: '< 5,000 步/日',
    examples: '每周运动 0 天；典型如久坐办公族。',
  },
  {
    id: 'light',
    label: '轻度活动',
    factor: 1.375,
    desc: '每周 1-3 天轻度运动（散步、瑜伽、轻松骑行等）。',
    stepsPerDay: '5,000 - 7,499 步/日',
    examples: '每周 1-3 次轻度运动；典型如偶尔散步、做家务者。',
  },
  {
    id: 'moderate',
    label: '中度活动',
    factor: 1.55,
    desc: '每周 3-5 天中等强度运动（快走、骑行、健身、球类等）。',
    stepsPerDay: '7,500 - 9,999 步/日',
    examples: '每周 3-5 次中等强度运动；典型如规律健身者。',
  },
  {
    id: 'very',
    label: '重度活动',
    factor: 1.725,
    desc: '每周 6-7 天高强度运动（跑步、HIIT、力量训练等）。',
    stepsPerDay: '10,000 - 12,499 步/日',
    examples: '每周 6-7 次高强度运动；典型如健身爱好者、运动员。',
  },
  {
    id: 'super',
    label: '超重度活动',
    factor: 1.9,
    desc: '每日高强度运动 + 体力工作，或每日 2 次训练。',
    stepsPerDay: '≥ 12,500 步/日',
    examples: '高强度运动 + 体力劳动，或每日双练；典型如体力工作者 + 训练者。',
  },
]

export const ACTIVITY_NOTE =
  '这套活动系数方案广泛使用于健身/营养学教材与在线计算器，但并非来自单一原始研究文献。1919 Harris-Benedict 原论文不含此 5 档系数；WHO/FAO/UNU 1985 使用的是不同的 3 档系统（男 1.55/1.78/2.10，女 1.56/1.64/1.82）。步数区间来自健身行业通行说法（Tudor-Locke & Bassett 步数分级框架），与系数的直接对应未从一手文献核到，为参考性描述。'

export const DEFAULT_ACTIVITY_ID = 'moderate'

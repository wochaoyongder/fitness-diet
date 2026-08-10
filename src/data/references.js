// 来源清单：博主 + 机构，含可靠度标记
// 博主的可量化配比主张尚未在线核验，留占位待补充

export const INSTITUTION_SOURCES = [
  {
    name: 'ISSN（国际运动营养学会）',
    desc: '蛋白质 1.4-2.0 g/kg（抗阻训练者）；减脂能量赤字时取上限以保瘦体重。',
    urls: ['https://doi.org/10.1186/s12970-017-0177-8'],
    reliability: 'unverified', // 数字基于既有知识，URL 待核对
    citation: 'Jager et al., J Int Soc Sports Nutr 2017.',
  },
  {
    name: 'ACSM / AND / DC（美国运动医学会 / 营养与饮食学会 / 加拿大营养师协会）',
    desc: '蛋白质 1.2-1.7 g/kg（力量/爆发力运动员）。',
    urls: ['https://doi.org/10.1249/MSS.0000000000000852'],
    reliability: 'unverified',
    citation: 'ACSM/AND/DC 联合立场声明, 2016.',
  },
  {
    name: '中国居民膳食营养素参考摄入量 DRIs（2023 版）',
    desc: '普通成人蛋白质 0.98-1.0 g/kg；蛋白质供能比 10-15% E（AMDR）。',
    urls: ['https://www.cnsoc.org/'],
    reliability: 'unverified',
    citation: '中国营养学会, DRIs 2023.',
  },
  {
    name: 'WHO / FAO / UNU（1985）',
    desc: '成人最低生理蛋白质需要约 0.83 g/kg；BMR 按体重分段公式见 formulas.js。',
    urls: ['https://www.fao.org/3/aa040e/AA040E06.htm'],
    reliability: 'verified',
    citation: 'WHO Tech Rep Ser 724, 1985.',
  },
  {
    name: 'NASM（美国国家运动医学会）',
    desc: 'TDEE = BMR × 活动系数，5 档系数见 activityLevels.js。',
    urls: ['https://www.nasm.org/resources/calorie-calculator'],
    reliability: 'verified',
    citation: 'NASM Calorie Calculator.',
  },
]

export const BLOGGER_SOURCES = [
  {
    name: '凯圣王',
    desc: '碳水循环法（周循环）：高/中/低碳日按 50%/35%/15% 分配周碳水，脂肪反向 15%/35%/50%，蛋白 0.8-1 g/kg，强调分餐（吸收约 10g/h），避免连续低碳。增肌主张：碳水服务训练，高训练日多给碳水、休息日少给，先满足总热量与蛋白再谈时机。',
    urls: ['https://space.bilibili.com/ (B站:凯圣王，含碳水循环系列、新手增肌系列)'],
    reliability: 'partial',
    citation: '凯圣王｜Bilibili：碳水循环系列、新手增肌系列、75天减脂记录。用户提供笔记+公开内容提炼整理。',
    status: '已实现（碳水循环，基于用户笔记）',
  },
  {
    name: '橙子减脂',
    desc: '碳水渐降法（日单位）。蛋白/脂肪按 g/kg 固定，碳水随体重下降自然降。',
    urls: [],
    reliability: 'unverified',
    citation: '用户描述，原文未搜索到，待喂料。',
    status: '已实现（基于用户描述，待完善）',
  },
  {
    name: '陈石',
    desc: '循证机制派。增肌：每周每肌群有效组 8-12 起步，RIR 1-3，蛋白质 1.6-2.2 g/kg 分 3-5 餐，总能量优先于营养时机（练后立即补蛋白不重要），有氧非禁区。减脂：先区分减重/减脂，温和缺口 10-20%，蛋白质优先保肌，低碳不更减脂（2026-07 公开内容），NEAT 易被忽视，平台期先审计真假（≥2周体重均值+围度+执行+步数+睡眠），再调一个变量。',
    urls: [
      '抖音精选：增肌！最佳训练量，每周几组练到位？（2026-07-17）',
      '抖音精选：低碳饮食，并不更减脂！（2026-07-19）',
      '抖音精选：瘦子增重，胖子减脂！关键点都在NEAT！（2026-07-05）',
      '抖音精选：练后立即补充蛋白质，根本不重要（2026-05-20）',
      '抖音精选：想增肌？做有氧！（2026-05-24）',
    ],
    reliability: 'partial',
    citation: '陈石｜抖音精选系列 2026；YYDS运动营养成长中心小宇宙播客；广东白云学院讲座背景介绍 2026-05-29。资质：ACE讲师、NSCA-CSCS、超鹿运动技术合伙人。',
    status: '已提炼（循证机制，含可执行数字）',
  },
  {
    name: '陈柏龄',
    desc: '待补充可量化配比主张。',
    urls: [],
    reliability: 'unverified',
    citation: '待补充原文链接。',
    status: '占位待补',
  },
  {
    name: '卓叔增重',
    desc: '面向瘦人增肌，待补充可量化配比主张。',
    urls: [],
    reliability: 'unverified',
    citation: '待补充原文链接。',
    status: '占位待补',
  },
  {
    name: '仰望尾迹云',
    desc: '待补充可量化配比主张。',
    urls: [],
    reliability: 'unverified',
    citation: '待补充原文链接。',
    status: '占位待补',
  },
]

// 综合执行模板（凯圣王×陈石共同逻辑 + 通行运动营养原则的二次整理）
// 不是任何一位老师的官方处方，作为参考值写入
export const COMBINED_TEMPLATE = {
  bulk: {
    note: '建议周期 8-12 周。小幅盈余：维持热量上方约 5-10% 起步，或用体重趋势反推。蛋白质 1.6-2.2 g/kg 分 3-5 餐。脂肪避免长期压低，剩余给碳水支持训练。高训练日前后多碳水，休息日少。每周看 3-7 天晨重均值，连续 2-3 周不涨且力量不进步，每天加 100-200 kcal 再观察。',
    frequency: '每周 3-5 次抗阻训练，新手优先 3-4 次',
    effectiveSets: '每肌群每周 8-12 个高质量工作组起步',
    intensity: '多数工作组留 1-3 次余力（RIR 1-3，约 RPE 7-9）',
  },
  cut: {
    note: '建议周期 6-12 周后评估。温和缺口：比维持热量低约 10-20%，不要一开始就极端节食。蛋白质优先保肌，越瘦/缺口越大越重视。碳水不妖魔化：可用碳循环把高需求训练日设高碳、休息日低碳，保持周总热量；也可每天近似。轻断食仅在更好控总摄入时用。',
    deficit: '维持热量 -10% 至 -20%（温和，非极端）',
    protein: '减脂期尤其保证蛋白质 + 抗阻训练保肌',
  },
  plateau: '平台期排查：1) 看 ≥2 周体重均值；2) 查腰围/照片/训练表现（围度降可能非真停滞）；3) 核对漏记（油/坚果/饮料/外卖酱料）；4) 核对 NEAT（步数是否随节食下降）；5) 排除睡眠/压力/经期/水盐短期干扰；6) 确认真停滞后再调一个变量：每天减 100-200 kcal 或加步数/有氧，不要同时大砍热量又暴加有氧。',
  disclaimer: '此综合模板基于两位老师公开内容的共同逻辑 + 通行运动营养原则二次整理，不是任何一位老师的官方课表。有慢性病/进食障碍史/严重肥胖/孕期哺乳期/运动损伤应先咨询专业人士。',
}

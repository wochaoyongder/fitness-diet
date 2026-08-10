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
    desc: '碳水循环法（周循环）。高/中/低碳日按 50%/35%/15% 分配周碳水，脂肪反向 15%/35%/50%，蛋白 0.8-1 g/kg。',
    urls: [],
    reliability: 'unverified',
    citation: '用户提供笔记，未在线核验。',
    status: '已实现（基于用户笔记）',
  },
  {
    name: '橙子减脂',
    desc: '碳水渐降法（日单位）。蛋白/脂肪按 g/kg 固定，碳水随体重下降自然降；具体触发条件未核验。',
    urls: [],
    reliability: 'unverified',
    citation: '用户描述，原文未搜索到，待喂料。',
    status: '已实现（基于用户描述，待完善）',
  },
  {
    name: '陈石',
    desc: '待补充可量化配比主张。',
    urls: [],
    reliability: 'unverified',
    citation: '待补充原文链接。',
    status: '占位待补',
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

// BMR 公式元数据（名称 / 出处 / 年份 / URL / 可靠度）
// 所有可靠度标注来自 subagent 通过 PubMed/PMC/FAO/NIH 交叉验证的结果

export const BMR_FORMULAS = [
  {
    id: 'mifflin_st_jeor',
    name: 'Mifflin-St Jeor',
    year: 1990,
    needsBodyFat: false,
    reliability: 'verified', // 已在线核验（PubMed 一手摘要）
    citation: 'Mifflin MD et al., Am J Clin Nutr 1990;51(2):241-247.',
    urls: [
      'https://pubmed.ncbi.nlm.nih.gov/2305711/',
      'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11176742/',
    ],
    note: '现代最常用。原文指出 Harris-Benedict 1919 平均高估实测 REE 约 5%。',
  },
  {
    id: 'harris_benedict_1919',
    name: 'Harris-Benedict 1919 原版',
    year: 1919,
    needsBodyFat: false,
    reliability: 'verified', // 已在线核验（2 个独立 PMC Table 1 一致）
    citation: 'Harris JA, Benedict FG, Carnegie Institution, 1919.',
    urls: [
      'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7784146/',
      'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11176742/',
    ],
    note: '基于 239 名受试者回归。系数较 Mifflin 略高。',
  },
  {
    id: 'harris_benedict_1984',
    name: 'Harris-Benedict 1984 修订版',
    year: 1984,
    needsBodyFat: false,
    reliability: 'partial', // 论文已核，系数未从一手摘要直接核出
    citation: 'Roza AM, Shizgal HM, Am J Clin Nutr 1984;40(1):168-182.',
    urls: ['https://pubmed.ncbi.nlm.nih.gov/6741850/'],
    note: '系数采用业界通行值，未从一手摘要直接核出。1984 版基于扩大样本（239→337）重做回归，摘要称与原方程相似。',
  },
  {
    id: 'katch_mcardle',
    name: 'Katch-McArdle',
    year: null,
    needsBodyFat: true,
    reliability: 'partial', // 形式与 Cunningham 1991 相同，一手出处未在线核到
    citation: '业界常用 "Katch-McArdle" 指代；形式相同的式子归为 Cunningham JJ, Am J Clin Nutr 1991;54:11A。',
    urls: [],
    note: '基于瘦体重（LBM）；需输入体脂率。权威 BMR 汇总表中形式相同的式子归为 Cunningham 1991，一手出处链未在线核出。',
  },
  {
    id: 'who_1985',
    name: 'WHO/FAO/UNU 1985',
    year: 1985,
    needsBodyFat: false,
    reliability: 'verified', // 已在线核验（FAO 1985 报告原文 + NIH DRI 1989 印证）
    citation: 'WHO/FAO/UNU Expert Consultation, WHO Tech Rep Ser 724, 1985（基于 Schofield 1985 回归，WHO 取整）。',
    urls: [
      'https://www.fao.org/3/aa040e/AA040E06.htm',
      'https://www.ncbi.nlm.nih.gov/books/NBK234938/table/ttt00003/',
    ],
    note: '按体重分段。App 仅实现成人三段（18-30 / 30-60 / >60）。',
  },
]

export const DEFAULT_FORMULA_ID = 'mifflin_st_jeor'

// 可靠度中文标签
export const RELIABILITY_LABELS = {
  verified: '已在线核验',
  partial: '部分核验',
  unverified: '未在线核验',
}

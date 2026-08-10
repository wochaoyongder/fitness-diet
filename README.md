# 健身饮食计算器 (fitness-diet)

一个开源的健身饮食计算 Web 应用。**重点不是动作教学，而是饮食教学**：根据用户体重、身高、年龄、性别、活动量等信息，计算减脂期与增肌期的每日热量与三大营养素（蛋白质 / 碳水 / 脂肪）分配，并提供多种饮食方法供选择。

## 功能

- **多 BMR 公式可选**：Mifflin-St Jeor、Harris-Benedict 1919 原版、Harris-Benedict 1984 修订版、Katch-McArdle、WHO/FAO/UNU 1985
- **5 档活动量系数**：久坐 / 轻度 / 中度 / 重度 / 超重度，每档附说明与步数参考
- **6 种饮食方法**：
  - 减脂：碳水循环（周·凯圣王）、碳水渐降（日·橙子减脂）、热量赤字、高蛋白减脂
  - 增肌：干净增肌、脏增肌
- **三大营养素联动滑块**：用户可自由调配蛋白 / 碳水 / 脂肪比例（和恒 = 100%），不调配时使用方法默认值
- **内嵌教学说明**：公式解释、方法原理、营养素科普、活动量档位说明，全部附来源

## 使用

```bash
cd fitness-diet
npm install
npm run dev
```

浏览器打开终端提示的本地地址（默认 http://localhost:5173）。

## 公式与数据来源

所有公式与配比均标注来源与在线核验可靠度，详见应用内"说明"页与源码 `src/data/`。

- **已在线核验**：Mifflin-St Jeor (1990)、Harris-Benedict 1919、WHO/FAO/UNU 1985、TDEE 5 档活动系数（NASM）
- **部分核验**：Harris-Benedict 1984 修订版、Katch-McArdle
- **未在线核验（待核对）**：博主方法、ISSN/ACSM/DRIs 数字区间

### 主要文献来源

- Mifflin MD et al., *Am J Clin Nutr* 1990;51(2):241-247. https://pubmed.ncbi.nlm.nih.gov/2305711/
- Harris JA, Benedict FG, Carnegie Institution, 1919.
- Roza AM, Shizgal HM, *Am J Clin Nutr* 1984;40(1):168-182. https://pubmed.ncbi.nlm.nih.gov/6741850/
- WHO/FAO/UNU Expert Consultation, WHO Tech Rep Ser 724, 1985. https://www.fao.org/3/aa040e/AA040E06.htm
- NASM Calorie Calculator. https://www.nasm.org/resources/calorie-calculator
- ISSN 立场声明 (Jager 2017). https://doi.org/10.1186/s12970-017-0177-8
- ACSM/AND/DC 联合立场 (2016). https://doi.org/10.1249/MSS.0000000000000852

## 待完善

中国知名健身博主（凯圣王、橙子减脂、陈石、陈柏龄、卓叔增重、仰望尾迹云）的可量化配比主张尚未在线核验，源码 `src/data/references.js` 中留有占位，欢迎补充原文链接与数字。

## 免责声明

本工具仅供学习与参考，**不构成医疗或专业营养建议**。具体饮食方案请咨询医生或注册营养师，尤其是孕妇、哺乳期、慢性病、服药人群。

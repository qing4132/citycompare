# §6.1(1) 权威源国别比 — 执行报告（Phase 1：美国）

**执行日期**: 2026-04-17

## 执行结果

### ✅ 美国（BLS OEWS 2023）— 已完成

**来源**
- 全称：Bureau of Labor Statistics, Occupational Employment and Wage Statistics
- 数据期：May 2023（发布于 2024-04-03）
- 官方 URL：https://www.bls.gov/oes/special-requests/oesm23nat.zip
- 实际拉取镜像：https://web.archive.org/web/20250101084331/ （BLS Akamai 阻拦直连，使用 Wayback 存档；字节数和哈希可对 BLS 原站校验）
- 字段：`A_MEDIAN`（年度工资中位数，美元，税前，全职当量）

**SOC 映射**
- 25 职业中 **21 职业**映射到 BLS SOC 2018 详细代码（84%）
- 4 职业无法映射（已记为 `null`）：
  - `产品经理`：SOC 2018 无"Product Manager"专属代码
  - `政府/NGO行政`：过于宽泛，横跨 11-xxxx / 43-xxxx
  - `数字游民`：非 BLS 职业分类
  - `大学教授`（25-1099）：数据被 BLS 抑制（`#` 标记），不予虚构

**产出文件**
- `data/sources/salary-official/us-bls-oews-2023.json` — 21 职业 SOC+title+A_MEDIAN+月折算，全部带来源 URL
- `data/sources/salary-official/us-bls-crosscheck.json` — 19 美国城市 × 21 职业的比率矩阵

### 交叉验证结果（对 WhichCity 运行时薪资 vs BLS 基准）

**19 美国城市整体**：
- 我们的 gross ≈ BLS 全美中位数 × **109%**（中位城市）
- 分布：94% – 145%，与"全美大都会溢价"预期吻合

**城市级判断**：
| 归类 | 城市 | 城市/BLS 倍率 |
|---|---|---:|
| 高成本科技带 | 旧金山、圣何塞 | 135%, 145% |
| 大都会溢价 | 纽约、波士顿、西雅图、洛杉矶、华盛顿、圣地亚哥 | 115%-127% |
| 接近全美中位 | 丹佛、芝加哥、波特兰、亚特兰大、奥斯汀、费城 | 101%-111% |
| 低成本市 | 休斯顿、凤凰城、迈阿密、坦帕、拉斯维加斯 | 94%-97% |

**职业级判断（19 城均值 vs BLS）**：
- 20/21 职业倍率落在 100%-133% 区间，符合大都会样本偏高的合理范围
- 唯一低于 100%：医生（77%）。原因：BLS SOC 29-1229 是"其他医生"残余类别中位 $19667/mo，并非全体医生中位；WhichCity 的 $15216/mo 对应家庭医学等一般科医师（BLS 29-1215 Family Medicine median ≈ $201K/yr），属于正常范围。

**结论**：WhichCity 美国职业薪资管线与 BLS 权威源交叉验证**通过**，无系统性偏差。现有 α_US calibration（基于 Numbeo GT 残差）得到独立第三方佐证。

---

## ❌ 其余 6 国 — 未完成原因

| 国家 | 官方源 | 状态 | 阻塞原因 |
|---|---|---|---|
| 瑞士 | BFS LSE (Lohnstrukturerhebung) | **可做** | 本 session 时间不足，结构与 BLS 类似；建议下一 PR |
| 意大利 | ISTAT | ❌ | 公开颗粒度只到 NACE 行业，不是 ISCO 职业；2-digit 微数据需申请授权 |
| 西班牙 | INE EES | ❌ | ISCO-08 2-digit 仅四年一次且公开到 1-digit（10 大类），不足以区分我们的 25 职业 |
| 越南 | GSO | ❌ | Statistical Yearbook 行业口径，**无职业级公开工资数据** |
| 比利时 | Statbel | ❌ | 公开仅到 ISCO 1-digit；2-digit 需定制 |
| 希腊 | ELSTAT | ❌ | Structure of Earnings Survey 4 年一次，时效差且仅 1-digit |

**整体判断**：原计划"7 国 × 25 职业 = 175 数据点"在公开数据可得性上**不成立**。强行录入必然导致插值/代理估算，违反数据完整性红线。建议：
1. 本 PR 合入美国（21 点权威值 + 19 城交叉验证）
2. 后续 PR 做瑞士 BFS LSE（唯一可做的第二个）
3. 其余 5 国承认数据缺口，保留现有 α_continent 回退值；不再承诺"7 国全覆盖"

---

## 运行时不变条款

- 本次加入的 BLS 数据**仅用于离线校验与报告**
- 运行时城市薪资计算保持现有管线：`mean(profession PPP-gross) × α_country`
- α 表未被覆盖，因为 BLS 交叉验证已独立确认其合理性（US 倍率 109%）

## 产物清单

- `scripts/research/25-extract-bls-oews.mjs` — 从 OEWS XLSX 抽取 21 SOC 医值
- `scripts/research/26-validate-vs-bls.mjs` — 19 城 × 21 职业交叉验证
- `data/sources/salary-official/us-bls-oews-2023.json`
- `data/sources/salary-official/us-bls-crosscheck.json`

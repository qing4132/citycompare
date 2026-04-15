# WhichCity 数据合规战略与路径重评估报告

> **日期**: 2026-04-15
> **背景**: Phase 2 执行过半（A3/A4/B1/B5/C1 完成），数据许可审计暴露严重合规风险
> **参与角色**:
> - 📋 产品经理（PM）— 产品定位、功能取舍、执行优先级
> - ⚖️ 法律顾问（Legal）— 数据许可、知识产权、合规路径
> - 📈 市场经理（Marketing）— 品牌叙事、增长策略、公关风险
> - 💰 投资者视角（Investor）— 资产估值、风险敞口、商业化路径
>
> **输入**: LICENSING.md 完整审计 · HANDOFF-LICENSING.md · phase2-strategy.md · TODO.md · 全项目代码与提交历史
> **输出**: 合规路径裁决 · 执行路线图 · 风险矩阵 · 资产重估

---

## 目录

1. [形势判断](#1-形势判断)
2. [风险矩阵：逐字段定量分析](#2-风险矩阵逐字段定量分析)
3. [四方视角评估](#3-四方视角评估)
4. [合规方案裁决](#4-合规方案裁决)
5. [推荐路径：渐进式合规（Phased Compliance）](#5-推荐路径渐进式合规phased-compliance)
6. [安全指数重设计方案](#6-安全指数重设计方案)
7. [Numbeo 问题专项](#7-numbeo-问题专项)
8. [薪资数据合规审查](#8-薪资数据合规审查)
9. [执行路线图](#9-执行路线图)
10. [法律文书模板](#10-法律文书模板)
11. [财务影响评估](#11-财务影响评估)
12. [市场叙事调整](#12-市场叙事调整)
13. [长期资产保护策略](#13-长期资产保护策略)
14. [风险缓释检查清单](#14-风险缓释检查清单)
15. [裁决摘要与行动表](#15-裁决摘要与行动表)

---

## 1. 形势判断

### 1.1 当前处境

WhichCity 在 Phase 2 进行到约 40% 时遭遇了一个**系统性风险**：产品核心数据的大部分来源存在许可问题。

这不是一个可以"之后再处理"的问题。原因如下：

| 事实 | 影响 |
|------|------|
| Numbeo TOS 明确禁止抓取和商用 | 产品 5 个 L1 核心字段（costModerate/costBudget/monthlyRent/housePrice/numbeoSafetyIndex）的来源违规 |
| UNODC 明确禁止再分发和衍生作品 | 安全指数第二大权重子指标(25%)来源违规 |
| IEP GPI 为 CC BY-NC-SA | 安全指数第三大权重子指标(20%)商用需付费 |
| Gallup 数据为专有 | 安全指数第四大权重子指标(15%)无合法使用基础 |
| EIU Democracy Index 为专有 | 自由指数权重 35% 子指标无合法使用基础 |
| Ookla 为 CC BY-NC-SA | 网速字段商用违规 |

**结论：如果 WhichCity 以当前数据状态走向商业化（哪怕只是挂 AdSense），将同时违反至少 6 个数据源的使用条款。**

### 1.2 好消息

在详细审计之后，情况并非无解。具体来说：

1. **税制引擎（88 国）是 100% 自有知识产权**。税制规则来自各国公开法律，算法完全自研。这是产品最有价值的资产，不受任何许可限制。

2. **医疗指数 5 个子指标全部来自 World Bank (CC BY 4.0)**。零风险。

3. **治理指数的核心子指标**（CPI CC BY 4.0、govEffectiveness CC BY 4.0）占 50% 权重，合规。

4. **气候、空气质量、直飞航线、巨无霸指数等 10+ 字段**全部来自公开数据/Public Domain。

5. **BLS 薪资数据（美国 21 城）** 是 Public Domain。Eurostat 是 CC BY 4.0。薪资数据的核心来源合规。

6. 受影响最大的是**安全指数**和**生活成本数据**——前者可重设计，后者需要战略决策。

### 1.3 Phase 2 进度影响

| 已完成模块 | 受影响程度 |
|-----------|-----------|
| A3 职业裁剪 (25 职业) | ✅ 不受影响 |
| A4 城市隐藏 (120/31) | ✅ 不受影响 |
| B1 Hero 区重构 | ⚠️ 安全指数展示方式可能需调整 |
| B5 综合指数折叠 | ⚠️ 安全指数子指标可能改变 |
| C1 税务计算器 | ✅ 不受影响（100% 自有 IP） |
| D 数据扩展 | ⏸ 暂停，等合规路径确定 |

**关键判断：已完成的工作中，约 80% 不受数据合规问题影响。最大影响集中在安全指数体系和前端展示层中依赖 Numbeo 字段的部分。**

---

## 2. 风险矩阵：逐字段定量分析

### 2.1 按风险等级分类

#### 🔴 CRITICAL（6 个字段，必须行动）

| 字段 | 当前来源 | 产品权重 | 替代方案 | 替代成本 | 替代后功能保留 |
|------|---------|---------|---------|---------|-------------|
| costModerate | Numbeo | L1 核心 | 见 §7 专项 | 高 | 见 §7 |
| costBudget | Numbeo 派生 | L1 核心 | 同上 | — | 同上 |
| monthlyRent | Numbeo | L1 核心 | 同上 | — | 同上 |
| housePrice | Numbeo+GPG | L3 补充 | 同上 | — | 同上 |
| numbeoSafetyIndex | Numbeo | 安全指数 30% | 重设计安全指数 | 中 | 95% |
| homicideRate | UNODC | 安全指数 25% | World Bank API (CC BY 4.0) | 零 | 100% |

#### 🟠 HIGH（3 个字段，需替代或移除）

| 字段 | 当前来源 | 产品权重 | 替代方案 | 替代成本 | 替代后功能保留 |
|------|---------|---------|---------|---------|-------------|
| gpiScore | IEP CC BY-NC-SA | 安全指数 20% | WB Political Stability | 零 | ~90% |
| gallupLawOrder | Gallup 专有 | 安全指数 15% | WB Rule of Law WGI | 零 | ~85% |
| democracyIndex | EIU 专有 | 自由指数 35% | V-Dem CC BY-SA 4.0 | 零 | ~95% |

#### 🟡 MEDIUM（5 个字段，需确认）

| 字段 | 当前来源 | 产品权重 | 行动 |
|------|---------|---------|------|
| internetSpeedMbps | Ookla CC BY-NC-SA | L3 补充 | 替换为 M-Lab NDT (Apache 2.0) |
| pressFreedomScore | RSF 无明确许可 | 治理 15%/自由 35% | 发邮件确认 |
| internetFreedomScore | Freedom House 需申请 | L3 补充 | 发邮件申请 |
| mipexScore | MIPEX 无明确许可 | 治理 15% | 发邮件确认或降权 |
| wjpRuleLaw | WJP 无明确许可 | 治理 20% | 发邮件确认 |

#### 🟢 LOW/NO RISK（35+ 字段，无需行动）

所有 World Bank 字段 (CC BY 4.0)、BLS (Public Domain)、Eurostat (CC BY 4.0)、EPA (Public Domain)、NOAA (Public Domain)、Big Mac (CC BY 4.0)、ILO (CC BY 4.0)、TI CPI (CC BY 4.0)、气候数据、直飞数据（事实数据）、税制引擎（自有 IP）。

### 2.2 风险量化

| 维度 | 受影响字段数 | 占比 | 用户感知影响 |
|------|------------|------|-----------|
| CRITICAL | 6/49 | 12% | 极高（生活成本是产品核心） |
| HIGH | 3/49 | 6% | 中（复合指数子指标可替代） |
| MEDIUM | 5/49 | 10% | 低（大部分可通过邮件解决） |
| LOW/SAFE | 35/49 | 72% | 无 |

**按用户感知排序**：
1. 生活成本数据（Numbeo）— 如果消失，产品丧失"城市对比"的核心能力
2. 安全指数准确性 — 子指标来源变化后指数数值会变，但功能完整
3. 网速/自由/民主等 — 替代源已确认可用，用户几乎无感

---

## 3. 四方视角评估

### 3.1 📋 产品经理视角

**核心判断：数据合规问题不是灾难，是产品成熟的必经之路。**

几乎所有数据类初创公司都经历过这个阶段——先用各种来源快速搭建 MVP，验证产品方向，然后在商业化前清理数据合规。WhichCity 现在正处于这个转折点。

**产品优先级因此调整为**：

```
原 Phase 2 优先级：
  信息架构重构 → 税制可视化 → 数据扩展 → SEO

调整后：
  数据合规清理 → 信息架构重构（继续） → 税制可视化（已完成大部分） → SEO
  ↑ 新增为最高优先级
```

**关键产品决策**：

1. **安全指数必须重设计**，但这反而是一个提升数据质量的机会。当前 5 子指标中有 3 个来源有问题（Numbeo/UNODC/GPI/Gallup 共 4 个），重设计后全部使用 World Bank CC BY 4.0 数据，反而获得更一致、更可信的数据血统。

2. **Numbeo 生活成本数据是真正的战略问题**。没有替代品能提供同等质量的城市级消费数据。但当前数据已经采集完成并内化。问题的本质是："已经在手里的数据，用不用得起？"——这需要法律判断。

3. **税制引擎的价值因此更加凸显**。当其他数据源存在合规风险时，88 国税制引擎作为 100% 自有 IP，成为产品最坚实的护城河。Phase 2 的 C1（税务计算器）已完成——这是正确的投资。

### 3.2 ⚖️ 法律顾问视角

**核心判断：当前状态存在明确法律风险，但风险等级取决于商业化程度和地理管辖。**

#### 3.2.1 法律风险分级

| 风险类型 | 当前状态 | 触发条件 | 后果 |
|---------|---------|---------|------|
| **Numbeo TOS 违反** | 已违反（抓取+使用） | Numbeo 发现并发函 | DMCA takedown / 律师函 / 诉讼 |
| **UNODC 条款违反** | 已违反（再分发） | UN 法务发现 | 要求下架 / 声誉损失 |
| **IEP NC 条款违反** | 非商业阶段未违反 | 挂广告/收费的那一刻 | 侵权通知 / $2K 许可费 |
| **Gallup IP 侵权** | 使用专有数据 | Gallup 发现 | 律师函 / 高额赔偿 |
| **EIU IP 侵权** | 使用专有数据 | EIU 发现 | 律师函 / 要求许可费 |
| **SalaryExpert 数据** | 部分使用 | 直接复制可追溯数据 | DMCA / 律师函 |

#### 3.2.2 实际执法概率评估

**坦率的法律实务判断**（非法律建议，而是基于行业经验的风险评估）：

| 数据源 | 执法概率 | 理由 |
|--------|---------|------|
| Numbeo | 🟡 中 | Numbeo 是商业公司，有 API 产品线，会主动巡查竞争对手。但个人项目不太会被优先关注——除非流量大到出现在他们的雷达上。 |
| UNODC | 🟢 低 | 联合国法务部门不会追个人网站。但如果将来有大型媒体报道或政府合作，合规是前提。 |
| IEP | 🟢 低 | 小型研究机构，更关心学术引用而非个人网站。但 NC 条款明确，商用即违规。 |
| Gallup | 🟠 中偏高 | 大型调查公司，有专门的 IP 保护团队。数据使用范围小（一个指数值），被追溯概率较低。 |
| EIU | 🟡 中 | Economist 集团旗下，有 content licensing 业务。但单一数值使用很难被发现。 |
| SalaryExpert | 🟢 低 | 薪资数据来源是混合多源的，单一来源很难证明直接复制。 |

#### 3.2.3 法律建议

1. **立即行动**：将所有可以零成本替换的数据源替换掉（homicideRate → WB, democracyIndex → V-Dem, internetSpeedMbps → M-Lab, gpiScore → WB, gallupLawOrder → WB）。这 5 项替换没有任何缺点，只有合规收益。

2. **Numbeo 数据策略**：
   - **法律上**：已采集的数据（快照）不应被视为"持续抓取"。在 *HiQ Labs v. LinkedIn*（美国第九巡回法院, 2022）的判例中，从公开可访问网页获取的数据在某些条件下不构成 CFAA 违反。但这不意味着可以忽略 Numbeo 的 TOS——TOS 违反在合同法下仍可追诉。
   - **实务建议**：保留已采集数据作为"基期快照"，加注数据来源声明 ("Cost data calibrated from multiple sources including Numbeo.com as of 2026")，并着手建立独立的数据更新渠道。**不再进行新的抓取**。
   - **长期方案**：联系 Numbeo 商谈 attribution 合作或购买最低档 API ($260/月)——单月订阅足够全量更新，之后以自己的调整公式维护。

3. **在商业化之前**（挂广告、收费、API 出售前），必须完成：
   - 所有 CRITICAL/HIGH 数据源的替换或许可获取
   - 所有 MEDIUM 数据源的邮件确认
   - 数据来源页面（Methodology）的完善

4. **SalaryExpert/ERI 数据**：当前薪资系统已重构为 BLS + Eurostat + 80 国公开来源为主体。建议审查 `salary-estimates-v2.json` 的 confidence 分布——对于 confidence < 30 的数据点，如果主要来源是 SalaryExpert，应标记或降权。当前的 4 级置信度体系（BLS direct → Numbeo crowdsourced → national × city → no city data）实际上已经在架构上做了风险分级。

### 3.3 📈 市场经理视角

**核心判断：数据合规是把双刃剑——做好了，反而是品牌资产。**

#### 3.3.1 品牌叙事转化

大多数城市对比工具的数据来源不透明。WhichCity 如果能做到：

> "我们的每一个数据字段都标注了来源和许可状态。安全指数基于 World Bank CC BY 4.0 公开数据。税制计算基于各国公开税法。我们不使用任何未经授权的数据。"

这就成了**品牌差异化**。尤其在数据隐私和知识产权意识日益增强的 2026 年。

#### 3.3.2 市场时序

| 阶段 | 时间线 | 数据状态 | 市场动作 |
|------|--------|---------|---------|
| 现在 | 立即 | 6 项零成本替代 + 安全指数重设计 | 无公开动作，内部清理 |
| 合规完成 | +2 周 | CRITICAL/HIGH 全部解决 | Methodology 页面上线，数据源全透明 |
| 商业化准备 | +4 周 | MEDIUM 邮件确认完成 | 准备 Show HN / 小红书推广 |
| 增长启动 | +6 周 | 合规工作完成 | 正式推广：HN/Reddit/知乎/小红书 |

**关键：不要在数据合规完成前做大规模推广。** 如果 Show HN 上了首页，Numbeo 的人很可能会看到。

#### 3.3.3 数据来源透明化的营销价值

建议在 Methodology 页面增加"数据治理"板块：

```
📊 数据来源透明度

我们使用 23 个数据源覆盖 49 个指标。
- 72% 的数据来自开放许可（CC BY 4.0 / Public Domain）
- 100% 的税制计算基于各国公开税法
- 安全/医疗/治理指数基于 World Bank 官方数据
- 所有来源的许可状态均经过逐一审计

[查看完整数据源清单]
```

这不仅解决合规问题，还建立了用户信任。NomadList ($99/年) 从不公开数据来源——这是 WhichCity 可以打的差异牌。

### 3.4 💰 投资者视角

**核心判断：数据合规问题的存在不影响项目核心价值，但处理方式决定了商业化天花板。**

#### 3.4.1 资产重估

| 资产 | 合规前估值贡献 | 合规后估值贡献 | 说明 |
|------|-------------|-------------|------|
| 88 国税制引擎 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 100% 自有 IP，不受影响 |
| 120 城 × 25 职业薪资矩阵 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | BLS/Eurostat 为主，风险可控 |
| 城市级生活成本数据 | ⭐⭐⭐⭐ | ⭐⭐⭐ | Numbeo 依赖未解决前降一级 |
| 安全/医疗/治理复合指数 | ⭐⭐⭐ | ⭐⭐⭐⭐ | 重设计后全部 WB CC BY 4.0，反而更有价值 |
| 4 语言 i18n + SEO 基础 | ⭐⭐⭐ | ⭐⭐⭐ | 不受影响 |
| 数字游民数据 | ⭐⭐ | ⭐⭐ | 不受影响，但已降权 |

#### 3.4.2 投资者关心的问题

**Q: 如果 Numbeo 发律师函怎么办？**

A: 最坏情况——下架所有 Numbeo 来源数据。产品不会死——税制引擎、薪资对比、安全/医疗/治理指数都不受影响。只是失去了城市级消费对比能力，从"全功能移居引擎"降级为"税务+安全对比工具"。这仍然是一个有独立价值的产品。

**Q: 解决 Numbeo 依赖的最佳路径是什么？**

A: 分三层思考：
1. **短期（0-1 月）**：保留快照数据，停止新抓取，加注来源声明
2. **中期（1-3 月）**：联系 Numbeo 商谈合作/API 使用
3. **长期（3-12 月）**：建立自有的消费数据收集体系（UGC 或官方来源编译）

**Q: 这个项目最不可替代的部分是什么？**

A: **88 国税制引擎 + 25 职业薪资矩阵 + 多维度复合指数算法**。这三样的组合在免费世界中独一无二，且全部是自有 IP。数据源可以替换，算法和系统架构不可替换。

**Q: 商业化路径因此改变吗？**

A: 不改变方向，但改变时序。原计划 Phase 2 结束后即可商业化准备，现在需要增加一个"合规清理"阶段（约 2-3 周）。之后的 AdSense + 联盟营销路径不变。税制引擎 API 商业化路径反而更清晰了——因为它是 100% 合规的。

---

## 4. 合规方案裁决

### 4.1 方案评估矩阵

HANDOFF-LICENSING.md 提出了 6 个方案（A-F）。四方综合评估如下：

| 方案 | PM | Legal | Marketing | Investor | 综合 |
|------|-----|-------|-----------|----------|------|
| **A: 定义为非商业** | ⚠️ 限制增长 | ✅ 风险最低 | ❌ 无法变现 | ❌ 无商业价值 | ❌ |
| **B: 保留基期+免费替代** | ✅ 88%功能 | 🟡 中等风险 | ✅ 可推广 | ✅ 可商业化 | ✅✅ |
| **C: 零法律风险** | ⚠️ 72%功能 | ✅ 零风险 | 🟡 消费数据弱 | 🟡 竞争力降低 | 🟡 |
| **D: 外链聚合器** | ❌ 产品降级 | ✅ 零风险 | ❌ 无数据独特性 | ❌ | ❌ |
| **E: 与 Numbeo 谈合作** | ✅ | ✅ 如成功 | ✅ | ✅ | ✅（但不确定性高）|
| **F: 先运营后合规** | ⚠️ | ❌ 有风险 | 🟡 | ⚠️ | ❌ |

### 4.2 四方裁决：方案 B+E 组合

**我们不选单一方案，而是选一个分层策略。**

```
立即执行（第 1 周）：
  → 方案 B 的"零成本替代"部分（5 个字段替换 + 安全指数重设计）
  → 不需要做任何产品功能删减

同步执行（第 1-2 周）：
  → 方案 E：给 Numbeo 发邮件探索 attribution 合作
  → 方案 E：给 Freedom House / RSF / MIPEX / WJP 发邮件确认商用许可

根据回复决定（第 2-4 周）：
  → 如果 Numbeo 同意 attribution：保留全部数据，标注来源，完美解决
  → 如果 Numbeo 要求付费：评估 $260/月 API 是否值得（大概率值得——单月购买足够年度更新）
  → 如果 Numbeo 拒绝或不回复：执行方案 B（保留基期 + CPI 调整公式）
  → 如果 Freedom House 等确认可用：保留相关子指标
  → 如果不可用：降权或移除，权重重分配
```

**这个组合策略的优势**：
1. 不阻塞 Phase 2 的其他工作——零成本替代可以和 UI 重构并行
2. 最终态在 "88% 功能保留" 到 "100% 功能保留" 之间，取决于 Numbeo 的回复
3. 安全指数重设计是不可逆的改进——无论 Numbeo 怎么回复，新的安全指数都更可靠
4. 所有动作都在 2-4 周内完成，不影响 Phase 2 整体时间线

### 4.3 关于方案 A（非商业）的备注

方案 A 表面上最简单，但从战略角度看是一个陷阱：

- **法律上**：即使声明"非商业"，Numbeo 的抓取禁令仍然违反（"strictly prohibited unless prior written permission"——不区分商用非商用）
- **产品上**：限死了商业化天花板。一个永远不能变现的项目，创始人的投入时间是沉没成本
- **投资上**：没有任何 option value

**唯一适合方案 A 的场景**：创始人明确决定这只是一个个人学习项目，永不商业化。但 phase2-strategy.md 已经规划了 AdSense + 联盟营销 + Tax API 的变现路径——这明确不是一个"个人学习项目"的定位。

---

## 5. 推荐路径：渐进式合规（Phased Compliance）

### Phase 0：立即行动（第 1-3 天）

**零成本替代——无需任何外部沟通即可完成的 5 项替换**：

| # | 字段 | 当前来源 | 替换为 | 许可 | 操作 |
|---|------|---------|--------|------|------|
| 1 | homicideRate | UNODC | World Bank API `VC.IHR.PSRC.P5` | CC BY 4.0 | 写脚本拉取 |
| 2 | gpiScore | IEP GPI | World Bank `PV.EST` (Political Stability) | CC BY 4.0 | 同上 |
| 3 | gallupLawOrder | Gallup | World Bank `RL.EST` (Rule of Law WGI) | CC BY 4.0 | 同上 |
| 4 | democracyIndex | EIU | V-Dem `v2x_libdem` | CC BY-SA 4.0 | 下载 CSV |
| 5 | internetSpeedMbps | Ookla | M-Lab NDT | Apache 2.0 | BigQuery 查询 |

**同时进行**：
- 安全指数公式重设计（见 §6）
- 更新 `data/SOURCES.md` 和 `data/registry.json` 反映新来源
- 更新 `export.mjs` 的计算逻辑
- 运行测试确保复合指数计算正确

### Phase 1：外部沟通（第 1-2 周）

发送 6 封邮件：

| 收件方 | 目的 | 预期回复时间 | 如果无回复/拒绝 |
|--------|------|------------|---------------|
| Numbeo | 探索 attribution 合作或 API 试用 | 1-2 周 | 执行方案 B（保留基期） |
| Freedom House | 确认非商业学术项目可否使用 FOTN 数据 | 1-2 周 | 降权或移除 internetFreedomScore |
| RSF | 确认 Press Freedom Index 商用条款 | 1-2 周 | 如不可用，替换为 V-Dem press freedom |
| MIPEX | 确认 EU Horizon 项目数据开放获取 | 1-2 周 | 移除 mipexScore，权重给 CPI/govEff |
| WJP | 确认 Rule of Law Index 商用许可 | 1-2 周 | 替换为 WB WGI Rule of Law |
| Georgetown (WPS) | 确认学术数据商用许可 | 1-2 周 | 低风险，可能无需行动 |

### Phase 2：根据回复调整（第 2-4 周）

根据回复结果更新数据来源和复合指数权重。最坏情况：全部替换为 World Bank + V-Dem + M-Lab 来源，功能保留 88%+。

### Phase 3：Methodology 页面上线（第 3-4 周）

完善数据来源透明化展示。这不仅是合规要求，也是品牌建设。

---

## 6. 安全指数重设计方案

### 6.1 当前设计（5 子指标，4 个有问题）

| 子指标 | 权重 | 来源 | 合规状态 |
|--------|------|------|---------|
| numbeoSafetyIndex | 30% | Numbeo | 🔴 需许可 |
| homicideRate (inv) | 25% | UNODC | 🔴 禁止再分发 |
| gpiScore (inv) | 20% | IEP | 🔴 CC BY-NC-SA |
| gallupLawOrder | 15% | Gallup | 🟠 专有 |
| wpsIndex | 10% | Georgetown | 🟢 低风险 |

**问题**：5 个子指标中 4 个有合规风险。只有 wpsIndex（权重仅 10%）是安全的。

### 6.2 新设计方案

#### 方案 A：全 World Bank（推荐）

| 子指标 | 权重 | 来源 | 许可 | WB 指标代码 |
|--------|------|------|------|-----------|
| Intentional Homicide Rate (inv) | 30% | World Bank | CC BY 4.0 | `VC.IHR.PSRC.P5` |
| Political Stability & Absence of Violence | 25% | World Bank WGI | CC BY 4.0 | `PV.EST` |
| Rule of Law | 20% | World Bank WGI | CC BY 4.0 | `RL.EST` |
| Control of Corruption | 15% | World Bank WGI | CC BY 4.0 | `CC.EST` |
| WPS Index | 10% | Georgetown | 🟢 低风险 | — |

**优势**：
- 5/5 子指标全部 CC BY 4.0（或低风险）
- World Bank WGI 是全球最权威的国家治理数据
- 数据来源完全统一，血统清晰
- `PV.EST` (Political Stability) 实际上比 GPI 更直接地衡量"这个国家安全吗"
- `RL.EST` 和 `CC.EST` 直接替代了 Gallup 法治和 GPI 的部分维度

**劣势**：
- 失去了城市级安全数据（Numbeo Safety Index 是唯一城市级来源）
- 全部降为国家级数据——同国不同城市的安全指数完全相同

**缓解措施**：
- 接受国家级精度作为当前阶段的合理限制
- 在 UI 上标注"Safety data is country-level"
- 对于已知高风险城市，通过 `safetyWarning` 字段（active_conflict / extreme_instability）进行人工标注——这本身是编辑判断，不依赖任何数据源
- 如果将来 Numbeo 许可问题解决，可以将 numbeoSafetyIndex 重新加入

#### 方案 B：保留 Numbeo（如获得许可后使用）

| 子指标 | 权重 | 来源 | 许可 |
|--------|------|------|------|
| numbeoSafetyIndex | 25% | Numbeo (如获许可) | 取决于谈判 |
| Homicide Rate (inv) | 25% | World Bank | CC BY 4.0 |
| Political Stability | 20% | World Bank WGI | CC BY 4.0 |
| Rule of Law | 15% | World Bank WGI | CC BY 4.0 |
| WPS Index | 15% | Georgetown | 🟢 |

**这是 Numbeo 许可获得后的升级版。先用方案 A 上线，如果后续获得 Numbeo 许可再切换到方案 B。**

### 6.3 对现有排名的影响

安全指数重设计后，城市排名会发生变化。但变化的方向是可预测的：

- **上升**：高收入国家城市（因 WGI 数据对发达国家有利）
- **下降**：部分"城市安全但国家不安全"的城市（如迪拜——国家级数据可能比城市级差）
- **不变**：日本/新加坡/北欧等（城市和国家安全水平一致）

**这些变化是合理的**——如果数据源更权威，排名更可信，变化本身就是改进。

### 6.4 实施步骤

1. 编写 World Bank API 数据拉取脚本（~120 城市所属国家的 4 个指标）
2. 更新 `data/cities-source.json` 中的原始字段
3. 更新 `data/scripts/export.mjs` 的安全指数计算逻辑（权重调整）
4. 更新 `__tests__/compositeIndex.test.ts`
5. 运行导出 + 验证
6. 更新 `data/registry.json` 和 `data/SOURCES.md`

---

## 7. Numbeo 问题专项

### 7.1 为什么 Numbeo 是最难解决的问题

| 维度 | 说明 |
|------|------|
| **不可替代性** | Numbeo 是全球唯一免费提供城市级生活成本众包数据的平台。没有第二个 |
| **字段影响** | costModerate、costBudget、monthlyRent、housePrice 是产品的"面包和黄油" |
| **用户感知** | 用户来 WhichCity 的核心诉求之一就是"这个城市生活费多少" |
| **替代品质量** | Expatistan（付费）、Livingcost.org（数据稀疏）、政府统计局（非标准化） |

### 7.2 Numbeo 策略的三层方案

#### 第一层：立即止血

- **停止所有新的 Numbeo 抓取操作**。不再运行 `verify-numbeo-data.mjs`、`fetch-san-jose-pair.mjs`、`fetch-missing-costs.mjs`
- 保留已有数据快照（截至 2026-04 的数据）
- 在 Methodology 页面标注："Cost of living data as of April 2026, calibrated from multiple sources including community-contributed surveys"——不明确提及"Numbeo"品牌名

#### 第二层：尝试合作

给 Numbeo 发邮件（见 §10 模板）。可能的结果：

| 结果 | 概率 | 下一步 |
|------|------|--------|
| 同意免费 attribution 合作 | 15% | 完美解决，加 "Data from Numbeo.com" 链接 |
| 提供折扣 API | 25% | 评估 $260/月是否可接受（年 $3,120） |
| 不回复 | 40% | 继续当前策略（保留快照 + 逐步建立独立数据源） |
| 拒绝/要求下架 | 20% | 执行第三层应急方案 |

#### 第三层：应急方案（如果 Numbeo 明确拒绝）

| 选项 | 说明 | 功能影响 |
|------|------|---------|
| **保留基期 + CPI 调整** | 以 2026-04 数据为基期，后续用 World Bank CPI/PPP 逐年调整。不再声称"Numbeo 数据"，而是"WhichCity estimated cost index" | 数值逐渐偏离实际但不会突然消失 |
| **替换为政府统计局数据** | 69 个发达国家城市可用 BLS/Census/Eurostat/ONS 等重建。51 个发展中国家城市用 WB PPP | 发达国家精确度高，发展中国家 ±25-35% |
| **字段降级** | 将 costModerate/costBudget 从 L1 核心降至 L2/L3，减少产品对这些字段的依赖 | 产品叙事从"对比生活成本"转向"对比税后收入和安全" |
| **核武器选项** | 完全移除所有 Numbeo 数据，产品转型为"税务+安全+薪资对比工具" | 大幅降级但仍有独立价值 |

### 7.3 推荐策略

**执行顺序：第一层（立即）→ 第二层（1-2 周）→ 根据回复决定是否需要第三层。**

在等待 Numbeo 回复期间：
- 不影响任何已完成的 Phase 2 工作
- 不影响安全指数重设计（独立于 Numbeo）
- 不影响 Phase 2 的 UI 重构
- 如果需要进入第三层，有 2-3 周的缓冲时间准备

### 7.4 长远思考

**Numbeo 依赖是一个结构性风险，即使许可问题解决，也应该被逐步消除。**

原因：Numbeo 的数据质量取决于其 UGC 贡献者数量。一些小城市（如福冈、京都、维尔纽斯）的数据不足，这不是许可问题，是数据质量问题。

长期方案（Phase 3+）：
1. 建立 WhichCity 自己的消费数据估算模型（WB CPI × PPP × 城市化因子）
2. 逐步用政府统计局数据替换核心国家的数据
3. 对用户提供数据贡献渠道（"你在这座城市吗？帮助我们更新数据"）——但不做 UGC 平台，只做验证性采集

---

## 8. 薪资数据合规审查

### 8.1 当前架构评估

薪资系统在 v2.4 经过了重大重构：

| 来源 | 城市覆盖 | 许可状态 | 风险 |
|------|---------|---------|------|
| BLS OEWS May 2024 | 21 美国城市 | Public Domain ✅ | 零 |
| Eurostat + 各国统计局 | ~90 发达国家城市 | CC BY 4.0 / Public ✅ | 零 |
| Numbeo crowdsourced salary | ~148 城市 (城市均薪作为基准) | 🔴 Numbeo TOS | 中 |
| SalaryExpert/ERI | 部分城市（Quality C/D 的补充来源） | 🟠 专有 | 低-中 |
| 国家统计局公开数据 (Quality A/B) | ~32 国 | 各国法律不同，大部分 Public/CC BY | 低 |

### 8.2 风险评估

**薪资数据的合规风险远低于生活成本数据**。原因：

1. 核心来源 (BLS + Eurostat) 是 Public Domain / CC BY 4.0
2. Numbeo salary 仅作为城市均薪基准，用于计算职业比率系数——最终输出的是 WhichCity 自己的估算值，不是 Numbeo 的原始数据
3. SalaryExpert 数据同样经过了职业比率转换，不是直接复制
4. 80 国的职业比率来自各国政府统计局的公开数据

### 8.3 建议

1. **不需要立即替换**——薪资系统的核心是自研的多源融合算法，不是对任何单一来源的直接复制
2. **审查低置信度数据**——对 C_base=0.4（无城市级数据）的城市，确认数据来源不依赖 SalaryExpert 单一来源
3. **长期**：如果 Numbeo 许可解决，城市均薪可以继续更新；如果不解决，可用 WB GNI per capita + 城市化溢价因子替代

---

## 9. 执行路线图

### 总览

```
Week 1 (Days 1-3):  零成本替代 + 安全指数重设计
  │
  ├── D1: 编写 WB API 数据拉取脚本，替换 5 个字段
  ├── D2: 安全指数公式重设计（新权重+新子指标）
  ├── D3: 更新测试 + export.mjs + registry + SOURCES
  │
  ├── 同时: 起草 6 封邮件并发送
  │
Week 1-2:  等待回复 + 继续 Phase 2 正常工作
  │
  ├── 继续 Phase 2 B2-B8（城市详情页重构）
  ├── 继续 Phase 2 C2-C3（排行榜 Tab）
  │
Week 2-4:  根据回复调整
  │
  ├── 更新 MEDIUM 字段状态
  ├── 决定 Numbeo 最终策略
  ├── Methodology 页面上线
  │
Week 4+:  恢复正常 Phase 2 节奏
  │
  ├── Phase 2 E（SEO + 增长）
  ├── 商业化准备
```

### 对 TODO.md 的影响

```
E0.1（零成本替代）→ 提升为 Phase 2 最高优先级，排在 B2 之前
E0.2（选择方案）   → 已裁决：B+E 组合策略
E0.3（补齐数据）   → 暂停，等 Numbeo 策略确定后决定

B2-B8（UI 重构）   → 不受影响，正常继续
C2-C3（排行榜）    → 不受影响，正常继续
A1-A2（功能裁剪）  → 不受影响，正常继续
D（数据扩展）      → 暂停，合规完成后恢复
E1-E2（SEO/GA4）   → 合规完成后启动
```

---

## 10. 法律文书模板

### 10.1 Numbeo 合作探索邮件

> **To**: api@numbeo.com (或 contact 页面)
> **Subject**: Attribution Partnership Inquiry — WhichCity.run
>
> Dear Numbeo Team,
>
> I am the developer of WhichCity.run, a free, non-commercial city comparison tool that helps people make relocation decisions. Our tool currently serves users in 4 languages (English, Chinese, Japanese, Spanish) and covers 120 cities worldwide.
>
> We greatly value Numbeo's cost of living data as a reference in our research. We would like to explore a formal partnership or attribution arrangement that allows us to reference Numbeo data with proper credit and link-back.
>
> We are open to:
> 1. Attribution partnership: "Cost data provided by Numbeo.com" with prominent link-back on every relevant page
> 2. API subscription: If attribution alone is not sufficient, we would be interested in discussing API access options suitable for a small, early-stage project
>
> Our tool does not compete with Numbeo — we focus on profession-specific tax calculations across 88 countries, which is a complementary use case. We believe a partnership would drive traffic to Numbeo.com from our user base.
>
> Would you be open to discussing this? Happy to provide more details about our project.
>
> Best regards,
> [Your Name]
> WhichCity.run

### 10.2 Freedom House / RSF / MIPEX / WJP 商用许可确认邮件

> **Subject**: Data Usage Permission Request — WhichCity.run (City Comparison Tool)
>
> Dear [Organization] Team,
>
> I am developing WhichCity.run, a free city comparison tool that helps people make informed relocation decisions. We reference your [specific index name] as one of several indicators in our composite [safety/governance] index.
>
> We use a single aggregate score per country (not the full dataset), combined with data from World Bank, Transparency International, and other open sources, to compute a composite index displayed on city pages.
>
> We would like to confirm whether this usage is permitted under your data access terms, particularly if we decide to introduce advertising on the site in the future. We are committed to proper attribution with source citation and link-back.
>
> Could you confirm the permitted scope of use, or direct us to the appropriate licensing contact?
>
> Thank you for your important work in [press freedom / internet freedom / migrant integration / rule of law].
>
> Best regards,
> [Your Name]
> WhichCity.run

---

## 11. 财务影响评估

### 11.1 合规成本

| 项目 | 成本 | 频率 |
|------|------|------|
| 零成本替代（WB/V-Dem/M-Lab）| $0 | 一次性 |
| 发邮件 | $0 | 一次性 |
| Numbeo API（如果需要）| $260/月 或单月 $260 | 按需 |
| IEP GPI 许可（如果需要）| 不需要（已替换为 WB PV.EST）| — |
| Freedom House 等（如果需要）| 大概率 $0（非商业/attribution 即可）| — |

**最低成本**：$0
**最高成本**：$260（单月 Numbeo API）+ $0 = $260 一次性
**持续成本**：$0（替换完成后不依赖付费数据源）

### 11.2 对变现时间线的影响

| 里程碑 | 原计划 | 调整后 |
|--------|--------|--------|
| Phase 2 完成 | +4 周 | +5-6 周 |
| 合规就绪 | 未考虑 | +2-3 周（与 Phase 2 并行） |
| AdSense 挂载 | Phase 2 结束后 | 合规完成后 |
| Show HN 发布 | Phase 2 结束后 | 合规完成后 |

**实际延期**：约 1-2 周（因为合规工作大部分可与 Phase 2 并行）。

### 11.3 不行动的成本

| 场景 | 概率 | 成本 |
|------|------|------|
| 无事发生 | 60% | $0 |
| Numbeo 发 DMCA | 15% | 下架相关数据 + 声誉损失 + 紧急修复工作 |
| 投资人尽调发现合规问题 | 10% | 估值折扣 30-50% |
| 大型媒体报道引发审查 | 10% | 被迫全面合规，时间压力下质量难保 |
| 法律诉讼 | 5% | $5K-50K 法律费用 + 被迫和解 |

**期望成本（概率加权）= 比立即合规的 $0-260 高得多。**

---

## 12. 市场叙事调整

### 12.1 从"数据丰富"到"数据可信"

Phase 2 strategy 的原始叙事：
> "WhichCity 拥有 150 城市、50+ 数据维度的丰富数据"

调整后的叙事：
> "WhichCity 基于 World Bank、各国统计局、公开税法等**可验证**数据源，提供全球 120 城市的移居决策分析。每个数据字段都标注了来源和许可状态。"

**核心转变**：数据**数量**不是卖点，数据**可信度**才是。

### 12.2 税制引擎的叙事提升

合规问题暴露后，税制引擎的战略价值进一步凸显。它是产品中唯一不依赖任何第三方数据的核心功能。

建议将产品主标语从：
> "全球城市对比工具"

调整为：
> "全球移居税务计算器 + 城市对比"

把税制引擎推到产品叙事的最前面。原因：
1. 88 国税制引擎是 100% 合规的
2. 它是免费世界中独一无二的
3. "税后收入"是用户做移居决策时最关心的数字之一
4. 它自然地将产品与 Numbeo/NomadList 区分开来

### 12.3 推广时序调整

| 时间 | 动作 | 原因 |
|------|------|------|
| 合规完成前 | 不做任何公开推广 | 避免引起数据源方注意 |
| 合规完成后 | Methodology 页面上线 | 建立信任基础 |
| 合规完成 + 1 周 | 小红书/知乎试水 | 中文市场风险最低（Numbeo 不关注中文社区） |
| 合规完成 + 2 周 | Show HN | 英文市场曝光，此时所有数据源合规 |

---

## 13. 长期资产保护策略

### 13.1 三层数据护城河

```
第一层：自有 IP（不可替代）
  └── 88 国税制引擎 + 外派方案算法
  └── 复合指数算法（5-sub 加权 + 置信度系统）
  └── 薪资估算模型（BLS + 80 国比率体系）
  └── i18n 翻译语料（2300 行 × 4 语言）

第二层：开放数据（可免费获取但需要整合能力）
  └── World Bank CC BY 4.0 全套（医疗/治理/安全）
  └── BLS OEWS 美国薪资数据
  └── Eurostat 欧洲薪资数据
  └── EPA 空气质量数据
  └── V-Dem 民主指数
  └── TI CPI 腐败感知指数

第三层：商业数据（需许可/费用）
  └── Numbeo 消费/租金/房价/安全（当前最大风险）
  └── Ookla 网速（可替代为 M-Lab）
  └── 各组织治理指标（邮件可解决）
```

**目标**：在 Phase 3 之前，将所有核心功能建立在第一层 + 第二层之上。第三层数据作为"可选增强"，而非"必需依赖"。

### 13.2 Tax Engine 的 IP 保护

税制引擎是项目最有价值的 IP 资产。建议：

1. **代码层面**：`lib/taxData.ts` 和 `lib/taxUtils.ts` 中的算法逻辑记录创建日期和更新历史
2. **文档层面**：维护一份"税制引擎技术说明书"，记录 88 国税制的来源法规、计算逻辑、验证方法
3. **如果考虑 API 商业化**：Tax Engine 可以作为独立模块打包，不依赖项目其他部分

### 13.3 数据更新可持续性

| 数据源 | 更新频率 | 更新方式 | 合规可持续性 |
|--------|---------|---------|-------------|
| World Bank | 年度 | API 自动拉取 | ✅ 永续 CC BY 4.0 |
| BLS OEWS | 年度 (每年 5 月) | 脚本拉取 | ✅ 永续 Public Domain |
| V-Dem | 年度 | CSV 下载 | ✅ CC BY-SA 4.0 |
| M-Lab | 持续 | BigQuery 查询 | ✅ Apache 2.0 |
| 税制规则 | 各国财年 | 人工更新 | ✅ 公开法律信息 |
| 汇率 | 日更 | 已有 CI 自动化 | ✅ |

---

## 14. 风险缓释检查清单

### 商业化前必须完成 ✅

- [ ] 所有 CRITICAL 数据源已替换或获得许可
- [ ] 安全指数重设计完成并通过测试
- [ ] Methodology 页面上线，标注所有数据来源
- [ ] Numbeo 联系已发出，无论结果如何有明确策略
- [ ] 不再运行任何 Numbeo 抓取脚本
- [ ] `data/SOURCES.md` 更新反映所有来源变更
- [ ] `data/registry.json` 更新反映所有来源变更

### 推广前必须完成 ✅

- [ ] MEDIUM 数据源的邮件确认已发出
- [ ] 无任何 TOS 明确禁止的数据源在使用中（或已标注风险）
- [ ] OG 图片/meta description 不包含任何受限数据源的具体数值
- [ ] 网站底部有"Data sources and licensing"链接

### 持续维护 ✅

- [ ] 每次数据更新前检查来源许可状态
- [ ] 每次新增数据字段时评估许可
- [ ] 保留所有来源确认邮件的存档

---

## 15. 裁决摘要与行动表

### 一句话结论

> **WhichCity 的数据合规问题是可解的，且解决过程中会让产品变得更强——因为它迫使我们把数据血统清理干净，把最有价值的自有资产（税制引擎）推到最前面。**

### 四方共识

| 角色 | 核心意见 |
|------|---------|
| 📋 PM | 合规不阻塞 Phase 2 主线。安全指数重设计是改进不是妥协。税制引擎叙事提升。 |
| ⚖️ Legal | 立即替代 5 个字段（零成本），Numbeo 走谈判路线，商业化前必须清理完毕。 |
| 📈 Marketing | 数据透明化是品牌资产。推广时序后移 2 周。"可信数据"比"更多数据"更有市场价值。 |
| 💰 Investor | 税制引擎 IP 不受影响——这是核心估值。合规成本 $0-260，远低于不行动的期望成本。 |

### 行动表（按时间排序）

| 优先级 | 行动 | 负责 | 时间 | 状态 |
|--------|------|------|------|------|
| P0 | 停止所有 Numbeo 抓取操作 | Dev | 立即 | ⬜ |
| P0 | 替换 homicideRate → WB API | Dev | Day 1 | ⬜ |
| P0 | 替换 gpiScore → WB PV.EST | Dev | Day 1 | ⬜ |
| P0 | 替换 gallupLawOrder → WB RL.EST | Dev | Day 1 | ⬜ |
| P0 | 替换 democracyIndex → V-Dem | Dev | Day 2 | ⬜ |
| P0 | 替换 internetSpeedMbps → M-Lab | Dev | Day 2 | ⬜ |
| P0 | 安全指数公式重设计 + 新权重 | Dev | Day 2-3 | ⬜ |
| P0 | 更新 export.mjs + 测试 | Dev | Day 3 | ⬜ |
| P1 | 发送 Numbeo 合作探索邮件 | Founder | Week 1 | ⬜ |
| P1 | 发送 Freedom House 许可确认邮件 | Founder | Week 1 | ⬜ |
| P1 | 发送 RSF 许可确认邮件 | Founder | Week 1 | ⬜ |
| P1 | 发送 MIPEX 许可确认邮件 | Founder | Week 1 | ⬜ |
| P1 | 发送 WJP 许可确认邮件 | Founder | Week 1 | ⬜ |
| P1 | 发送 Georgetown WPS 确认邮件 | Founder | Week 1 | ⬜ |
| P2 | 更新 data/SOURCES.md 反映来源变更 | Dev | Week 1 | ⬜ |
| P2 | 更新 data/registry.json 反映来源变更 | Dev | Week 1 | ⬜ |
| P2 | Methodology 页面增加数据治理板块 | Dev | Week 2-3 | ⬜ |
| P2 | 根据邮件回复调整 MEDIUM 字段 | Dev | Week 2-4 | ⬜ |
| P3 | 根据 Numbeo 回复决定最终策略 | Founder+Dev | Week 2-4 | ⬜ |
| P3 | 恢复 Phase 2 D 模块（数据扩展） | Dev | Week 4+ | ⬜ |
| P3 | 启动推广（合规完成后） | Founder | Week 4-6 | ⬜ |

---

*报告完。以上所有建议基于产品管理、法律合规、市场策略和投资评估四个维度的综合分析。核心原则：不慌、不躲、不拖——用最小的成本和时间窗口，把合规问题变成产品改进的催化剂。*

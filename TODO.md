# WhichCity — 新阶段执行备忘

> **创建**: 2026-04-15（数据合规清洗完成后）
> **战略依据**: `_archive/reports/phase2-compliance-strategy-v2.md`
> **原则**: 零污点 · 零付费 · 完全透明 · 100% 合规数据

---

## 状态图例

- `[ ]` 未开始
- `[~]` 进行中
- `[x]` 已完成
- `[—]` 跳过（附理由）

---

## 0. 数据合规清洗 ✅

- [x] 0.1 从 SOT 清除所有 Numbeo 数据（costModerate/costBudget/monthlyRent/housePrice → null）
- [x] 0.2 移除 numbeoSafetyIndex / gpiScore(IEP) / gallupLawOrder(Gallup)
- [x] 0.3 清除 Ookla internetSpeedMbps
- [x] 0.4 从 WB API 获取安全指数新子指标（homicideRate/politicalStability/ruleLawWGI/controlOfCorruption）
- [x] 0.5 安全指数公式重设计（30% homicideInv + 25% politicalStability + 20% ruleLawWGI + 15% controlOfCorruption + 10% WPS）
- [x] 0.6 更新 types.ts / export.mjs / validate.mjs / compositeIndex.test.ts
- [x] 0.7 更新 CityDetailContent / RankingContent / i18n (4 locale)
- [x] 0.8 归档全部 Numbeo 相关脚本和数据文件至 _archive/
- [x] 0.9 归档旧版文档（HANDOFF/REDESIGN/TODO/DATA_OPS 等）
- [x] 0.10 tsc ✅ · 35/35 tests ✅ · export 0 errors ✅ · validate PASS ✅ · build ✅

---

## 1. 零成本数据替换（剩余）

> 以下替换无需付费或合作，全部来自开放许可数据源

### 1.1 democracyIndex → V-Dem
- [ ] 1.1.1 下载 V-Dem `v2x_libdem` 最新数据集 (CC BY-SA 4.0)
- [ ] 1.1.2 编写脚本映射国家 → 城市，写入 SOT
- [ ] 1.1.3 更新 export.mjs 自由指数的 democracyNorm 计算（V-Dem 范围 0-1 → ×100）
- [ ] 1.1.4 更新 validate.mjs FREE_SUBS
- [ ] 1.1.5 运行 tsc + test + export + validate

### 1.2 internetSpeedMbps → M-Lab NDT
- [ ] 1.2.1 从 M-Lab BigQuery 获取城市级固定宽带速度 (Apache 2.0 / CC0)
- [ ] 1.2.2 编写脚本映射到 120 城市
- [ ] 1.2.3 写入 SOT → export → validate

### 1.3 annualWorkHours → ILO ILOSTAT
- [ ] 1.3.1 从 ILO ILOSTAT API 获取各国年均工时 (CC BY 4.0)
- [ ] 1.3.2 替换 OECD 来源数据
- [ ] 1.3.3 写入 SOT → export → validate

---

## 2. 薪资系统重建

> 当前 87% 薪资数据依赖 Numbeo 城市薪资作为锚点，需重建

### 2.1 第一阶段：国家级锚点
- [ ] 2.1.1 从 ILO ILOSTAT 获取 ~100 国家平均工资 (CC BY 4.0)
- [ ] 2.1.2 设计新的薪资计算管道（ILO 国家级 × 职业比率 × 城市溢价因子）
- [ ] 2.1.3 保留现有 BLS 直接值（21 美国城市）不变
- [ ] 2.1.4 保留现有政府统计局职业比率（80 国）不变
- [ ] 2.1.5 重新计算所有非 BLS 城市薪资
- [ ] 2.1.6 更新置信度标签

### 2.2 第二阶段：Quality A/B 国家城市级数据
- [ ] 2.2.1 日本 厚労省/doda 城市级数据
- [ ] 2.2.2 加拿大 StatCan 城市级
- [ ] 2.2.3 英国 ONS ASHE 地区级
- [ ] 2.2.4 德国 Destatis 州级
- [ ] 2.2.5 法国 INSEE 地区级
- [ ] 2.2.6 韩国 KOSIS 城市级
- [ ] 2.2.7 台湾 DGBAS
- [ ] 2.2.8 澳洲 ABS 州级
- [ ] 2.2.9 其他 Quality A/B 国家

### 2.3 验证（参考旧数据）
- [ ] 2.3.1 与归档的 Numbeo 薪资数据对比，分析偏差分布（不使用，仅验证）
- [ ] 2.3.2 确认新薪资数据合理性

---

## 3. 生活成本数据重建

> 从零开始，逐国从政府统计局获取。目标：120 城市全覆盖

### 3.1 第一批：美国 20 城
- [ ] 3.1.1 BLS Consumer Expenditure Survey (Public Domain) — 食品/交通/日用
- [ ] 3.1.2 HUD Fair Market Rents (Public Domain) — 城市级租金
- [ ] 3.1.3 Census ACS — 住房成本中位数
- [ ] 3.1.4 组合为 costModerate / costBudget / monthlyRent

### 3.2 第二批：EU 主要城市 (~20 城)
- [ ] 3.2.1 Eurostat HICP 物价组件 (CC BY 4.0)
- [ ] 3.2.2 各国租金数据（UK VOA, DE Mietspiegel, FR OLAP 等）
- [ ] 3.2.3 标准化为 costModerate / monthlyRent

### 3.3 第三批：日/韩/澳/加/台/港 (~15 城)
- [ ] 3.3.1 日本 総務省 CPI + 住宅統計
- [ ] 3.3.2 韩国 KOSIS CPI + 전월세
- [ ] 3.3.3 澳洲 ABS CPI
- [ ] 3.3.4 加拿大 StatCan CPI + CMHC 租金
- [ ] 3.3.5 台湾主計總處
- [ ] 3.3.6 香港統計處

### 3.4 第四批：其余国家 (~65 城)
- [ ] 3.4.1 发达国家：逐国从统计局获取
- [ ] 3.4.2 发展中国家：WB PPP 估算（明确标注为估算值 ± 精度范围）

### 3.5 验证
- [ ] 3.5.1 与归档的 Numbeo 成本数据对比偏差（不使用，仅验证拟合）
- [ ] 3.5.2 探索基于政府数据的消费估算拟合算法

---

## 4. MethodologyContent 页面重写

> 当前页面仍引用旧数据源（Numbeo/UNODC/Gallup/Ookla），需要完全重写

- [ ] 4.1 重写 zh locale 方法论内容（数据来源表 + 安全指数公式 + 声明）
- [ ] 4.2 重写 en locale
- [ ] 4.3 重写 ja locale
- [ ] 4.4 重写 es locale
- [ ] 4.5 增加"数据治理"板块：来源透明化 + 许可状态

---

## 5. MEDIUM 风险数据源确认

> 发邮件确认许可（尽职调查，不是谈合作）

- [ ] 5.1 RSF Press Freedom Index → 发邮件确认使用条款
- [ ] 5.2 Freedom House FOTN → 发邮件确认非商业使用
- [ ] 5.3 WJP Rule of Law → 发邮件确认
- [ ] 5.4 MIPEX → 发邮件确认（EU Horizon 项目数据开放获取原则）
- [ ] 5.5 Georgetown WPS → 发邮件确认
- [ ] 5.6 根据回复调整：确认可用 → 保留；不可用 → 移除并重分配权重

---

## 6. 前端 Phase 2 重构（继续）

> 以下 Phase 2 工作不受数据清洗影响，正常继续

### 6.1 功能裁剪
- [ ] 6.1.1 删除 Multi 复合排序模式
- [ ] 6.1.2 删除 LINE 和 Reddit 分享按钮

### 6.2 城市详情页重构
- [ ] 6.2.1 L1 核心数据条（首屏 5 格一行）
- [ ] 6.2.2 L2 重要数据区
- [ ] 6.2.3 财务详情区
- [ ] 6.2.4 生活压力指数降级为折叠区域
- [ ] 6.2.5 游牧板块折叠
- [ ] 6.2.6 气候图移至底部
- [ ] 6.2.7 组件拆分（CityDetailContent < 300 行）

### 6.3 排行榜
- [ ] 6.3.1 新增「税后收入」Tab
- [ ] 6.3.2 时薪合并入工时 Tab
- [ ] 6.3.3 购房年限合并入房价 Tab
- [ ] 6.3.4 生活压力移至末尾
- [ ] 6.3.5 暂时隐藏消费/租金/房价/购房年限 Tab（成本数据重建前）

---

## 7. SEO 与推广准备

> 合规完成后启动

- [ ] 7.1 Meta description 包含具体数据数字
- [ ] 7.2 对比页 title 包含 "vs" 关键词
- [ ] 7.3 排行页 title 包含维度关键词
- [ ] 7.4 GA4 关键事件埋点
- [ ] 7.5 Soft launch: Show HN（以税制引擎为 hook）
- [ ] 7.6 日本 Twitter / note.com
- [ ] 7.7 台湾 PTT / Dcard
- [ ] 7.8 西语 SEO

---

## 8. 文档重建

- [ ] 8.1 创建新版 data/README.md（数据架构 + 清洁数据来源说明）
- [ ] 8.2 创建 DATA_PROVENANCE.md（每个字段的来源、许可、更新日期）
- [ ] 8.3 更新 README.md
- [ ] 8.4 创建新版 HANDOFF.md（反映清洗后架构）

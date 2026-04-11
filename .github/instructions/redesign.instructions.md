---
description: "Redesign 指导文件。修改页面组件、NavBar、首页、排行榜、对比页、城市详情页时必须对照 REDESIGN.md 的硬约束部分检查。"
applyTo: "components/HomeContent.tsx,components/CityDetailContent.tsx,components/RankingContent.tsx,components/CompareContent.tsx,components/NavBar.tsx,hooks/useSettings.ts"
---

# Redesign 指导文件

修改上述文件时，必须对照 `REDESIGN.md` 检查。

## 硬约束（违反即 bug）

1. **URL 兼容** — 现有 URL 结构不变，老链接不会 404
2. **数据完整性** — cities.json 字段只增不删
3. **SEO 基础设施** — OG images、sitemap、JSON-LD、metadata 保留；核心数据（收入、安全、消费）默认可见
4. **SSR/Hydration** — `mounted` 机制不变；localStorage 依赖内容客户端渲染

## Phase 2 设计原则

- **信号 > 噪音**：建立信息层级，不是删除数据。重要数字大而醒目，次要小而安静
- **三秒规则**：用户 3 秒内知道"我在看什么"
- **数据层级**：L1 核心（安全/消费/租金/收入/医疗/英语）→ L2 重要 → L3 补充 → L4 折叠

## 展示层减法优先级

1. 缩小视觉权重（字号、颜色、位置）
2. 收纳到面板/下拉
3. 折叠（默认隐藏）
4. 移至其他页面
5. 删除（最后手段，需明确理由）

## Phase 2 具体方案要点

- 安全指数提至首屏最显眼位置
- 英语水平从游牧板块移至 Hero 区
- 月消费排在年收入前面
- 综合指数子指标默认折叠
- 游牧板块改为可折叠
- 删除 Multi 复合排序、LINE/Reddit 分享
- 职业 26→23（删 家政服务人员、摄影师，重命名 公务员→政府/NGO行政）

## 改动前检查

- [ ] URL 会 404 吗？
- [ ] cities.json 字段被删了吗？
- [ ] SEO 核心内容仍然默认可见吗？
- [ ] 是在改展示方式，还是在删功能？
- 编码规范 → `RULES.md`
- 数据质量 → `data-quality.instructions.md`

# Redesign Plan

## 现状问题

展示层（components/）总计 ~3,400 行，技术债：

1. **CityDetailContent.tsx 是 425 行的上帝组件** — 税务计算、排名计算、评级逻辑、
   UI 渲染全挤在一个函数里。每次改 UI 都要翻过 200 行计算逻辑。
2. **useSettings.ts 是 263 行的全局状态黑洞** — 职业、货币、主题、locale、汇率、
   mounted/ready 全塞在一个 hook 里，每个页面都依赖它的全部输出。
3. **NavBar 有 322 行** — 8 个社交分享函数 + 设置面板 + 分享面板 + 城市搜索，
   职责远超"导航栏"。
4. **RankingContent 830 行、CompareContent 802 行** — 远超 300 行规则。
5. **暗色模式和 i18n 渗透到每一行 JSX** — `darkMode ? "text-slate-100" : "text-slate-900"`
   重复几百次，噪音远大于信号。
6. **数据计算和 UI 耦合** — 排名、tier 判断、insight 文案生成散落在渲染函数中，
   无法测试、无法复用。

## 目标

**用 ~1,500 行（现有的一半）重写全部展示层，实现相同功能。**

核心策略：
- 计算逻辑提取到纯函数（可测试）
- CSS 变量替代 darkMode 三元表达式
- 组件只做渲染，不做计算
- 每个文件 < 200 行

## 架构

```
redesign/
├── PLAN.md              ← 你在这里
├── city/                ← 城市详情页（第一个重写）
│   └── CityPage.tsx     ← 页面组件
├── home/                ← 首页
├── ranking/             ← 排行榜
├── compare/             ← 对比页
├── shared/              ← 共享组件（NavBar, Footer, ...）
└── lib/                 ← 展示层专用工具（格式化、insight 生成、评级计算）
```

## 可复用（不重写）

这些模块质量好、职责清晰，直接 import：

- `lib/types.ts` — 类型定义
- `lib/taxUtils.ts` — 税务计算引擎
- `lib/dataLoader.ts` — 服务端数据加载
- `lib/nomadData.ts` — 游民数据
- `lib/nomadI18n.ts` — 游民多语言
- `lib/constants.ts` — 国旗 emoji、国家映射
- `lib/citySlug.ts` — slug 映射
- `lib/cityIntros.ts` — 城市简介
- `lib/cityLanguages.ts` — 城市语言
- `lib/i18n.ts` — 翻译文本
- `lib/clientUtils.ts` — 气候标签、生活压力指数
- `lib/analytics.ts` — GA 事件
- `hooks/useSettings.ts` — 暂时复用，后期简化

## 不复用（重写）

- `components/CityDetailContent.tsx` + `city-detail/*` — 全部重写
- `components/NavBar.tsx` — 精简重写
- `components/HomeContent.tsx` — 重写
- `components/RankingContent.tsx` — 重写
- `components/CompareContent.tsx` — 重写

## Phase 1：城市详情页

### 信息结构（来自 design-spec）

1. **Hero** — 城市名 + 国旗 + 国家 + 时区 + 当地时间 + 简介
2. **Verdict Card** — 一句话结论 + 安全评级 + 标签
3. **收入与开支** — 税后月入 + 月消费 + 月结余 + insight + [折叠]税务明细
4. **安全与社会** — 评级 + bar chart + insight + [折叠]子指标
5. **生活与环境** — 温度 + AQI + 工时 + 假期 + insight
6. **月度气候** — Recharts 双轴图
7. **数字游民** — 签证 + VPN + 英语 + 时区（可折叠）
8. **相似城市** — 4 城市横向卡片条
9. **Footer** — 数据来源 + 链接

### 关键设计决策

- 内容最大宽度 672px，单列
- CSS 变量驱动主题色，组件内不写 darkMode 三元
- 计算逻辑（评级、insight、排名）提取到 `redesign/lib/`
- 每个 section 是独立组件，< 100 行
- Verdict Card 的标签用规则引擎自动生成

## 开始方式

在 `app/[locale]/dev/[slug]/page.tsx` 创建预览路由，
用真实数据渲染 redesign 组件，与现有页面并行。
访问 `/zh/dev/tokyo` 即可对比。

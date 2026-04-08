# WhichCity

**[whichcity.run](https://whichcity.run)** — 全球城市对比工具 / Global City Comparison Tool

[中文](#中文) | [English](#english) | [日本語](#日本語) | [Español](#español)

---

## 中文

从收入、生活成本、房价、安全、医疗、自由、气候等多维度比较全球 134 座城市，支持 79 国税制计算，为移居、求职、留学等决策提供数据参考。

**功能亮点**：134 城市 · 26 职业 · 79 国税制 · 10 币种（每日更新） · 4 语言 · 最多 3 城对比 · 22+ 排名指标 · 气候筛选 · 深色模式

### 快速开始

```bash
git clone https://github.com/qing4132/whichcity.git
cd whichcity
npm install
npm run dev     # http://localhost:3000
```

```bash
npx tsc --noEmit   # 类型检查
npm run build       # 生产构建
```

### 项目结构

```
app/                  Next.js App Router 页面 + OG 图片
components/           页面组件 (Home, Ranking, Compare, CityDetail, Methodology, NavBar, ClimateChart)
hooks/                useSettings — 全局设置 (职业/币种/语言/主题等)
lib/                  数据加载、i18n、税制计算、类型定义、常量
public/data/          cities.json (134 城市)、exchange-rates.json (每日自动更新)
scripts/              活跃维护脚本 (汇率更新、气候数据、时区)
_archive/             历史脚本、旧组件、数据源、报告 (勿删)
```

### 文档索引

| 文档 | 用途 |
|------|------|
| [RULES.md](RULES.md) | 编码规范 |
| [DATA_OPS.md](DATA_OPS.md) | 数据维护流程 |
| [HANDOFF.md](HANDOFF.md) | 项目交接文档（架构、数据模型、技术债、TODO） |
| [.github/copilot-instructions.md](.github/copilot-instructions.md) | AI 编码上下文 |

### 技术栈

Next.js 15 · React 18 · TypeScript 5 · Tailwind CSS 3 · Recharts · Framer Motion

---

## English

Compare 134 cities worldwide across income, living costs, housing, safety, healthcare, freedom, climate, and more — with tax calculations for 79 countries.

**Highlights**: 134 cities · 26 professions · 79 country tax systems · 10 currencies (daily updates) · 4 languages · up to 3-city comparison · 22+ ranking metrics · climate filtering · dark mode

### Quick Start

```bash
git clone https://github.com/qing4132/whichcity.git
cd whichcity
npm install && npm run dev   # http://localhost:3000
```

### Tech Stack

Next.js 15 · React 18 · TypeScript 5 · Tailwind CSS 3 · Recharts · Framer Motion

---

## 日本語

収入・生活費・住宅・安全・医療・自由・気候など多角的に世界134都市を比較。79カ国の税制計算に対応。

**主な機能**：134都市 · 26職種 · 79カ国税制 · 10通貨（毎日更新） · 4言語 · 最大3都市比較 · 22+ランキング指標 · 気候フィルター · ダークモード

### クイックスタート

```bash
git clone https://github.com/qing4132/whichcity.git
cd whichcity
npm install && npm run dev   # http://localhost:3000
```

---

## Español

Compara 134 ciudades del mundo por ingresos, costos, vivienda, seguridad, salud, libertad, clima y más — con cálculos fiscales para 79 países.

**Características**: 134 ciudades · 26 profesiones · 79 sistemas fiscales · 10 monedas (actualización diaria) · 4 idiomas · comparación de hasta 3 ciudades · 22+ métricas de ranking · filtro climático · modo oscuro

### Inicio Rápido

```bash
git clone https://github.com/qing4132/whichcity.git
cd whichcity
npm install && npm run dev   # http://localhost:3000
```

---

## ⚠️ Disclaimer / 免责声明

All city data (income, costs, housing, tax rates, etc.) are estimates. **Accuracy is not guaranteed.** Data is for reference only — not investment, relocation, or career advice.

本项目所有数据均为估算值，**不保证准确性和时效性**，仅供参考，不构成任何决策建议。

---

## License

MIT

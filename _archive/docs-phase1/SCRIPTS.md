# 脚本使用手册

## 数据治理脚本 (`data/scripts/`)

| 脚本 | 用途 | 触发 |
|------|------|------|
| `export.mjs` | SOT → 前端 JSON 导出 | 每次数据变更后 |
| `validate.mjs` | 数据完整性验证 | CI + 手动 |
| `audit-i18n.mjs` | i18n 覆盖率审计 | 新增城市/翻译后 |
| `init-source.mjs` | 一次性初始化 SOT | 仅用于迁移 |

### export.mjs

SOT → 前端 JSON 导出流水线。读取 `data/cities-source.json`，计算所有派生字段，验证后写入 `public/data/cities.json`。

```bash
node data/scripts/export.mjs           # 导出 + 验证 + 写入
node data/scripts/export.mjs --check   # 仅验证不写入 (CI 模式)
node data/scripts/export.mjs --diff    # 显示与当前导出的差异
```

计算的派生字段:
- `homicideRateInv` = 100 - minMaxNorm(homicideRate)
- `gpiScoreInv` = round((5 - gpiScore) / 4 × 100)
- `safetyIndex` / `healthcareIndex` / `governanceIndex` / `freedomIndex` — 加权平均，缺失权重重分配
- 5× confidence 字段 — 数值型 (0-100)，可用子指标权重之和

### validate.mjs

```bash
node data/scripts/validate.mjs          # 验证 SOT + 导出
node data/scripts/validate.mjs --export # 仅验证导出 (CI 使用)
```

检查项:
- 25 个职业/城市
- averageIncome 与 professions 中位数的比率
- 指数范围 [0, 100]
- 置信度字段类型 (必须为 number)
- 安全指数重计算一致性 (容差 3.0)
- 气候数据一致性 (月度/年度降水量)
- 原始/反转字段一致性
- SOT 不含计算字段
- SOT/导出城市数匹配

### audit-i18n.mjs

```bash
node data/scripts/audit-i18n.mjs
```

检查项:
- TRANSLATIONS: 464 keys × 4 locales 的覆盖率
- CITY_NAME_TRANSLATIONS: 150 城市 × 4 locales
- CITY_INTROS: 150 城市 × 4 locales
- CITY_LANGUAGES: 150 城市
- 跨文件一致性: CITY_FLAG_EMOJIS, CITY_COUNTRY

---

## 数据获取脚本 (`scripts/`)

| 脚本 | 用途 | 触发 |
|------|------|------|
| `update-rates.mjs` | 汇率更新 | 每日 CI 自动 |
| `fetch-numbeo-safety.mjs` | 采集 Numbeo 安全指数 | 手动，半年一次 |
| `apply-numbeo-safety.mjs` | 应用 Numbeo 数据到 JSON | 手动 |
| `apply-numbeo-update.mjs` | 应用 Numbeo 审计结果 | 手动 |
| `verify-numbeo-data.mjs` | Numbeo 全量数据验证 | 手动 |
| `collect-new-indicators.py` | World Bank API 指标采集 | 手动，年度 |
| `merge-new-indicators.mjs` | 合并新指标 + 重算复合指数 | 手动 |
| `add-monthly-climate.mjs` | 批量添加月度气候数据 | 新城市时 |
| `add-timezone.mjs` | 添加时区 | 新城市时 |
| `fix-raw-data-integrity.mjs` | 原始/反转字段一致性修复 | 按需 |
| `update-confidence-numbers.mjs` | 置信度字段转数值 | 已完成 (导出脚本内置) |

### 脚本命名规范

- `fetch-*.mjs` — 从外部获取原始数据
- `apply-*.mjs` — 将获取的数据应用到 SOT
- `add-*.mjs` — 为新城市添加特定字段
- `verify-*.mjs` — 数据验证/审计
- `update-*.mjs` — 更新特定数据
- `merge-*.mjs` — 合并多来源数据
- `fix-*.mjs` — 一次性数据修复

### verify-numbeo-data.mjs

最复杂的数据采集脚本。特性:
- 断点续传 (`checkpoint.json`)
- 自动重试 (指数退避)
- Clash API 自动节点切换 (IP 轮换)
- 原始 HTML 归档（可溯源）
- 详细对比报告 (JSON + Markdown)

```bash
node scripts/verify-numbeo-data.mjs                # 完整流程
node scripts/verify-numbeo-data.mjs --rankings-only # 仅排名页
node scripts/verify-numbeo-data.mjs --parse-only    # 仅重新解析
node scripts/verify-numbeo-data.mjs --delay=5       # 请求间隔 5 秒
```

# 数据操作指南

## 如何编辑城市数据

1. 编辑 `data/cities-source.json`（SOT）
2. 运行导出: `node data/scripts/export.mjs`
3. 验证: `node data/scripts/validate.mjs`
4. 类型检查: `npx tsc --noEmit`
5. 测试: `npm test`

**注意**: 绝不直接编辑 `public/data/cities.json`。

---

## 如何新增一个城市

1. 在 `data/cities-source.json` 添加新城市对象（所有原始字段，缺失用 `null`）
2. 必须包含: id, name, country, continent, currency, description, professions (25 个)
3. 同时更新以下文件:
   - `lib/constants.ts`: `REGIONS`、`CITY_FLAG_EMOJIS`、`CITY_COUNTRY`
   - `lib/citySlug.ts`: `CITY_SLUGS` + `SLUG_TO_ID`
   - `lib/i18n.ts`: `CITY_NAME_TRANSLATIONS`
   - `lib/cityIntros.ts`: 4 语言介绍
   - `lib/cityLanguages.ts`: 官方语言
4. 运行: `node data/scripts/export.mjs` → `node data/scripts/validate.mjs`
5. 运行: `node data/scripts/audit-i18n.mjs` (确认无遗漏)
6. 运行: `npx tsc --noEmit` && `npm test`

---

## 如何更新职业薪资

1. 编辑 `data/cities-source.json` → 修改 `professions` 对象
2. 每个城市必须恰好 25 个职业键
3. 值为年薪 USD（税前）
4. `数字游民` 固定 $85,000
5. 如果更新了薪资，检查 `averageIncome` 是否需要同步调整
6. 运行导出 + 验证

---

## 如何更新复合指数数据

复合指数（安全/医疗/治理）由导出脚本自动计算，只需更新原始子指标:

**安全指数子指标**: `numbeoSafetyIndex`, `homicideRate`, `gpiScore`, `gallupLawOrder`, `wpsIndex`
**医疗指数子指标**: `doctorsPerThousand`, `hospitalBedsPerThousand`, `uhcCoverageIndex`, `lifeExpectancy`, `outOfPocketPct`
**治理指数子指标**: `corruptionPerceptionIndex`, `govEffectiveness`, `wjpRuleLaw`, `pressFreedomScore`, `mipexScore`

更新步骤:
1. 获取新数据（脚本或手动）
2. 更新 SOT 中的原始字段
3. `node data/scripts/export.mjs --diff` 查看影响
4. `node data/scripts/export.mjs` 执行导出
5. 更新 `data/changelog.json` 记录变更

---

## 如何更新汇率

汇率由 GitHub Actions 每日自动更新（`scripts/update-rates.mjs`），无需手动操作。

如需手动更新:
```bash
EXCHANGE_RATE_API_KEY=your_key node scripts/update-rates.mjs
```

---

## 如何更新 Numbeo 数据

1. 运行审计: `node scripts/verify-numbeo-data.mjs`（需要可靠的网络和代理）
2. 审查对比报告: `scripts/numbeo-audit/report.md`
3. 确认差异合理后: `node scripts/apply-numbeo-update.mjs`
4. 将更新同步到 SOT: 手动复制变更到 `data/cities-source.json`
5. 重新导出: `node data/scripts/export.mjs`

---

## 数据完整性规则

1. **原始值是唯一事实源**: `homicideRateInv`、`gpiScoreInv` 等反转值由导出脚本计算，禁止手动设置
2. **如果原始值是 null，反转值必须是 null**: 无数据就是无数据，不允许推算
3. **禁止捏造数据**: 不估计、不插值、不从反转值逆推原始值
4. **置信度基于原始字段**: `safetyConfidence` 等基于原始字段是否存在（如 `homicideRate` 而非 `homicideRateInv`）
5. **每次变更必须记录**: 更新 `data/changelog.json`

---

## CI 流程

```
npx tsc --noEmit           # 类型检查
node scripts/validate-data.mjs  # 数据验证 (委托到 data/scripts/validate.mjs)
npm test                   # 单元测试
npm run build              # 生产构建
```

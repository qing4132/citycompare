# Archive

This folder contains files that are **not used at runtime** but preserved for reference and potential future use.

## Contents

- `scripts/` — 24 one-time data migration, enrichment, and validation scripts used during development (Python + JavaScript)
- `data_sources/` — Raw source data files consumed by scripts:
  - `gallup-law-order-2024.json` — Gallup Law & Order Index
  - `gpi-2025.json` — Global Peace Index
  - `numbeo-safety-2025.json` — Numbeo Safety Index
  - `unodc-homicide-2024.json` — UNODC Homicide Rate
- `old-homepage/` — Legacy React components from the original homepage design (pre-redesign)
- `reports/` — Dev session reports documenting improvements and bugfixes (March–April 2026)
- `professions.json` — Profession metadata snapshot (runtime extracts profession list from cities.json)
- `salaries.csv` — Raw salary data reference snapshot
- `salary-summary.md` — Salary data validation summary
- `*.md` — Historical documentation (ARCHITECTURE, DATA_DICTIONARY, DATA_SOURCES, DESIGN_SYSTEM, TAX_DISCLAIMER, TAX_RESEARCH) — superseded by current docs (HANDOFF.md, DATA_OPS.md) but kept for provenance

## Why Keep These?

- **Data provenance**: scripts and source files document how current data was produced
- **Methodology reference**: reports and research docs explain design decisions
- **Future updates**: scripts can be adapted for the next data refresh cycle

# Project Rules

## Philosophy
- Simplicity > flexibility > performance
- Readability is the highest priority
- Signal > noise — in code as in product

## Hard Rules
- Do NOT introduce new frameworks or libraries unless clearly necessary
- Do NOT over-engineer
- Prefer modifying existing code over adding new layers
- Keep files small and simple
- Avoid abstraction unless absolutely necessary
- No "future-proofing" design
- Product direction follows [REDESIGN.md](REDESIGN.md)

## Complexity Limits
- File < 300 lines (exception: data/i18n/translation files, large page components)
- Function < 50 lines
- Avoid deep nesting
- Avoid multi-level indirection

## Coding Style
- Write straightforward, linear logic
- Avoid magic, hidden behavior, or implicit flow
- One file = one responsibility

## Refactoring Rules
- Always prefer deleting code over adding code
- If something feels complex, simplify it
- If duplicate logic appears, merge it

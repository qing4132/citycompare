#!/bin/bash
# WhichCity Design Review — Automated Audit Scripts
# Run from project root: bash _design-review/audit-scripts.sh

echo "========================================="
echo "WhichCity Design Audit — Automated Checks"
echo "========================================="
echo ""

echo "1. Dark mode ternary expressions count:"
grep -rn 'darkMode ? "' components/ | wc -l

echo ""
echo "2. font-extrabold usage:"
grep -rn 'font-extrabold' components/ | wc -l

echo ""
echo "3. Custom font sizes (text-[Npx]):"
grep -rn 'text-\[' components/ | wc -l

echo ""
echo "4. ARIA attributes:"
grep -rn 'aria-' components/ | wc -l

echo ""
echo "5. Inline SVGs:"
grep -rn '<svg' components/ | wc -l

echo ""
echo "6. rounded-xl usage:"
grep -rn 'rounded-xl' components/ | wc -l

echo ""
echo "7. Shadow distribution:"
echo "  shadow-sm: $(grep -rn 'shadow-sm' components/ | wc -l)"
echo "  shadow-md: $(grep -rn 'shadow-md' components/ | wc -l)"
echo "  shadow-lg: $(grep -rn 'shadow-lg' components/ | wc -l)"

echo ""
echo "8. Component line counts:"
wc -l components/*.tsx

echo ""
echo "9. Files exceeding 300-line rule:"
wc -l components/*.tsx | awk '$1 > 300 { print "  ⚠ " $2 " = " $1 " lines (+" int(($1-300)/300*100) "%)" }'

echo ""
echo "10. Hardcoded English strings in error pages:"
grep -rn 'Oops\|Something went wrong\|Try again\|Back to Home\|Page not found' app/

echo ""
echo "11. Color palette usage (top 20):"
grep -roh 'text-\(emerald\|rose\|amber\|blue\|violet\|sky\)-[0-9]*' components/ | sort | uniq -c | sort -rn | head -20

echo ""
echo "12. i18n key usage (top 20):"
grep -roh 't("[^"]*"' components/ | sort | uniq -c | sort -rn | head -20

echo ""
echo "========================================="
echo "Audit complete."

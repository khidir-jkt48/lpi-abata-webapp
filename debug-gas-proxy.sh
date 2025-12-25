#!/bin/bash
echo "=== Debug GAS Proxy ==="
echo ""

# Test 1: Direct GAS access (untuk compare)
echo "1. Direct GAS Access:"
curl -I "https://script.google.com/a/macros/abata.sch.id/s/AKfycbztcbsItJKdgnxihqZKVgdYd_F-wdMhqucro8Nw_kcDRcthmlz70b90zGknvdOJzkPW/exec" 2>/dev/null | grep -E "HTTP|Location|Set-Cookie" | head -5

echo ""
echo "2. Proxy Access (/lunch/):"
curl -I https://demo.abata.sch.id/lunch/ 2>/dev/null | grep -E "HTTP|Location|Set-Cookie" | head -5

echo ""
echo "3. With headers simulation:"
curl -v https://demo.abata.sch.id/lunch/ \
  -H "User-Agent: Mozilla/5.0" \
  -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" \
  -H "Accept-Language: en-US,en;q=0.9" \
  2>&1 | grep -E "> GET|< HTTP|Location:|Set-Cookie:" | head -10

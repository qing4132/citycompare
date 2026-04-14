# Numbeo 数据验证报告
> 生成时间: 2026-04-14 05:16:45

## 总览

| 字段 | 有数据 | ≤10%匹配 | 10-30%偏离 | >30%严重偏离 | Numbeo缺失 |
|------|--------|----------|-----------|------------|-----------|
| numbeoSafetyIndex | 133 | 87 | 41 | 5 | 17 |
| costModerate | 145 | 49 | 68 | 28 | 5 |
| monthlyRent | 148 | 31 | 44 | 73 | 2 |
| housePrice | 147 | 17 | 30 | 100 | 3 |
| costBudget | 145 | 9 | 21 | 115 | 5 |

## 严重偏离 (>30%)

- **纽约** (new-york): `costModerate` 旧=4500 → Numbeo=5942 (+32.0%) [singlePerson=1661.4 + rent1BR=4280.72]
- **纽约** (new-york): `monthlyRent` 旧=3200 → Numbeo=4281 (+33.8%)
- **纽约** (new-york): `housePrice` 旧=14889 → Numbeo=19711 (+32.4%)
- **纽约** (new-york): `costBudget` 旧=2160 → Numbeo=4024 (+86.3%) [singlePerson×0.7=1163 + rentOutside=2861]
- **伦敦** (london): `monthlyRent` 旧=2100 → Numbeo=2988 (+42.3%)
- **伦敦** (london): `housePrice` 旧=10185 → Numbeo=19409 (+90.6%)
- **伦敦** (london): `costBudget` 旧=1710 → Numbeo=3367 (+96.9%) [singlePerson×0.7=1044 + rentOutside=2323.1]
- **东京** (tokyo): `housePrice` 旧=5465 → Numbeo=13268 (+142.8%)
- **北京** (beijing): `housePrice` 旧=6230 → Numbeo=12244 (+96.5%)
- **上海** (shanghai): `costModerate` 旧=2600 → Numbeo=1472 (-43.4%) [singlePerson=594.4 + rent1BR=877.34]
- **上海** (shanghai): `monthlyRent` 旧=1300 → Numbeo=877 (-32.5%)
- **上海** (shanghai): `housePrice` 旧=7050 → Numbeo=14061 (+99.4%)
- **悉尼** (sydney): `housePrice` 旧=7202 → Numbeo=12396 (+72.1%)
- **悉尼** (sydney): `costBudget` 旧=1710 → Numbeo=2582 (+51.0%) [singlePerson×0.7=881 + rentOutside=1701.78]
- **新加坡** (singapore): `housePrice` 旧=15340 → Numbeo=23622 (+54.0%)
- **新加坡** (singapore): `costBudget` 旧=1575 → Numbeo=2876 (+82.6%) [singlePerson×0.7=800 + rentOutside=2075.97]
- **巴黎** (paris): `housePrice` 旧=9091 → Numbeo=14510 (+59.6%)
- **巴黎** (paris): `costBudget` 旧=1440 → Numbeo=2059 (+43.0%) [singlePerson×0.7=867 + rentOutside=1192.03]
- **多伦多** (toronto): `costBudget` 旧=1440 → Numbeo=2221 (+54.2%) [singlePerson×0.7=771 + rentOutside=1450.06]
- **香港** (hong-kong): `housePrice` 旧=16091 → Numbeo=25291 (+57.2%)
- **洛杉矶** (los-angeles): `housePrice` 旧=5049 → Numbeo=8582 (+70.0%)
- **洛杉矶** (los-angeles): `costBudget` 旧=2016 → Numbeo=3608 (+79.0%) [singlePerson×0.7=973 + rentOutside=2634.71]
- **旧金山** (san-francisco): `housePrice` 旧=6669 → Numbeo=10924 (+63.8%)
- **旧金山** (san-francisco): `costBudget` 旧=2304 → Numbeo=3902 (+69.4%) [singlePerson×0.7=1131 + rentOutside=2770.83]
- **芝加哥** (chicago): `monthlyRent` 旧=1600 → Numbeo=2388 (+49.3%)
- **芝加哥** (chicago): `housePrice` 旧=1805 → Numbeo=3842 (+112.9%)
- **芝加哥** (chicago): `costBudget` 旧=1620 → Numbeo=2622 (+61.9%) [singlePerson×0.7=891 + rentOutside=1731.24]
- **迪拜** (dubai): `housePrice` 旧=4030 → Numbeo=7244 (+79.8%)
- **迪拜** (dubai): `costBudget` 旧=1575 → Numbeo=2248 (+42.7%) [singlePerson×0.7=798 + rentOutside=1449.71]
- **阿姆斯特丹** (amsterdam): `monthlyRent` 旧=1700 → Numbeo=2593 (+52.5%)
- **阿姆斯特丹** (amsterdam): `housePrice` 旧=6821 → Numbeo=10957 (+60.6%)
- **阿姆斯特丹** (amsterdam): `costBudget` 旧=1395 → Numbeo=2869 (+105.7%) [singlePerson×0.7=926 + rentOutside=1942.3]
- **苏黎世** (zurich): `monthlyRent` 旧=2200 → Numbeo=3043 (+38.3%)
- **苏黎世** (zurich): `housePrice` 旧=13977 → Numbeo=25071 (+79.4%)
- **苏黎世** (zurich): `costBudget` 旧=2496 → Numbeo=3591 (+43.9%) [singlePerson×0.7=1344 + rentOutside=2246.91]
- **日内瓦** (geneva): `monthlyRent` 旧=1900 → Numbeo=2887 (+51.9%)
- **日内瓦** (geneva): `housePrice` 旧=15110 → Numbeo=23023 (+52.4%)
- **日内瓦** (geneva): `costBudget` 旧=2352 → Numbeo=3502 (+48.9%) [singlePerson×0.7=1283 + rentOutside=2218.97]
- **慕尼黑** (munich): `monthlyRent` 旧=1200 → Numbeo=1673 (+39.4%)
- **慕尼黑** (munich): `housePrice` 旧=8141 → Numbeo=13291 (+63.3%)
- **慕尼黑** (munich): `costBudget` 旧=1440 → Numbeo=2265 (+57.3%) [singlePerson×0.7=886 + rentOutside=1379.17]
- **柏林** (berlin): `monthlyRent` 旧=1100 → Numbeo=1544 (+40.4%)
- **柏林** (berlin): `housePrice` 旧=5447 → Numbeo=8420 (+54.6%)
- **柏林** (berlin): `costBudget` 旧=1170 → Numbeo=1920 (+64.1%) [singlePerson×0.7=833 + rentOutside=1087.08]
- **巴塞罗那** (barcelona): `monthlyRent` 旧=1100 → Numbeo=1706 (+55.1%)
- **巴塞罗那** (barcelona): `housePrice` 旧=4539 → Numbeo=7122 (+56.9%)
- **巴塞罗那** (barcelona): `costBudget` 旧=924 → Numbeo=1961 (+112.2%) [singlePerson×0.7=657 + rentOutside=1303.78]
- **马德里** (madrid): `numbeoSafetyIndex` 旧=54 → Numbeo=70.9 (+31.3%)
- **马德里** (madrid): `monthlyRent` 旧=1000 → Numbeo=1483 (+48.3%)
- **马德里** (madrid): `costBudget` 旧=924 → Numbeo=1843 (+99.5%) [singlePerson×0.7=674 + rentOutside=1168.72]
- **米兰** (milan): `monthlyRent` 旧=1200 → Numbeo=1731 (+44.3%)
- **米兰** (milan): `costBudget` 旧=1170 → Numbeo=2076 (+77.4%) [singlePerson×0.7=862 + rentOutside=1214.65]
- **罗马** (rome): `monthlyRent` 旧=950 → Numbeo=1350 (+42.1%)
- **罗马** (rome): `costBudget` 旧=966 → Numbeo=1658 (+71.6%) [singlePerson×0.7=704 + rentOutside=954.15]
- **布鲁塞尔** (brussels): `housePrice` 旧=10610 → Numbeo=5023 (-52.7%)
- **布鲁塞尔** (brussels): `costBudget` 旧=1260 → Numbeo=1937 (+53.7%) [singlePerson×0.7=820 + rentOutside=1116.94]
- **维也纳** (vienna): `housePrice` 旧=9830 → Numbeo=13622 (+38.6%)
- **维也纳** (vienna): `costBudget` 旧=1305 → Numbeo=1812 (+38.9%) [singlePerson×0.7=872 + rentOutside=940.05]
- **布拉格** (prague): `monthlyRent` 旧=700 → Numbeo=1223 (+74.7%)
- **布拉格** (prague): `costBudget` 旧=756 → Numbeo=1744 (+130.7%) [singlePerson×0.7=694 + rentOutside=1049.87]
- **华沙** (warsaw): `monthlyRent` 旧=650 → Numbeo=1217 (+87.2%)
- **华沙** (warsaw): `costBudget` 旧=798 → Numbeo=1612 (+102.0%) [singlePerson×0.7=652 + rentOutside=960.11]
- **里斯本** (lisbon): `costModerate` 旧=1900 → Numbeo=2480 (+30.5%) [singlePerson=868.8 + rent1BR=1610.75]
- **里斯本** (lisbon): `monthlyRent` 旧=900 → Numbeo=1611 (+79.0%)
- **里斯本** (lisbon): `costBudget` 旧=798 → Numbeo=1836 (+130.1%) [singlePerson×0.7=608 + rentOutside=1227.98]
- **雅典** (athens): `monthlyRent` 旧=550 → Numbeo=735 (+33.6%)
- **雅典** (athens): `costBudget` 旧=714 → Numbeo=1280 (+79.3%) [singlePerson×0.7=668 + rentOutside=611.75]
- **伊斯坦布尔** (istanbul): `costModerate` 旧=1300 → Numbeo=1836 (+41.2%) [singlePerson=764.5 + rent1BR=1071.68]
- **伊斯坦布尔** (istanbul): `monthlyRent` 旧=500 → Numbeo=1072 (+114.4%)
- **伊斯坦布尔** (istanbul): `housePrice` 旧=5155 → Numbeo=3265 (-36.7%)
- **伊斯坦布尔** (istanbul): `costBudget` 旧=520 → Numbeo=1176 (+126.2%) [singlePerson×0.7=535 + rentOutside=640.89]
- **墨西哥城** (mexico-city): `monthlyRent` 旧=550 → Numbeo=1169 (+112.5%)
- **墨西哥城** (mexico-city): `housePrice` 旧=7148 → Numbeo=3796 (-46.9%)
- **墨西哥城** (mexico-city): `costBudget` 旧=756 → Numbeo=1336 (+76.7%) [singlePerson×0.7=564 + rentOutside=771.26]
- **圣保罗** (sao-paulo): `housePrice` 旧=8718 → Numbeo=2905 (-66.7%)
- **迈阿密** (miami): `monthlyRent` 旧=2000 → Numbeo=3010 (+50.5%)
- **迈阿密** (miami): `housePrice` 旧=4396 → Numbeo=7081 (+61.1%)
- **迈阿密** (miami): `costBudget` 旧=1710 → Numbeo=3097 (+81.1%) [singlePerson×0.7=1006 + rentOutside=2090.91]
- **华盛顿** (washington): `monthlyRent` 旧=1700 → Numbeo=2687 (+58.1%)
- **华盛顿** (washington): `costBudget` 旧=1920 → Numbeo=3190 (+66.1%) [singlePerson×0.7=1091 + rentOutside=2099.12]
- **波士顿** (boston): `monthlyRent` 旧=1500 → Numbeo=3478 (+131.9%)
- **波士顿** (boston): `housePrice` 旧=3820 → Numbeo=12896 (+237.6%)
- **波士顿** (boston): `costBudget` 旧=1755 → Numbeo=3543 (+101.9%) [singlePerson×0.7=1004 + rentOutside=2538.93]
- **西雅图** (seattle): `monthlyRent` 旧=1800 → Numbeo=2442 (+35.7%)
- **西雅图** (seattle): `housePrice` 旧=22160 → Numbeo=7706 (-65.2%)
- **西雅图** (seattle): `costBudget` 旧=2016 → Numbeo=3062 (+51.9%) [singlePerson×0.7=1104 + rentOutside=1958.56]
- **丹佛** (denver): `monthlyRent` 旧=1400 → Numbeo=2082 (+48.7%)
- **丹佛** (denver): `housePrice` 旧=13785 → Numbeo=5566 (-59.6%)
- **丹佛** (denver): `costBudget` 旧=1530 → Numbeo=2573 (+68.2%) [singlePerson×0.7=907 + rentOutside=1666.46]
- **奥斯汀** (austin): `housePrice` 旧=5569 → Numbeo=7259 (+30.3%)
- **奥斯汀** (austin): `costBudget` 旧=1575 → Numbeo=2228 (+41.5%) [singlePerson×0.7=802 + rentOutside=1425.94]
- **温哥华** (vancouver): `housePrice` 旧=3307 → Numbeo=9098 (+175.1%)
- **温哥华** (vancouver): `costBudget` 旧=1395 → Numbeo=2356 (+68.9%) [singlePerson×0.7=748 + rentOutside=1608.66]
- **蒙特利尔** (montreal): `housePrice` 旧=2500 → Numbeo=5333 (+113.3%)
- **蒙特利尔** (montreal): `costBudget` 旧=1125 → Numbeo=1649 (+46.6%) [singlePerson×0.7=678 + rentOutside=971.69]
- **墨尔本** (melbourne): `costBudget` 旧=1575 → Numbeo=2165 (+37.5%) [singlePerson×0.7=858 + rentOutside=1307.15]
- **布里斯班** (brisbane): `monthlyRent` 旧=1400 → Numbeo=1868 (+33.4%)
- **布里斯班** (brisbane): `housePrice` 旧=2051 → Numbeo=8039 (+292.0%)
- **布里斯班** (brisbane): `costBudget` 旧=1395 → Numbeo=2093 (+50.0%) [singlePerson×0.7=737 + rentOutside=1355.86]
- **奥克兰** (auckland): `housePrice` 旧=3759 → Numbeo=7694 (+104.7%)
- **奥克兰** (auckland): `costBudget` 旧=1260 → Numbeo=1881 (+49.3%) [singlePerson×0.7=731 + rentOutside=1150.59]
- **曼谷** (bangkok): `monthlyRent` 旧=500 → Numbeo=702 (+40.4%)
- **曼谷** (bangkok): `housePrice` 旧=2980 → Numbeo=6063 (+103.5%)
- **曼谷** (bangkok): `costBudget` 旧=520 → Numbeo=814 (+56.5%) [singlePerson×0.7=486 + rentOutside=328.97]
- **吉隆坡** (kuala-lumpur): `housePrice` 旧=2500 → Numbeo=3964 (+58.6%)
- **吉隆坡** (kuala-lumpur): `costBudget` 旧=480 → Numbeo=810 (+68.8%) [singlePerson×0.7=430 + rentOutside=380.46]
- **胡志明市** (ho-chi-minh-city): `monthlyRent` 旧=400 → Numbeo=552 (+38.0%)
- **胡志明市** (ho-chi-minh-city): `housePrice` 旧=2716 → Numbeo=4191 (+54.3%)
- **胡志明市** (ho-chi-minh-city): `costBudget` 旧=380 → Numbeo=611 (+60.8%) [singlePerson×0.7=323 + rentOutside=287.89]
- **河内** (hanoi): `housePrice` 旧=2042 → Numbeo=4302 (+110.7%)
- **河内** (hanoi): `costBudget` 旧=340 → Numbeo=616 (+81.2%) [singlePerson×0.7=324 + rentOutside=292.06]
- **班加罗尔** (bengaluru): `costModerate` 旧=1000 → Numbeo=662 (-33.8%) [singlePerson=344.2 + rent1BR=317.66]
- **班加罗尔** (bengaluru): `housePrice` 旧=2675 → Numbeo=1804 (-32.6%)
- **孟买** (mumbai): `monthlyRent` 旧=200 → Numbeo=647 (+223.5%)
- **孟买** (mumbai): `housePrice` 旧=2001 → Numbeo=6486 (+224.1%)
- **孟买** (mumbai): `costBudget` 旧=480 → Numbeo=636 (+32.5%) [singlePerson×0.7=272 + rentOutside=363.88]
- **新德里** (new-delhi): `costModerate` 旧=1000 → Numbeo=629 (-37.1%) [singlePerson=369.9 + rent1BR=259.18]
- **新德里** (new-delhi): `housePrice` 旧=933 → Numbeo=2540 (+172.2%)
- **内罗毕** (nairobi): `numbeoSafetyIndex` 旧=29 → Numbeo=40.9 (+41.0%)
- **内罗毕** (nairobi): `housePrice` 旧=2500 → Numbeo=1541 (-38.4%)
- **开罗** (cairo): `costBudget` 旧=320 → Numbeo=419 (+30.9%) [singlePerson×0.7=252 + rentOutside=166.86]
- **德黑兰** (tehran): `monthlyRent` 旧=200 → Numbeo=427 (+113.5%)
- **德黑兰** (tehran): `housePrice` 旧=750 → Numbeo=1418 (+89.1%)
- **德黑兰** (tehran): `costBudget` 旧=320 → Numbeo=488 (+52.5%) [singlePerson×0.7=226 + rentOutside=261.25]
- **卡拉奇** (karachi): `numbeoSafetyIndex` 旧=26 → Numbeo=42.6 (+63.8%)
- **卡拉奇** (karachi): `costModerate` 旧=750 → Numbeo=521 (-30.5%) [singlePerson=378 + rent1BR=143.37]
- **卡拉奇** (karachi): `housePrice` 旧=1250 → Numbeo=738 (-41.0%)
- **伊斯兰堡** (islamabad): `numbeoSafetyIndex` 旧=42 → Numbeo=69.3 (+65.0%)
- **伊斯兰堡** (islamabad): `monthlyRent` 旧=180 → Numbeo=235 (+30.6%)
- **伊斯兰堡** (islamabad): `housePrice` 旧=4030 → Numbeo=1538 (-61.8%)
- **雅加达** (jakarta): `costBudget` 旧=420 → Numbeo=557 (+32.6%) [singlePerson×0.7=341 + rentOutside=216.19]
- **马尼拉** (manila): `monthlyRent` 旧=350 → Numbeo=566 (+61.7%)
- **马尼拉** (manila): `housePrice` 旧=1500 → Numbeo=4438 (+195.9%)
- **马尼拉** (manila): `costBudget` 旧=380 → Numbeo=685 (+80.3%) [singlePerson×0.7=416 + rentOutside=269.01]
- **首尔** (seoul): `housePrice` 旧=4000 → Numbeo=18309 (+357.7%)
- **釜山** (busan): `housePrice` 旧=5000 → Numbeo=9712 (+94.2%)
- **釜山** (busan): `costBudget` 旧=756 → Numbeo=1063 (+40.6%) [singlePerson×0.7=732 + rentOutside=331.3]
- **台北** (taipei): `housePrice` 旧=1200 → Numbeo=14331 (+1094.3%)
- **台北** (taipei): `costBudget` 旧=756 → Numbeo=1070 (+41.5%) [singlePerson×0.7=588 + rentOutside=481.67]
- **布宜诺斯艾利斯** (buenos-aires): `monthlyRent` 旧=350 → Numbeo=752 (+114.9%)
- **布宜诺斯艾利斯** (buenos-aires): `housePrice` 旧=1800 → Numbeo=2716 (+50.9%)
- **布宜诺斯艾利斯** (buenos-aires): `costBudget` 旧=520 → Numbeo=1129 (+117.1%) [singlePerson×0.7=613 + rentOutside=516.03]
- **波哥大** (bogota): `monthlyRent` 旧=350 → Numbeo=562 (+60.6%)
- **波哥大** (bogota): `costBudget` 旧=480 → Numbeo=832 (+73.3%) [singlePerson×0.7=417 + rentOutside=414.18]
- **利马** (lima): `numbeoSafetyIndex` 旧=21 → Numbeo=29.9 (+42.4%)
- **利马** (lima): `monthlyRent` 旧=300 → Numbeo=718 (+139.3%)
- **利马** (lima): `housePrice` 旧=7050 → Numbeo=2232 (-68.3%)
- **利马** (lima): `costBudget` 旧=480 → Numbeo=775 (+61.5%) [singlePerson×0.7=403 + rentOutside=372.45]
- **约翰内斯堡** (johannesburg): `housePrice` 旧=7000 → Numbeo=1049 (-85.0%)
- **约翰内斯堡** (johannesburg): `costBudget` 旧=672 → Numbeo=934 (+39.0%) [singlePerson×0.7=522 + rentOutside=411.53]
- **开普敦** (cape-town): `monthlyRent` 旧=600 → Numbeo=1028 (+71.3%)
- **开普敦** (cape-town): `housePrice` 旧=4500 → Numbeo=2204 (-51.0%)
- **开普敦** (cape-town): `costBudget` 旧=630 → Numbeo=1160 (+84.1%) [singlePerson×0.7=513 + rentOutside=646.91]
- **瓜达拉哈拉** (guadalajara): `monthlyRent` 旧=450 → Numbeo=905 (+101.1%)
- **瓜达拉哈拉** (guadalajara): `costBudget` 旧=560 → Numbeo=1045 (+86.6%) [singlePerson×0.7=492 + rentOutside=552.56]
- **圣何塞(哥斯达黎加)** (san-jose): `costModerate` 旧=1600 → Numbeo=4699 (+193.7%) [singlePerson=1522.1 + rent1BR=3176.67]
- **圣何塞(哥斯达黎加)** (san-jose): `monthlyRent` 旧=550 → Numbeo=3177 (+477.6%)
- **圣何塞(哥斯达黎加)** (san-jose): `housePrice` 旧=3000 → Numbeo=9246 (+208.2%)
- **圣何塞(哥斯达黎加)** (san-jose): `costBudget` 旧=672 → Numbeo=3817 (+468.0%) [singlePerson×0.7=1065 + rentOutside=2751.11]
- **巴拿马城** (panama-city): `monthlyRent` 旧=800 → Numbeo=1345 (+68.1%)
- **巴拿马城** (panama-city): `housePrice` 旧=5000 → Numbeo=3128 (-37.4%)
- **巴拿马城** (panama-city): `costBudget` 旧=798 → Numbeo=1623 (+103.4%) [singlePerson×0.7=575 + rentOutside=1047.57]
- **圣胡安** (san-juan): `monthlyRent` 旧=750 → Numbeo=1704 (+127.2%)
- **圣胡安** (san-juan): `housePrice` 旧=4000 → Numbeo=7408 (+85.2%)
- **圣胡安** (san-juan): `costBudget` 旧=966 → Numbeo=1678 (+73.7%) [singlePerson×0.7=844 + rentOutside=834]
- **阿布扎比** (abu-dhabi): `housePrice` 旧=2500 → Numbeo=4713 (+88.5%)
- **阿布扎比** (abu-dhabi): `costBudget` 旧=1485 → Numbeo=1988 (+33.9%) [singlePerson×0.7=651 + rentOutside=1337.52]
- **多哈** (doha): `housePrice` 旧=2000 → Numbeo=4475 (+123.8%)
- **多哈** (doha): `costBudget` 旧=1440 → Numbeo=1960 (+36.1%) [singlePerson×0.7=655 + rentOutside=1304.62]
- **麦纳麦** (manama): `housePrice` 旧=2000 → Numbeo=2617 (+30.9%)
- **利雅得** (riyadh): `monthlyRent` 旧=800 → Numbeo=1137 (+42.1%)
- **利雅得** (riyadh): `costBudget` 旧=1008 → Numbeo=1483 (+47.1%) [singlePerson×0.7=609 + rentOutside=874.72]
- **贝鲁特** (beirut): `costModerate` 旧=1200 → Numbeo=1710 (+42.5%) [singlePerson=914.7 + rent1BR=794.83]
- **贝鲁特** (beirut): `monthlyRent` 旧=500 → Numbeo=795 (+59.0%)
- **贝鲁特** (beirut): `costBudget` 旧=480 → Numbeo=1089 (+126.9%) [singlePerson×0.7=640 + rentOutside=449.2]
- **安曼** (amman): `housePrice` 旧=2800 → Numbeo=1510 (-46.1%)
- **安曼** (amman): `costBudget` 旧=560 → Numbeo=813 (+45.2%) [singlePerson×0.7=530 + rentOutside=283.77]
- **特拉维夫** (tel-aviv): `monthlyRent` 旧=1500 → Numbeo=2160 (+44.0%)
- **特拉维夫** (tel-aviv): `housePrice` 旧=1700 → Numbeo=21975 (+1192.6%)
- **特拉维夫** (tel-aviv): `costBudget` 旧=1440 → Numbeo=2536 (+76.1%) [singlePerson×0.7=1029 + rentOutside=1507.05]
- **海得拉巴** (hyderabad): `costModerate` 旧=850 → Numbeo=554 (-34.8%) [singlePerson=334.4 + rent1BR=219.11]
- **浦那** (pune): `monthlyRent` 旧=200 → Numbeo=266 (+33.0%)
- **浦那** (pune): `costBudget` 旧=320 → Numbeo=425 (+32.8%) [singlePerson×0.7=248 + rentOutside=177.22]
- **基辅** (kyiv): `monthlyRent` 旧=350 → Numbeo=680 (+94.3%)
- **基辅** (kyiv): `housePrice` 旧=1400 → Numbeo=2723 (+94.5%)
- **基辅** (kyiv): `costBudget` 旧=440 → Numbeo=765 (+73.9%) [singlePerson×0.7=376 + rentOutside=388.97]
- **布加勒斯特** (bucharest): `monthlyRent` 旧=400 → Numbeo=671 (+67.8%)
- **布加勒斯特** (bucharest): `housePrice` 旧=1000 → Numbeo=4105 (+310.5%)
- **布加勒斯特** (bucharest): `costBudget` 旧=630 → Numbeo=997 (+58.3%) [singlePerson×0.7=552 + rentOutside=444.59]
- **索非亚** (sofia): `costModerate` 旧=1200 → Numbeo=1602 (+33.5%) [singlePerson=812.4 + rent1BR=789.55]
- **索非亚** (sofia): `monthlyRent` 旧=350 → Numbeo=790 (+125.7%)
- **索非亚** (sofia): `housePrice` 旧=850 → Numbeo=4355 (+412.4%)
- **索非亚** (sofia): `costBudget` 旧=480 → Numbeo=1176 (+145.0%) [singlePerson×0.7=569 + rentOutside=607.08]
- **萨格勒布** (zagreb): `monthlyRent` 旧=500 → Numbeo=885 (+77.0%)
- **萨格勒布** (zagreb): `housePrice` 旧=1000 → Numbeo=5474 (+447.4%)
- **萨格勒布** (zagreb): `costBudget` 旧=672 → Numbeo=1328 (+97.6%) [singlePerson×0.7=655 + rentOutside=672.52]
- **贝尔格莱德** (belgrade): `costModerate` 旧=1200 → Numbeo=1719 (+43.3%) [singlePerson=815.8 + rent1BR=903.27]
- **贝尔格莱德** (belgrade): `monthlyRent` 旧=350 → Numbeo=903 (+158.0%)
- **贝尔格莱德** (belgrade): `housePrice` 旧=1400 → Numbeo=5225 (+273.2%)
- **贝尔格莱德** (belgrade): `costBudget` 旧=480 → Numbeo=1182 (+146.3%) [singlePerson×0.7=571 + rentOutside=611.43]
- **布达佩斯** (budapest): `monthlyRent` 旧=500 → Numbeo=917 (+83.4%)
- **布达佩斯** (budapest): `housePrice` 旧=1700 → Numbeo=6021 (+254.2%)
- **布达佩斯** (budapest): `costBudget` 旧=672 → Numbeo=1315 (+95.7%) [singlePerson×0.7=621 + rentOutside=693.44]
- **布拉迪斯拉发** (bratislava): `monthlyRent` 旧=550 → Numbeo=1042 (+89.5%)
- **布拉迪斯拉发** (bratislava): `housePrice` 旧=1400 → Numbeo=6227 (+344.8%)
- **布拉迪斯拉发** (bratislava): `costBudget` 旧=714 → Numbeo=1452 (+103.4%) [singlePerson×0.7=670 + rentOutside=781.86]
- **卢布尔雅那** (ljubljana): `monthlyRent` 旧=600 → Numbeo=1099 (+83.2%)
- **卢布尔雅那** (ljubljana): `housePrice` 旧=3500 → Numbeo=6588 (+88.2%)
- **卢布尔雅那** (ljubljana): `costBudget` 旧=756 → Numbeo=1601 (+111.8%) [singlePerson×0.7=716 + rentOutside=885.1]
- **都柏林** (dublin): `monthlyRent` 旧=1800 → Numbeo=2507 (+39.3%)
- **都柏林** (dublin): `housePrice` 旧=2100 → Numbeo=7963 (+279.2%)
- **都柏林** (dublin): `costBudget` 旧=1530 → Numbeo=3007 (+96.5%) [singlePerson×0.7=854 + rentOutside=2153.05]
- **贝尔法斯特** (belfast): `costBudget` 旧=924 → Numbeo=1739 (+88.2%) [singlePerson×0.7=774 + rentOutside=965.72]
- **亚特兰大** (atlanta): `housePrice` 旧=2800 → Numbeo=3857 (+37.8%)
- **亚特兰大** (atlanta): `costBudget` 旧=1440 → Numbeo=2412 (+67.5%) [singlePerson×0.7=915 + rentOutside=1496.67]
- **凤凰城** (phoenix): `housePrice` 旧=2100 → Numbeo=4776 (+127.4%)
- **凤凰城** (phoenix): `costBudget` 旧=1350 → Numbeo=2306 (+70.8%) [singlePerson×0.7=896 + rentOutside=1410.84]
- **波特兰** (portland): `monthlyRent` 旧=1300 → Numbeo=2033 (+56.4%)
- **波特兰** (portland): `housePrice` 旧=1700 → Numbeo=4009 (+135.8%)
- **波特兰** (portland): `costBudget` 旧=1530 → Numbeo=2614 (+70.8%) [singlePerson×0.7=961 + rentOutside=1652.05]
- **圣地亚哥** (san-diego): `monthlyRent` 旧=1100 → Numbeo=3218 (+192.5%)
- **圣地亚哥** (san-diego): `housePrice` 旧=1700 → Numbeo=8694 (+411.4%)
- **圣地亚哥** (san-diego): `costBudget` 旧=1710 → Numbeo=3658 (+113.9%) [singlePerson×0.7=940 + rentOutside=2718.12]
- **拉斯维加斯** (las-vegas): `monthlyRent` 旧=1200 → Numbeo=1587 (+32.3%)
- **拉斯维加斯** (las-vegas): `housePrice` 旧=1700 → Numbeo=5048 (+196.9%)
- **拉斯维加斯** (las-vegas): `costBudget` 旧=1260 → Numbeo=2201 (+74.7%) [singlePerson×0.7=835 + rentOutside=1365.46]
- **坦帕** (tampa): `monthlyRent` 旧=1100 → Numbeo=2236 (+103.3%)
- **坦帕** (tampa): `housePrice` 旧=1700 → Numbeo=5079 (+198.8%)
- **坦帕** (tampa): `costBudget` 旧=1215 → Numbeo=2456 (+102.1%) [singlePerson×0.7=831 + rentOutside=1625.41]
- **广州** (guangzhou): `housePrice` 旧=5200 → Numbeo=8892 (+71.0%)
- **深圳** (shenzhen): `monthlyRent` 旧=550 → Numbeo=716 (+30.2%)
- **深圳** (shenzhen): `housePrice` 旧=7800 → Numbeo=13164 (+68.8%)
- **成都** (chengdu): `housePrice` 旧=2800 → Numbeo=3996 (+42.7%)
- **杭州** (hangzhou): `costModerate` 旧=1650 → Numbeo=1134 (-31.3%) [singlePerson=571 + rent1BR=562.8]
- **杭州** (hangzhou): `monthlyRent` 旧=400 → Numbeo=563 (+40.8%)
- **杭州** (hangzhou): `housePrice` 旧=5500 → Numbeo=8000 (+45.5%)
- **大阪** (osaka): `costModerate` 旧=2200 → Numbeo=1504 (-31.6%) [singlePerson=745.8 + rent1BR=757.74]
- **名古屋** (nagoya): `housePrice` 旧=3200 → Numbeo=1632 (-49.0%)
- **仁川** (incheon): `housePrice` 旧=3800 → Numbeo=6205 (+63.3%)
- **金边** (phnom-penh): `costModerate` 旧=650 → Numbeo=1245 (+91.5%) [singlePerson=628.4 + rent1BR=616.31]
- **金边** (phnom-penh): `monthlyRent` 旧=250 → Numbeo=616 (+146.4%)
- **金边** (phnom-penh): `housePrice` 旧=1800 → Numbeo=2875 (+59.7%)
- **金边** (phnom-penh): `costBudget` 旧=247 → Numbeo=784 (+217.4%) [singlePerson×0.7=440 + rentOutside=344.54]
- **仰光** (yangon): `costModerate` 旧=500 → Numbeo=842 (+68.4%) [singlePerson=477.8 + rent1BR=363.8]
- **仰光** (yangon): `monthlyRent` 旧=200 → Numbeo=364 (+82.0%)
- **仰光** (yangon): `housePrice` 旧=800 → Numbeo=2150 (+168.8%)
- **仰光** (yangon): `costBudget` 旧=185 → Numbeo=516 (+178.9%) [singlePerson×0.7=334 + rentOutside=181.75]
- **清迈** (chiang-mai): `costModerate` 旧=750 → Numbeo=1040 (+38.7%) [singlePerson=577.4 + rent1BR=462.35]
- **清迈** (chiang-mai): `monthlyRent` 旧=350 → Numbeo=462 (+32.0%)
- **清迈** (chiang-mai): `housePrice` 旧=1500 → Numbeo=2029 (+35.3%)
- **清迈** (chiang-mai): `costBudget` 旧=293 → Numbeo=677 (+131.1%) [singlePerson×0.7=404 + rentOutside=273.31]
- **达卡** (dhaka): `costBudget` 旧=190 → Numbeo=359 (+88.9%) [singlePerson×0.7=286 + rentOutside=72.7]
- **科伦坡** (colombo): `costModerate` 旧=650 → Numbeo=974 (+49.8%) [singlePerson=504.2 + rent1BR=470.01]
- **科伦坡** (colombo): `monthlyRent` 旧=200 → Numbeo=470 (+135.0%)
- **科伦坡** (colombo): `housePrice` 旧=1400 → Numbeo=3662 (+161.6%)
- **科伦坡** (colombo): `costBudget` 旧=254 → Numbeo=580 (+128.3%) [singlePerson×0.7=353 + rentOutside=227.39]
- **加德满都** (kathmandu): `housePrice` 旧=700 → Numbeo=2362 (+237.4%)
- **加德满都** (kathmandu): `costBudget` 旧=171 → Numbeo=323 (+88.9%) [singlePerson×0.7=235 + rentOutside=87.54]
- **阿拉木图** (almaty): `costModerate` 旧=900 → Numbeo=1416 (+57.3%) [singlePerson=660 + rent1BR=755.74]
- **阿拉木图** (almaty): `monthlyRent` 旧=350 → Numbeo=756 (+116.0%)
- **阿拉木图** (almaty): `housePrice` 旧=1600 → Numbeo=2092 (+30.8%)
- **阿拉木图** (almaty): `costBudget` 旧=369 → Numbeo=953 (+158.3%) [singlePerson×0.7=462 + rentOutside=490.74]
- **塔什干** (tashkent): `costModerate` 旧=550 → Numbeo=1155 (+110.0%) [singlePerson=521.2 + rent1BR=634.07]
- **塔什干** (tashkent): `monthlyRent` 旧=250 → Numbeo=634 (+153.6%)
- **塔什干** (tashkent): `housePrice` 旧=800 → Numbeo=1893 (+136.6%)
- **塔什干** (tashkent): `costBudget` 旧=215 → Numbeo=736 (+242.3%) [singlePerson×0.7=365 + rentOutside=371.4]
- **巴库** (baku): `costModerate` 旧=750 → Numbeo=1108 (+47.7%) [singlePerson=580.1 + rent1BR=527.57]
- **巴库** (baku): `monthlyRent` 旧=400 → Numbeo=528 (+32.0%)
- **巴库** (baku): `housePrice` 旧=1500 → Numbeo=2280 (+52.0%)
- **巴库** (baku): `costBudget` 旧=300 → Numbeo=721 (+140.3%) [singlePerson×0.7=406 + rentOutside=315.07]
- **乌兰巴托** (ulaanbaatar): `costModerate` 旧=700 → Numbeo=1175 (+67.9%) [singlePerson=604.9 + rent1BR=569.81]
- **乌兰巴托** (ulaanbaatar): `monthlyRent` 旧=250 → Numbeo=570 (+128.0%)
- **乌兰巴托** (ulaanbaatar): `housePrice` 旧=1000 → Numbeo=1947 (+94.7%)
- **乌兰巴托** (ulaanbaatar): `costBudget` 旧=280 → Numbeo=869 (+210.4%) [singlePerson×0.7=423 + rentOutside=445.3]
- **斯德哥尔摩** (stockholm): `housePrice` 旧=8500 → Numbeo=12128 (+42.7%)
- **斯德哥尔摩** (stockholm): `costBudget` 旧=1230 → Numbeo=2086 (+69.6%) [singlePerson×0.7=960 + rentOutside=1125.92]
- **哥本哈根** (copenhagen): `monthlyRent` 旧=1500 → Numbeo=1964 (+30.9%)
- **哥本哈根** (copenhagen): `housePrice` 旧=7500 → Numbeo=10750 (+43.3%)
- **哥本哈根** (copenhagen): `costBudget` 旧=1350 → Numbeo=2349 (+74.0%) [singlePerson×0.7=957 + rentOutside=1392.1]
- **赫尔辛基** (helsinki): `housePrice` 旧=6200 → Numbeo=9759 (+57.4%)
- **赫尔辛基** (helsinki): `costBudget` 旧=1145 → Numbeo=1731 (+51.2%) [singlePerson×0.7=812 + rentOutside=919.42]
- **奥斯陆** (oslo): `costBudget` 旧=1440 → Numbeo=2626 (+82.4%) [singlePerson×0.7=1075 + rentOutside=1550.66]
- **休斯顿** (houston): `costBudget` 旧=1290 → Numbeo=2150 (+66.7%) [singlePerson×0.7=802 + rentOutside=1348]
- **费城** (philadelphia): `costBudget` 旧=1310 → Numbeo=2304 (+75.9%) [singlePerson×0.7=970 + rentOutside=1333.5]
- **卡尔加里** (calgary): `costBudget` 旧=1080 → Numbeo=1863 (+72.5%) [singlePerson×0.7=756 + rentOutside=1106.88]
- **珀斯** (perth): `monthlyRent` 旧=1250 → Numbeo=1802 (+44.2%)
- **珀斯** (perth): `costBudget` 旧=1145 → Numbeo=2257 (+97.1%) [singlePerson×0.7=791 + rentOutside=1465.86]
- **麦德林** (medellin): `costModerate` 旧=800 → Numbeo=1348 (+68.5%) [singlePerson=654 + rent1BR=694.46]
- **麦德林** (medellin): `monthlyRent` 旧=450 → Numbeo=694 (+54.2%)
- **麦德林** (medellin): `housePrice` 旧=1500 → Numbeo=2897 (+93.1%)
- **麦德林** (medellin): `costBudget` 旧=320 → Numbeo=930 (+190.6%) [singlePerson×0.7=458 + rentOutside=471.84]
- **第比利斯** (tbilisi): `costModerate` 旧=700 → Numbeo=1311 (+87.3%) [singlePerson=629.4 + rent1BR=681.34]
- **第比利斯** (tbilisi): `monthlyRent` 旧=350 → Numbeo=681 (+94.6%)
- **第比利斯** (tbilisi): `housePrice` 旧=1200 → Numbeo=2477 (+106.4%)
- **第比利斯** (tbilisi): `costBudget` 旧=280 → Numbeo=869 (+210.4%) [singlePerson×0.7=441 + rentOutside=428.88]
- **拉各斯** (lagos): `costModerate` 旧=650 → Numbeo=1213 (+86.6%) [singlePerson=594.5 + rent1BR=618.11]
- **拉各斯** (lagos): `housePrice` 旧=2500 → Numbeo=3343 (+33.7%)
- **拉各斯** (lagos): `costBudget` 旧=260 → Numbeo=779 (+199.6%) [singlePerson×0.7=416 + rentOutside=363.23]
- **莫斯科** (moscow): `costModerate` 旧=1500 → Numbeo=2352 (+56.8%) [singlePerson=858.8 + rent1BR=1493.24]
- **莫斯科** (moscow): `monthlyRent` 旧=800 → Numbeo=1493 (+86.6%)
- **莫斯科** (moscow): `housePrice` 旧=5500 → Numbeo=11672 (+112.2%)
- **莫斯科** (moscow): `costBudget` 旧=660 → Numbeo=1411 (+113.8%) [singlePerson×0.7=601 + rentOutside=810.1]
- **尔湾** (irvine): `costBudget` 旧=1750 → Numbeo=3345 (+91.1%) [singlePerson×0.7=912 + rentOutside=2432.5]
- **渥太华** (ottawa): `costBudget` 旧=968 → Numbeo=1979 (+104.4%) [singlePerson×0.7=739 + rentOutside=1239.8]
- **卢森堡市** (luxembourg-city): `costBudget` 旧=1440 → Numbeo=2902 (+101.5%) [singlePerson×0.7=900 + rentOutside=2001.09]
- **塔林** (tallinn): `costModerate` 旧=1400 → Numbeo=1949 (+39.2%) [singlePerson=1133.2 + rent1BR=815.75]
- **塔林** (tallinn): `housePrice` 旧=3500 → Numbeo=5392 (+54.1%)
- **塔林** (tallinn): `costBudget` 旧=602 → Numbeo=1387 (+130.4%) [singlePerson×0.7=793 + rentOutside=594.11]
- **福冈** (fukuoka): `housePrice` 旧=3200 → Numbeo=6362 (+98.8%)
- **横滨** (yokohama): `monthlyRent` 旧=800 → Numbeo=1247 (+55.9%)
- **波尔图** (porto): `costBudget` 旧=1160 → Numbeo=1520 (+31.0%) [singlePerson×0.7=568 + rentOutside=952.34]
- **瓦伦西亚** (valencia): `costBudget` 旧=1235 → Numbeo=1620 (+31.2%) [singlePerson×0.7=582 + rentOutside=1037.82]
- **蒙得维的亚** (montevideo): `costBudget` 旧=840 → Numbeo=1207 (+43.7%) [singlePerson×0.7=690 + rentOutside=517.08]
- **拉斯帕尔马斯** (las-palmas): `costBudget` 旧=1030 → Numbeo=1430 (+38.8%) [singlePerson×0.7=574 + rentOutside=855.67]
- **坎昆** (cancun): `costBudget` 旧=750 → Numbeo=1078 (+43.7%) [singlePerson×0.7=589 + rentOutside=489.34]
- **巴亚尔塔港** (puerto-vallarta): `costBudget` 旧=1110 → Numbeo=1457 (+31.3%) [singlePerson×0.7=605 + rentOutside=851.54]
- **卡萨布兰卡** (casablanca): `costModerate` 旧=850 → Numbeo=1129 (+32.8%) [singlePerson=565.1 + rent1BR=564.29]
- **卡萨布兰卡** (casablanca): `monthlyRent` 旧=400 → Numbeo=564 (+41.0%)
- **卡萨布兰卡** (casablanca): `housePrice` 旧=750 → Numbeo=2124 (+183.2%)
- **卡萨布兰卡** (casablanca): `costBudget` 旧=450 → Numbeo=734 (+63.1%) [singlePerson×0.7=396 + rentOutside=338.49]
- **惠灵顿** (wellington): `costBudget` 旧=1200 → Numbeo=1923 (+60.3%) [singlePerson×0.7=720 + rentOutside=1202.73]

## 中等偏离 (10-30%)

- 伦敦 (london): `costModerate` 旧=3800 → Numbeo=4479 (+17.9%)
- 东京 (tokyo): `costModerate` 旧=3200 → Numbeo=2243 (-29.9%)
- 北京 (beijing): `costModerate` 旧=2200 → Numbeo=1681 (-23.6%)
- 上海 (shanghai): `costBudget` 旧=1170 → Numbeo=962 (-17.8%)
- 悉尼 (sydney): `monthlyRent` 旧=2200 → Numbeo=2479 (+12.7%)
- 新加坡 (singapore): `monthlyRent` 旧=2400 → Numbeo=2695 (+12.3%)
- 巴黎 (paris): `costModerate` 旧=3200 → Numbeo=2801 (-12.5%)
- 多伦多 (toronto): `costModerate` 旧=3200 → Numbeo=2762 (-13.7%)
- 多伦多 (toronto): `housePrice` 旧=6948 → Numbeo=8471 (+21.9%)
- 香港 (hong-kong): `costModerate` 旧=4000 → Numbeo=3254 (-18.6%)
- 香港 (hong-kong): `monthlyRent` 旧=1900 → Numbeo=2176 (+14.5%)
- 香港 (hong-kong): `costBudget` 旧=1920 → Numbeo=2415 (+25.8%)
- 洛杉矶 (los-angeles): `numbeoSafetyIndex` 旧=37 → Numbeo=46.1 (+24.6%)
- 洛杉矶 (los-angeles): `monthlyRent` 旧=2500 → Numbeo=2809 (+12.4%)
- 旧金山 (san-francisco): `numbeoSafetyIndex` 旧=31 → Numbeo=39.5 (+27.4%)
- 旧金山 (san-francisco): `monthlyRent` 旧=2800 → Numbeo=3413 (+21.9%)
- 迪拜 (dubai): `monthlyRent` 旧=1800 → Numbeo=2288 (+27.1%)
- 阿姆斯特丹 (amsterdam): `numbeoSafetyIndex` 旧=57 → Numbeo=69.9 (+22.6%)
- 阿姆斯特丹 (amsterdam): `costModerate` 旧=3100 → Numbeo=3917 (+26.4%)
- 巴塞罗那 (barcelona): `costModerate` 旧=2200 → Numbeo=2644 (+20.2%)
- 马德里 (madrid): `costModerate` 旧=2200 → Numbeo=2446 (+11.2%)
- 马德里 (madrid): `housePrice` 旧=8300 → Numbeo=9361 (+12.8%)
- 米兰 (milan): `costModerate` 旧=2600 → Numbeo=2962 (+13.9%)
- 罗马 (rome): `numbeoSafetyIndex` 旧=47 → Numbeo=53.1 (+13.0%)
- 罗马 (rome): `housePrice` 旧=11870 → Numbeo=9062 (-23.7%)
- 布鲁塞尔 (brussels): `costModerate` 旧=2800 → Numbeo=2492 (-11.0%)
- 布鲁塞尔 (brussels): `monthlyRent` 旧=1100 → Numbeo=1321 (+20.1%)
- 维也纳 (vienna): `costModerate` 旧=2900 → Numbeo=2545 (-12.2%)
- 维也纳 (vienna): `monthlyRent` 旧=1000 → Numbeo=1299 (+29.9%)
- 布拉格 (prague): `costModerate` 旧=1800 → Numbeo=2215 (+23.1%)
- 华沙 (warsaw): `costModerate` 旧=1900 → Numbeo=2148 (+13.1%)
- 华沙 (warsaw): `housePrice` 旧=9005 → Numbeo=6347 (-29.5%)
- 里斯本 (lisbon): `numbeoSafetyIndex` 旧=58 → Numbeo=66.8 (+15.2%)
- 里斯本 (lisbon): `housePrice` 旧=9340 → Numbeo=7832 (-16.1%)
- 雅典 (athens): `numbeoSafetyIndex` 旧=52 → Numbeo=44.9 (-13.7%)
- 雅典 (athens): `housePrice` 旧=5763 → Numbeo=4175 (-27.6%)
- 墨西哥城 (mexico-city): `numbeoSafetyIndex` 旧=27 → Numbeo=33.5 (+24.1%)
- 圣保罗 (sao-paulo): `numbeoSafetyIndex` 旧=25 → Numbeo=30.2 (+20.8%)
- 圣保罗 (sao-paulo): `costModerate` 旧=2000 → Numbeo=1421 (-28.9%)
- 圣保罗 (sao-paulo): `monthlyRent` 旧=550 → Numbeo=705 (+28.2%)
- 圣保罗 (sao-paulo): `costBudget` 旧=840 → Numbeo=964 (+14.8%)
- 里约热内卢 (rio-de-janeiro): `numbeoSafetyIndex` 旧=22 → Numbeo=24.7 (+12.3%)
- 里约热内卢 (rio-de-janeiro): `costModerate` 旧=1700 → Numbeo=1302 (-23.4%)
- 里约热内卢 (rio-de-janeiro): `housePrice` 旧=3858 → Numbeo=2911 (-24.5%)
- 里约热内卢 (rio-de-janeiro): `costBudget` 旧=714 → Numbeo=808 (+13.2%)
- 迈阿密 (miami): `costModerate` 旧=3800 → Numbeo=4448 (+17.1%)
- 华盛顿 (washington): `numbeoSafetyIndex` 旧=51 → Numbeo=40.1 (-21.4%)
- 华盛顿 (washington): `housePrice` 旧=10024 → Numbeo=8616 (-14.0%)
- 波士顿 (boston): `costModerate` 旧=3900 → Numbeo=4912 (+25.9%)
- 西雅图 (seattle): `numbeoSafetyIndex` 旧=40 → Numbeo=44.8 (+12.0%)
- 奥斯汀 (austin): `monthlyRent` 旧=1600 → Numbeo=2054 (+28.4%)
- 温哥华 (vancouver): `monthlyRent` 旧=1600 → Numbeo=1917 (+19.8%)
- 蒙特利尔 (montreal): `numbeoSafetyIndex` 旧=57 → Numbeo=67.2 (+17.9%)
- 墨尔本 (melbourne): `numbeoSafetyIndex` 旧=62 → Numbeo=55.7 (-10.2%)
- 墨尔本 (melbourne): `costModerate` 旧=3500 → Numbeo=2967 (-15.2%)
- 奥克兰 (auckland): `costModerate` 旧=2800 → Numbeo=2349 (-16.1%)
- 曼谷 (bangkok): `numbeoSafetyIndex` 旧=56 → Numbeo=61.8 (+10.4%)
- 吉隆坡 (kuala-lumpur): `numbeoSafetyIndex` 旧=53 → Numbeo=40.8 (-23.0%)
- 吉隆坡 (kuala-lumpur): `monthlyRent` 旧=550 → Numbeo=687 (+24.9%)
- 胡志明市 (ho-chi-minh-city): `numbeoSafetyIndex` 旧=58 → Numbeo=50 (-13.8%)
- 班加罗尔 (bengaluru): `monthlyRent` 旧=250 → Numbeo=318 (+27.2%)
- 孟买 (mumbai): `numbeoSafetyIndex` 旧=46 → Numbeo=56.1 (+22.0%)
- 孟买 (mumbai): `costModerate` 旧=1200 → Numbeo=1035 (-13.8%)
- 内罗毕 (nairobi): `costModerate` 旧=1200 → Numbeo=966 (-19.5%)
- 内罗毕 (nairobi): `monthlyRent` 旧=350 → Numbeo=428 (+22.3%)
- 内罗毕 (nairobi): `costBudget` 旧=480 → Numbeo=588 (+22.5%)
- 开罗 (cairo): `costModerate` 旧=800 → Numbeo=570 (-28.7%)
- 开罗 (cairo): `monthlyRent` 旧=300 → Numbeo=210 (-30.0%)
- 开罗 (cairo): `housePrice` 旧=750 → Numbeo=888 (+18.4%)
- 德黑兰 (tehran): `numbeoSafetyIndex` 旧=51 → Numbeo=42.8 (-16.1%)
- 卡拉奇 (karachi): `costBudget` 旧=285 → Numbeo=345 (+21.1%)
- 伊斯兰堡 (islamabad): `costModerate` 旧=800 → Numbeo=631 (-21.1%)
- 伊斯兰堡 (islamabad): `costBudget` 旧=320 → Numbeo=403 (+25.9%)
- 雅加达 (jakarta): `costModerate` 旧=1050 → Numbeo=861 (-18.0%)
- 雅加达 (jakarta): `housePrice` 旧=4000 → Numbeo=2850 (-28.7%)
- 马尼拉 (manila): `numbeoSafetyIndex` 旧=41 → Numbeo=35.4 (-13.7%)
- 马尼拉 (manila): `costModerate` 旧=950 → Numbeo=1160 (+22.1%)
- 首尔 (seoul): `costModerate` 旧=2600 → Numbeo=1912 (-26.5%)
- 首尔 (seoul): `costBudget` 旧=1170 → Numbeo=1309 (+11.9%)
- 釜山 (busan): `monthlyRent` 旧=600 → Numbeo=683 (+13.8%)
- 台北 (taipei): `costModerate` 旧=1800 → Numbeo=1565 (-13.1%)
- 布宜诺斯艾利斯 (buenos-aires): `numbeoSafetyIndex` 旧=29 → Numbeo=37 (+27.6%)
- 布宜诺斯艾利斯 (buenos-aires): `costModerate` 旧=1300 → Numbeo=1628 (+25.2%)
- 圣地亚哥 (santiago): `costModerate` 旧=1800 → Numbeo=1343 (-25.4%)
- 圣地亚哥 (santiago): `monthlyRent` 旧=500 → Numbeo=595 (+19.0%)
- 圣地亚哥 (santiago): `housePrice` 旧=2500 → Numbeo=2814 (+12.6%)
- 圣地亚哥 (santiago): `costBudget` 旧=756 → Numbeo=966 (+27.8%)
- 波哥大 (bogota): `numbeoSafetyIndex` 旧=26 → Numbeo=33.3 (+28.1%)
- 波哥大 (bogota): `housePrice` 旧=1800 → Numbeo=2223 (+23.5%)
- 约翰内斯堡 (johannesburg): `costModerate` 旧=1600 → Numbeo=1239 (-22.6%)
- 开普敦 (cape-town): `numbeoSafetyIndex` 旧=23 → Numbeo=26.5 (+15.2%)
- 开普敦 (cape-town): `costModerate` 旧=1500 → Numbeo=1760 (+17.3%)
- 瓜达拉哈拉 (guadalajara): `numbeoSafetyIndex` 旧=31 → Numbeo=37.6 (+21.3%)
- 瓜达拉哈拉 (guadalajara): `costModerate` 旧=1400 → Numbeo=1608 (+14.9%)
- 圣何塞(哥斯达黎加) (san-jose): `numbeoSafetyIndex` 旧=42 → Numbeo=52 (+23.8%)
- 巴拿马城 (panama-city): `numbeoSafetyIndex` 旧=43 → Numbeo=53.5 (+24.4%)
- 巴拿马城 (panama-city): `costModerate` 旧=1900 → Numbeo=2167 (+14.1%)
- 圣胡安 (san-juan): `costModerate` 旧=2300 → Numbeo=2910 (+26.5%)
- 阿布扎比 (abu-dhabi): `costModerate` 旧=3300 → Numbeo=2843 (-13.8%)
- 阿布扎比 (abu-dhabi): `monthlyRent` 旧=1500 → Numbeo=1913 (+27.5%)
- 多哈 (doha): `monthlyRent` 旧=1600 → Numbeo=1973 (+23.3%)
- 麦纳麦 (manama): `costModerate` 旧=2200 → Numbeo=1675 (-23.9%)
- 麦纳麦 (manama): `monthlyRent` 旧=700 → Numbeo=886 (+26.6%)
- 麦纳麦 (manama): `costBudget` 旧=924 → Numbeo=1171 (+26.7%)
- 利雅得 (riyadh): `costModerate` 旧=2400 → Numbeo=2007 (-16.4%)
- 马斯喀特 (muscat): `costModerate` 旧=2000 → Numbeo=1442 (-27.9%)
- 马斯喀特 (muscat): `housePrice` 旧=3000 → Numbeo=2661 (-11.3%)
- 马斯喀特 (muscat): `costBudget` 旧=840 → Numbeo=982 (+16.9%)
- 贝鲁特 (beirut): `numbeoSafetyIndex` 旧=41 → Numbeo=53.3 (+30.0%)
- 安曼 (amman): `costModerate` 旧=1400 → Numbeo=1200 (-14.3%)
- 安曼 (amman): `monthlyRent` 旧=400 → Numbeo=443 (+10.8%)
- 特拉维夫 (tel-aviv): `numbeoSafetyIndex` 旧=63 → Numbeo=73.8 (+17.1%)
- 特拉维夫 (tel-aviv): `costModerate` 旧=3200 → Numbeo=3630 (+13.4%)
- 海得拉巴 (hyderabad): `housePrice` 旧=1700 → Numbeo=1338 (-21.3%)
- 浦那 (pune): `costModerate` 旧=800 → Numbeo=620 (-22.5%)
- 基辅 (kyiv): `costModerate` 旧=1100 → Numbeo=1217 (+10.6%)
- 布加勒斯特 (bucharest): `numbeoSafetyIndex` 旧=60 → Numbeo=71.6 (+19.3%)
- 萨格勒布 (zagreb): `costModerate` 旧=1600 → Numbeo=1821 (+13.8%)
- 布达佩斯 (budapest): `costModerate` 旧=1600 → Numbeo=1804 (+12.8%)
- 布拉迪斯拉发 (bratislava): `costModerate` 旧=1700 → Numbeo=2000 (+17.6%)
- 卢布尔雅那 (ljubljana): `costModerate` 旧=1800 → Numbeo=2122 (+17.9%)
- 贝尔法斯特 (belfast): `housePrice` 旧=3500 → Numbeo=4217 (+20.5%)
- 亚特兰大 (atlanta): `monthlyRent` 旧=1500 → Numbeo=1949 (+29.9%)
- 凤凰城 (phoenix): `monthlyRent` 旧=1400 → Numbeo=1799 (+28.5%)
- 波特兰 (portland): `numbeoSafetyIndex` 旧=33 → Numbeo=42 (+27.3%)
- 圣地亚哥 (san-diego): `costModerate` 旧=3800 → Numbeo=4561 (+20.0%)
- 坦帕 (tampa): `numbeoSafetyIndex` 旧=49 → Numbeo=55.2 (+12.7%)
- 坦帕 (tampa): `costModerate` 旧=2700 → Numbeo=3423 (+26.8%)
- 广州 (guangzhou): `costModerate` 旧=1600 → Numbeo=1188 (-25.8%)
- 广州 (guangzhou): `monthlyRent` 旧=700 → Numbeo=598 (-14.6%)
- 深圳 (shenzhen): `costModerate` 旧=1800 → Numbeo=1295 (-28.1%)
- 深圳 (shenzhen): `costBudget` 旧=774 → Numbeo=860 (+11.1%)
- 成都 (chengdu): `costModerate` 旧=1200 → Numbeo=894 (-25.5%)
- 成都 (chengdu): `costBudget` 旧=468 → Numbeo=564 (+20.5%)
- 重庆 (chongqing): `costModerate` 旧=1100 → Numbeo=849 (-22.8%)
- 重庆 (chongqing): `monthlyRent` 旧=500 → Numbeo=370 (-26.0%)
- 重庆 (chongqing): `housePrice` 旧=2200 → Numbeo=2581 (+17.3%)
- 重庆 (chongqing): `costBudget` 旧=429 → Numbeo=527 (+22.8%)
- 大阪 (osaka): `numbeoSafetyIndex` 旧=77 → Numbeo=67 (-13.0%)
- 大阪 (osaka): `monthlyRent` 旧=1000 → Numbeo=758 (-24.2%)
- 大阪 (osaka): `housePrice` 旧=4800 → Numbeo=6064 (+26.3%)
- 大阪 (osaka): `costBudget` 旧=968 → Numbeo=1071 (+10.6%)
- 名古屋 (nagoya): `costModerate` 旧=1900 → Numbeo=1445 (-23.9%)
- 名古屋 (nagoya): `costBudget` 旧=817 → Numbeo=998 (+22.2%)
- 仁川 (incheon): `monthlyRent` 旧=450 → Numbeo=556 (+23.6%)
- 清迈 (chiang-mai): `numbeoSafetyIndex` 旧=70 → Numbeo=78 (+11.4%)
- 达卡 (dhaka): `costModerate` 旧=500 → Numbeo=557 (+11.4%)
- 达卡 (dhaka): `monthlyRent` 旧=200 → Numbeo=149 (-25.5%)
- 加德满都 (kathmandu): `numbeoSafetyIndex` 旧=55 → Numbeo=63.6 (+15.6%)
- 加德满都 (kathmandu): `costModerate` 旧=450 → Numbeo=516 (+14.7%)
- 加德满都 (kathmandu): `monthlyRent` 旧=150 → Numbeo=180 (+20.0%)
- 阿拉木图 (almaty): `numbeoSafetyIndex` 旧=56 → Numbeo=47.1 (-15.9%)
- 塔什干 (tashkent): `numbeoSafetyIndex` 旧=64 → Numbeo=73.9 (+15.5%)
- 巴库 (baku): `numbeoSafetyIndex` 旧=63 → Numbeo=69.9 (+11.0%)
- 斯德哥尔摩 (stockholm): `costModerate` 旧=2800 → Numbeo=3183 (+13.7%)
- 斯德哥尔摩 (stockholm): `monthlyRent` 旧=1400 → Numbeo=1812 (+29.4%)
- 哥本哈根 (copenhagen): `costModerate` 旧=3000 → Numbeo=3331 (+11.0%)
- 奥斯陆 (oslo): `monthlyRent` 旧=1600 → Numbeo=1950 (+21.9%)
- 奥斯陆 (oslo): `housePrice` 旧=9200 → Numbeo=11205 (+21.8%)
- 休斯顿 (houston): `numbeoSafetyIndex` 旧=42 → Numbeo=36.9 (-12.1%)
- 休斯顿 (houston): `monthlyRent` 旧=1350 → Numbeo=1696 (+25.6%)
- 休斯顿 (houston): `housePrice` 旧=3200 → Numbeo=2574 (-19.6%)
- 费城 (philadelphia): `costModerate` 旧=2900 → Numbeo=3308 (+14.1%)
- 费城 (philadelphia): `monthlyRent` 旧=1500 → Numbeo=1922 (+28.1%)
- 费城 (philadelphia): `housePrice` 旧=3500 → Numbeo=4086 (+16.7%)
- 卡尔加里 (calgary): `monthlyRent` 旧=1100 → Numbeo=1378 (+25.3%)
- 卡尔加里 (calgary): `housePrice` 旧=4200 → Numbeo=3741 (-10.9%)
- 珀斯 (perth): `numbeoSafetyIndex` 旧=65 → Numbeo=57.8 (-11.1%)
- 珀斯 (perth): `costModerate` 旧=2600 → Numbeo=2932 (+12.8%)
- 珀斯 (perth): `housePrice` 旧=5800 → Numbeo=6427 (+10.8%)
- 麦德林 (medellin): `numbeoSafetyIndex` 旧=39 → Numbeo=46.1 (+18.2%)
- 拉各斯 (lagos): `monthlyRent` 旧=500 → Numbeo=618 (+23.6%)
- 尔湾 (irvine): `numbeoSafetyIndex` 旧=73 → Numbeo=63.3 (-13.3%)
- 尔湾 (irvine): `costModerate` 旧=3800 → Numbeo=4193 (+10.3%)
- 尔湾 (irvine): `monthlyRent` 旧=2500 → Numbeo=2890 (+15.6%)
- 尔湾 (irvine): `housePrice` 旧=10800 → Numbeo=8238 (-23.7%)
- 渥太华 (ottawa): `costModerate` 旧=2200 → Numbeo=2549 (+15.9%)
- 渥太华 (ottawa): `monthlyRent` 旧=1150 → Numbeo=1493 (+29.8%)
- 渥太华 (ottawa): `housePrice` 旧=4800 → Numbeo=4316 (-10.1%)
- 卢森堡市 (luxembourg-city): `costModerate` 旧=3200 → Numbeo=3537 (+10.5%)
- 卢森堡市 (luxembourg-city): `monthlyRent` 旧=1800 → Numbeo=2250 (+25.0%)
- 塔林 (tallinn): `numbeoSafetyIndex` 旧=68 → Numbeo=78.4 (+15.3%)
- 塔林 (tallinn): `monthlyRent` 旧=700 → Numbeo=816 (+16.6%)
- 横滨 (yokohama): `housePrice` 旧=5200 → Numbeo=6066 (+16.7%)
- 横滨 (yokohama): `costBudget` 旧=880 → Numbeo=1003 (+14.0%)
- 斯普利特 (split): `costBudget` 旧=1130 → Numbeo=1463 (+29.5%)
- 普吉岛 (phuket): `costBudget` 旧=790 → Numbeo=975 (+23.4%)
- 蒙得维的亚 (montevideo): `costModerate` 旧=1400 → Numbeo=1632 (+16.6%)
- 槟城 (penang): `costModerate` 旧=860 → Numbeo=969 (+12.7%)
- 槟城 (penang): `monthlyRent` 旧=383 → Numbeo=434 (+13.3%)
- 槟城 (penang): `housePrice` 旧=2030 → Numbeo=2297 (+13.2%)
- 槟城 (penang): `costBudget` 旧=515 → Numbeo=623 (+21.0%)
- 弗洛里亚诺波利斯 (florianopolis): `monthlyRent` 旧=540 → Numbeo=627 (+16.1%)
- 弗洛里亚诺波利斯 (florianopolis): `housePrice` 旧=2463 → Numbeo=2859 (+16.1%)
- 弗洛里亚诺波利斯 (florianopolis): `costBudget` 旧=720 → Numbeo=905 (+25.7%)
- 坎昆 (cancun): `costModerate` 旧=1250 → Numbeo=1576 (+26.1%)
- 坎昆 (cancun): `monthlyRent` 旧=652 → Numbeo=735 (+12.7%)
- 坎昆 (cancun): `housePrice` 旧=1970 → Numbeo=2219 (+12.6%)
- 巴亚尔塔港 (puerto-vallarta): `costModerate` 旧=1850 → Numbeo=2275 (+23.0%)
- 巴亚尔塔港 (puerto-vallarta): `monthlyRent` 旧=1253 → Numbeo=1411 (+12.6%)
- 巴亚尔塔港 (puerto-vallarta): `housePrice` 旧=4844 → Numbeo=5358 (+10.6%)
- 京都 (kyoto): `monthlyRent` 旧=447 → Numbeo=561 (+25.5%)
- 惠灵顿 (wellington): `costModerate` 旧=2600 → Numbeo=2274 (-12.5%)
- 惠灵顿 (wellington): `housePrice` 旧=5200 → Numbeo=6756 (+29.9%)

## Numbeo 未覆盖城市

- 圣何塞(美国) (san-jose-us, id=133)
- 普拉亚德尔卡门 (playa-del-carmen, id=142)

## 交叉验证: 平均薪资 (Numbeo vs 我方)

| 城市 | 我方年收入 | Numbeo年化 | 偏差 |
|------|-----------|-----------|------|

## Numbeo 排名 Index 参考值

| 城市 | Safety | CoL-Idx | Rent-Idx | Healthcare | Pollution |
|------|--------|---------|----------|-----------|-----------|
| 纽约 | 49.1 | 100 | 100 | 62.9 | 58.1 |
| 伦敦 | 46.2 | 61.5 | 28.4 | 67.3 | 57.8 |
| 东京 | 75.8 | 56.9 | 25.4 | 77.9 | 42.5 |
| 北京 | 74.7 | 37.5 | 23.3 | 70.4 | 77 |
| 上海 | 73.6 | 39 | 21.7 | 67.8 | 68 |
| 悉尼 | 66.1 | 79.8 | 53.5 | 74.6 | 28.5 |
| 新加坡 | 77.7 | 88.7 | 64.2 | 71.9 | 32.3 |
| 巴黎 | 42 | 79.1 | 39.7 | 77 | 63.1 |
| 多伦多 | 56.4 | 66.3 | 36.6 | 74 | 37.5 |
| 香港 | 78.3 | 73.8 | 54.4 | 66.5 | 66.3 |
| 洛杉矶 | 46.1 | 81.9 | 71.8 | 61.9 | 68.4 |
| 旧金山 | 39.5 | 96.2 | 75.3 | 64.9 | 49 |
| 芝加哥 | 34.5 | 75.3 | 53.2 | 64.8 | 50.3 |
| 迪拜 | 83.9 | 62.2 | 50.7 | 69.9 | 49.3 |
| 阿姆斯特丹 | 69.9 | 81.8 | 53 | 75.2 | 27 |
| 苏黎世 | 76.7 | 123.3 | 70.7 | 70.1 | 25.3 |
| 日内瓦 | 70.5 | 118.2 | 63.5 | 69.9 | 24.2 |
| 慕尼黑 | 78.3 | 77.5 | 40 | 77 | 24.7 |
| 柏林 | 55.3 | 71 | 34.1 | 66.1 | 38 |
| 巴塞罗那 | 47.8 | 59.6 | 35 | 76.8 | 62.8 |
| 马德里 | 70.9 | 60.1 | 33.3 | 79.2 | 38.1 |
| 米兰 | 46.2 | 76.1 | 39.1 | 70.3 | 67.9 |
| 罗马 | 53.1 | 61.5 | 31 | 64.9 | 47.8 |
| 布鲁塞尔 | 44.3 | 71.3 | 31.2 | 73.6 | 62.4 |
| 维也纳 | 70.5 | 75.7 | 28.8 | 79.7 | 15.8 |
| 布拉格 | 75.3 | 59.4 | 29.2 | 74.7 | 33 |
| 华沙 | 74.6 | 53.2 | 26.3 | 58.4 | 59.6 |
| 里斯本 | 66.8 | 54.8 | 35.9 | 72.4 | 37.7 |
| 雅典 | 44.9 | 57 | 17.4 | 58.4 | 55.5 |
| 伊斯坦布尔 | 51.9 | 45.6 | 22.2 | 70.1 | 67.3 |
| ... | 共 150 个城市 (完整数据见 fetched-data.json) | | | | |

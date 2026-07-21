# Adding Mandarin and Cantonese

Research and plan for v2. Nothing here is in the app yet.

Each language was checked against **two independent sources**, the same standard
applied to the Teochew set. That cross-check is the whole value of this document
— the sources disagree in several places, and three of the disagreements would
have shipped wrong terms.

**Sources**

| Language | A | B |
|---|---|---|
| Mandarin | [That's Mandarin](https://www.thatsmandarin.com/chinese-language/family-tree/) | [LTL School](https://ltl-school.com/complicated-chinese-family-tree/) |
| Cantonese | [little chinese things](https://littlechinesethings.wordpress.com/2019/01/26/relatives-in-cantonese/) | [CantoneseClass101](https://www.cantoneseclass101.com/blog/2019/12/06/cantonese-family-words/) |

---

## 1. The finding that changes the architecture

**Cantonese splits aunts by age. Teochew doesn't. Mandarin is disputed.**

| | Father's elder sister | Father's younger sister |
|---|---|---|
| Teochew | 姑 Gou | 姑 Gou |
| Mandarin (A) | 姑姑 gūgu | 姑姑 gūgu |
| Mandarin (B) | 姑妈 gūmā | 姑姑 gūgu |
| **Cantonese (both)** | **姑媽 gu1 maa1** | **姑姐 gu1 ze1** |

Same for the mother's side: Cantonese has 姨媽 (elder) and 阿姨 (younger), where
Teochew has only 姨.

This means **no single language's distinctions can define the engine.** The
resolver has to compute the finest distinction any supported language makes, and
each language's table collapses what it doesn't use.

The good news: **the engine already computes this.** `relativeAge(father, aunt)`
returns `'younger'` for the demo family today — Teochew simply never asks. So
Cantonese needs no new structural work, only a table that reads a fact already
available.

---

## 2. Conflicts between sources

### 2a. Cantonese in-laws — the two sources are exactly reversed

| Term | Source A says | Source B says |
|---|---|---|
| 大伯 daai6 baak3 | husband's elder brother | wife's elder brother |
| 大舅 daai6 kau5 | wife's elder brother | husband's elder brother |

One of these is wrong and there is no way to tell which from the sources alone.
**Do not ship either until a third source or a native speaker settles it.**

Reasoning that favours B: 舅 is the maternal-uncle root and attaches to the
wife's family elsewhere (舅仔 = wife's younger brother in A, husband's younger
brother in B — also reversed). 伯 is the paternal-elder root. But that is
inference, not evidence.

### 2b. Mandarin cousins — source B contradicts the 堂/表 rule

Source A: 堂 for father's **brothers'** children; 表 for mother's side **and
father's sisters'** children.

Source B: labels 堂兄 as "Dad's Brother's/**sister's** son."

A is correct and matches both Cantonese sources and the rule already implemented
in `cousinPrefix()`: 堂 tracks the shared surname, so a father's *sister's*
children take 表 because they carry their own father's surname. **Source B is
wrong here.**

### 2c. Mandarin aunts — split by age or not?

Source A gives one term each (姑姑, 阿姨). Source B splits both by age
(姑妈/姑姑, 姨妈/阿姨). Both patterns are attested in real usage; B's is more
traditional, A's more colloquial-northern.

Probably a register difference rather than an error, which makes it a **product
decision, not a data one** — the same shape as the grandparent question already
solved on the person card. Offering both is likely right.

### 2d. Cantonese cousins — register differs

| Source A | Source B |
|---|---|
| 堂哥 / 堂姐 / 堂弟 / 堂妹 | 堂阿哥 / 堂家姐 / 堂細佬 / 堂細妹 |

Both valid; B's are more colloquially Cantonese. A's are safer as defaults since
they match the written forms.

### 2e. A caution about source reliability

Cantonese source A had 表哥 and 表妹 **swapped for four years**, through five
separate reader corrections, before the author fixed it in 2023. The version
above is the corrected one. This is the strongest argument for never shipping a
single-sourced term.

---

## 3. The cross-language trap

**Identical characters, completely different people.** Three cases, all of which
would produce confidently wrong results if any data were shared between
languages:

| Characters | In Mandarin | In Cantonese |
|---|---|---|
| 奶奶 | father's mother (*nǎinai*) | **husband's mother** (*naai4 naai2*) |
| 公公 | husband's father (*gōnggong*) | **mother's father** (*gung4 gung1*) |
| 婆婆 | husband's mother (*pópo*) | **mother's mother** (*po4 po2*) |

Calling your grandmother 奶奶 is correct in Mandarin and calls her your
mother-in-law in Cantonese. **Term tables must be fully independent per
language — no shared entries, no inheritance, no "same character so same term"
shortcuts.**

---

## 4. What the two languages agree on with Teochew

These transfer cleanly and need no new engine logic:

- Father's brother splits by age in all three (伯 / 叔).
- Mother's brother splits by age in none (舅).
- Siblings split by age and gender in all three.
- 堂/表 follows surname, not side, in all three.
- Birth-rank prefixes (大/二/三/細·小) apply in all three — Cantonese source A
  documents 大姑媽/二姑媽/三姑媽 explicitly, matching the ranking already built.

---

## 5. Where the two languages differ from Teochew structurally

| | Teochew | Mandarin | Cantonese |
|---|---|---|---|
| Grandparents split by side | optional (3 systems) | **always** 爷爷·奶奶 / 外公·外婆 | **always** 爺爺·嫲嫲 / 公公·婆婆 |
| Father's sister by age | no | disputed | **yes** |
| Mother's sister by age | no | disputed | **yes** |
| Cousins addressed as | sibling terms | **堂/表 forms** | **堂/表 forms** |

Three consequences for the code:

1. **The grandparent style picker becomes Teochew-only.** Offering "same term for
   both sides" in Mandarin or Cantonese would be wrong.
2. **The cousin rule becomes language-conditional.** Teochew's "sibling term,
   with 堂/表 shown as descriptive" is currently hardcoded. In the other two the
   descriptive form *is* the address form — the same data, promoted.
3. **Aunt resolution must consult relative age**, and each table decides whether
   to use it.

---

## 6. Romanization

Three different systems, none interchangeable:

| Language | System | Example |
|---|---|---|
| Teochew | Teochew Store style (current) | Gou, Yi, Gim |
| Teochew | Peng'im with tone numbers (alternative) | gou1, i5, gim6 |
| Mandarin | Pinyin with tone marks | gūgu, āyí, jiùjiu |
| Cantonese | Jyutping with tone numbers | gu1 maa1, ji4 maa1, kau5 fu6 |

The `pronunciation` field currently carries an anglicised hint (Gou → "Goh").
Whether that survives for Mandarin and Cantonese is open — pinyin is already
widely readable, jyutping much less so.

---

## 7. Suggested implementation order

1. **Refactor first, no new terms.** `TERM_TABLE` → `TERM_TABLES[lang]`; make the
   cousin and grandparent rules language-conditional; run the whole suite against
   Teochew to prove nothing regressed. This is the risky step and it is testable
   without any new data.
2. **Cantonese next, not Mandarin.** It is the harder case — it forces the aunt
   age distinction into the open. Anything that survives Cantonese will take
   Mandarin easily.
3. **Mandarin last**, once the seams are proven.
4. **Resolve §2a before shipping any Cantonese in-law term.** Everything else
   can ship; that pair cannot.

Terms follow the existing standard: return nothing rather than guess, and mark
anything single-sourced as provisional on the card, the way same-sex partner
terms already are.

---

## 8. Extracted data

Recorded as the sources gave it. **Not verified for the app** — a term appearing
here is not a term ready to ship. Agreement between A and B is marked ✓✓.

### Mandarin

| Relationship | Term | Pinyin | Agreement |
|---|---|---|---|
| father | 爸爸 | bàba | ✓✓ |
| mother | 妈妈 | māma | ✓✓ |
| older brother | 哥哥 | gēge | ✓✓ |
| younger brother | 弟弟 | dìdi | ✓✓ |
| older sister | 姐姐 | jiějie | ✓✓ |
| younger sister | 妹妹 | mèimei | ✓✓ |
| son | 儿子 | érzi | ✓✓ |
| daughter | 女儿 | nǚ'ér | ✓✓ |
| father's father | 爷爷 | yéye | ✓✓ |
| father's mother | 奶奶 | nǎinai | ✓✓ |
| mother's father | 外公 | wàigōng | ✓✓ |
| mother's mother | 外婆 | wàipó | ✓✓ |
| father's older brother | 伯伯 | bóbo | ✓✓ |
| father's younger brother | 叔叔 | shūshu | ✓✓ |
| father's sister | 姑姑 / 姑妈 | gūgu / gūmā | disputed, §2c |
| mother's brother | 舅舅 | jiùjiu | ✓✓ |
| mother's sister | 阿姨 / 姨妈 | āyí / yímā | disputed, §2c |
| father's older brother's wife | 伯母 | bómǔ | B only |
| father's younger brother's wife | 婶婶 | shěnshen | B only |
| father's sister's husband | 姑父 | gūfù | B only |
| mother's brother's wife | 舅母 | jiùmǔ | B only |
| older male cousin, paternal | 堂哥 / 堂兄 | tánggē / tángxiōng | ✓✓ |
| younger male cousin, paternal | 堂弟 | tángdì | ✓✓ |
| older female cousin, paternal | 堂姐 | tángjiě | ✓✓ |
| younger female cousin, paternal | 堂妹 | tángmèi | ✓✓ |
| older male cousin, maternal | 表哥 | biǎogē | ✓✓ |
| younger male cousin, maternal | 表弟 | biǎodì | ✓✓ |
| older female cousin, maternal | 表姐 | biǎojiě | ✓✓ |
| younger female cousin, maternal | 表妹 | biǎomèi | ✓✓ |
| brother's son | 侄子 | zhízi | ✓✓ |
| brother's daughter | 侄女 | zhínǚ | ✓✓ |
| sister's son | 外甥 | wàishēng | ✓✓ |
| sister's daughter | 外甥女 | wàishēngnǚ | ✓✓ |
| husband's father | 公公 | gōnggong | ✓✓ |
| husband's mother | 婆婆 | pópo | ✓✓ |
| wife's father | 岳父 | yuèfù | ✓✓ |
| wife's mother | 岳母 | yuèmǔ | ✓✓ |
| older sister's husband | 姐夫 | jiěfū | B only |
| younger sister's husband | 妹夫 | mèifū | B only |
| older brother's wife | 嫂子 | sǎozi | B only |
| younger brother's wife | 弟妹 | dìmèi | B only |

**Gaps:** great-grandparents, grandchildren, birth-rank forms.

### Cantonese

| Relationship | Term | Jyutping | Agreement |
|---|---|---|---|
| father | 爸爸 | baa1 baa1 / baa4 baa1 | ✓✓ |
| mother | 媽媽 | maa1 maa1 / maa4 maa1 | ✓✓ |
| older brother | 哥哥 | go1 go1 | ✓✓ |
| younger brother | 弟弟 | dai6 dai6 | ✓✓ |
| older sister | 姐姐 | ze2 ze2 | ✓✓ |
| younger sister | 妹妹 | mui6 mui6 | ✓✓ |
| husband | 老公 | lou5 gung1 | ✓✓ |
| wife | 老婆 | lou5 po4 | ✓✓ |
| son | 仔 | zai2 | ✓✓ |
| daughter | 女 | neoi5 / neoi2 | ✓✓ |
| father's father | 爺爺 | je4 je4 | ✓✓ |
| father's mother | 嫲嫲 | maa4 maa4 | ✓✓ |
| mother's father | 外公 / 公公 | ngoi6 gung1 / gung1 gung1 | ✓✓ |
| mother's mother | 外婆 / 婆婆 | ngoi6 po4 / po4 po2 | ✓✓ |
| paternal great-grandfather | 太爺 | taai3 je4 | A only |
| paternal great-grandmother | 太嫲 | taai3 maa4 | A only |
| maternal great-grandfather | 太公 | taai3 gung1 | A only |
| maternal great-grandmother | 太婆 | taai3 po4 | A only |
| **father's elder sister** | **姑媽** | gu1 maa1 | ✓✓ |
| **father's younger sister** | **姑姐** | gu1 ze1 / gu1 ze2 | ✓✓ |
| father's elder brother | 伯父 | baak3 fu6 | ✓✓ |
| father's younger brother | 叔叔 / 叔父 | suk1 suk1 / suk1 fu6 | variant |
| father's sister's husband | 姑丈 | gu1 zoeng6 / gu1 zoeng2 | ✓✓ |
| father's elder brother's wife | 伯娘 | baak3 noeng4 | ✓✓ |
| father's younger brother's wife | 阿嬸 | aa3 sam2 | ✓✓ |
| **mother's elder sister** | **姨媽** | ji4 maa1 | ✓✓ |
| **mother's younger sister** | **阿姨** | aa3 ji4 / aa3 ji1 | ✓✓ |
| mother's sister's husband | 姨丈 | ji4 zoeng6 / ji4 zoeng2 | ✓✓ |
| mother's brother | 舅父 | kau5 fu6 / kau5 fu2 | ✓✓ |
| mother's brother's wife | 舅母 | kau5 mou5 | ✓✓ |
| older male cousin, paternal | 堂哥 / 堂阿哥 | tong4 go1 / tong4 aa3 go1 | register, §2d |
| younger male cousin, paternal | 堂弟 / 堂細佬 | tong4 dai6 / tong4 sai3 lou2 | register, §2d |
| older female cousin, paternal | 堂姐 / 堂家姐 | tong4 ze2 / tong4 gaa1 ze1 | register, §2d |
| younger female cousin, paternal | 堂妹 / 堂細妹 | tong4 mui6 / tong4 sai3 mui2 | register, §2d |
| older male cousin, maternal | 表哥 | biu2 go1 | ✓✓ |
| younger male cousin, maternal | 表弟 | biu2 dai6 / biu2 dai2 | ✓✓ |
| older female cousin, maternal | 表姐 | biu2 ze2 | ✓✓ |
| younger female cousin, maternal | 表妹 | biu2 mui6 / biu2 mui2 | ✓✓ |
| brother's son | 侄仔 / 侄 | zat6 zai2 / zat6 | ✓✓ |
| brother's daughter | 姪女 / 侄女 | zat6 neoi5 / zat6 neoi2 | ✓✓ |
| sister's son | 外甥 | ngoi6 sang1 / ngoi6 saang1 | ✓✓ |
| sister's daughter | 外甥女 | ngoi6 sang1 neoi5 | ✓✓ |
| son's son | 孫仔 | syun1 zai2 | ✓✓ |
| son's daughter | 孫女 | syun1 neoi5 / neoi2 | ✓✓ |
| daughter's son | 外孫 | ngoi6 syun1 | ✓✓ |
| daughter's daughter | 外孫女 | ngoi6 syun1 neoi5 | ✓✓ |
| husband's father | 老爺 | lou5 je4 | ✓✓ |
| husband's mother | 奶奶 | naai5 naai5 / naai4 naai2 | ✓✓ |
| wife's father | 外父 | ngoi6 fu6 / ngoi6 fu2 | ✓✓ |
| wife's mother | 外母 | ngoi6 mou5 / ngoi6 mou2 | ✓✓ |
| elder brother's wife | 阿嫂 | aa3 sou2 | B only |
| younger brother's wife | 弟婦 | dai6 fu5 | B only |
| elder sister's husband | 姐夫 | ze2 fu1 | B only |
| younger sister's husband | 妹夫 | mui6 fu1 | B only |
| daughter-in-law | 新抱 | san1 pou5 | ✓✓ |
| son-in-law | 女婿 | neoi5 sai3 | ✓✓ |
| husband's elder sister | 姑奶 | gu1 naai5 / gu1 naai1 | ✓✓ |
| husband's younger sister | 姑仔 | gu1 zai2 | ✓✓ |
| wife's elder sister | 大姨 | daai6 ji4 / daai6 ji1 | ✓✓ |
| wife's younger sister | 姨仔 | ji4 zai2 / ji1 zai2 | ✓✓ |
| husband's / wife's elder brother | 大伯 / 大舅 | — | **CONFLICT, §2a** |
| husband's / wife's younger brother | 舅仔 / 叔仔 | — | **CONFLICT, §2a** |

Source A also documents a full great-uncle and great-aunt set (伯公, 叔公, 伯婆,
叔婆, 姑婆, 姑丈公, 舅公, 舅婆, 姨婆, 姨丈公), unverified against B.

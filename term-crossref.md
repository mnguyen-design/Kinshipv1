# Term cross-reference

Comparing the Teochew reference list against what the prototype currently implements.
**21 of 46** reference entries match exactly.

> **Resolved and now in the prototype**
>
> - **Grandparents** — all three systems built in, switchable from the language menu:
>   亞公/亞嫲, 內公/外公 with 內媽/外媽, and plain 公/媽. Default is 亞公.
> - **Cousins** — address term stays the sibling term; 堂/表 now shown as a prominent
>   "Descriptive form" panel, computed from which line the cousin comes through
>   rather than hardcoded to 表.
> - **Younger brother's wife** — 細姆 Soi-m, split from 嫂 Soh, which is now scoped
>   to the elder brother's wife only.
> - **Romanization** stays in the current style; **characters** stay traditional.
>
> Still open: §2c (姊 or 姐), §2d (老嫲 or 老妈), §4 (child ≠ 孫), and the
> elder sister's husband reading.

---

## 1. Confirmed — no change needed

The core aunt/uncle system agrees completely.

| Reference | Peng'im | Implemented | Note |
|---|---|---|---|
| 伯 | beh4 | 伯 Be | dad's older brother |
| 叔 | jek4 | 叔 Zeg | dad's younger brother |
| 姑 | gou1 | 姑 Gou | dad's sister |
| 舅 | gu6 | 舅 Gu | mom's brother |
| 姨 | i5 | 姨 Yi | mom's sister |
| 姆 | m2 | 姆 M | dad's older brother's wife |
| 婶 | sim2 | 嬸 Sim | dad's younger brother's wife |
| 妗 | gim6 | 妗 Gim | mom's brother's wife |
| 丈 | dion6 | 丈 Die[n] | aunt's husband, either side |
| 兄 | hian1 | 兄 Hia[n] | older brother |
| 弟 | di6 | 弟 Di | younger brother |
| 妹 | mue6 | 妹 Mue | younger sister |
| 嫂 | so2 | 嫂 Soh | older brother's wife — see §3 |
| 爸 | ba1 | 爸 Ba | father |
| 孙 | sung1 | 孫 Sung | grandchild |
| 老公 | lao(7) gong1 | 老公 Lau-gong | great-grandfather |
| 大姑 | dua7 gou1 | generated | rank prefix confirmed |
| 细姑 | soi(2) gou1 | generated | rank prefix confirmed |

**大姑 / 细姑 matter beyond themselves.** They confirm the 大 / 细 ranking is real for
父-side aunts, which is the same mechanism producing 大舅 / 二舅 / 細舅 and 大姨 / 細姨.
Those specific ranked forms are not in the reference list, but the pattern is.

---

## 2. Conflicts — need a decision

### 2a. Grandparents — the implemented terms aren't in the list at all

| | Paternal | Maternal |
|---|---|---|
| **Reference** | 内公 lai(7) gong1 / 内妈 lai(7) ma2 | 外公 ghua7 gong1 / 外妈 ghua7 ma2 |
| **Generic** | 公 gong1 / 妈 ma2 | — |
| **Implemented** | 亞公 A-gong / 亞嫲 A-ma | 亞公 A-gong / 亞嫲 A-ma (identical) |

Two differences, both significant:

1. **亞 doesn't appear in the reference at all.** It came from the Figma Make export.
2. **The reference distinguishes the two sides** with 内 (inner, paternal) and 外
   (outer, maternal). The prototype deliberately does *not* — both grandfathers are
   亞公, with a note saying 外公 *may* be used to disambiguate.

This is the largest single divergence. If 内/外 is how your family speaks, the tree
should say so, and the note has it backwards — the distinction would be the rule
rather than the exception.

### 2b. Cousins — this contradicts an earlier locked decision

Your earlier instruction, still in effect in the code:

> Cousins use sibling address terms; 表/堂 prefixes are descriptive only, not address terms.

The reference list treats them as the terms themselves, split by **surname**:

| Same surname (堂 tang5) | Different surname (表 bio2) |
|---|---|
| 堂兄 tang(7) hian1 | 表兄 bio(6) hian1 |
| 堂弟 tang(7) di6 | 表弟 bio(6) di6 |
| 堂姐 tang(7) je2 | 表姐 bio(6) je2 |
| 堂妹 tang(7) mue6 | 表妹 bio(6) mue6 |

**A related bug either way:** the prototype currently labels *every* cousin 表 in its
descriptive line. Under the 堂/表 system that's wrong for paternal-line cousins — your
father's brother's children share your surname and take 堂.

### 2c. Older sister — 姊 or 姐

Reference is **姐 je2**. Implemented is **姊 Ze**. Both are standard for elder sister;
姊 is the more literary form. This propagates: 姊夫 (elder sister's husband) would
become 姐夫.

### 2d. Great-grandmother — 老妈 or 老嫲

Reference is **老妈**, matching its use of 妈 for grandmother. Implemented is **老嫲**.
Same question as 2a: which character for the grandmother line.

---

## 3. Narrower than assumed

**嫂 is listed only for the *older* brother's wife.** The prototype applies it to both
older and younger brothers. The reference gives no term for a younger brother's wife —
so either it's also 嫂, or there's a separate term the list doesn't cover.

---

## 4. In the reference, not implemented

| Term | Peng'im | Meaning | Notes |
|---|---|---|---|
| 丈夫囝 / 逗囝 | da1 bou1 gian2 / dao1 gian2 | son | see below |
| 㜁𡚸囝 / 走囝 | ja1 bhou(6) gian2 / jao(6) gian2 | daughter | see below |
| 父 | be6 | father (referring to) | vs 爸 for addressing |
| 嫒 | ai5 | mother (referring to) | vs 妈 for addressing |
| 翁 | ang1 | husband | |
| 母 | bhou2 | wife | |
| 亲戚 | cheng1 chek4 | relative | vocabulary, not address |
| 家庭 / 家人 | ge1 teng5 / ge1 nang5 | family | vocabulary, not address |

**The son/daughter entries confirm a bug I flagged.** A child currently resolves to
孫 Sung, inherited from the original term table treating 孫 as covering all descendants.
The reference has distinct terms, so child ≠ grandchild.

Note these look like *referring* terms rather than *address* terms — you'd speak about
your son as 丈夫囝, not call him that. The list marks this distinction explicitly for
父/爸 and 嫒/妈, which suggests the app may need both registers.

---

## 5. Implemented, not in the reference

Not necessarily wrong — the list isn't exhaustive — but unverified against it.

| Term | Source |
|---|---|
| 祖公 Zou-gong / 祖媽 Zou-ma | you supplied these for great-great-grandparents |
| 老姨 Lau-yi / 老丈 Lau-die[n] | Figma Make export, grandmother's sister and her husband |
| 姊夫 Ze-hu / 妹婿 Mue-sai | you supplied |
| 媳婦 Sin-pu / 仔婿 Gia-sai | you supplied |
| 孫婿 Sung-sai / 曾孫 Ceng-sung | you supplied |
| 大舅 / 二舅 / 三舅 / 細舅 | generated by the rank rule |
| 大姨 / 細姨 | generated by the rank rule |

---

## 6. Two systemic choices

### Romanization
The reference uses **Peng'im with tone numbers** (gou1, i5, gim6, so2, dua7 gou1).
The prototype uses the Teochew Store style (Gou, Yi, Gim, Soh, Tua-Gou).

Peng'im is more precise and tones are meaningful. The current style is easier to read
aloud for someone who doesn't know the system. Switching affects all 45 terms and the
pronunciation column, which currently carries an anglicised hint (Gou → Goh).

### Characters
The reference is **simplified** (婶 细 孙 妈). The prototype is **traditional**
(嬸 細 孫 媽). Worth settling before the term set grows.

# Kinship 親情

**Know what to call everyone at the table.**

In many families every relative has a precise term, decided by which side
they're on, their generation, and whether they're older or younger than the
linking parent. Kinship works the term out from the shape of your family tree,
so you don't have to memorise a table.

Teochew first. Mandarin and Cantonese are planned for v2, Vietnamese for v3.

---

## Try it

Open `kinship-prototype.html` in any browser. That's the whole app — one file,
no build step, no dependencies, no server.

## What it does

- **My family** — your tree, with the correct term on every person. Click anyone
  to re-anchor and see what *they* call everyone else.
- **Ask** — describe a relative in plain language, or pick two people and see
  the chain between them and what each calls the other.
- **Bloom** — where the family was born, where it settled, who has a birthday
  this month. Every figure is a filter.

## How it's built

A single HTML file, vanilla JavaScript. The decisions worth knowing:

**Terms are computed, not looked up.** `relate(fromId, toId)` derives the term
from the graph's topology, so it re-anchors on anyone — you can ask what your
cousin calls your grandmother, not just what you call people. Two siblings get
the same term for an aunt because they share parents, not because anything
special-cases siblings.

**It returns nothing rather than guessing.** If a relative's gender or relative
age isn't recorded, the term is `null` and the interface says so. A confidently
wrong kinship term is worse than an admitted gap, because you'll go and use it.

**Where families genuinely differ, it asks.** Grandparents are the clearest
case: some families say 亞公 for both sides, some mark them 內公 and 外公, some
use plain 公. All three are offered on the grandparent's own card.

**Connectors are derived from the graph.** Positions and lines come from one
source, so a line can't detach from the node it belongs to.

**Nothing leaves the browser.** No server, no account, no analytics. A family
tree is largely other people's personal data, and none of them agreed to be in
a database.

## Your data

Your tree saves itself in this browser as you work. Clearing your browsing data
erases it, so **download a copy** — the ⤓ button in the top right.

- **Download my tree** writes a versioned `.json` file. Plain, readable, and
  yours.
- **Load a tree file** brings one back. Drag it onto the window, or use the
  menu. You'll always see what's in the file before anything is replaced.
- **Erase and start over** deletes the tree from this browser for good, after
  telling you exactly what you'd lose.

If the browser blocks saving — private windows do — the app says so plainly in
the nav rather than pretending it worked.

## Terms and sources

Teochew terms from The Teochew Store and learnteochew.com, cross-referenced
against a Peng'im reference list. See **[term-crossref.md](term-crossref.md)**
for where the sources agree, where they conflict, and what's still unresolved.

Terms are guaranteed correct only within a verified boundary. Outside it, the
app says so rather than guessing.

**[languages-v2.md](languages-v2.md)** holds the research for Mandarin and
Cantonese — term data from two sources each, the conflicts between them, and
what the engine needs before either can ship.

The demo family is fictional.

## Deploying

**[SHIP.md](SHIP.md)** — step by step, GitHub through Vercel.
**[DEPLOY.md](DEPLOY.md)** — why it's built this way, and what to do when you
outgrow it.

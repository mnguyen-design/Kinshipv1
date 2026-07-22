# Architecture and configuration

Why Kinship is built this way, what `vercel.json` does, and what changes when
you outgrow it. For the step-by-step deploy, see **[SHIP.md](SHIP.md)**.

---

## The shape of it

A single HTML file on Vercel. The tree lives in the visitor's own browser
(`localStorage`) and travels as a `.json` file they download.

This isn't a placeholder for a "real" backend. It has a genuine advantage:
nobody's family data leaves their machine. That matters more here than in most
apps, because a family tree is a pile of *other people's* names, birthdates and
migration history, and none of those people consented to being in a database.
No server means no breach to have, no privacy policy to write, and no question
about your cousins' data.

What it costs: no cross-device sync, no shareable link, and real risk of loss if
someone clears their browser. Export is what covers that gap, which is why the
download stays prominent rather than buried in settings.

---

## What `vercel.json` does

**`rewrites`** — serves `kinship-prototype.html` at `/` so the working filename
doesn't have to change.

**`Cache-Control: must-revalidate`** — the browser re-checks on every load, so a
deploy reaches people immediately. This matters while term data is still
changing; someone holding a cached copy would see terms you've since corrected.

**`Content-Security-Policy`** — restricts the page to itself and Google Fonts.
`connect-src` is the meaningful part. It was `'none'` — the app structurally
incapable of sending anything anywhere — until term submissions were added
(July 2026), which was exactly the deliberate decision that line existed to
force. It is now `'self'`: the page can talk to its own origin (`/api/submit`)
and still nothing else. The privacy promise survives because of what that
endpoint accepts — see **Term submissions** below. If you ever add analytics or
third-party calls, they will still break here, on purpose.

The header applies to `/(.*)`, not to the specific filename. Vercel matches
headers against the *incoming* request path, so scoping it to
`/kinship-prototype.html` would leave the homepage at `/` with no policy at all.

---

## Term submissions

When the app has no name for a relationship, visitors can contribute the term
their family uses. This is the one thing that leaves the visitor's machine, and
it is deliberately name-free: the payload is a relationship *description*
("wife's younger brother"), the characters, romanization, and an optional note.
The two people's names never travel — they exist only in the visitor's local
session list. "Nobody's family data leaves their machine" still holds; what
leaves is linguistic data.

The pipeline: the in-app form POSTs to `/api/submit` (a Vercel serverless
function in `api/submit.js`), which validates, rate-limits, and relays to the
**Kinship term submissions** database in Notion. The browser can't talk to
Notion directly — the API needs a secret token and refuses cross-origin browser
calls — which is why the relay exists.

One-time setup:

1. Create an internal integration at notion.so → Settings → Integrations
   (or www.notion.so/my-integrations). Copy the secret.
2. Open the *Kinship term submissions* database page in Notion → `•••` →
   Connections → add your integration.
3. In Vercel → Project → Settings → Environment Variables, add:
   - `NOTION_TOKEN` — the integration secret
   - `NOTION_DATABASE_ID` — `ab2725bc78cb45fe88917c7258bace98`
4. Redeploy.

Until those env vars exist, submissions fail gracefully: the visitor sees
"couldn't send — kept on this device" with a retry, and copy-as-text still
works. Rows arrive with Status = New; the select options (New / Reviewed /
Added to app / Rejected) are the review workflow.

---

## How the data layer behaves

**Autosave** to `localStorage`, debounced, on every change. Only durable state
is stored — which person is selected and the zoom level are deliberately left
out. A returning visitor lands back in their tree.

**Export** writes a versioned document:

```json
{
  "format": "kinship.tree",
  "schemaVersion": 1,
  "exportedAt": "2026-07-20T…",
  "about": "A Kinship family tree. Open kinship (the app) and choose Import…",
  "peopleCount": 42,
  "tree": { "people": […], "edges": […], "egoId": "…" }
}
```

The `about` line is there because this file might be opened in a decade by
someone who has never heard of the app — possibly a grandchild, possibly after
the app no longer exists. It's plain JSON, readable without any tooling.

**`schemaVersion` is the field that matters most.** It's what lets you change
the data model later without orphaning files people have already saved. When you
make a breaking change, bump it to 2 and add a migration in `parseTreeDoc` for
version-1 files. Import already refuses files from a *newer* version with an
"update the app" message rather than corrupting them. Without this field you'd
eventually have to tell someone their backup is unreadable.

**Import validates before replacing anything.** Non-JSON, empty trees, people
without identifiers, and newer schema versions are all refused. Dangling
connections and a missing anchor are reported rather than silently dropped. The
confirmation names how many people are being replaced and offers to download the
current tree first.

**The backup nudge** appears at 15 people, then again only after 10 more have
been added since the last saved copy. It never appears in the demo, and stays
hidden when storage is already failing — that warning is more urgent and
shouldn't have to compete.

**Erase** clears storage and memory together, and cancels any save already
in flight. Without that cancellation a debounced write scheduled *before* the
erase would land *after* it and resurrect the tree.

**When storage is blocked** — Safari private mode throws on `setItem`, and a
full disk will too — the app flags it in the nav and says the tree will be lost
when the tab closes. Silently failing to save while appearing to work is the one
behaviour that would actually destroy someone's family history.

---

## A known modelling limitation

Each person has `bornIn` and `settledIn` — two points of a journey that often
had three. In the demo, Siew-Lan is recorded China → USA, but her children were
born in Vietnam, because that's where she was in the early eighties. Those years
exist in the data only as an inference from where her children were born, and
the Bloom migration flow draws a line straight from China to the USA, skipping
the part of the story that is often the most interesting.

Not urgent. But if you ever add a third field, that's the reason.

---

## When you outgrow this

The trigger isn't traffic. It's someone asking to open their tree on a second
device, or wanting a sibling to edit it.

**Supabase's free tier** is still the recommendation: Postgres, auth and
row-level security, at $0 until 500MB — far more family trees than you'll have.
The reason to wait is that accounts bring obligations: password resets, account
deletion, a privacy policy, and the question of what happens to a tree full of
living relatives' data when someone deletes their account.

Two things to get right at that point:

1. **Anonymous-to-account migration.** Someone will build a 60-person tree
   before signing up. If signup wipes it, that's unforgivable. The export format
   is what makes this safe — on first login, upload the local tree.

2. **Keep the export working.** Once data sits on a server, the download button
   stops being the backup and becomes the exit. Keeping it is what makes the
   product trustworthy rather than a place where family history gets locked in.

A cheaper middle step, if sync is all you want: a private Gist or a
user-supplied cloud link holding the same JSON. Ugly, free, and it avoids
building auth before you know anyone wants it.

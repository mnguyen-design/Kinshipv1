# Getting Kinship onto GitHub and Vercel

Every command runs in **Terminal**, from the project folder. Open Terminal, paste
this, and stay there for the rest of the guide:

```bash
cd ~/Projects/Kinshipv1
```

About 15 minutes the first time. Cost: **$0**.

This folder holds only what belongs in the repository — eight files, nothing to
clean up first. The older `~/Projects/kinship` folder still has the Figma
exports, your snapshot zip, your real family tree, and a broken `.git` left over
from a failed attempt. Leave it alone; nothing there is needed here.

---

## Step 1 — Check git is installed

```bash
git --version
```

A version number means you're set. If macOS offers to install developer tools,
accept and wait — that's git arriving.

If git asks who you are later, set it once:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

---

## Step 2 — Know what's about to become public

Run:

```bash
ls -la
```

You should see exactly eight files. That is the whole repository — there is
nothing to clean up or exclude before you start.

**Published to the website** — two of them:

| File | Why |
|---|---|
| `kinship-prototype.html` | the entire app |
| `vercel.json` | routing, caching, security headers |

**In the repo, not published** — the four docs (`README.md`, `SHIP.md`,
`DEPLOY.md`, `term-crossref.md`) plus `.gitignore` and `.vercelignore`. Useful
to anyone reading the code, no reason to serve them from your family's website.

**Nothing personal is in this folder.** Your real family tree, the folder
snapshot and the Figma exports all stayed behind in `~/Projects/kinship`.

`.gitignore` is still doing real work, though — it will catch anything you
create here later, including any `kinship-*.json` you download from the app
while testing. That is the likeliest way real family data would ever reach the
repo, so it is worth keeping.

### About the demo family

The five people closest to the anchor are stand-ins: **Mei, Daniel, Jasmine,
Binh and Lien**, with shifted birth dates. Your own name, your siblings' and
your parents' — paired with exact dates of birth — would otherwise have gone
onto a public page and into git history permanently.

The rest is your original tree: the structure, the extended family, the
birthplaces, and the China → Vietnam → US migration. Those stay because the demo
needs a real migration to be worth showing, and a route out of Chaoshan is
shared by most Teochew families rather than identifying to yours.

**Still your call:** the extended family's names and birth years are in there.
Much less exposing than name-plus-birthday, but they're real people who didn't
choose this. Say the word and they become stand-ins too.

---

## Step 3 — Create the local repository

```bash
git init
git add .
git status
```

**Read the `git status` list before continuing.** It should show exactly eight
files and nothing else. If a `.json` tree file or a `.DS_Store` appears, stop —
something is wrong with `.gitignore`, and it is far easier to fix now than after
a push.

When the list looks right:

```bash
git commit -m "Kinship: term engine, family tree, local save and export"
```

---

## Step 4 — Create the GitHub repository

Go to **github.com/new**.

- **Repository name:** `kinship`
- **Description:** Know what to call everyone at the table.
- **Public or Private:** either. The code has no secrets and no real family data.
- **Do not tick** "Add a README", "Add .gitignore", or "Choose a license". You
  already have those files, and letting GitHub create its own causes a conflict
  on your first push.

Click **Create repository**, then ignore the commands it shows you — those are
for an empty repo. Use these, replacing `YOUR-USERNAME`:

```bash
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/kinship.git
git push -u origin main
```

**When it asks for a password:** GitHub no longer accepts your account password
here. Go to **github.com/settings/tokens** → *Generate new token (classic)* →
tick the **repo** scope → generate → copy it. Paste that as the password. macOS
remembers it after the first time.

---

## Step 5 — Verify before deploying

Reload your repository page. You should see the README rendered, plus
`kinship-prototype.html`, `vercel.json`, `SHIP.md`, `DEPLOY.md`.

**Then search your own repo.** Use the search box at the top of the repository
and look for a real relative's name — a grandparent, an aunt. Expect no results.

If something personal did get through, tell me before you deploy. Deleting the
file afterwards doesn't remove it; it stays in the commit history and needs a
rewrite. Catching it now is a one-line fix.

---

## Step 6 — Deploy

Go to **vercel.com** → **Continue with GitHub** → authorise.

1. Dashboard → **Add New… → Project**
2. Find `kinship` → **Import**. Not listed? Click *Adjust GitHub App
   Permissions* and grant access to the repo.
3. On the configure screen, **change nothing**:
   - Framework Preset: **Other**
   - Build Command, Output Directory, Install Command: all empty

   There is no build step. If Vercel guessed a framework, set it back to *Other*.
4. **Deploy**

Twenty seconds later you'll have a URL like `kinship-abc123.vercel.app`.

---

## Step 7 — Test the deployment

Open the URL:

- [ ] Welcome screen loads with serif headings. System fonts instead means the
      security header is blocking Google Fonts — see Troubleshooting.
- [ ] The demo tree renders with connecting lines.
- [ ] Click a grandparent. The card offers 亞公 / 內公·外公 / 公, and choosing
      one updates both sides at once.
- [ ] Build a small tree of your own, then **reload the page**. You should land
      back in your tree, not on the welcome screen.
- [ ] ⤓ → **Download my tree**. A `.json` file lands in Downloads.
- [ ] Drag that file onto the window. You get a confirmation naming how many
      people are in it — never a silent replacement.
- [ ] ⤓ → **Erase and start over**. It should tell you what you'd lose and offer
      a download first. Cancel it.
- [ ] **Open the URL on your phone** and repeat the download and re-import. This
      is where problems are most likely, and where most of your family will
      actually open the app.

---

## Step 8 — Shipping changes

```bash
git add .
git commit -m "what changed"
git push
```

Vercel redeploys within a minute. Push to any branch other than `main` for a
preview URL instead — useful for trying a term change before your family sees it.

---

## A custom domain

Buy it anywhere (Namecheap, Cloudflare, Porkbun — $10–15/year, the only
recurring cost). Then Vercel → **Project → Settings → Domains → Add**, and follow
the DNS records it gives you. HTTPS is automatic.

---

## Troubleshooting

**"Support for password authentication was removed"**
You need the Personal Access Token from Step 4, not your GitHub password.

**"failed to push some refs" / "rejected"**
GitHub created a README when you made the repo. Run
`git pull --rebase origin main`, then push again.

**"fatal: not a valid object name" or odd git errors on the first commit**
A previous `git init` left things in a bad state. Run `rm -rf .git` and start
Step 3 again.

**The site loads but looks unstyled**
The Content-Security-Policy is blocking Google Fonts. Check `vercel.json`
reached the repo, then open the browser console (right-click → Inspect →
Console) and look for a CSP error naming `fonts.googleapis.com`.

**404 at the root URL**
The rewrite in `vercel.json` isn't matching. The filename must be exactly
`kinship-prototype.html`. If you renamed it, update `vercel.json` to match.

**The tree disappears on reload**
Check the nav for a ⚠. In a private window this is expected and the app should
be warning you. Otherwise open the console and look for a storage error.

**Vercel published files you didn't expect**
Check `.vercelignore` made it into the repo.

/* POST /api/submit — relays a term contribution to the Notion database.
 *
 * This is the one deliberate exception to "nothing leaves the visitor's
 * machine": a term submission carries NO family data. The client sends only a
 * name-free relationship description ("wife's younger brother"), the term
 * itself, and an optional note. See DEPLOY.md → "Term submissions".
 *
 * Env vars (set in Vercel → Project → Settings → Environment Variables):
 *   NOTION_TOKEN        — internal integration secret (starts with "ntn_" or "secret_")
 *   NOTION_DATABASE_ID  — the "Kinship term submissions" database id
 */

var LIMITS = { relationship: 200, characters: 40, romanization: 80, note: 280 };

/* Best-effort per-instance rate limit: 8 submissions per IP per 10 minutes.
 * Serverless instances are ephemeral, so this is a speed bump, not a wall —
 * fine for a prototype whose worst case is junk rows in a Notion table. */
var hits = new Map();
function rateLimited(ip) {
  var now = Date.now(), windowMs = 10 * 60 * 1000;
  var list = (hits.get(ip) || []).filter(function (t) { return now - t < windowMs; });
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 2000) hits.clear(); // keep the map from growing unbounded
  return list.length > 8;
}

function clean(v, max) {
  if (typeof v !== 'string') return '';
  return v.replace(/\s+/g, ' ').trim().slice(0, max);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'POST only' });
  }

  var body = req.body || {};

  // Honeypot: real users never see this field. Bots that fill it get a
  // cheerful 200 and nothing happens.
  if (body.website) return res.status(200).json({ ok: true });

  var ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) {
    return res.status(429).json({ ok: false, error: 'Too many submissions — try again in a few minutes.' });
  }

  var relationship = clean(body.relationship, LIMITS.relationship);
  var characters = clean(body.characters, LIMITS.characters);
  var romanization = clean(body.romanization, LIMITS.romanization);
  var note = clean(body.note, LIMITS.note);

  if (!characters || !relationship) {
    return res.status(400).json({ ok: false, error: 'Missing characters or relationship.' });
  }

  if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) {
    return res.status(500).json({ ok: false, error: 'Submission collection is not configured.' });
  }

  var properties = {
    Relationship: { title: [{ text: { content: relationship } }] },
    Characters: { rich_text: [{ text: { content: characters } }] },
    Status: { select: { name: 'New' } }
  };
  if (romanization) properties.Romanization = { rich_text: [{ text: { content: romanization } }] };
  if (note) properties.Note = { rich_text: [{ text: { content: note } }] };

  try {
    var r = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.NOTION_TOKEN,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        parent: { database_id: process.env.NOTION_DATABASE_ID },
        properties: properties
      })
    });
    if (!r.ok) {
      var detail = await r.text();
      console.error('Notion rejected the submission:', r.status, detail.slice(0, 500));
      return res.status(502).json({ ok: false, error: 'The collection point refused the submission.' });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Notion request failed:', e && e.message);
    return res.status(502).json({ ok: false, error: 'Could not reach the collection point.' });
  }
};

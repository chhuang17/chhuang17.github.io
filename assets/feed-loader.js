/**
 * Shared feed loader for Blog and Projects listing pages.
 *
 * Usage:
 *   <script src="/assets/feed-loader.js"></script>
 *   <script>
 *     loadFeed({
 *       slugs: ["shp-intro"],
 *       basePath: "/posts",       // or "/project"
 *       containerId: "post-list"
 *     });
 *   </script>
 */

/* global marked */

function fmtDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  } catch { return ''; }
}

function parseFrontMatter(md) {
  const meta = {};
  if (md.startsWith('---')) {
    const end = md.indexOf('\n---');
    if (end !== -1) {
      const fm = md.slice(3, end).trim();
      fm.split('\n').forEach(function (line) {
        var i = line.indexOf(':');
        if (i > -1) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
      });
      md = md.slice(end + 4);
    }
  }
  return { meta: meta, body: md };
}

async function loadPost(slug, basePath) {
  var resp = await fetch(basePath + '/' + slug + '/content.md');
  if (!resp.ok) return null;
  var raw = await resp.text();
  var parsed = parseFrontMatter(raw);
  var meta = parsed.meta;
  var md = parsed.body;

  // Fallback title / cover from rendered markdown
  var html = marked.parse(md);
  var tmp = document.createElement('div');
  tmp.innerHTML = html;
  var mdH1 = (tmp.querySelector('h1') || {}).textContent || '';
  var mdImg = (tmp.querySelector('img') || {}).getAttribute && tmp.querySelector('img').getAttribute('src') || '';

  var title   = meta.title || mdH1.trim() || slug;
  var date    = meta.date ? fmtDate(meta.date) : '';
  var excerpt = meta.excerpt || '';
  var cover   = meta.cover || mdImg || '';

  return { slug: slug, title: title, date: date, excerpt: excerpt, cover: cover };
}

async function loadFeed(opts) {
  var slugs       = opts.slugs || [];
  var basePath    = opts.basePath || '/posts';
  var containerId = opts.containerId || 'post-list';

  var feed = document.getElementById(containerId);
  if (!feed) return;

  for (var idx = 0; idx < slugs.length; idx++) {
    var slug = slugs[idx];
    var p = await loadPost(slug, basePath);
    if (!p) continue;

    var card = document.createElement('article');
    card.className = 'post-card';
    card.role = 'link';
    card.tabIndex = 0;
    card.setAttribute('data-href', basePath + '/' + p.slug + '/');

    card.innerHTML =
      '<div class="post-content">' +
        '<h3 class="post-title">' + p.title + '</h3>' +
        (p.date ? '<div class="meta">' + p.date + '</div>' : '') +
        (p.excerpt ? '<p class="excerpt">' + p.excerpt + '</p>' : '') +
      '</div>' +
      (p.cover
        ? '<div class="thumb-wrap"><img class="post-thumb" src="' + p.cover + '" alt="' + p.title + '"></div>'
        : '<div></div>');

    // Click handler (closure)
    (function (href) {
      card.onclick = function () { location.href = href; };
      card.onkeypress = function (e) { if (e.key === 'Enter') location.href = href; };
    })(basePath + '/' + p.slug + '/');

    feed.appendChild(card);
  }
}

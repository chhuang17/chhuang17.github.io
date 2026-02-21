/**
 * Shared feed loader for Blog and Projects listing pages.
 * Supports sorting by date (newest/oldest) and popularity,
 * and category filtering with language badges.
 *
 * Usage:
 *   <script src="/assets/feed-loader.js"></script>
 *   <script>
 *     loadFeed({
 *       slugs: ["shp-intro"],
 *       basePath: "/posts",       // or "/project"
 *       containerId: "post-list",
 *       enableCategoryFilter: true // show category filter buttons
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

function langBadgeHTML(lang) {
  if (!lang) return '';
  var label = lang.startsWith('zh') ? '中文' : 'EN';
  return '<span class="lang-badge lang-' + (lang.startsWith('zh') ? 'zh' : 'en') + '">' + label + '</span>';
}

function categoryBadgeHTML(category) {
  if (!category) return '';
  return '<span class="cat-badge cat-' + category.toLowerCase() + '">' + category + '</span>';
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
  var imgEl = tmp.querySelector('img');
  var mdImg = imgEl ? (imgEl.getAttribute('src') || '') : '';

  var title      = meta.title || mdH1.trim() || slug;
  var dateRaw    = meta.date || '';
  var date       = dateRaw ? fmtDate(dateRaw) : '';
  var excerpt    = meta.excerpt || '';
  var cover      = meta.cover || mdImg || '';
  var popularity = parseInt(meta.popularity, 10) || 0;
  var lang       = meta.lang || '';
  var category   = meta.category || '';

  return {
    slug: slug, title: title, date: date, dateRaw: dateRaw,
    excerpt: excerpt, cover: cover, popularity: popularity,
    lang: lang, category: category
  };
}

function createCard(p, basePath) {
  var card = document.createElement('article');
  card.className = 'post-card';
  card.role = 'link';
  card.tabIndex = 0;
  card.setAttribute('data-href', basePath + '/' + p.slug + '/');

  var badges = '';
  if (p.category || p.lang) {
    badges = '<div class="post-badges">' +
      categoryBadgeHTML(p.category) +
      langBadgeHTML(p.lang) +
    '</div>';
  }

  card.innerHTML =
    '<div class="post-content">' +
      '<h3 class="post-title">' + p.title + '</h3>' +
      (p.date || badges
        ? '<div class="meta">' +
            (p.date ? '<span>' + p.date + '</span>' : '') +
            badges +
          '</div>'
        : '') +
      (p.excerpt ? '<p class="excerpt">' + p.excerpt + '</p>' : '') +
    '</div>' +
    (p.cover
      ? '<div class="thumb-wrap"><img class="post-thumb" src="' + p.cover + '" alt="' + p.title + '"></div>'
      : '<div></div>');

  var href = basePath + '/' + p.slug + '/';
  card.onclick = function () { location.href = href; };
  card.onkeypress = function (e) { if (e.key === 'Enter') location.href = href; };

  return card;
}

function sortPosts(posts, mode) {
  var sorted = posts.slice();
  if (mode === 'newest') {
    sorted.sort(function (a, b) { return (b.dateRaw || '').localeCompare(a.dateRaw || ''); });
  } else if (mode === 'oldest') {
    sorted.sort(function (a, b) { return (a.dateRaw || '').localeCompare(b.dateRaw || ''); });
  } else if (mode === 'popular') {
    sorted.sort(function (a, b) { return b.popularity - a.popularity; });
  }
  return sorted;
}

/* ── Internal state for current filter/sort ── */
var _feedState = {};

function renderToolbar(feed, posts, basePath, defaultSort, enableCategoryFilter) {
  var toolbar = document.createElement('div');
  toolbar.className = 'feed-toolbar';

  /* ── Category filter ── */
  if (enableCategoryFilter) {
    var categories = [];
    posts.forEach(function (p) {
      if (p.category && categories.indexOf(p.category) === -1) {
        categories.push(p.category);
      }
    });
    categories.sort();

    if (categories.length > 0) {
      var filterRow = document.createElement('div');
      filterRow.className = 'filter-bar';

      var allBtn = document.createElement('button');
      allBtn.className = 'filter-btn active';
      allBtn.textContent = 'All';
      allBtn.setAttribute('data-cat', '');
      allBtn.onclick = function () {
        filterRow.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
        allBtn.classList.add('active');
        _feedState.category = '';
        renderCards(feed, posts, basePath, _feedState.sort, _feedState.category);
      };
      filterRow.appendChild(allBtn);

      categories.forEach(function (cat) {
        var btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.textContent = cat;
        btn.setAttribute('data-cat', cat);
        btn.onclick = function () {
          filterRow.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
          _feedState.category = cat;
          renderCards(feed, posts, basePath, _feedState.sort, _feedState.category);
        };
        filterRow.appendChild(btn);
      });

      toolbar.appendChild(filterRow);
    }
  }

  /* ── Sort bar ── */
  var sortBar = document.createElement('div');
  sortBar.className = 'sort-bar';

  var options = [
    { value: 'newest',  label: 'Newest' },
    { value: 'oldest',  label: 'Oldest' },
    { value: 'popular', label: 'Popular' }
  ];

  options.forEach(function (opt) {
    var btn = document.createElement('button');
    btn.className = 'sort-btn' + (opt.value === defaultSort ? ' active' : '');
    btn.textContent = opt.label;
    btn.setAttribute('data-sort', opt.value);
    btn.onclick = function () {
      sortBar.querySelectorAll('.sort-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      _feedState.sort = opt.value;
      renderCards(feed, posts, basePath, _feedState.sort, _feedState.category);
    };
    sortBar.appendChild(btn);
  });

  toolbar.appendChild(sortBar);
  return toolbar;
}

function renderCards(feed, posts, basePath, sortMode, categoryFilter) {
  // Remove only cards, keep toolbar
  feed.querySelectorAll('.post-card').forEach(function (c) { c.remove(); });

  var filtered = posts;
  if (categoryFilter) {
    filtered = posts.filter(function (p) { return p.category === categoryFilter; });
  }

  var sorted = sortPosts(filtered, sortMode);
  sorted.forEach(function (p) {
    feed.appendChild(createCard(p, basePath));
  });
}

async function loadFeed(opts) {
  var slugs                = opts.slugs || [];
  var basePath             = opts.basePath || '/posts';
  var containerId          = opts.containerId || 'post-list';
  var defaultSort          = opts.defaultSort || 'newest';
  var enableCategoryFilter = opts.enableCategoryFilter || false;

  var feed = document.getElementById(containerId);
  if (!feed) return;

  // Init state
  _feedState.sort = defaultSort;
  _feedState.category = '';

  // Load all posts in parallel
  var promises = slugs.map(function (slug) { return loadPost(slug, basePath); });
  var results = await Promise.all(promises);
  var posts = results.filter(function (p) { return p !== null; });

  // Insert toolbar (filter + sort)
  var toolbar = renderToolbar(feed, posts, basePath, defaultSort, enableCategoryFilter);
  feed.appendChild(toolbar);

  // Initial render
  renderCards(feed, posts, basePath, defaultSort, '');
}

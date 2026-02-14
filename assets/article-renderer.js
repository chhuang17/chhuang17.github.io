/**
 * Shared article renderer for blog posts and project pages.
 *
 * Usage:
 *   <script src="/assets/article-renderer.js"></script>
 *   <script>
 *     renderArticle({ contentPath: '/posts/shp-intro/content.md' });
 *   </script>
 */

/* global marked, MathJax */

(function () {
  'use strict';

  // Configure marked renderer once
  marked.setOptions({ mangle: false, headerIds: false });
  marked.use({
    renderer: {
      image: function () {
        var args = arguments;
        var token = (args.length === 1 && typeof args[0] === 'object')
          ? args[0]
          : { href: args[0], title: args[1], text: args[2] };

        var esc = function (s) {
          return String(s == null ? '' : s)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        };

        var href  = esc(token.href  || '');
        var title = esc(token.title || '');
        var alt   = esc(token.text  || '');

        return '<img src="' + href + '" alt="' + alt + '"' +
               (title ? ' title="' + title + '"' : '') + '>';
      }
    }
  });

  /**
   * Wrap standalone images in <figure> with auto-generated <figcaption>.
   */
  function wrapImagesWithCaptions(scopeEl) {
    var imgs = scopeEl.querySelectorAll('.markdown-body img:not(.no-caption)');

    imgs.forEach(function (img) {
      if (img.closest('pre, code')) return;

      // Caption priority: data-caption > title > alt > filename
      var fileCaption = '';
      try {
        var url = new URL(img.src, location.origin);
        var base = url.pathname.split('/').pop() || '';
        var name = base.replace(/\.[a-z0-9]+$/i, '');
        fileCaption = name.replace(/[-_]+/g, ' ')
                          .replace(/\b\w/g, function (m) { return m.toUpperCase(); });
      } catch (e) { /* ignore */ }

      var cap = (img.getAttribute('data-caption') || img.getAttribute('title') ||
                 img.getAttribute('alt') || fileCaption || '').trim();

      var figure = img.closest('figure.md-figure');
      if (!figure) {
        figure = document.createElement('figure');
        figure.className = 'md-figure';
        img.parentNode.insertBefore(figure, img);
        figure.appendChild(img);
      }

      var fc = figure.querySelector('figcaption.md-figcaption');
      if (!fc) {
        fc = document.createElement('figcaption');
        fc.className = 'md-figcaption';
        figure.appendChild(fc);
      }
      fc.textContent = cap;

      if (!cap) fc.remove();
    });
  }

  /**
   * Render a markdown article into #content.
   * @param {Object} opts
   * @param {string} opts.contentPath - URL path to the content.md file
   * @param {string} [opts.holderId]  - Element ID to render into (default: 'content')
   */
  window.renderArticle = async function (opts) {
    var contentPath = opts.contentPath;
    var holderId    = opts.holderId || 'content';

    var resp = await fetch(contentPath, { cache: 'no-store' });
    var md = await resp.text();

    // Strip front-matter
    if (md.startsWith('---')) {
      var end = md.indexOf('\n---');
      if (end !== -1) md = md.slice(end + 4);
    }

    var html = marked.parse(md);
    var holder = document.getElementById(holderId);
    holder.innerHTML = html;

    // Wrap images with figure + caption
    wrapImagesWithCaptions(holder);

    // Typeset math
    if (window.MathJax && MathJax.typesetPromise) {
      await MathJax.typesetPromise([holder]);
    }

    // Update page title from first h1
    var h1 = holder.querySelector('h1');
    if (h1) document.title = h1.textContent + '｜Chien-Hao Huang';
  };
})();

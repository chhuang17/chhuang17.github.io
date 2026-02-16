/**
 * Shared site components — header, footer, head meta.
 *
 * Usage: add <script src="/assets/components.js"></script> in <head>,
 *        then set <body data-page="home|about|projects|blog">
 */
(function () {
  'use strict';

  /* ── Determine current page from <body data-page="..."> ── */
  function getCurrentPage() {
    return document.body.getAttribute('data-page') || '';
  }

  /* ── Header ── */
  function renderHeader(currentPage) {
    const nav = [
      { href: '/',          label: 'Home',     key: 'home' },
      { href: '/about/',    label: 'About',    key: 'about' },
      { href: '/projects/', label: 'Projects', key: 'projects' },
      { href: '/blog/',     label: 'Blog',     key: 'blog' },
    ];

    const links = nav.map(n => {
      const aria = n.key === currentPage ? ' aria-current="page"' : '';
      return `<a href="${n.href}"${aria}>${n.label}</a>`;
    }).join('\n      ');

    const html = `
    <a class="brand" href="/">Will Huang</a>
    <nav class="nav">
      ${links}
      <button id="theme-toggle" class="theme-toggle" aria-label="Toggle theme" title="切換主題">🌓</button>
    </nav>`;

    const header = document.querySelector('.site-header');
    if (header) {
      header.innerHTML = html;
    }
  }

  /* ── Footer ── */
  function renderFooter() {
    const footer = document.querySelector('.site-footer');
    if (footer) {
      footer.innerHTML = '<p>© 2025–2026 Will Huang · Hosted on GitHub Pages</p>';
    }
  }

  /* ── Init ── */
  // Run immediately (script is in <head> but DOM elements are available
  // because we hook into DOMContentLoaded)
  document.addEventListener('DOMContentLoaded', function () {
    const page = getCurrentPage();
    renderHeader(page);
    renderFooter();
  });
})();

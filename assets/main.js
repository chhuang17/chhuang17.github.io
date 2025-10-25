(function() {
  const KEY = 'theme-preference'; // 'light' | 'dark'

  // 如果之前存過 'auto'，這裡把它對應成系統偏好或亮色
  const migrate = (val) => {
    if (val === 'auto') {
      try {
        return window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark' : 'light';
      } catch { return 'dark'; }
    }
    return val;
  };

  const getStored = () => migrate(localStorage.getItem(KEY)) || 'dark';
  const setStored = (val) => localStorage.setItem(KEY, val);
  
  const applyTheme = (pref) => {
    document.documentElement.setAttribute('data-theme', pref);
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.textContent = pref === 'dark' ? '🌙' : '☀️';
    btn.setAttribute('aria-label', `Theme: ${pref}`);
    btn.title = `Theme: ${pref}`;
  };

  const toggle = (curr) => (curr === 'light' ? 'dark' : 'light');
  
  document.addEventListener('DOMContentLoaded', () => {
    let pref = getStored();
    applyTheme(pref);
  
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', () => {
        pref = toggle(pref);
        setStored(pref);
        applyTheme(pref);
      });
    }
  });
})();


// === Scroll reveal (About page, bi-directional) ===
document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('main.container.about');
  if (!root) return;

  const sections = root.querySelectorAll('.about-full.reveal');

  if (!('IntersectionObserver' in window)) {
    sections.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;

      if (entry.isIntersecting) {
        // 當區塊進入可視範圍 → 顯示
        el.classList.add('is-visible');

        // 階梯淡入
        const kids = el.querySelectorAll('[data-reveal-child]');
        kids.forEach((k, i) => {
          k.style.transitionDelay = `${i * 80}ms`;
        });
      } else {
        // 當區塊離開可視範圍 → 淡出
        el.classList.remove('is-visible');
      }
    });
  }, {
    threshold: 0.35,
    rootMargin: '0px 0px -8% 0px'
  });

  sections.forEach(s => io.observe(s));
});


// --- Email 防爬：把 data-user / data-domain 組成 mailto ---
(function () {
  const a = document.querySelector('#contact .email');
  if (!a) return;
  const user = a.getAttribute('data-user');
  const domain = a.getAttribute('data-domain');
  if (user && domain) {
    const addr = `${user}@${domain}`;
    a.href = `mailto:${addr}`;
    a.textContent = addr; // 直接顯示完整 email（也可改成「Email」）
  }
})();

// --- Scroll reveal（保底：若站上已實作，這段不會衝突） ---
(function () {
  const nodes = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || !nodes.length) {
    nodes.forEach(n => n.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  nodes.forEach(n => io.observe(n));
})();


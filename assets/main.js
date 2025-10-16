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

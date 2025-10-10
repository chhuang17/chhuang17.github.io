(function() {
const KEY = 'theme-preference'; // 'light' | 'dark' | 'auto'


const getStored = () => localStorage.getItem(KEY) || 'auto';
const setStored = (val) => localStorage.setItem(KEY, val);


const applyTheme = (pref) => {
document.documentElement.setAttribute('data-theme', pref);
const btn = document.getElementById('theme-toggle');
if (!btn) return;
const label = { light: '🌞', dark: '🌙', auto: '🌓' }[pref] || '🌓';
btn.textContent = label;
btn.setAttribute('aria-label', `Theme: ${pref}`);
btn.title = `主題：${pref}`;
};


const cycle = (curr) => ({ auto: 'light', light: 'dark', dark: 'auto' }[curr] || 'auto');


document.addEventListener('DOMContentLoaded', () => {
let pref = getStored();
applyTheme(pref);


const btn = document.getElementById('theme-toggle');
if (btn) {
btn.addEventListener('click', () => {
pref = cycle(pref);
setStored(pref);
applyTheme(pref);
});
}
});
})();

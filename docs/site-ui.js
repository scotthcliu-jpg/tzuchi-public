(function () {
  'use strict';
  var storageKey = 'tzuchi-public-theme';

  function preferredTheme() {
    try { return localStorage.getItem(storageKey) || 'light'; }
    catch (error) { return 'light'; }
  }

  function applyTheme(theme, button) {
    document.documentElement.dataset.theme = theme;
    if (button) {
      var isDark = theme === 'dark';
      button.textContent = isDark ? '☀ 切換白底' : '◐ 切換黑底';
      button.setAttribute('aria-label', isDark ? '切換為白底模式' : '切換為黑底模式');
      button.setAttribute('aria-pressed', String(isDark));
    }
  }

  applyTheme(preferredTheme());

  document.addEventListener('DOMContentLoaded', function () {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-toggle';
    button.addEventListener('click', function () {
      var nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(storageKey, nextTheme); } catch (error) {}
      applyTheme(nextTheme, button);
    });
    document.body.appendChild(button);
    applyTheme(document.documentElement.dataset.theme || 'light', button);
  });
}());

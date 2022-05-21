import { storage } from '../../utils/storage';

export function themeToggle(containerEl) {
  const htmlEl = document.querySelector('html');
  const btnEls = containerEl.querySelectorAll('.veda-toggle-theme');
  const coreTheme = storage.getItem('@coreTheme') ?? 'light';
  const isDark = coreTheme === 'dark';
  if (isDark) {
    htmlEl.classList.add('dark');
  }
  const handleClick = event => {
    event.preventDefault();
    htmlEl.classList.toggle('dark');
    const coreTheme = storage.getItem('@coreTheme') ?? 'light';
    const isDark = coreTheme === 'dark';
    if (isDark) {
      storage.setItem('@coreTheme', 'light');
    } else {
      storage.setItem('@coreTheme', 'dark');
    }
    btnEls.forEach(btnEl => {
      if (isDark) {
        btnEl.classList.remove('veda-toggle-theme--dark');
      } else {
        btnEl.classList.add('veda-toggle-theme--dark');
      }
    });
  };

  btnEls.forEach(btnEl => {
    if (isDark) {
      btnEl.classList.add('veda-toggle-theme--dark');
    }
    btnEl.removeEventListener('click', handleClick);
    btnEl.addEventListener('click', handleClick);
  });
}

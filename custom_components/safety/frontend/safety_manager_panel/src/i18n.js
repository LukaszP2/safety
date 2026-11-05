const locales = import.meta.glob('./locales/*.json');
let currentLang = '';
let translations = {};

// Ładujemy angielski jako fallback (synchronicznie dla bezpieczeństwa)
import fallbackEn from './locales/en.json';

export async function setLanguage(lang) {
  if (currentLang === lang) return;
  
  const localeKey = `./locales/${lang}.json`;
  
  try {
    if (locales[localeKey]) {
      const module = await locales[localeKey]();
      translations = module.default || module;
    } else {
      translations = fallbackEn;
    }
    currentLang = lang;
    window.dispatchEvent(new CustomEvent('language-loaded'));
  } catch (e) {
    translations = fallbackEn;
    window.dispatchEvent(new CustomEvent('language-loaded'));
  }
}

export function t(key, hass, params = {}) {
  const keys = key.split('.');
  
  // 1. Szukaj w załadowanym języku
  let val = translations;
  for (const k of keys) {
    if (val == null) break;
    val = val[k];
  }

  // 2. Szukaj w angielskim (fallback)
  if (val === undefined || val === null) {
    val = fallbackEn;
    for (const k of keys) {
      if (val == null) break;
      val = val[k];
    }
  }

  let text = val || key;

  // 3. Interpolacja parametrów {{param}}
  if (params && Object.keys(params).length > 0) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(new RegExp(`{{${k}}}`, 'g'), v);
    });
  }

  return text;
}
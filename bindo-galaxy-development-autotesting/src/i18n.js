import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const hash = process.env.SYS_LOCALE_HASH;
const fileName = hash === '.undefined' ? '' : hash;

const options = {
  fallbackLng: 'en-US',
  ns: ['common'],
  defaultNS: 'common',
  debug: false,
  interpolation: {
    escapeValue: false,
  },
  backend: {
    loadPath: `/locales/{{lng}}/{{ns}}${fileName}.json`,
  },
};

i18n
  .use(XHR)
  .use(LanguageDetector)
  .init(options);

export default i18n;

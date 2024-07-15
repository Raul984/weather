import { createI18n } from "vue-i18n";
import Cookies from "js-cookie";

import uk from "./uk.json";
import en from "./en.json";

const locales = { en, uk };
const localLanguage = Cookies.get("language") || "en";
const i18n = createI18n({
  legacy: false,
  locale: localLanguage,
  fallbackLocale: "en",
  messages: locales,
});

export default i18n;

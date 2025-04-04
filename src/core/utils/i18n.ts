// src/core/i18n.js
import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import HttpBackend from "i18next-http-backend"
import LanguageDetector from "i18next-browser-languagedetector"

// This setup uses dynamic loading from /public/locales
void i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "es"],
    ns: ["common"], // Add other namespaces as needed
    defaultNS: "common",
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json", // Path to load JSON files
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"], // persist language choice
    },
    react: {
      useSuspense: false, // avoid suspense unless you're handling fallback loading
    },
    interpolation: {
      escapeValue: false, // React already protects from XSS
    },
  })

export default i18n

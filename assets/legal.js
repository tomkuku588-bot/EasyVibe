(function () {
  const storageKey = "easyvibe-legal-language";
  const supportedLanguages = new Set(["zh", "en"]);

  function normalizeLanguage(language) {
    return supportedLanguages.has(language) ? language : "zh";
  }

  function updatePageTitle(language) {
    const titleMeta = document.querySelector(`meta[name="localized-title"][data-lang="${language}"]`);
    if (titleMeta) {
      document.title = titleMeta.content;
    }
  }

  function applyLanguage(language) {
    const activeLanguage = normalizeLanguage(language);
    document.documentElement.lang = activeLanguage === "en" ? "en" : "zh-CN";
    document.body.dataset.lang = activeLanguage;
    updatePageTitle(activeLanguage);

    document.querySelectorAll("[data-lang-switch]").forEach((button) => {
      const isActive = button.dataset.langSwitch === activeLanguage;
      button.setAttribute("aria-pressed", String(isActive));
    });

    try {
      window.localStorage.setItem(storageKey, activeLanguage);
    } catch (error) {
      // Language switching still works when localStorage is unavailable.
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    let initialLanguage = "zh";

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlLanguage = urlParams.get("lang") || window.location.hash.replace("#", "");
      initialLanguage = urlLanguage || window.localStorage.getItem(storageKey) || initialLanguage;
    } catch (error) {
      initialLanguage = "zh";
    }

    applyLanguage(initialLanguage);

    document.querySelectorAll("[data-lang-switch]").forEach((button) => {
      button.addEventListener("click", () => {
        applyLanguage(button.dataset.langSwitch);
      });
    });
  });
})();

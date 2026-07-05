import { withPluginApi } from "discourse/lib/plugin-api";

const ROOT_CLASS = "pink-unicorn-theme-forced";
const OVERLAY_ID = "pink-unicorn-theme-overlay";
const UNICORN_CLASS = "pink-unicorn-theme-unicorn";
const THEME_CONTROL_SELECTORS = [
  "[name='theme_ids']",
  "[name='color_scheme_id']",
  "[name='dark_scheme_id']",
  "[name='interface_color_selector']",
  "[data-setting-name='theme_ids']",
  "[data-setting-name='color_scheme_id']",
  "[data-setting-name='dark_scheme_id']",
  "[data-setting-name='interface_color_selector']",
  "#user-theme-ids",
  "#user-color-scheme-id",
  "#user-dark-scheme-id",
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function ensureRootClass() {
  document.documentElement.classList.add(ROOT_CLASS);
  document.body?.classList.add(ROOT_CLASS);
}

function nearestPreferenceContainer(element) {
  return (
    element.closest(
      ".control-group, .pref-control, .pref-row, .preference, .setting, .field"
    ) || element.parentElement
  );
}

function hideThemeControls() {
  THEME_CONTROL_SELECTORS.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element) => {
      element.disabled = true;
      const container = nearestPreferenceContainer(element);

      if (container) {
        container.style.display = "none";
      } else {
        element.style.display = "none";
      }
    });
  });
}

function shouldHideThemeControls() {
  const pathname = window.location?.pathname || "";

  return (
    /^\/my\/preferences(\/|$)/.test(pathname) ||
    /^\/u\/[^/]+\/preferences(\/|$)/.test(pathname)
  );
}

function createUnicorn(index, total, baseSpeed) {
  const unicorn = document.createElement("span");
  const duration = baseSpeed + ((index * 3) % 11);
  const delay = index * -2.35;
  const top = ((index + 1) / (total + 1)) * 100;
  const size = 2.1 + (index % 4) * 0.45;
  const drift = -10 + (index % 5) * 5;
  const sparkle = index % 2 === 0 ? " ✨" : "";

  unicorn.className = UNICORN_CLASS;
  unicorn.textContent = `🦄${sparkle}`;
  unicorn.style.setProperty("--pink-unicorn-top", `${top}%`);
  unicorn.style.setProperty("--pink-unicorn-duration", `${duration}s`);
  unicorn.style.setProperty("--pink-unicorn-delay", `${delay}s`);
  unicorn.style.setProperty("--pink-unicorn-size", `${size}rem`);
  unicorn.style.setProperty("--pink-unicorn-drift", `${drift}vh`);

  return unicorn;
}

function ensureOverlay(siteSettings) {
  const count = clamp(
    Number(siteSettings.pink_unicorn_theme_unicorn_count || 10),
    4,
    24
  );
  const baseSpeed = clamp(
    Number(siteSettings.pink_unicorn_theme_animation_speed || 22),
    8,
    60
  );

  let overlay = document.getElementById(OVERLAY_ID);
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    overlay.setAttribute("aria-hidden", "true");
    document.body?.appendChild(overlay);
  }

  if (overlay.dataset.count === String(count) && overlay.children.length === count) {
    return;
  }

  overlay.dataset.count = String(count);
  overlay.innerHTML = "";

  for (let index = 0; index < count; index += 1) {
    overlay.appendChild(createUnicorn(index, count, baseSpeed));
  }
}

function applyPinkUnicornTheme(siteSettings) {
  ensureRootClass();
  ensureOverlay(siteSettings);
  if (shouldHideThemeControls()) {
    hideThemeControls();
  }
}

export default {
  name: "pink-unicorn-theme",

  initialize() {
    withPluginApi("0.8.42", (api) => {
      const siteSettings = api.container.lookup("service:site-settings");
      const currentUser = api.getCurrentUser();
      if (
        !siteSettings?.pink_unicorn_theme_enabled ||
        !currentUser?.pink_unicorn_theme_forced
      ) {
        return;
      }

      const apply = () => applyPinkUnicornTheme(siteSettings);
      apply();
      api.onPageChange(() => apply());
    });
  },
};

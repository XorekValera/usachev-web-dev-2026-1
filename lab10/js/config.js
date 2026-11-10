(function () {
  // Ключ по умолчанию для лабораторных работ 8, 9 и 10.
  const DEFAULT_API_KEY = "5a6e8284-90ab-4848-b4b6-58611186e88t";

  const params = new URLSearchParams(window.location.search);
  const keyFromQuery = params.get("api_key");

  // Ключ можно переопределить через ?api_key=... — он запомнится в браузере.
  if (keyFromQuery) {
    localStorage.setItem("lunchbox_api_key", keyFromQuery);
  }

  window.APP_CONFIG = {
    API_BASE: "https://amd.dedyn.io:15243",
    API_ORDERS_PATH: "/labs/api/orders",
    API_DISHES_PATH: "/labs/api/dishes",
    IMAGE_BASE: "https://amd.dedyn.io:15243/labs/api/images",
    DEFAULT_API_KEY: DEFAULT_API_KEY,
    API_KEY: localStorage.getItem("lunchbox_api_key") || DEFAULT_API_KEY
  };

  // Превращает путь к картинке в адрес на сервере API.
  // Абсолютные адреса оставляем как есть (только приводим http к https).
  window.buildImageUrl = function (path) {
    if (!path) {
      return "";
    }

    if (/^https?:\/\//i.test(path)) {
      return String(path).replace(/^http:\/\//i, "https://");
    }

    const clean = String(path)
      .replace(/^\.?\//, "")
      .replace(/^images\/menu\//, "")
      .replace(/^images\//, "");

    return window.APP_CONFIG.IMAGE_BASE + "/" + clean;
  };

  // Собирает полный URL запроса к API: база + путь + api_key.
  window.buildApiUrl = function (path, apiKey) {
    const key = apiKey === undefined ? window.APP_CONFIG.API_KEY : apiKey;
    const url = window.APP_CONFIG.API_BASE + path;

    if (!key) {
      return url;
    }

    return url + (url.indexOf("?") === -1 ? "?" : "&") + "api_key=" + encodeURIComponent(key);
  };
})();

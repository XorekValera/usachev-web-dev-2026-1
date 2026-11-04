(function () {
  const params = new URLSearchParams(window.location.search);
  const keyFromQuery = params.get("api_key");

  if (keyFromQuery) {
    localStorage.setItem("lunchbox_api_key", keyFromQuery);
  }

  window.APP_CONFIG = {
    API_BASE: "https://edu.std-900.ist.mospolytech.ru",
    API_KEY: localStorage.getItem("lunchbox_api_key") || ""
  };
})();

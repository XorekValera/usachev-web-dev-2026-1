import js from "@eslint/js";
import globals from "globals";

// Идентификаторы, объявленные в одних файлах и используемые в других.
// Скрипты подключаются на страницы как обычные <script>, поэтому все они
// находятся в глобальной области видимости.
const sharedGlobals = {
  API_DISHES_URL: "readonly",
  API_URL: "readonly",
  APP_CONFIG: "readonly",
  CATEGORIES: "readonly",
  CATEGORY_ALIASES: "readonly",
  CATEGORY_LABELS: "readonly",
  DISHES: "writable",
  LOCAL_DISHES: "readonly",
  ORDER_FIELDS: "readonly",
  ORDER_STORAGE_KEY: "readonly",
  addDetailRow: "readonly",
  allOrders: "writable",
  clearSelection: "readonly",
  collectPayload: "readonly",
  createDishCard: "readonly",
  createOrderCard: "readonly",
  deleteOrderId: "writable",
  emptyLabels: "readonly",
  emptySelection: "readonly",
  fetchOrders: "readonly",
  formatDate: "readonly",
  formatDelivery: "readonly",
  getApiUrl: "readonly",
  getDishId: "readonly",
  getErrorMessage: "readonly",
  getLocalDishes: "readonly",
  getOrderComposition: "readonly",
  getOrderDish: "readonly",
  getOrderTotal: "readonly",
  getSelectedDishes: "readonly",
  getValidationMessage: "readonly",
  hasAnySelected: "readonly",
  hiddenFields: "readonly",
  initDishes: "readonly",
  isComboValid: "readonly",
  loadDishes: "readonly",
  loadSelection: "readonly",
  normalizeDish: "readonly",
  openDelete: "readonly",
  openDetails: "readonly",
  openEdit: "readonly",
  readDemoOrders: "readonly",
  redrawDishes: "readonly",
  refreshOrders: "readonly",
  removeOrder: "readonly",
  renderCheckout: "readonly",
  renderCheckoutSummary: "readonly",
  renderDishes: "readonly",
  renderOrders: "readonly",
  restoreSelectedDish: "readonly",
  saveDemoOrders: "readonly",
  saveSelection: "readonly",
  selectedDishes: "readonly",
  selection: "writable",
  showNotification: "readonly",
  submitOrder: "readonly",
  updateOrder: "readonly",
  updateOrderPanel: "readonly",
  updateOrderSummary: "readonly"
};

export default [
  {
    ignores: ["node_modules/**", "**/vendor/**"]
  },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.browser,
        ...sharedGlobals
      }
    },
    rules: {
      "no-unused-vars": [
        "error",
        { vars: "local", args: "none", caughtErrors: "none" }
      ],
      // Скрипты подключены как обычные <script> и делят одну глобальную
      // область видимости, поэтому объявления из sharedGlobals считаются
      // повторным объявлением встроенных глобальных переменных.
      "no-redeclare": "off",
      "no-console": "off",
      "indent": ["error", 2],
      "quotes": ["error", "double"],
      "semi": ["error", "always"]
    }
  }
];

const API_DISHES_URL = "https://edu.std-900.ist.mospolytech.ru/labs/api/dishes";

let DISHES = [];

const CATEGORY_ALIASES = {
  mains: "main_course",
  main: "main_course",
  main_courses: "main_course",
  salads: "salad",
  salads_starters: "salad",
  starters: "salad",
  beverages: "drink",
  drinks: "drink",
  desserts: "dessert"
};

function normalizeDish(dish) {
  return Object.assign({}, dish, {
    category: CATEGORY_ALIASES[dish.category] || dish.category,
    image: typeof dish.image === "string"
      ? dish.image.replace(/^http:\/\//i, "https://")
      : ""
  });
}

async function loadDishes() {
  const response = await fetch(API_DISHES_URL);

  if (!response.ok) {
    throw new Error("Не удалось загрузить блюда: " + response.status);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Сервер вернул данные в неожиданном формате");
  }

  return data.map(normalizeDish);
}

function getLocalDishes() {
  return LOCAL_DISHES.map(function (dish, index) {
    return Object.assign({ id: index + 1 }, dish);
  });
}

function redrawDishes() {
  renderDishes();
  document.dispatchEvent(new CustomEvent("dishes:rendered"));

  if (typeof updateOrderPanel === "function") {
    updateOrderPanel();
  }
}

async function initDishes() {
  // Сначала показываем локальное меню, чтобы страница не оставалась пустой,
  // пока загружаются данные с сервера.
  DISHES = getLocalDishes();
  redrawDishes();

  try {
    const apiDishes = await loadDishes();

    if (apiDishes.length > 0) {
      DISHES = apiDishes;
      redrawDishes();
    }
  } catch (error) {
    console.warn("API недоступно, используются локальные данные о блюдах.", error);
  }
}

document.addEventListener("DOMContentLoaded", initDishes);

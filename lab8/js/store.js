const ORDER_STORAGE_KEY = "lunchbox_order";
const CATEGORIES = ["soup", "main_course", "salad", "drink", "dessert"];

function emptySelection() {
  const result = {};
  CATEGORIES.forEach(function (category) {
    result[category] = null;
  });
  return result;
}

function loadSelection() {
  const result = emptySelection();

  try {
    const raw = localStorage.getItem(ORDER_STORAGE_KEY);

    if (!raw) {
      return result;
    }

    const parsed = JSON.parse(raw);

    CATEGORIES.forEach(function (category) {
      if (typeof parsed[category] === "string" && parsed[category]) {
        result[category] = parsed[category];
      }
    });
  } catch (error) {
    console.warn("Не удалось прочитать сохранённый заказ.", error);
  }

  return result;
}

let selection = loadSelection();

function saveSelection() {
  const data = {};

  CATEGORIES.forEach(function (category) {
    if (selection[category]) {
      data[category] = selection[category];
    }
  });

  if (Object.keys(data).length > 0) {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(data));
  } else {
    localStorage.removeItem(ORDER_STORAGE_KEY);
  }
}

function clearSelection() {
  CATEGORIES.forEach(function (category) {
    selection[category] = null;
  });
  saveSelection();
}

function hasAnySelected() {
  return CATEGORIES.some(function (category) {
    return selection[category] !== null;
  });
}

function getSelectedDishes(dishes) {
  const result = emptySelection();

  CATEGORIES.forEach(function (category) {
    const keyword = selection[category];
    result[category] = keyword
      ? dishes.find(function (dish) {
        return dish.keyword === keyword;
      }) || null
      : null;
  });

  return result;
}

function getOrderTotal(dishes) {
  const selected = getSelectedDishes(dishes);
  return CATEGORIES.reduce(function (total, category) {
    return selected[category] ? total + Number(selected[category].price) : total;
  }, 0);
}

function getValidationMessage() {
  const hasSoup = selection.soup !== null;
  const hasMain = selection.main_course !== null;
  const hasSalad = selection.salad !== null;
  const hasDrink = selection.drink !== null;

  if (!hasAnySelected()) {
    return "Ничего не выбрано. Выберите блюда для заказа";
  }

  if (!hasSoup && !hasMain && !hasSalad) {
    return "Выберите главное блюдо";
  }

  if (hasSoup && !hasMain && !hasSalad) {
    return "Выберите главное блюдо/салат/стартер";
  }

  if (!hasSoup && !hasMain && hasSalad) {
    return "Выберите суп или главное блюдо";
  }

  if (!hasDrink) {
    return "Выберите напиток";
  }

  return null;
}

function isComboValid() {
  return getValidationMessage() === null;
}

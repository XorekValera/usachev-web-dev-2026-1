const selectedDishes = {
  soup: null,
  main_course: null,
  salad: null,
  drink: null,
  dessert: null
};

const emptyLabels = {
  soup: "Блюдо не выбрано",
  main_course: "Блюдо не выбрано",
  salad: "Блюдо не выбрано",
  drink: "Напиток не выбран",
  dessert: "Десерт не выбран"
};

const hiddenFields = {
  soup: "hidden-soup",
  main_course: "hidden-main-course",
  salad: "hidden-salad",
  drink: "hidden-drink",
  dessert: "hidden-dessert"
};

function updateOrderSummary() {
  const emptyMessage = document.getElementById("order-empty");
  const orderContent = document.getElementById("order-content");
  const totalElement = document.getElementById("order-total");

  if (!emptyMessage || !orderContent || !totalElement) {
    return;
  }

  const chosen = Object.keys(selectedDishes).filter(function (category) {
    return selectedDishes[category] !== null;
  });

  emptyMessage.hidden = chosen.length !== 0;
  orderContent.hidden = chosen.length === 0;

  let total = 0;

  Object.keys(selectedDishes).forEach(function (category) {
    const dish = selectedDishes[category];
    const valueElement = document.querySelector("[data-order-category=\"" + category + "\"]");
    const hiddenInput = document.getElementById(hiddenFields[category]);

    if (valueElement) {
      valueElement.textContent = dish
        ? dish.name + " — " + dish.price + " ₽"
        : emptyLabels[category];
    }

    if (hiddenInput) {
      hiddenInput.value = dish ? dish.keyword : "";
    }

    if (dish) {
      total += dish.price;
    }
  });

  totalElement.textContent = total;
}

document.addEventListener("click", function (event) {
  const button = event.target.closest(".dish__button");

  if (!button) {
    return;
  }

  const card = button.closest(".dish");
  const dish = DISHES.find(function (item) {
    return item.keyword === card.dataset.dish;
  });

  if (!dish) {
    return;
  }

  selectedDishes[dish.category] = dish;

  document.querySelectorAll(".dish").forEach(function (item) {
    if (item.dataset.category === dish.category) {
      item.classList.remove("selected");
    }
  });

  card.classList.add("selected");
  updateOrderSummary();
});

function getValidationMessage() {
  const hasSoup = selectedDishes.soup !== null;
  const hasMain = selectedDishes.main_course !== null;
  const hasSalad = selectedDishes.salad !== null;
  const hasDrink = selectedDishes.drink !== null;
  const hasAny = Object.keys(selectedDishes).some(function (category) {
    return selectedDishes[category] !== null;
  });

  if (!hasAny) {
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

function showNotification(message) {
  const overlay = document.createElement("div");
  overlay.className = "notification-overlay";

  const notification = document.createElement("div");
  notification.className = "notification";

  const text = document.createElement("p");
  text.className = "notification__text";
  text.textContent = message;

  const button = document.createElement("button");
  button.className = "notification__button";
  button.type = "button";
  button.textContent = "Окей";
  button.addEventListener("click", function () {
    overlay.remove();
  });

  notification.append(text, button);
  overlay.append(notification);
  document.body.append(overlay);
}

document.addEventListener("DOMContentLoaded", function () {
  updateOrderSummary();

  const form = document.querySelector(".order-form");

  if (!form) {
    return;
  }

  form.addEventListener("submit", function (event) {
    const message = getValidationMessage();

    if (message) {
      event.preventDefault();
      showNotification(message);
    }
  });
});

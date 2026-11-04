const selectedDishes = {
  soup: null,
  main_course: null,
  drink: null
};

const emptyLabels = {
  soup: "Блюдо не выбрано",
  main_course: "Блюдо не выбрано",
  drink: "Напиток не выбран"
};

const hiddenFields = {
  soup: "hidden-soup",
  main_course: "hidden-main-course",
  drink: "hidden-drink"
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

  if (chosen.length === 0) {
    emptyMessage.hidden = false;
    orderContent.hidden = true;
  } else {
    emptyMessage.hidden = true;
    orderContent.hidden = false;
  }

  let total = 0;

  Object.keys(selectedDishes).forEach(function (category) {
    const dish = selectedDishes[category];
    const valueElement = document.querySelector('[data-order-category="' + category + '"]');
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

document.addEventListener("DOMContentLoaded", updateOrderSummary);

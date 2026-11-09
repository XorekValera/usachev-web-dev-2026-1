function createOrderCard(dish) {
  const card = createDishCard(dish);
  const button = card.querySelector(".dish__button");

  card.classList.add("selected");
  button.textContent = "Удалить";
  button.classList.add("dish__button--remove");

  return card;
}

function renderCheckoutSummary(selected) {
  const summary = document.getElementById("checkout-summary");

  if (!summary) {
    return;
  }

  summary.innerHTML = "";

  CATEGORIES.forEach(function (category) {
    const dish = selected[category];
    const row = document.createElement("div");
    row.className = "order-line";

    const label = document.createElement("span");
    label.className = "order-line__label";
    label.textContent = {
      soup: "Суп",
      main_course: "Главное блюдо",
      salad: "Салат или стартер",
      drink: "Напиток",
      dessert: "Десерт"
    }[category];

    const value = document.createElement("span");
    value.className = "order-line__value";
    value.textContent = dish
      ? dish.name + " — " + dish.price + " ₽"
      : "Не выбран";

    row.append(label, value);
    summary.append(row);
  });

  const totalRow = document.createElement("p");
  totalRow.className = "order-total";
  totalRow.innerHTML = "Итого: <span id=\"checkout-total\">" + getOrderTotal(DISHES) + "</span> ₽";
  summary.append(totalRow);
}

function renderCheckout() {
  const container = document.getElementById("selected-dishes");
  const emptyMessage = document.getElementById("empty-order");
  const form = document.getElementById("checkout-form");

  if (!container || !emptyMessage || !form) {
    return;
  }

  const selected = getSelectedDishes(DISHES);
  const dishes = CATEGORIES
    .map(function (category) {
      return selected[category];
    })
    .filter(Boolean);

  container.innerHTML = "";
  container.hidden = dishes.length === 0;
  emptyMessage.hidden = dishes.length > 0;
  form.hidden = dishes.length === 0;

  dishes.forEach(function (dish) {
    container.append(createOrderCard(dish));
  });

  renderCheckoutSummary(selected);
}

function getDishId(dish) {
  if (dish && dish.id !== undefined && dish.id !== null) {
    return Number(dish.id);
  }

  const localDish = LOCAL_DISHES.find(function (item) {
    return item.keyword === dish.keyword || item.name === dish.name;
  });

  return localDish ? LOCAL_DISHES.indexOf(localDish) + 1 : null;
}

function collectPayload(form) {
  const formData = new FormData(form);
  const deliveryType = String(formData.get("delivery_type") || "now");
  const deliveryTime = String(formData.get("delivery_time") || "");

  if (deliveryType === "by_time" && !deliveryTime) {
    throw new Error("Укажите время доставки");
  }

  const payload = {
    full_name: String(formData.get("full_name") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    subscribe: formData.get("subscribe") ? 1 : 0,
    phone: String(formData.get("phone") || "").trim(),
    delivery_address: String(formData.get("delivery_address") || "").trim(),
    delivery_type: deliveryType,
    delivery_time: deliveryType === "by_time" ? deliveryTime : null,
    comment: String(formData.get("comment") || "").trim()
  };

  const fields = {
    soup: "soup_id",
    main_course: "main_course_id",
    salad: "salad_id",
    drink: "drink_id",
    dessert: "dessert_id"
  };

  const selected = getSelectedDishes(DISHES);

  CATEGORIES.forEach(function (category) {
    const dish = selected[category];

    if (!dish) {
      return;
    }

    const id = getDishId(dish);

    if (id !== null) {
      payload[fields[category]] = id;
    }
  });

  return payload;
}

async function submitOrder(form) {
  const payload = collectPayload(form);

  if (!APP_CONFIG.API_KEY) {
    const orders = JSON.parse(localStorage.getItem("lunchbox_demo_orders") || "[]");

    orders.push(Object.assign({}, payload, {
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      total: getOrderTotal(DISHES),
      keywords: Object.assign({}, selection)
    }));

    if (orders.length > 10) {
      orders.splice(0, orders.length - 10);
    }

    localStorage.setItem("lunchbox_demo_orders", JSON.stringify(orders));
    return payload;
  }

  const url = APP_CONFIG.API_BASE + "/labs/api/orders?api_key=" + encodeURIComponent(APP_CONFIG.API_KEY);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    let message = "Не удалось оформить заказ. Попробуйте позже.";

    try {
      const data = await response.json();
      message = data.error || data.message || message;
    } catch (error) {
      console.warn("Сервер не вернул JSON с описанием ошибки.", error);
    }

    throw new Error(message);
  }

  return response.json();
}

document.addEventListener("click", function (event) {
  const button = event.target.closest("#selected-dishes .dish__button");

  if (!button) {
    return;
  }

  const card = button.closest(".dish");
  const category = card.dataset.category;

  selection[category] = null;
  saveSelection();
  card.remove();

  const selected = getSelectedDishes(DISHES);
  const container = document.getElementById("selected-dishes");
  const emptyMessage = document.getElementById("empty-order");
  const form = document.getElementById("checkout-form");

  renderCheckoutSummary(selected);

  if (container && emptyMessage && form && container.children.length === 0) {
    container.hidden = true;
    emptyMessage.hidden = false;
    form.hidden = true;
  }
});

document.addEventListener("dishes:rendered", renderCheckout);

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("checkout-form");

  if (!form) {
    return;
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const validationMessage = getValidationMessage();

    if (validationMessage) {
      showNotification(validationMessage);
      return;
    }

    const submitButton = form.querySelector("button[type=\"submit\"]");

    if (submitButton) {
      submitButton.disabled = true;
    }

    try {
      await submitOrder(form);
      clearSelection();

      showNotification("Заказ успешно оформлен!", {
        buttonText: "Окей",
        onClose: function () {
          window.location.href = "orders.html";
        }
      });
    } catch (error) {
      console.error(error);
      showNotification(error.message || "Не удалось оформить заказ. Попробуйте позже.", {
        type: "error"
      });
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
});

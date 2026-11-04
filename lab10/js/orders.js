let allOrders = [];
let deleteOrderId = null;

const ORDER_FIELDS = {
  soup: "soup_id",
  main_course: "main_course_id",
  salad: "salad_id",
  drink: "drink_id",
  dessert: "dessert_id"
};

const CATEGORY_LABELS = {
  soup: "Суп",
  main_course: "Главное блюдо",
  salad: "Салат или стартер",
  drink: "Напиток",
  dessert: "Десерт"
};

function readDemoOrders() {
  try {
    return JSON.parse(localStorage.getItem("lunchbox_demo_orders") || "[]");
  } catch (error) {
    console.warn("Не удалось прочитать демо-заказы.", error);
    return [];
  }
}

function saveDemoOrders(orders) {
  localStorage.setItem("lunchbox_demo_orders", JSON.stringify(orders));
}

function getApiUrl(path) {
  return APP_CONFIG.API_BASE + path + "?api_key=" + encodeURIComponent(APP_CONFIG.API_KEY);
}

async function getErrorMessage(response, fallback) {
  try {
    const data = await response.json();
    return data.error || data.message || fallback;
  } catch (error) {
    return fallback;
  }
}

async function fetchOrders() {
  if (!APP_CONFIG.API_KEY) {
    return readDemoOrders();
  }

  const response = await fetch(getApiUrl("/labs/api/orders"));

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Не удалось загрузить заказы"));
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

async function updateOrder(id, payload) {
  if (!APP_CONFIG.API_KEY) {
    const orders = readDemoOrders();
    const index = orders.findIndex(function (order) {
      return String(order.id) === String(id);
    });

    if (index === -1) {
      throw new Error("Заказ не найден");
    }

    orders[index] = Object.assign({}, orders[index], payload, {
      updated_at: new Date().toISOString()
    });
    saveDemoOrders(orders);
    return orders[index];
  }

  const response = await fetch(getApiUrl("/labs/api/orders/" + encodeURIComponent(id)), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Не удалось изменить заказ"));
  }

  return response.json();
}

async function removeOrder(id) {
  if (!APP_CONFIG.API_KEY) {
    const orders = readDemoOrders();
    const filtered = orders.filter(function (order) {
      return String(order.id) !== String(id);
    });

    if (filtered.length === orders.length) {
      throw new Error("Заказ не найден");
    }

    saveDemoOrders(filtered);
    return;
  }

  const response = await fetch(getApiUrl("/labs/api/orders/" + encodeURIComponent(id)), {
    method: "DELETE"
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Не удалось удалить заказ"));
  }
}

function getOrderDish(order, category) {
  const keyword = order.keywords && order.keywords[category];

  if (keyword) {
    const byKeyword = DISHES.find(function (dish) {
      return dish.keyword === keyword;
    });

    if (byKeyword) {
      return byKeyword;
    }
  }

  const field = ORDER_FIELDS[category];
  const value = order[field];

  if (value === undefined || value === null || value === "") {
    return null;
  }

  return DISHES.find(function (dish) {
    return Number(dish.id) === Number(value);
  }) || null;
}

function getOrderComposition(order) {
  return CATEGORIES.map(function (category) {
    return getOrderDish(order, category);
  }).filter(Boolean);
}

function getOrderTotal(order) {
  const sum = getOrderComposition(order).reduce(function (total, dish) {
    return total + Number(dish.price);
  }, 0);

  return sum || Number(order.total) || 0;
}

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatDelivery(order) {
  if (order.delivery_type === "by_time" && order.delivery_time) {
    return "Ко времени: " + order.delivery_time;
  }

  return "Как можно скорее (с 7:00 до 23:00)";
}

function createOrderCard(order, number) {
  const card = document.createElement("article");
  card.className = "order-card";

  const head = document.createElement("div");
  head.className = "order-card__head";

  const numberElement = document.createElement("p");
  numberElement.className = "order-card__number";
  numberElement.textContent = "Заказ №" + number;

  const dateElement = document.createElement("p");
  dateElement.className = "order-card__date";
  dateElement.textContent = formatDate(order.created_at);

  head.append(numberElement, dateElement);

  const composition = document.createElement("p");
  composition.className = "order-card__composition";
  const dishNames = getOrderComposition(order).map(function (dish) {
    return dish.name;
  });
  composition.textContent = "Состав: " + (dishNames.length ? dishNames.join(", ") : "—");

  const meta = document.createElement("div");
  meta.className = "order-card__meta";

  const price = document.createElement("p");
  price.textContent = "Стоимость: " + getOrderTotal(order) + " ₽";

  const delivery = document.createElement("p");
  delivery.textContent = "Доставка: " + formatDelivery(order);

  meta.append(price, delivery);

  const actions = document.createElement("div");
  actions.className = "order-card__actions";

  const buttons = [
    { action: "details", label: "Подробнее", modifier: "" },
    { action: "edit", label: "Редактирование", modifier: "" },
    { action: "delete", label: "Удаление", modifier: " order-card__button--danger" }
  ];

  buttons.forEach(function (item) {
    const button = document.createElement("button");
    button.className = "order-card__button" + item.modifier;
    button.type = "button";
    button.textContent = item.label;
    button.dataset.action = item.action;
    button.dataset.id = order.id;
    actions.append(button);
  });

  card.append(head, composition, meta, actions);
  return card;
}

function renderOrders() {
  const list = document.getElementById("orders-list");
  const empty = document.getElementById("orders-empty");

  if (!list || !empty) {
    return;
  }

  list.innerHTML = "";
  empty.hidden = allOrders.length > 0;

  allOrders.forEach(function (order, index) {
    list.append(createOrderCard(order, index + 1));
  });
}

function addDetailRow(container, label, value) {
  const paragraph = document.createElement("p");
  const strong = document.createElement("strong");
  strong.textContent = label + ": ";
  paragraph.append(strong, document.createTextNode(value));
  container.append(paragraph);
}

function openDetails(order) {
  const content = document.getElementById("details-content");

  if (!content) {
    return;
  }

  content.innerHTML = "";

  const composition = getOrderComposition(order).map(function (dish) {
    return dish.name;
  });

  addDetailRow(content, "Номер заказа", String(order.id));
  addDetailRow(content, "Дата оформления", formatDate(order.created_at));
  addDetailRow(content, "Состав", composition.length ? composition.join(", ") : "—");
  addDetailRow(content, "Стоимость", getOrderTotal(order) + " ₽");
  addDetailRow(content, "Доставка", formatDelivery(order));
  addDetailRow(content, "Имя", order.full_name || "—");
  addDetailRow(content, "Email", order.email || "—");
  addDetailRow(content, "Телефон", order.phone || "—");
  addDetailRow(content, "Адрес", order.delivery_address || "—");
  addDetailRow(content, "Комментарий", order.comment || "—");
  addDetailRow(content, "Подписка", Number(order.subscribe) ? "Да" : "Нет");

  document.getElementById("details-modal").hidden = false;
}

function openEdit(order) {
  const form = document.getElementById("edit-form");

  if (!form) {
    return;
  }

  form.elements.id.value = order.id;
  form.elements.full_name.value = order.full_name || "";
  form.elements.email.value = order.email || "";
  form.elements.phone.value = order.phone || "";
  form.elements.delivery_address.value = order.delivery_address || "";
  form.elements.comment.value = order.comment || "";
  form.elements.delivery_time.value = order.delivery_time || "";

  const deliveryType = order.delivery_type === "by_time" ? "by_time" : "now";
  form.querySelector('input[name="delivery_type"][value="' + deliveryType + '"]').checked = true;

  document.getElementById("edit-modal").hidden = false;
}

function openDelete(order) {
  deleteOrderId = order.id;
  document.getElementById("delete-modal").hidden = false;
}

async function refreshOrders() {
  try {
    allOrders = await fetchOrders();
  } catch (error) {
    console.error(error);
    showNotification(error.message || "Не удалось загрузить заказы", { type: "error" });
    allOrders = readDemoOrders();
  }

  allOrders.sort(function (a, b) {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  renderOrders();
}

document.addEventListener("click", function (event) {
  const modalElement = event.target.classList.contains("modal") ? event.target : null;

  if (modalElement) {
    modalElement.hidden = true;
    return;
  }

  const closeButton = event.target.closest("[data-close]");

  if (closeButton) {
    const modal = document.getElementById(closeButton.dataset.close);

    if (modal) {
      modal.hidden = true;
    }

    return;
  }

  const actionButton = event.target.closest("[data-action]");

  if (!actionButton) {
    return;
  }

  const order = allOrders.find(function (item) {
    return String(item.id) === String(actionButton.dataset.id);
  });

  if (!order) {
    return;
  }

  if (actionButton.dataset.action === "details") {
    openDetails(order);
  } else if (actionButton.dataset.action === "edit") {
    openEdit(order);
  } else if (actionButton.dataset.action === "delete") {
    openDelete(order);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const editForm = document.getElementById("edit-form");
  const deleteButton = document.getElementById("delete-confirm");

  if (editForm) {
    editForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const formData = new FormData(editForm);
      const deliveryType = String(formData.get("delivery_type") || "now");
      const deliveryTime = String(formData.get("delivery_time") || "");

      if (deliveryType === "by_time" && !deliveryTime) {
        showNotification("Укажите время доставки", { type: "error" });
        return;
      }

      const payload = {
        full_name: String(formData.get("full_name") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        phone: String(formData.get("phone") || "").trim(),
        delivery_address: String(formData.get("delivery_address") || "").trim(),
        delivery_type: deliveryType,
        delivery_time: deliveryType === "by_time" ? deliveryTime : null,
        comment: String(formData.get("comment") || "").trim()
      };

      const saveButton = editForm.querySelector('button[type="submit"]');
      saveButton.disabled = true;

      try {
        await updateOrder(formData.get("id"), payload);
        document.getElementById("edit-modal").hidden = true;
        showNotification("Заказ успешно изменён");
        await refreshOrders();
      } catch (error) {
        console.error(error);
        showNotification(error.message || "Не удалось изменить заказ", { type: "error" });
      } finally {
        saveButton.disabled = false;
      }
    });
  }

  if (deleteButton) {
    deleteButton.addEventListener("click", async function () {
      if (deleteOrderId === null) {
        return;
      }

      deleteButton.disabled = true;

      try {
        await removeOrder(deleteOrderId);
        document.getElementById("delete-modal").hidden = true;
        deleteOrderId = null;
        showNotification("Заказ успешно удалён");
        await refreshOrders();
      } catch (error) {
        console.error(error);
        showNotification(error.message || "Не удалось удалить заказ", { type: "error" });
      } finally {
        deleteButton.disabled = false;
      }
    });
  }
});

document.addEventListener("dishes:rendered", refreshOrders);

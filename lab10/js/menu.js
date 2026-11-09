function updateOrderPanel() {
  const panel = document.getElementById("order-panel");
  const totalElement = document.getElementById("order-panel-total");
  const link = document.getElementById("checkout-link");

  if (!panel || !totalElement || !link) {
    return;
  }

  panel.hidden = !hasAnySelected();
  totalElement.textContent = getOrderTotal(DISHES);

  const valid = isComboValid();

  link.classList.toggle("is-disabled", !valid);
  link.setAttribute("aria-disabled", valid ? "false" : "true");
  link.tabIndex = valid ? 0 : -1;
}

document.addEventListener("click", function (event) {
  const checkoutLink = event.target.closest("#checkout-link");

  if (checkoutLink) {
    if (checkoutLink.classList.contains("is-disabled")) {
      event.preventDefault();
    }
    return;
  }

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

  if (selection[dish.category] === dish.keyword) {
    selection[dish.category] = null;
    card.classList.remove("selected");
  } else {
    selection[dish.category] = dish.keyword;

    document.querySelectorAll(".dish[data-category=\"" + dish.category + "\"]").forEach(function (item) {
      item.classList.remove("selected");
    });

    card.classList.add("selected");
  }

  saveSelection();
  updateOrderPanel();
});

document.addEventListener("DOMContentLoaded", updateOrderPanel);

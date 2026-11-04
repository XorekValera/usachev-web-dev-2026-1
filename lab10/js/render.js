function createDishCard(dish) {
  const card = document.createElement("div");
  card.className = "dish";
  card.dataset.dish = dish.keyword;
  card.dataset.category = dish.category;
  card.dataset.kind = dish.kind;

  if (selection[dish.category] === dish.keyword) {
    card.classList.add("selected");
  }

  const image = document.createElement("img");
  image.className = "dish__image";
  image.src = dish.image;
  image.alt = dish.name;
  image.width = 500;
  image.height = 500;
  image.addEventListener("error", function () {
    if (typeof LOCAL_DISHES === "undefined") {
      return;
    }

    const localDish = LOCAL_DISHES.find(function (item) {
      return item.keyword === dish.keyword || item.name === dish.name;
    });

    if (localDish && image.src.indexOf(localDish.image) === -1) {
      image.src = localDish.image;
    }
  });

  const price = document.createElement("p");
  price.className = "dish__price";
  price.textContent = dish.price + " ₽";

  const name = document.createElement("p");
  name.className = "dish__name";
  name.textContent = dish.name;

  const count = document.createElement("p");
  count.className = "dish__count";
  count.textContent = dish.count;

  const button = document.createElement("button");
  button.className = "dish__button";
  button.type = "button";
  button.textContent = "Добавить";

  card.append(image, price, name, count, button);
  return card;
}

function renderDishes() {
  const sections = document.querySelectorAll("[data-category]");

  sections.forEach(function (section) {
    const category = section.dataset.category;
    const container = section.querySelector(".dishes");
    if (!container) {
      return;
    }

    const dishes = DISHES
      .filter(function (dish) {
        return dish.category === category;
      })
      .sort(function (a, b) {
        return a.name.localeCompare(b.name, "ru");
      });

    container.innerHTML = "";
    dishes.forEach(function (dish) {
      container.append(createDishCard(dish));
    });
  });
}

document.addEventListener("click", function (event) {
  const filter = event.target.closest(".filter");

  if (!filter) {
    return;
  }

  const section = filter.closest("[data-category]");
  const wasActive = filter.classList.contains("active");

  section.querySelectorAll(".filter").forEach(function (button) {
    button.classList.remove("active");
  });

  const cards = section.querySelectorAll(".dish");

  if (wasActive) {
    cards.forEach(function (card) {
      card.hidden = false;
    });
    return;
  }

  filter.classList.add("active");

  cards.forEach(function (card) {
    card.hidden = card.dataset.kind !== filter.dataset.kind;
  });
});

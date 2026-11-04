function createDishCard(dish) {
  const card = document.createElement("div");
  card.className = "dish";
  card.dataset.dish = dish.keyword;
  card.dataset.category = dish.category;

  const image = document.createElement("img");
  image.className = "dish__image";
  image.src = dish.image;
  image.alt = dish.name;
  image.width = 500;
  image.height = 500;

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

document.addEventListener("DOMContentLoaded", renderDishes);

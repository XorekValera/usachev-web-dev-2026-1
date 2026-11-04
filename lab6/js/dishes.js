const DISHES = [
  {
    keyword: "gaspacho",
    name: "Гаспачо",
    price: 195,
    category: "soup",
    kind: "veg",
    count: "350 г",
    image: "images/menu/soups/gazpacho.jpg"
  },
  {
    keyword: "gribnoy",
    name: "Грибной суп-пюре",
    price: 185,
    category: "soup",
    kind: "veg",
    count: "330 г",
    image: "images/menu/soups/mushroom_soup.jpg"
  },
  {
    keyword: "norwegian",
    name: "Норвежский суп",
    price: 270,
    category: "soup",
    kind: "fish",
    count: "350 г",
    image: "images/menu/soups/norwegian_soup.jpg"
  },
  {
    keyword: "chicken_soup",
    name: "Куриный суп",
    price: 240,
    category: "soup",
    kind: "meat",
    count: "350 г",
    image: "images/menu/soups/chicken.jpg"
  },
  {
    keyword: "ramen",
    name: "Рамен",
    price: 320,
    category: "soup",
    kind: "meat",
    count: "400 г",
    image: "images/menu/soups/ramen.jpg"
  },
  {
    keyword: "tomyum",
    name: "Том-ям",
    price: 330,
    category: "soup",
    kind: "fish",
    count: "350 г",
    image: "images/menu/soups/tomyum.jpg"
  },
  {
    keyword: "chicken_cutlets",
    name: "Куриные котлеты с картофельным пюре",
    price: 320,
    category: "main_course",
    kind: "meat",
    count: "320 г",
    image: "images/menu/main_course/chickencutletsandmashedpotatoes.jpg"
  },
  {
    keyword: "fried_potatoes",
    name: "Жареная картошка с грибами",
    price: 250,
    category: "main_course",
    kind: "veg",
    count: "300 г",
    image: "images/menu/main_course/friedpotatoeswithmushrooms1.jpg"
  },
  {
    keyword: "lasagna",
    name: "Лазанья",
    price: 380,
    category: "main_course",
    kind: "meat",
    count: "350 г",
    image: "images/menu/main_course/lasagna.jpg"
  },
  {
    keyword: "fish_rice",
    name: "Рыба с рисом",
    price: 420,
    category: "main_course",
    kind: "fish",
    count: "320 г",
    image: "images/menu/main_course/fishrice.jpg"
  },
  {
    keyword: "pizza",
    name: "Пицца",
    price: 450,
    category: "main_course",
    kind: "veg",
    count: "400 г",
    image: "images/menu/main_course/pizza.jpg"
  },
  {
    keyword: "shrimp_pasta",
    name: "Паста с креветками",
    price: 470,
    category: "main_course",
    kind: "fish",
    count: "350 г",
    image: "images/menu/main_course/shrimppasta.jpg"
  },
  {
    keyword: "caesar",
    name: "Цезарь с курицей",
    price: 320,
    category: "salad",
    kind: "meat",
    count: "220 г",
    image: "images/menu/salads_starters/caesar.jpg"
  },
  {
    keyword: "caprese",
    name: "Капрезе",
    price: 280,
    category: "salad",
    kind: "veg",
    count: "200 г",
    image: "images/menu/salads_starters/caprese.jpg"
  },
  {
    keyword: "french_fries",
    name: "Картофель фри",
    price: 180,
    category: "salad",
    kind: "veg",
    count: "150 г",
    image: "images/menu/salads_starters/frenchfries1.jpg"
  },
  {
    keyword: "french_fries_sauce",
    name: "Картофель фри с соусом",
    price: 200,
    category: "salad",
    kind: "veg",
    count: "170 г",
    image: "images/menu/salads_starters/frenchfries2.jpg"
  },
  {
    keyword: "salad_with_egg",
    name: "Салат с яйцом",
    price: 220,
    category: "salad",
    kind: "veg",
    count: "200 г",
    image: "images/menu/salads_starters/saladwithegg.jpg"
  },
  {
    keyword: "tuna_salad",
    name: "Салат с тунцом",
    price: 350,
    category: "salad",
    kind: "fish",
    count: "250 г",
    image: "images/menu/salads_starters/tunasalad.jpg"
  },
  {
    keyword: "apple_juice",
    name: "Яблочный сок",
    price: 120,
    category: "drink",
    kind: "cold",
    count: "250 мл",
    image: "images/menu/beverages/applejuice.jpg"
  },
  {
    keyword: "carrot_juice",
    name: "Морковный сок",
    price: 130,
    category: "drink",
    kind: "cold",
    count: "250 мл",
    image: "images/menu/beverages/carrotjuice.jpg"
  },
  {
    keyword: "orange_juice",
    name: "Апельсиновый сок",
    price: 140,
    category: "drink",
    kind: "cold",
    count: "250 мл",
    image: "images/menu/beverages/orangejuice.jpg"
  },
  {
    keyword: "tea",
    name: "Чай",
    price: 90,
    category: "drink",
    kind: "hot",
    count: "300 мл",
    image: "images/menu/beverages/tea.jpg"
  },
  {
    keyword: "green_tea",
    name: "Зелёный чай",
    price: 100,
    category: "drink",
    kind: "hot",
    count: "300 мл",
    image: "images/menu/beverages/greentea.jpg"
  },
  {
    keyword: "cappuccino",
    name: "Капучино",
    price: 180,
    category: "drink",
    kind: "hot",
    count: "300 мл",
    image: "images/menu/beverages/cappuccino.jpg"
  },
  {
    keyword: "donuts",
    name: "Пончик",
    price: 120,
    category: "dessert",
    kind: "small",
    count: "80 г",
    image: "images/menu/desserts/donuts.jpg"
  },
  {
    keyword: "donuts_glazed",
    name: "Пончик с глазурью",
    price: 140,
    category: "dessert",
    kind: "small",
    count: "90 г",
    image: "images/menu/desserts/donuts2.jpg"
  },
  {
    keyword: "baklava",
    name: "Пахлава",
    price: 160,
    category: "dessert",
    kind: "small",
    count: "100 г",
    image: "images/menu/desserts/baklava.jpg"
  },
  {
    keyword: "chocolate_cake",
    name: "Шоколадный торт",
    price: 240,
    category: "dessert",
    kind: "medium",
    count: "150 г",
    image: "images/menu/desserts/chocolatecake.jpg"
  },
  {
    keyword: "cheesecake",
    name: "Чизкейк",
    price: 260,
    category: "dessert",
    kind: "medium",
    count: "160 г",
    image: "images/menu/desserts/checheesecake.jpg"
  },
  {
    keyword: "chocolate_cheesecake",
    name: "Шоколадный чизкейк",
    price: 320,
    category: "dessert",
    kind: "large",
    count: "200 г",
    image: "images/menu/desserts/chocolatecheesecake.jpg"
  }
];

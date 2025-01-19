// Search functionality
const searchInput = document.querySelector("#search-bar");
const items_sale = document.getElementById("items_sale");
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    const products = document.querySelectorAll("#items_sale .product");

    products.forEach((product) => {
      const productTitle = product
        .querySelector("h3")
        .textContent.toLowerCase()
        .trim();
      product.style.display = productTitle.includes(searchTerm) ? "" : "none";
    });
  });
}

// Open & close cart
let cart = document.querySelector(".cart");

function open_cart() {
  cart.classList.add("active");
}

function close_cart() {
  cart.classList.remove("active");
}

// Icon cart selecting and open on click
let cartIcon = document.querySelector(".icon_cart");
cartIcon.click = open_cart

// Close by close cart icon
let closeCart = document.querySelector(".close_cart");
cartIcon.click = close_cart

//slider
//Declaring array of images ,it's index, intervalID, playing flag
let images = [
  "../public/img/slider-01.jpg",
  "../public/img/slider-02.jpg",
  "../public/img/slider-03.jpg",
];
let index = 0;
let intervalID;
let playing = 0;

//to display the first image
// document.getElementById("imgID").setAttribute('src',images[index]);
imgID.src = images[index];

//previous  function
const previous = () => {
  index > 0 ? index-- : (index = images.length - 1);
  document.getElementById("imgID").setAttribute("src", images[index]);
};
// next function
const nextFun = () => {
  index < images.length - 1 ? index++ : (index = 0);
  document.getElementById("imgID").setAttribute("src", images[index]);
};
//play function with validation flag
const playFun = () => {
  if (playing == 0) {
    intervalID = setInterval(nextFun, 1500);
    playing = 1;
  }
};

//stop function with validation flag
const stopFun = () => {
  if ((playing = 1)) {
    clearInterval(intervalID);
    playing = 0;
  }
};

//on clicks
prev.addEventListener("click", previous);
next.addEventListener("click", nextFun);
play.addEventListener("click", playFun);
stopp.addEventListener("click", stopFun);

//add items to cart
let allProducts = []; //from itemshome.js

let cart_items = document.querySelector(".cart_items");
let product_cart = [];

//push the added product to cart array
function addToCart(id, btn) {       //(btn=>this & id=> product id) at onclick event
  const product = allProducts.find((product) => product.id === id);
  if (product) {
    product_cart.push(product);
    // btn.classList.add("active");
    // console.log(product_cart);
  } else {
    console.error(`Product with ID ${id} not found.`);
  }
  getCartItems();
}

//count the price in cart
let count_item = document.querySelector(".count_item");
let count_item_cart = document.querySelector(".count_item_cart");
let price_cart_total = document.querySelector(".price_cart_total");
let price_cart_Head = document.querySelector(".price_cart_Head");

//adding the product to the cart 
function getCartItems() {
  let totalCartPrice = 0;
  let items_C = "";
  for (let i = 0; i < product_cart.length; i++) {
    items_C = `
        <div class="item_cart">
            <img src="${product_cart[i].img}" alt="product">
            <div class="content">
                <h4>${product_cart[i].name}</h4>
                <p class="price_cart">$${product_cart[i].price}</p>
            </div>
            <button class="delete_item" onclick="removeFromCart(${i})">
                <i class="fa-regular fa-trash-can"></i>
            </button>
        </div>`;
    totalCartPrice += product_cart[i].price;
  }
  cart_items.innerHTML = items_C;

  //for header
  price_cart_Head.textContent = "$" + totalCartPrice;
  count_item.textContent = product_cart.length;
  //for cart
  count_item_cart.textContent = `(${product_cart.length} items in cart)`;
  price_cart_total.textContent = "$" + totalCartPrice;
}

function removeFromCart(index) {
  product_cart.splice(index, 1);
  getCartItems();
}

//To Display Login User
let logOut = document.querySelector(".logout");
let welcome = document.querySelector(".welcomeName");
if (currentUser) {
  welcome.innerHTML = `welcome, ${currentUser.userName} !`;
  document.querySelector(".loging-signup").style.display = "none";
} else {
  logOut.style.display = "none";
}
//log out
logOut.addEventListener("click", function () {
  localStorage.removeItem("currentUser");
  window.location.href = "/public/index.html";
});

// declare all cart-related elements at the top
const cartItems = document.querySelector(".cart_items");
const countItem = document.querySelector(".count_item");
const countItemCart = document.querySelector(".count_item_cart");
const priceCartTotal = document.querySelector(".price_cart_total");
const priceCartHead = document.querySelector(".price_cart_Head");
const topCartCount = document.querySelector(".top_cart h3 span"); 

    
    let allProducts = []; 
    let productCart = []; 

    //fetch all products
    fetch("http://localhost:3000/products")
        .then(response => response.json())
        .then(data => {
            allProducts = data;
            displayProducts(data);
        })
        .catch(error => console.error('Error fetching products:', error));

    function displayProducts(data) {
        const productsDiv = document.getElementById("products_dev");
        if (!productsDiv) return;
        
        productsDiv.innerHTML = '';

        
        data.forEach(product => {
            
            const oldPriceP = product.old_price ? `<p class="old_price">${product.old_price}$</p>` : '';
            const percentageDisc = product.old_price ? 
                Math.floor((product.old_price - product.price) / (product.old_price) * 100) : 0;
            const discountP = product.old_price ? 
                `<span class="sale_percent">${percentageDisc}% off</span>` : '';

            const productElement = document.createElement('div');
            productElement.className = 'product';
            productElement.innerHTML = `
                <div class="icons">
                    <span><i class="fa-solid fa-cart-plus" data-product-id="${product.id}"></i></span>
                    <span><i class="fa-solid fa-heart"></i></span>
                    <span><i class="fa-solid fa-share-from-square"></i></span>
                </div>
                ${discountP}
                <div class="img_product">
                    <img src="${product.img}" alt="">
                    <img class="img_hover" src="${product.img_hover || product.img}" alt="">
                </div>
                <h3 class="name_product">
                    <a href="#">${product.name}</a>
                </h3>
                <div class="stars">
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                </div>
                <div class="price">
                    <p><span>${product.price}$</span></p>
                    ${oldPriceP}
                </div>
            `;

            const cartIcon = productElement.querySelector('.fa-cart-plus');
            cartIcon.addEventListener('click', function() {
                addToCart(product.id, this);
            });

            productsDiv.appendChild(productElement);
        });
    }

    function addToCart(id, btn) {
        const product = allProducts.find(product => product.id === id);
        if (product) {
            productCart.push(product);
            // btn.classList.add("active");
            updateCartDisplay();
        }
    }

    function updateCartDisplay() {
        if (!cartItems) return; // Guard clause for cart items container

        let totalCartPrice = 0;
        cartItems.innerHTML = ''; // Clear current cart items

        productCart.forEach((product, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item_cart';
            itemDiv.innerHTML = `
                <img src="${product.img}" alt="product">
                <div class="content">
                    <h4>${product.name}</h4>
                    <p class="price_cart">$${product.price}</p>
                </div>
                <button class="delete_item">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            `;

            // Add delete event listener
            const deleteBtn = itemDiv.querySelector('.delete_item');
            deleteBtn.addEventListener('click', () => removeFromCart(index));

            cartItems.appendChild(itemDiv);
            totalCartPrice += product.price;
        });

        // Update all cart counters and totals
        if (priceCartHead) priceCartHead.textContent = `$${totalCartPrice}`;
        if (countItem) countItem.textContent = productCart.length.toString();
        if (countItemCart) countItemCart.textContent = `(${productCart.length} items in cart)`;
        if (priceCartTotal) priceCartTotal.textContent = `$${totalCartPrice}`;
        // Update top cart count
        if (topCartCount) {
            topCartCount.textContent = `(${productCart.length} Item${productCart.length !== 1 ? 's' : ''} in Cart)`;
        }
    }

    function removeFromCart(index) {
        if (index >= 0 && index < productCart.length) {
            productCart.splice(index, 1);
            updateCartDisplay();
        }
    }

    // Cart open/close functionality
    const cart = document.querySelector('.cart');
    const cartIcon = document.querySelector('.icon_cart');
    const closeCart = document.querySelector('.close_cart');

    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            if (cart) cart.classList.add("active");
        });
    }

    if (closeCart) {
        closeCart.addEventListener('click', () => {
            if (cart) cart.classList.remove("active");
        });
    }

    // Search functionality
    const searchInput = document.querySelector('#search-bar');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            const products = document.querySelectorAll('#products_dev .product');
            
            products.forEach(product => {
                const productTitle = product.querySelector('h3').textContent.toLowerCase().trim();
                product.style.display = productTitle.includes(searchTerm) ? '' : 'none';
            });
        });
    }

//To Display Login User name 
let logOut = document.querySelector(".logout");
let welcome = document.querySelector(".welcomeName");
if(currentUser){
    welcome.innerHTML =`welcome, ${currentUser.userName} !`;
    document.querySelector(".loging-signup").style.display= "none";
}else{
    logOut.style.display= "none"
}
//log out
logOut.addEventListener("click", function () {
    localStorage.removeItem("currentUser");
    window.location.href = "/public/index.html";
});


//save cart products in local storage 
let checkoutButton = document.querySelector(".btn_cart");


checkoutButton.addEventListener('click', ()=>{
    localStorage.setItem('storageCart', JSON.stringify(productCart)); //adding to local storage
    // savedCartProducts = localStorage.getItem('storageCart');
})


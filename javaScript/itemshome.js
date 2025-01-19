//displaying the products on sale 
fetch("http://localhost:3000/products")
.then(response => response.json())
    .then(data =>{
        const items_sale = document.getElementById("items_sale");
        allProducts = data;
        data.forEach(product => {
            if(product.old_price && product.status == "approved"){      //added product status
                const old_price_p =  `<p class="old_price">${product.old_price}$</p>`;
                const percentage_disc = Math.floor((product.old_price-product.price)/(product.old_price)*100);
                const discountP = `<span class="sale_percent">${percentage_disc}% off</span>`;
                items_sale.innerHTML +=`
                <div class="product">
                <div class="icons">
                <span><i onclick="addToCart('${product.id}', this)" class="fa-solid fa-cart-plus"></i></span>
                <span><i class="fa-solid fa-heart"></i></span>
                <span><i class="fa-solid fa-share-from-square"></i></span>
                </div>
                ${discountP}
                <div class="img_product">
                    <img src="${product.img}" alt="">
                    <img class="img_hover" src="${product.img_hover}" alt="">
                </div>
                <h3 class="name_product">
                    <a href="#">${product.name} </a>
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
                    ${old_price_p}
                </div>
            </div>`}});})

window.addEventListener('DOMContentLoaded', () => {
    const savedCart = localStorage.getItem('storageCart');//text values
    
    if (savedCart) {
        const checkoutCart = JSON.parse(savedCart);//array
        displayCartItems(checkoutCart);
    } else {
        console.log('No products in cart localStorage.');
    }
});

// displaying the product data 
let totalPrice =0;
function displayCartItems(cartItems) {  
    cartItems.forEach(item => {
        totalPrice += +`${item.price}`
        document.querySelector(".cart-items").innerHTML += `
        <div class="cart-item">
        <img src="${item.img}" alt="Product" class="cart-item-image">
        <div class="cart-item-details">
            <h3 class="cart-item-name">${item.name}</h3>
            <p class="cart-item-price">$${item.price}</p>
        </div>
        </div>
                `});
    document.querySelector(".total-price").textContent = `$${totalPrice + 10}`
    document.querySelector(".subTotal").textContent = `$${totalPrice}`
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

async function sendOrder (orderData){
    try{
        const response = await fetch("http://localhost:3000/orders", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
    }catch(error){
        console.error('Error Making The Order:', error);
    }

}



async function sendOrder(order) {
    try {
        const response = await fetch('http://localhost:3000/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(order),
        });

        if (response.ok) {
            console.log(`Order ${order.id} sent successfully.`);
        } else {
            console.error(`Failed to send order ${order.id}:`, response.statusText);
        }
    } catch (error) {
        console.error(`Error sending order ${order.id}:`, error);
    }
}


const savedCart = localStorage.getItem('storageCart');//text values
const ordersArray = JSON.parse(savedCart);  //array

//initialize the orders
document.querySelector(".checkout-btn").addEventListener('click',async ()=>{
    // const orders = {
    //     id: 
    //     productId: order.id
    //     sellerId:
    //     customer: currentUser.userName,
    //     totalAmount:
    //     status: "pending",
    //     orderDate:  
    // }
    //SweetAlert
    Swal.fire({
        title: "Your Order Done!",
        icon: "success"
      });

    sendOrder (orderData)
})

// order
// "id": "5O",
// "productId": "4P",
// "sellerId": "2",
// "customer": "Abdallah.Hassan",
// "totalAmount": 99.99,
// "status": "pending",
// "orderDate": "2025-01-15T10:00:00Z"
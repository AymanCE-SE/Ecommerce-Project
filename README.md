# AliPaPa E-Commerce Platform

A native JavaScript e-commerce platform for buying and selling products, featuring customer, seller, and admin dashboards. No frameworks required—just HTML, CSS, and vanilla JS.

## Features

- **Customer**
  - Browse all products with search and filtering
  - Add products to cart and checkout
  - User registration and login
  - Profile management
  - Order history

- **Seller**
  - Seller dashboard for managing products and orders
  - Add, edit, and delete products
  - View orders for their products

- **Admin**
  - Admin dashboard for managing users, products, and orders
  - Approve/reject products
  - Add/edit/delete users and products

- **General**
  - Responsive design
  - Persistent cart using localStorage
  - RESTful API calls to a local server (e.g., [json-server](https://github.com/typicode/json-server))
  - SweetAlert for notifications

## Project Structure

```
ecommerce-platform/
├── javaScript/
│   ├── adminDashboard.js
│   ├── all_products.js
│   ├── auth.js
│   ├── checkout.js
│   ├── itemshome.js
│   ├── login.js
│   ├── main.js
│   ├── register.js
│   └── seller.js
├── public/
│   ├── Admin/
│   │   └── adminDashboard.html
│   ├── Seller/
│   │   └── seller.html
│   ├── checkout/
│   │   └── checkout.html
│   ├── login/
│   │   └── login.html
│   ├── register/
│   │   └── register.html
│   ├── all_products.html
│   ├── index.html
│   └── styles.css
└── db.json (for json-server)
```

## Installation & Running

### 1. Clone the repository

```sh
git clone <your-repo-url>
cd ecommerce-platform
```

### 2. Install dependencies

No Node.js dependencies are required for the frontend.  
For the backend, install [json-server](https://github.com/typicode/json-server):

```sh
npm install -g json-server
```

### 3. Setup the database

Create a `db.json` file in the root directory with initial data for `users`, `products`, and `orders`.  
Example:

```json
{
  "users": [],
  "products": [],
  "orders": []
}
```

### 4. Start the backend server

```sh
json-server --watch db.json --port 3000
```

### 5. Run the frontend

Open `public/index.html` in your browser.  
You can also use a simple static server (like [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VS Code).

## Usage

- Register as a new user or login as an existing user.
- Browse products, add to cart, and proceed to checkout.
- Sellers can manage their products and view orders.
- Admins can manage users, products, and orders from the admin dashboard.

## Notes

- All data is stored in `db.json` via json-server.
- Authentication is handled on the frontend using localStorage.
- For demo/testing, you can pre-populate `db.json` with sample users and products.

---

**Enjoy using AliPaPa E-Commerce Platform!**
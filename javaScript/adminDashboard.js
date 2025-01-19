/** @format */

// State management for local data
let localUsers = [];
let localProducts = [];
let localOrders = [];
let allJsonUsers = [];

// Navigation
document.addEventListener("DOMContentLoaded", () => {
  // Navigate initialize and event on click
  document.querySelectorAll(".nav_item").forEach((item) => {
    item.addEventListener("click", () => {
      //remove class active of nav_item and section
      document
        .querySelectorAll(".nav_item")
        .forEach((i) => i.classList.remove("active"));
      document
        .querySelectorAll(".section")
        .forEach((s) => s.classList.remove("active"));
      //add active to clicked item and data section related to it
      item.classList.add("active");
      document.getElementById(item.dataset.section).classList.add("active");
    });
  });
});

// Fetch and display data
async function fetchData() {
  // async to return promise
  try {
    const [users, products, orders] = await Promise.all([
      fetch("http://localhost:3000/users").then((res) => res.json()),
      fetch("http://localhost:3000/products").then((res) => res.json()),
      fetch("http://localhost:3000/orders").then((res) => res.json()),
    ]);

    // Filter out users with status 'deleted'
    localUsers = users.filter((user) => {
      return user.status !== "deleted"; // Exclude deleted users
    });
    allJsonUsers = users;

    // Update local state for products and orders
    localProducts = products;
    localOrders = orders;

    // Update the tables
    updateDashboardStats();
    updateUsersTable();
    updateProductsTable();
    updateOrdersTable();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Dashboard Stats
function updateDashboardStats() {
  document.getElementById("totalUsers").textContent = localUsers.length;
  document.getElementById("totalProducts").textContent = localProducts.length;
  document.getElementById("totalOrders").textContent = localOrders.length;
  localProducts.filter((p) => p.status === "pending").length;
}

//update Users Table
function updateUsersTable() {
  let usersTable = document.querySelector("#usersTable tbody");
  usersTable.innerHTML += localUsers
    .map(
      (user) => `
    <tr>
        <td>${user.id}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td class="action-buttons">
            <button class="btn btn-primary" onclick="showEditUserModel('${user.id}')">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-danger" onclick="confirmDeleteUser('${user.id}')">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    </tr>
`
    )
    .join("");
}

// update Products Table
function updateProductsTable() {
  let productTable = document.querySelector("#productsTable tbody");
  productTable.innerHTML += localProducts
    .map(
      (product) => `
        <tr>
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.price}$</td>
        <td><span class="badge badge-${product.status}">${product.status}</span></td>
        <td class="action-buttons">
            <button class="btn btn-primary" onclick="showEditProductModel('${product.id}')">
                <i id="edit" class="fas fa-edit"></i>
            </button>
            <button class="btn btn-danger" onclick="confirmDeleteProduct('${product.id}')">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    </tr>
    `
    )
    .join("");
}

// update Orders Table
function updateOrdersTable() {
  let orderTable = document.querySelector("#ordersTable tbody");
  orderTable.innerHTML += localOrders
    .map(
      (order) =>
        `
    <tr>
    <td>${order.id}</td>
    <td>${order.productId}</td>
    <td>${order.customer}</td>
    <td>${order.sellerId}</td>
    <td>${order.totalAmount}$</td>
    <td><span class="badge badge-${order.status}">${order.status}</span></td>
    <td class="action-buttons">
        <button class="btn btn-primary" onclick="viewOrderDetails('${
          order.id
        }')">
            <i class="fas fa-eye"></i>
        </button>
        <select onchange="updateOrderStatus('${
          order.id
        }', this.value)" class="form-control">
            <option value="pending" ${
              order.status === "pending" ? "selected" : ""
            }>Pending</option>
            <option value="processing" ${
              order.status === "processing" ? "selected" : ""
            }>Processing</option>
            <option value="completed" ${
              order.status === "completed" ? "selected" : ""
            }>Completed</option>
            <option value="cancelled" ${
              order.status === "cancelled" ? "selected" : ""
            }>Cancelled</option>
        </select>
    </td>
</tr>`
    )
    .join("");
}

// Initialize search
const searchInput = document.querySelector('.search_bar input[type="text"]'); //search bar
searchInput.addEventListener("input", (e) => {
  //Triggered when the user types in an input field with e value
  const searchTerm = e.target.value.toLowerCase().trim();
  const activeSection = document.querySelector(".section.active");
  const tableBody = activeSection.querySelector("tbody");
  const rows = tableBody.getElementsByTagName("tr");

  Array.from(rows).forEach((row) => {
    //to convert HTMLCollection To array
    const text = row.textContent.toLowerCase().trim();
    row.style.display = text.includes(searchTerm) ? "" : "none";
  });
});

//#region user
//#################################### Users ####################################//
// show add user, product model by add button
// let model = document.querySelectorAll(".model");
let userAddModel = document.getElementById("addUserModel"); //user model
let productAddModel = document.getElementById("addProductModel"); //product model
let addBtn = document.querySelectorAll(".section_header .btn");
let addUserBtn = addBtn[0]; //add user btn
let addProductBtn = addBtn[1]; //add product button
addUserBtn.addEventListener(
  "click",
  () => (userAddModel.style.display = "block")
);
addProductBtn.addEventListener(
  "click",
  () => (productAddModel.style.display = "block")
);

// close user model by close icon
let close = document.querySelectorAll(".close");
let closeAddModel = close[0]; //add user close
let closeUserEditModel = close[1]; //edit user close
let closeProductModel = close[2]; //add product close
let closeProductEditModel = close[3]; //edit user close
closeAddModel.addEventListener(
  "click",
  () => (userAddModel.style.display = "none")
);
closeUserEditModel.addEventListener(
  "click",
  () => (editUserModel.style.display = "none")
);
closeProductModel.addEventListener(
  "click",
  () => (productAddModel.style.display = "none")
);
closeProductEditModel.addEventListener(
  "click",
  () => (editProductModel.style.display = "none")
);

//Validations
// username validation
function isUserNameUnique(usernameToCheck) {
  // Normalize the username for comparison
  const normalizedUsername = usernameToCheck.trim().toLowerCase();
  // Extract and normalize all usernames from the user data
  const user_Names = allJsonUsers.map((item) =>
    item.username.trim().toLowerCase()
  );
  // console.log(allJsonUsers)
  // Check if the username already exists
  return !user_Names.includes(normalizedUsername); //true || false
}

// email validation
function isEmailUnique(emailToCheck) {
  // Normalize the email for comparison
  const normalizedEmail = emailToCheck.toLowerCase();
  // Extract and normalize all emails from the user data
  const existedEmails = allJsonUsers.map((item) =>
    item.email.trim().toLowerCase()
  );
  // Check if the email already exists
  return !existedEmails.includes(normalizedEmail); //true || false
}

//manage sending add user data to json
async function addUser(userData) {
  try {
    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      await fetchData();
    }
  } catch (error) {
    console.error("Error adding user:", error);
    updateUsersTable();
    updateDashboardStats();
  }
  document.getElementById("addUserModel").style.display = "none";
}

// Initialize Model handlers
document.getElementById("addUserForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const userData = {
    username: formData.get("username"),
    email: formData.get("email"),
    role: formData.get("role"),
    id:
      (allJsonUsers.length + 1).toString() +
      formData.get("username").slice(0, 2),
    status: "active",
    password: "123456",
    createdAt: new Date().toISOString(),
  };
  if (!isEmailUnique(formData.get("email"))) {
    alert("Email is already in use.");
  } else if (!isUserNameUnique(formData.get("username"))) {
    alert("Username is already taken.");
  } else {
    await addUser(userData);
    e.target.reset();
  }
});

//add delete status to the user "DELETE"
async function confirmDeleteUser(userId) {
  if (confirm("Are you sure you want to delete this user?")) {
    try {
      // Find the existing user data  //step1
      const existingUser = localUsers.find((user) => user.id === userId);
      if (!existingUser) {
        throw new Error("User not found");
      }
      if (existingUser.role == "admin") {
        alert("you can't delete Admin");
        return;
      }
      // Create updated user data with deleted status //step2
      const updatedUserData = {
        ...existingUser,
        status: "deleted",
      };

      // Send PATCH request to update user status //step3
      const response = await fetch(`http://localhost:3000/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUserData),
      });
      if (response.ok) {
        await fetchData();
      } else {
        throw new Error("Failed to update user status");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  }
}

//edit btn call the function by onclick
//=>fetch=>check on user by it's id and get the data to input fields
async function showEditUserModel(userId) {
  try {
    let user;
    const response = await fetch(`http://localhost:3000/users/${userId}`);
    user = await response.json();

    //take the existing data of user and add to input fields
    if (user) {
      const model = document.getElementById("editUserModel"); //select the edit model
      model.setAttribute("data-user-id", userId); //add custom attribute"data" to the userModel to dectect
      //adding the current data to edit
      document.querySelector('#editUserModel [name="username"]').value =
        user.username;
      document.querySelector('#editUserModel [name="email"]').value =
        user.email;
      document.querySelector('#editUserModel [name="role"]').value = user.role;
      model.style.display = "block";
    }
    if (user.role == "admin") {
      alert("You Can't Edit Admin!");
      editUserModel.style.display = "none";
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  }
}

// Add event listener on submit for edit user form
document
  .getElementById("editUserForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    //to get the targetted user id by closest parent with class model
    const userId = e.target.closest(".model").getAttribute("data-user-id"); //nearest element in parent model

    const formData = new FormData(e.target);
    const userData = {
      username: formData.get("username"),
      email: formData.get("email"),
      role: formData.get("role"),
    };
    try {
      const response = await fetch(`http://localhost:3000/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        await fetchData(); // Refresh data from server
        document.getElementById("editUserModel").style.display = "none";
      }
    } catch (error) {
      console.error("Error updating user:", error);
      updateUsersTable();
      updateDashboardStats();
      document.getElementById("editUserModel").style.display = "none";
    }
  });

  //#region Product
//#################################### Products ####################################//
// Adding Product
//manage sending add user data to json
async function addProduct(productData) {
  try {
    const response = await fetch("http://localhost:3000/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });

    if (response.ok) {
      await fetchData();
    }
  } catch (error) {
    console.error("Error adding product:", error);
  }
  updateProductsTable();
  updateDashboardStats();
  document.getElementById("addProductModel").style.display = "none";
}

// Initialize Model handlers on submit
document
  .getElementById("addProductForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productData = {
      name: formData.get("name"),
      description: formData.get("description"),
      sellerId: "AliPaPa",
      img: formData.get("img"),
      img_hover: formData.get("img_hover"),
      id: (localProducts.length + 1).toString() + "P",
      status: formData.get("status"),
      price: +formData.get("price"),
      createdAt: new Date().toISOString(),
    };
    const oldPrice = formData.get("old_price");
    if (oldPrice) {
      //check if there old price for discount processing
      productData.old_price = +oldPrice;
    }
    await addProduct(productData);
    e.target.reset();
  });

// delete Product "DELETE"
async function confirmDeleteProduct(productId) {
  if (confirm("Are you sure you want to DELETE this Product?")) {
    try {
      // Find the existing Product data
      const existingProduct = localProducts.find(
        (product) => product.id === productId
      );
      if (!existingProduct) {
        throw new Error("Product not found");
      }

      // Send DELETE request to the Product
      const response = await fetch(
        `http://localhost:3000/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        await fetchData();
      } else {
        throw new Error("Failed to DELETE Product ");
      }
    } catch (error) {
      console.error("Error DELETEING Product:", error);
    }
  }
}

//Show Edit Product Model and add the current data
async function showEditProductModel(productId) {
  try {
    let product;
    const response = await fetch(`http://localhost:3000/products/${productId}`);
    product = await response.json();

    //take the existing data of user and add to input fields
    if (product) {
      const model = document.getElementById("editProductModel"); //select the edit model
      model.setAttribute("data-product-id", productId); //add custom attribute"data" to the product Model to dectect
      //adding the current data to edit
      document.querySelector('#editProductModel [name="name"]').value =
        product.name;
      document.querySelector('#editProductModel [name="status"]').value =
        product.status;
      document.querySelector('#editProductModel [name="price"]').value =
        product.price;
      document.querySelector('#editProductModel [name="old_price"]').value =
        product.old_price;
      document.querySelector('#editProductModel [name="description"]').value =
        product.description;
      model.style.display = "block";
    }
  } catch (error) {
    console.error("Error fetching Product:", error);
  }
}

// Add event listener on submit for edit form
document
  .getElementById("editProductForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    //to get the targetted product id by closest parent with class model
    const productId = e.target
      .closest(".model")
      .getAttribute("data-product-id");

    const formData = new FormData(e.target);
    const productData = {
      name: formData.get("name"),
      status: formData.get("status"),
      description: formData.get("description"),
      price: formData.get("price"),
    };

    const oldPrice = formData.get("old_price");

    if (oldPrice) {
      //check if there old price for discount processing
      productData.old_price = +oldPrice;
    }

    const mainImage = formData.get("img");
    const secondaryImage = formData.get("img_hover");

    // if(mainImage && secondaryImage){
    //     productData.img = mainImage;
    //     productData.img_hover = secondaryImage;
    // }
    try {
      const response = await fetch(
        `http://localhost:3000/products/${productId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        }
      );

      if (response.ok) {
        await fetchData(); // Refresh data from server
        document.getElementById("editProductModel").style.display = "none";
      }
    } catch (error) {
      console.error("Error updating product:", error);
      updateProductsTable();
      updateDashboardStats();
      document.getElementById("editProductModel").style.display = "none";
    }
  });

addEventListener("load", fetchData());

   // Navigation sidebar
    document.querySelectorAll('.nav_item').forEach(item => {
    item.addEventListener('click', () => {
    document.querySelectorAll('.nav_item').forEach(i => i.classList.remove('active'));
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    item.classList.add('active');
    document.getElementById(item.dataset.section).classList.add('active');});
            });
    //search functionality
    const searchInput = document.querySelector('.search_bar input[type="text"]'); //search bar
    searchInput.addEventListener('input', (e) => {    //Triggered when the user types in an input field with e value
    const searchTerm = e.target.value.toLowerCase().trim();
    const activeSection = document.querySelector('.section.active');
    const tableBody = activeSection.querySelector('tbody');
    const rows = tableBody.getElementsByTagName('tr');
    Array.from(rows).forEach(row => {               //to convert HTMLCollection To array
    const text = row.textContent.toLowerCase().trim();
    row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
        });
    // navigation open and close buttons
        function setupModels() {
        const productAddModel = document.getElementById("addProductModel");
        const addProductBtn = document.querySelector(".section_header .btn");
        const closeButtons = document.querySelectorAll("#close");
        
        addProductBtn.addEventListener('click', () => productAddModel.style.display = "block");
        
        closeButtons.forEach((button, index) => {
            const model = index === 0 ? productAddModel : document.getElementById("editProductModel");
            button.addEventListener('click', () => model.style.display = "none");
        });
    }
    
class Seller {
    constructor(id) {
        this.id = id;
        this.products = [];
        this.orders = [];
        this.initialize();
    }

    initialize() {
        // Initialize event listeners once DOM is loaded
        if (document.readyState === 'loading') {        // content not fully loaded yet
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            this.setupEventListeners(); //excute when the page full loaded
        }
    }
    // to add the forms of add and edit, prepare the page
    setupEventListeners() {
        document.getElementById('addProductForm')?.addEventListener('submit', (e) => this.handleAddProduct(e));
        document.getElementById('editProductForm')?.addEventListener('submit', (e) => this.handleEditProduct(e));
        this.fetchData();
    }

    async handleAddProduct(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const productData = {
            name: formData.get('name'),
            description: formData.get('description'),
            img: formData.get('img'),
            img_hover: formData.get('img_hover'),
            status: 'pending',
            sellerId: this.id,
            price: +formData.get('price'),
            createdAt: new Date().toISOString()
        };
        
        const oldPrice = formData.get('old_price');
        if (oldPrice) {
            productData.old_price = +oldPrice;
        }
        await this.addProduct(productData);
        e.target.reset();
    }

    async addProduct(productData) {
        try {
            const response = await fetch('http://localhost:3000/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
            
            if (response.ok) {
                await this.fetchData();
                document.getElementById('addProductModel').style.display = 'none';
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    }

    async showEditProductModel(productId) {
        try {
            const response = await fetch(`http://localhost:3000/products/${productId}`);
            const product = await response.json();
            
            if (product) {
                const model = document.getElementById('editProductModel');
                model.setAttribute('data-product-id', productId);
                
                document.querySelector('#editProductModel [name="name"]').value = product.name;
                document.querySelector('#editProductModel [name="status"]').value = product.status;
                document.querySelector('#editProductModel [name="price"]').value = product.price;
                document.querySelector('#editProductModel [name="old_price"]').value = product.old_price;
                document.querySelector('#editProductModel [name="description"]').value = product.description;
                
                model.style.display = 'block';
            }
        } catch (error) {
            console.error('Error fetching Product:', error);
        }
    }

    async handleEditProduct(e) {
        e.preventDefault();
        const productId = e.target.closest('.model').getAttribute('data-product-id');
        const formData = new FormData(e.target);
        
        const productData = {
            name: formData.get('name'),
            status: formData.get('status'),
            description: formData.get('description'),
            price: formData.get('price'),
        };

        const oldPrice = formData.get('old_price');
        if (oldPrice) {
            productData.old_price = +oldPrice;
        }

        const mainImage = formData.get('img');
        const secondaryImage = formData.get('img_hover');
        if (mainImage && secondaryImage) {
            productData.img = mainImage;
            productData.img_hover = secondaryImage;
        }

        await this.updateProduct(productId, productData);
    }

    async updateProduct(productId, productData) {
        try {
            const response = await fetch(`http://localhost:3000/products/${productId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
            
            if (response.ok) {
                await this.fetchData();
                document.getElementById('editProductModel').style.display = 'none';
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    }

    async confirmDeleteProduct(productId) {
        if (confirm('Are you sure you want to DELETE this Product?')) {
            try {
                const response = await fetch(`http://localhost:3000/products/${productId}`, {
                    method: 'DELETE'
                });
                
                if (!response.ok) {
                    throw new Error('Failed to delete product');
                }
                
                await this.fetchData();
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Failed to delete product. Please try again.');
            }
        }
    }

    // fetching all data
    async fetchData() {
        try {
            const [productsResponse, ordersResponse, targetSeller] = await Promise.all([
                fetch('http://localhost:3000/products'),
                fetch('http://localhost:3000/orders'),
                fetch('http://localhost:3000/users')
            ]);

            const [productsData, ordersData, allUsers] = await Promise.all([
                productsResponse.json(),
                ordersResponse.json(),
                targetSeller.json()
            ]);

            const sellersUser = allUsers.filter(user => user.role === 'seller');
            
            if (!sellersUser.some(user => user.id === this.id)) {
                console.error(`Seller with ID ${this.id} not found!`);
                return;
            }

            this.products = productsData.filter(product => product.sellerId === this.id);
            this.orders = ordersData.filter(order => 
                this.products.some(p => p.id === order.productId)
            );

            this.updateDashboardStats();
            this.renderProducts();
            this.renderOrders();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    updateDashboardStats() {
        document.getElementById('totalProducts').textContent = this.products.length;
        document.getElementById('totalOrders').textContent = this.orders.length;
        document.getElementById('pending_Shipments').textContent = 
            this.orders.filter(order => order.status === 'pending').length;
    }

    renderProducts() {
        const productsTableBody = document.querySelector('#productsTable tbody');
        productsTableBody.innerHTML = ''; // Clear existing content
        
        this.products.forEach(product => {
            const row = document.createElement('tr');
            
            const cells = [
                { text: product.id },
                { text: product.name },
                { text: `${product.price}$` },
                { html: `<span class="badge badge-${product.status}">${product.status}</span>` },
                { html: `
                    <div class="action-buttons">
                        <button class="btn btn-primary" onclick="seller.showEditProductModel('${product.id}')">
                            <i id="edit" class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger" onclick="seller.confirmDeleteProduct('${product.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `}
            ];
            
            cells.forEach(cell => {
                const td = document.createElement('td');
                if (cell.html) {
                    td.innerHTML = cell.html;
                } else {
                    td.textContent = cell.text;
                }
                row.appendChild(td);
            });
            
            productsTableBody.appendChild(row);
        });
    }

    renderOrders() {
        const ordersTableBody = document.querySelector('#ordersTable');
        ordersTableBody.innerHTML = ''; // Clear existing content
        
        this.orders.forEach(order => {
            const row = document.createElement('tr');
            
            const cells = [
                { text: order.id },
                { text: order.customer },             
                { text: this.username },
                { text: order.totalAmount },
                { text: order.status },
                { html: '<button class="btn btn_primary">View</button>' }
            ];
            
            cells.forEach(cell => {
                const td = document.createElement('td');
                if (cell.html) {
                    td.innerHTML = cell.html;
                } else {
                    td.textContent = cell.text;
                }
                row.appendChild(td);
            });
            
            ordersTableBody.appendChild(row);
        });
    }
}
console.log(currentUser.id)

//call seller instance
let seller;

document.addEventListener('DOMContentLoaded', () => {
    seller = new Seller(currentUser.id);
    setupModels()
});
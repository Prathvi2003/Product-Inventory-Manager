"use strict";
let products = [];
// HTML ELEMENTS
const productList = document.getElementById("productList");
const nameInput = document.getElementById("name");
const categoryInput = document.getElementById("category");
const priceInput = document.getElementById("price");
const quantityInput = document.getElementById("quantity");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("filterCategory");
const statusFilter = document.getElementById("filterStatus");
const modal = document.getElementById("productModal");
const resultCount = document.getElementById("resultCount");
const totalProducts = document.getElementById("totalProducts");
const totalValue = document.getElementById("totalValue");
const lowStock = document.getElementById("lowStock");
const outStock = document.getElementById("outStock");
const emptyState = document.getElementById("emptyState");
// MODAL
document
    .getElementById("openForm")
    .addEventListener("click", () => {
    modal.classList.add("show");
});
document
    .getElementById("closeForm")
    .addEventListener("click", closeModal);
document
    .getElementById("cancelForm")
    .addEventListener("click", closeModal);
function closeModal() {
    modal.classList.remove("show");
    clearForm();
}
// ADD PRODUCT
document
    .getElementById("addButton")
    .addEventListener("click", addProduct);
function addProduct() {
    const name = nameInput.value.trim();
    const category = categoryInput.value;
    const price = Number(priceInput.value);
    const quantity = Number(quantityInput.value);
    if (name === "" ||
        price <= 0 ||
        quantity < 0) {
        alert("Please enter valid product details.");
        return;
    }
    const product = {
        id: Date.now(),
        name: name,
        category: category,
        price: price,
        quantity: quantity
    };
    products.push(product);
    saveProducts();
    displayProducts();
    closeModal();
}
// CLEAR FORM
function clearForm() {
    nameInput.value = "";
    priceInput.value = "";
    quantityInput.value = "";
}
// DISPLAY PRODUCTS
function displayProducts() {
    productList.innerHTML = "";
    const searchText = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    const selectedStatus = statusFilter.value;
    const filtered = products.filter((product) => {
        const matchesSearch = product.name
            .toLowerCase()
            .includes(searchText);
        const matchesCategory = selectedCategory === "All" ||
            product.category === selectedCategory;
        const status = getStatus(product.quantity);
        const matchesStatus = selectedStatus === "All" ||
            status === selectedStatus;
        return (matchesSearch &&
            matchesCategory &&
            matchesStatus);
    });
    resultCount.textContent =
        filtered.length.toString();
    if (filtered.length === 0) {
        emptyState.style.display = "block";
    }
    else {
        emptyState.style.display = "none";
    }
    filtered.forEach((product) => {
        const row = document.createElement("tr");
        const status = getStatus(product.quantity);
        let statusClass;
        if (status === "In Stock") {
            statusClass = "status-in";
        }
        else if (status === "Low Stock") {
            statusClass = "status-low";
        }
        else {
            statusClass = "status-out";
        }
        row.innerHTML = `

                <td>
                    <span class="product-name">
                        ${product.name}
                    </span>
                </td>

                <td>
                    <span class="category-badge">
                        ${product.category}
                    </span>
                </td>

                <td>
                    ₹${product.price.toLocaleString("en-IN")}
                </td>

                <td>
                    ${product.quantity}
                </td>

                <td>
                    <span class="status ${statusClass}">
                        ${status}
                    </span>
                </td>

                <td>

                    <button
                        class="action-btn"
                        onclick="editProduct(${product.id})">
                        ✎
                    </button>

                    <button
                        class="action-btn delete-btn"
                        onclick="deleteProduct(${product.id})">
                        🗑
                    </button>

                </td>

            `;
        productList.appendChild(row);
    });
    updateDashboard();
}
// STOCK STATUS
function getStatus(quantity) {
    if (quantity === 0) {
        return "Out of Stock";
    }
    if (quantity <= 5) {
        return "Low Stock";
    }
    return "In Stock";
}
// DASHBOARD
function updateDashboard() {
    let value = 0;
    let low = 0;
    let out = 0;
    products.forEach((product) => {
        value +=
            product.price *
                product.quantity;
        if (product.quantity === 0) {
            out++;
        }
        else if (product.quantity <= 5) {
            low++;
        }
    });
    totalProducts.textContent =
        products.length.toString();
    totalValue.textContent =
        value.toLocaleString("en-IN");
    lowStock.textContent =
        low.toString();
    outStock.textContent =
        out.toString();
}
// DELETE
function deleteProduct(id) {
    const confirmDelete = confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) {
        return;
    }
    products =
        products.filter((product) => product.id !== id);
    saveProducts();
    displayProducts();
}
// EDIT
function editProduct(id) {
    const product = products.find((item) => item.id === id);
    if (!product) {
        return;
    }
    const name = prompt("Product Name:", product.name) || product.name;
    const price = Number(prompt("Price:", product.price.toString()));
    const quantity = Number(prompt("Quantity:", product.quantity.toString()));
    if (price <= 0 ||
        quantity < 0) {
        alert("Invalid product details.");
        return;
    }
    product.name = name;
    product.price = price;
    product.quantity = quantity;
    saveProducts();
    displayProducts();
}
// SEARCH
searchInput.addEventListener("input", displayProducts);
categoryFilter.addEventListener("change", displayProducts);
statusFilter.addEventListener("change", displayProducts);
// LOCAL STORAGE
function saveProducts() {
    localStorage.setItem("smartstock_products", JSON.stringify(products));
}
function loadProducts() {
    const data = localStorage.getItem("smartstock_products");
    if (data) {
        products =
            JSON.parse(data);
    }
    displayProducts();
}
// START
loadProducts();

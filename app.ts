interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    quantity: number;
}

let products: Product[] = [];


// HTML ELEMENTS

const productList =
    document.getElementById("productList") as HTMLTableSectionElement;

const nameInput =
    document.getElementById("name") as HTMLInputElement;

const categoryInput =
    document.getElementById("category") as HTMLSelectElement;

const priceInput =
    document.getElementById("price") as HTMLInputElement;

const quantityInput =
    document.getElementById("quantity") as HTMLInputElement;

const searchInput =
    document.getElementById("search") as HTMLInputElement;

const categoryFilter =
    document.getElementById("filterCategory") as HTMLSelectElement;

const statusFilter =
    document.getElementById("filterStatus") as HTMLSelectElement;

const modal =
    document.getElementById("productModal") as HTMLElement;

const resultCount =
    document.getElementById("resultCount") as HTMLElement;

const totalProducts =
    document.getElementById("totalProducts") as HTMLElement;

const totalValue =
    document.getElementById("totalValue") as HTMLElement;

const lowStock =
    document.getElementById("lowStock") as HTMLElement;

const outStock =
    document.getElementById("outStock") as HTMLElement;

const emptyState =
    document.getElementById("emptyState") as HTMLElement;


// MODAL

document
    .getElementById("openForm")!
    .addEventListener("click", () => {

        modal.classList.add("show");

    });


document
    .getElementById("closeForm")!
    .addEventListener("click", closeModal);


document
    .getElementById("cancelForm")!
    .addEventListener("click", closeModal);


function closeModal(): void {

    modal.classList.remove("show");

    clearForm();
}


// ADD PRODUCT

document
    .getElementById("addButton")!
    .addEventListener("click", addProduct);


function addProduct(): void {

    const name: string =
        nameInput.value.trim();

    const category: string =
        categoryInput.value;

    const price: number =
        Number(priceInput.value);

    const quantity: number =
        Number(quantityInput.value);


    if (
        name === "" ||
        price <= 0 ||
        quantity < 0
    ) {

        alert("Please enter valid product details.");

        return;
    }


    const product: Product = {

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

function clearForm(): void {

    nameInput.value = "";

    priceInput.value = "";

    quantityInput.value = "";
}


// DISPLAY PRODUCTS

function displayProducts(): void {

    productList.innerHTML = "";

    const searchText: string =
        searchInput.value.toLowerCase();


    const selectedCategory: string =
        categoryFilter.value;


    const selectedStatus: string =
        statusFilter.value;


    const filtered: Product[] =
        products.filter((product: Product) => {


            const matchesSearch: boolean =
                product.name
                    .toLowerCase()
                    .includes(searchText);


            const matchesCategory: boolean =
                selectedCategory === "All" ||
                product.category === selectedCategory;


            const status: string =
                getStatus(product.quantity);


            const matchesStatus: boolean =
                selectedStatus === "All" ||
                status === selectedStatus;


            return (
                matchesSearch &&
                matchesCategory &&
                matchesStatus
            );

        });


    resultCount.textContent =
        filtered.length.toString();


    if (filtered.length === 0) {

        emptyState.style.display = "block";

    } else {

        emptyState.style.display = "none";

    }


    filtered.forEach(
        (product: Product) => {

            const row =
                document.createElement("tr");


            const status: string =
                getStatus(product.quantity);


            let statusClass: string;


            if (status === "In Stock") {

                statusClass = "status-in";

            } else if (status === "Low Stock") {

                statusClass = "status-low";

            } else {

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

function getStatus(quantity: number): string {

    if (quantity === 0) {

        return "Out of Stock";

    }

    if (quantity <= 5) {

        return "Low Stock";

    }

    return "In Stock";
}


// DASHBOARD

function updateDashboard(): void {

    let value: number = 0;

    let low: number = 0;

    let out: number = 0;


    products.forEach(
        (product: Product) => {

            value +=
                product.price *
                product.quantity;


            if (product.quantity === 0) {

                out++;

            } else if (product.quantity <= 5) {

                low++;

            }

        }
    );


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

function deleteProduct(id: number): void {

    const confirmDelete: boolean =
        confirm(
            "Are you sure you want to delete this product?"
        );


    if (!confirmDelete) {

        return;

    }


    products =
        products.filter(
            (product: Product) =>
                product.id !== id
        );


    saveProducts();

    displayProducts();

}


// EDIT

function editProduct(id: number): void {

    const product: Product | undefined =
        products.find(
            (item: Product) =>
                item.id === id
        );


    if (!product) {

        return;

    }


    const name: string =
        prompt(
            "Product Name:",
            product.name
        ) || product.name;


    const price: number =
        Number(
            prompt(
                "Price:",
                product.price.toString()
            )
        );


    const quantity: number =
        Number(
            prompt(
                "Quantity:",
                product.quantity.toString()
            )
        );


    if (
        price <= 0 ||
        quantity < 0
    ) {

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

searchInput.addEventListener(
    "input",
    displayProducts
);


categoryFilter.addEventListener(
    "change",
    displayProducts
);


statusFilter.addEventListener(
    "change",
    displayProducts
);


// LOCAL STORAGE

function saveProducts(): void {

    localStorage.setItem(
        "smartstock_products",
        JSON.stringify(products)
    );

}


function loadProducts(): void {

    const data: string | null =
        localStorage.getItem(
            "smartstock_products"
        );


    if (data) {

        products =
            JSON.parse(data) as Product[];

    }


    displayProducts();

}


// START

loadProducts();
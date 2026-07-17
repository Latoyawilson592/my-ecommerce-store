// Mock Product Database
const products = [
    { id: 1, name: "Minimalist Mechanical Keyboard", price: 129.00, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80" },
    { id: 2, name: "Ergonomic Wireless Mouse", price: 79.00, image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80" },
    { id: 3, name: "4K USB-C Desk Monitor", price: 349.00, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80" },
    { id: 4, name: "Premium Leather Desk Mat", price: 49.00, image: "https://images.unsplash.com/photo-1632292224971-0d45778bd364?w=500&q=80" }
];

// Feature: Persistent Cart initialization via LocalStorage
let cart = JSON.parse(localStorage.getItem('quickshop_cart')) || [];

// DOM Elements
const productGrid = document.getElementById('product-grid');
const cartDrawer = document.getElementById('cart-drawer');
const cartBtn = document.getElementById('cart-btn');
const closeCart = document.getElementById('close-cart');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');

// New Feature Elements
const searchInput = document.getElementById('search-input');
const checkoutModal = document.getElementById('checkout-modal');
const closeModalBtn = document.getElementById('close-modal-btn');

// 1. Display Products (Updated to support filtering)
function displayProducts(productsToRender = products) {
    if (productsToRender.length === 0) {
        productGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-gray-500 text-lg">No products match your search criteria.</p>
            </div>
        `;
        return;
    }

    productGrid.innerHTML = productsToRender.map(product => `
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden product-card flex flex-col">
            <div class="h-48 overflow-hidden bg-gray-100">
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
            </div>
            <div class="p-4 flex-grow flex flex-col justify-between">
                <div>
                    <h3 class="text-sm font-medium text-gray-900 mb-1">${product.name}</h3>
                    <p class="text-lg font-bold text-gray-900">$${product.price.toFixed(2)}</p>
                </div>
                <button onclick="addToCart(${product.id})" class="mt-4 w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold py-2 px-4 rounded transition-colors text-sm">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Feature: Real-time search filter logic
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm)
    );
    displayProducts(filtered);
});

// 2. Cart Management Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveAndUpdateCart();
    openCartDrawer();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveAndUpdateCart();
}

// Helper to save data state locally
function saveAndUpdateCart() {
    localStorage.setItem('quickshop_cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (totalItems > 0) {
        cartCount.textContent = totalItems;
        cartCount.classList.remove('hidden');
    } else {
        cartCount.classList.add('hidden');
    }

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="text-gray-500 text-center py-4">Your cart is empty.</p>`;
        cartTotal.textContent = "$0.00";
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="flex py-6">
            <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <img src="${item.image}" alt="${item.name}" class="h-full w-full object-cover object-center">
            </div>
            <div class="ml-4 flex flex-1 flex-col">
                <div>
                    <div class="flex justify-between text-base font-medium text-gray-900">
                        <h3>${item.name}</h3>
                        <p class="ml-4">$${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                </div>
                <div class="flex flex-1 items-end justify-between text-sm">
                    <p class="text-gray-500">Qty ${item.quantity}</p>
                    <button type="button" onclick="removeFromCart(${item.id})" class="font-medium text-indigo-600 hover:text-indigo-500">Remove</button>
                </div>
            </div>
        </div>
    `).join('');

    const totalSum = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${totalSum.toFixed(2)}`;
}

// Feature: Checkout workflow & clearing states
function handleCheckout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    closeCartDrawer();
    checkoutModal.classList.remove('hidden');
    
    // Clear cart entirely upon successful simulated payment
    cart = [];
    saveAndUpdateCart();
}

// Drawer & Modal UI Toggle Actions
function openCartDrawer() { cartDrawer.classList.remove('hidden'); }
function closeCartDrawer() { cartDrawer.classList.add('hidden'); }

cartBtn.addEventListener('click', openCartDrawer);
closeCart.addEventListener('click', closeCartDrawer);
cartOverlay.addEventListener('click', closeCartDrawer);
closeModalBtn.addEventListener('click', () => checkoutModal.classList.add('hidden'));

// Run functions on fresh page boot
displayProducts();
updateCartUI();

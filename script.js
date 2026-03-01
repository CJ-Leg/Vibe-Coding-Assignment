
// DOM Elements
const itemName = document.getElementById('itemName');
const itemQty = document.getElementById('itemQty');
const itemPrice = document.getElementById('itemPrice');
const addItemBtn = document.getElementById('addItemBtn');
const clearBtn = document.getElementById('clearBtn');
const inventoryList = document.getElementById('inventoryList');
const ctx = document.getElementById('inventoryChart').getContext('2d');

// Load inventory from localStorage
let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

// Initialize Chart.js
let inventoryChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: inventory.map(item => item.name),
        datasets: [{
            label: 'Total Value ($)',
            data: inventory.map(item => (item.quantity * item.price).toFixed(2)),
            backgroundColor: 'rgba(58, 95, 143, 0.7)',
            borderColor: 'rgba(58, 95, 143, 1)',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
    }
});

// Render inventory & update chart
function renderInventory() {
    inventoryList.innerHTML = '';
    inventory.forEach(item => {
        const li = document.createElement('li');
        const totalValue = (item.quantity * item.price).toFixed(2);
        li.textContent = `${item.name} - Qty: ${item.quantity}, Price: $${item.price.toFixed(2)}, Total: $${totalValue}`;
        inventoryList.appendChild(li);
    });
    updateChart();
}

// Update chart
function updateChart() {
    inventoryChart.data.labels = inventory.map(item => item.name);
    inventoryChart.data.datasets[0].data = inventory.map(item => (item.quantity * item.price).toFixed(2));
    inventoryChart.update();
}

// Add item with validation
addItemBtn.addEventListener('click', () => {
    const name = itemName.value.trim();
    const qty = itemQty.value.trim();
    const price = itemPrice.value.trim();

    if (!name || !qty || !price) return alert('All fields are required.');
    if (isNaN(qty) || isNaN(price) || Number(qty) <= 0 || Number(price) <= 0) return alert('Quantity and Price must be positive numbers.');
    if (inventory.find(item => item.name.toLowerCase() === name.toLowerCase())) return alert('Item already exists in inventory.');

    inventory.push({ name, quantity: Number(qty), price: Number(price) });
    localStorage.setItem('inventory', JSON.stringify(inventory));
    renderInventory();

    itemName.value = '';
    itemQty.value = '';
    itemPrice.value = '';
});

// Clear inventory
clearBtn.addEventListener('click', () => {
    if (inventory.length === 0) return alert('Inventory is already empty.');
    if (confirm('Are you sure you want to clear all inventory?')) {
        inventory = [];
        localStorage.removeItem('inventory');
        renderInventory();
    }
});

// Initial render
renderInventory();

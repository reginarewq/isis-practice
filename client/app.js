// ==================== ПОКУПАТЕЛИ ====================
async function loadCustomers() {
    const resp = await fetch(`${API}/customers`);
    const customers = await resp.json();
    const tbody = document.getElementById("customers-table");
    
    tbody.innerHTML = customers.map(c => `
        <tr>
            <td>${c.id}</td>
            <td>${c.last_name || '---'}</td>
            <td>${c.first_name || '---'}</td>
            <td>${c.phone || '---'}</td>
            <td>${c.email || '---'}</td>
            <td>${c.address || '---'}</td>
            <td>
                <button class='btn btn-delete' onclick='deleteCustomer(${c.id})'>🗑️</button>
            </td>
        </tr>
    `).join("");
}

function showCustomerForm() {
    document.getElementById("customer-form-panel").style.display = "block";
}

function hideCustomerForm() {
    document.getElementById("customer-form-panel").style.display = "none";
    document.getElementById("last_name").value = "";
    document.getElementById("first_name").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("email").value = "";
    document.getElementById("address").value = "";
}

async function saveCustomer() {
    const data = {
        last_name: document.getElementById("last_name").value,
        first_name: document.getElementById("first_name").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
        address: document.getElementById("address").value
    };
    
    await fetch(`${API}/customers`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    });
    hideCustomerForm();
    loadCustomers();
    loadStats();
}

async function deleteCustomer(id) {
    if (!confirm("Удалить покупателя?")) return;
    await fetch(`${API}/customers/${id}`, { method: "DELETE" });
    loadCustomers();
    loadStats();
}

// ==================== ВКЛАДКИ ====================
function showTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    document.getElementById('animals-tab').style.display = 'none';
    document.getElementById('feeds-tab').style.display = 'none';
    document.getElementById('products-tab').style.display = 'none';
    document.getElementById('vaccinations-tab').style.display = 'none';
    document.getElementById('customers-tab').style.display = 'none';
    
    document.getElementById(`${tabName}-tab`).style.display = 'block';
    
    if (tabName === 'animals') loadAnimals();
    if (tabName === 'feeds') loadFeeds();
    if (tabName === 'products') loadProducts();
    if (tabName === 'vaccinations') loadVaccinations();
    if (tabName === 'customers') loadCustomers();
}

// ==================== СТАТИСТИКА ====================
async function loadStats() {
    try {
        const animalsResp = await fetch(`${API}/animals`);
        const animals = await animalsResp.json();
        const productsResp = await fetch(`${API}/products`);
        const products = await productsResp.json();
        const customersResp = await fetch(`${API}/customers`);
        const customers = await customersResp.json();
        
        document.getElementById('stats').innerHTML = `
            📊 <span>${animals.length}</span> животных | 
            🥛 <span>${products.length}</span> записей продукции |
            👥 <span>${customers.length}</span> покупателей
        `;
    } catch(e) {
        document.getElementById('stats').innerHTML = '📊 Статистика недоступна';
    }
}

// ==================== ЖИВОТНЫЕ ====================
const API = "http://localhost:5000/api";
let editingAnimalId = null;
let editingFeedId = null;
let editingProductId = null;
let editingVaccinationId = null;

async function loadAnimals() {
    const resp = await fetch(`${API}/animals`);
    const animals = await resp.json();
    const tbody = document.getElementById("animals-table");
    
    tbody.innerHTML = animals.map(a => `
        <tr>
            <td>${a.id}</td>
            <td>${a.tag_number || '---'}</td>
            <td>${a.name || '---'}</td>
            <td>${a.animal_type || '---'}</td>
            <td>${a.breed || '---'}</td>
            <td>${a.birth_date || '---'}</td>
            <td>${a.gender || '---'}</td>
            <td>
                <button class='btn btn-edit' onclick='editAnimal(${a.id})'>✏️</button>
                <button class='btn btn-delete' onclick='deleteAnimal(${a.id})'>🗑️</button>
            </td>
        </tr>
    `).join("");
    loadStats();
}

function showAnimalForm() {
    document.getElementById("animal-form-panel").style.display = "block";
    document.getElementById("animal-form-title").textContent = 
        editingAnimalId ? "✏️ Редактирование животного" : "🐮 Новое животное";
}

function hideAnimalForm() {
    document.getElementById("animal-form-panel").style.display = "none";
    editingAnimalId = null;
    document.getElementById("tag_number").value = "";
    document.getElementById("name").value = "";
    document.getElementById("animal_type").value = "корова";
    document.getElementById("breed").value = "";
    document.getElementById("birth_date").value = "";
    document.getElementById("gender").value = "самка";
}

async function saveAnimal() {
    const data = {
        tag_number: document.getElementById("tag_number").value,
        name: document.getElementById("name").value,
        animal_type: document.getElementById("animal_type").value,
        breed: document.getElementById("breed").value,
        birth_date: document.getElementById("birth_date").value,
        gender: document.getElementById("gender").value
    };
    
    const url = editingAnimalId ? `${API}/animals/${editingAnimalId}` : `${API}/animals`;
    const method = editingAnimalId ? "PUT" : "POST";
    
    await fetch(url, {
        method, headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    });
    hideAnimalForm();
    loadAnimals();
}

async function editAnimal(id) {
    const resp = await fetch(`${API}/animals/${id}`);
    const a = await resp.json();
    document.getElementById("tag_number").value = a.tag_number || "";
    document.getElementById("name").value = a.name || "";
    document.getElementById("animal_type").value = a.animal_type || "корова";
    document.getElementById("breed").value = a.breed || "";
    document.getElementById("birth_date").value = a.birth_date || "";
    document.getElementById("gender").value = a.gender || "самка";
    editingAnimalId = id;
    showAnimalForm();
}

async function deleteAnimal(id) {
    if (!confirm("Удалить животное?")) return;
    await fetch(`${API}/animals/${id}`, { method: "DELETE" });
    loadAnimals();
}

// ==================== КОРМА ====================
async function loadFeeds() {
    const resp = await fetch(`${API}/feeds`);
    const feeds = await resp.json();
    const tbody = document.getElementById("feeds-table");
    
    tbody.innerHTML = feeds.map(f => `
        <tr>
            <td>${f.id}</td>
            <td>${f.name || '---'}</td>
            <td>${f.feed_type || '---'}</td>
            <td>${f.unit || '---'}</td>
            <td>${f.stock_quantity || 0} ${f.unit || ''}</td>
            <td>
                <button class='btn btn-edit' onclick='editFeed(${f.id})'>✏️</button>
                <button class='btn btn-delete' onclick='deleteFeed(${f.id})'>🗑️</button>
            </td>
        </tr>
    `).join("");
}

function showFeedForm() {
    document.getElementById("feed-form-panel").style.display = "block";
}

function hideFeedForm() {
    document.getElementById("feed-form-panel").style.display = "none";
    editingFeedId = null;
    document.getElementById("feed_name").value = "";
    document.getElementById("feed_type").value = "сухой";
    document.getElementById("unit").value = "кг";
    document.getElementById("stock_quantity").value = "";
}

async function saveFeed() {
    const data = {
        name: document.getElementById("feed_name").value,
        feed_type: document.getElementById("feed_type").value,
        unit: document.getElementById("unit").value,
        stock_quantity: parseFloat(document.getElementById("stock_quantity").value)
    };
    
    const url = editingFeedId ? `${API}/feeds/${editingFeedId}` : `${API}/feeds`;
    const method = editingFeedId ? "PUT" : "POST";
    
    await fetch(url, {
        method, headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    });
    hideFeedForm();
    loadFeeds();
}

async function editFeed(id) {
    const resp = await fetch(`${API}/feeds/${id}`);
    const f = await resp.json();
    document.getElementById("feed_name").value = f.name || "";
    document.getElementById("feed_type").value = f.feed_type || "сухой";
    document.getElementById("unit").value = f.unit || "кг";
    document.getElementById("stock_quantity").value = f.stock_quantity || "";
    editingFeedId = id;
    showFeedForm();
}

async function deleteFeed(id) {
    if (!confirm("Удалить корм?")) return;
    await fetch(`${API}/feeds/${id}`, { method: "DELETE" });
    loadFeeds();
}

// ==================== ПРОДУКЦИЯ ====================
async function loadProducts() {
    const resp = await fetch(`${API}/products`);
    const products = await resp.json();
    const tbody = document.getElementById("products-table");
    
    tbody.innerHTML = products.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.animal_name || p.animal_id}</td>
            <td>${p.product_type || '---'}</td>
            <td>${p.quantity || 0}</td>
            <td>${p.production_date || '---'}</td>
            <td>
                <button class='btn btn-delete' onclick='deleteProduct(${p.id})'>🗑️</button>
            </td>
        </tr>
    `).join("");
}

async function loadAnimalsSelect() {
    const resp = await fetch(`${API}/animals`);
    const animals = await resp.json();
    const select = document.getElementById("product_animal_id");
    select.innerHTML = animals.map(a => 
        `<option value="${a.id}">${a.name || a.tag_number} (${a.animal_type})</option>`
    ).join("");
}

function showProductForm() {
    loadAnimalsSelect();
    document.getElementById("product-form-panel").style.display = "block";
    document.getElementById("production_date").valueAsDate = new Date();
}

function hideProductForm() {
    document.getElementById("product-form-panel").style.display = "none";
    document.getElementById("product_type").value = "молоко";
    document.getElementById("product_quantity").value = "";
    document.getElementById("production_date").value = "";
}

async function saveProduct() {
    const data = {
        animal_id: parseInt(document.getElementById("product_animal_id").value),
        product_type: document.getElementById("product_type").value,
        quantity: parseFloat(document.getElementById("product_quantity").value),
        production_date: document.getElementById("production_date").value
    };
    
    await fetch(`${API}/products`, {
        method: "POST", headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    });
    hideProductForm();
    loadProducts();
}

async function deleteProduct(id) {
    if (!confirm("Удалить запись о продукции?")) return;
    await fetch(`${API}/products/${id}`, { method: "DELETE" });
    loadProducts();
}

// ==================== ПРИВИВКИ ====================
async function loadVaccinations() {
    const resp = await fetch(`${API}/vaccinations`);
    const vaccinations = await resp.json();
    const tbody = document.getElementById("vaccinations-table");
    
    tbody.innerHTML = vaccinations.map(v => `
        <tr>
            <td>${v.id}</td>
            <td>${v.animal_name || v.animal_id}</td>
            <td>${v.vaccine_name || '---'}</td>
            <td>${v.vaccination_date || '---'}</td>
            <td>${v.next_date || '---'}</td>
            <td>${v.vet_name || '---'}</td>
            <td>
                <button class='btn btn-delete' onclick='deleteVaccination(${v.id})'>🗑️</button>
            </td>
        </tr>
    `).join("");
}

async function loadAnimalsForVacc() {
    const resp = await fetch(`${API}/animals`);
    const animals = await resp.json();
    const select = document.getElementById("vacc_animal_id");
    select.innerHTML = animals.map(a => 
        `<option value="${a.id}">${a.name || a.tag_number} (${a.animal_type})</option>`
    ).join("");
}

function showVaccinationForm() {
    loadAnimalsForVacc();
    document.getElementById("vaccination-form-panel").style.display = "block";
    document.getElementById("vaccination_date").valueAsDate = new Date();
}

function hideVaccinationForm() {
    document.getElementById("vaccination-form-panel").style.display = "none";
    document.getElementById("vaccine_name").value = "";
    document.getElementById("vaccination_date").value = "";
    document.getElementById("next_date").value = "";
    document.getElementById("vet_name").value = "";
}

async function saveVaccination() {
    const data = {
        animal_id: parseInt(document.getElementById("vacc_animal_id").value),
        vaccine_name: document.getElementById("vaccine_name").value,
        vaccination_date: document.getElementById("vaccination_date").value,
        next_date: document.getElementById("next_date").value || null,
        vet_name: document.getElementById("vet_name").value
    };
    
    await fetch(`${API}/vaccinations`, {
        method: "POST", headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    });
    hideVaccinationForm();
    loadVaccinations();
}

async function deleteVaccination(id) {
    if (!confirm("Удалить запись о прививке?")) return;
    await fetch(`${API}/vaccinations/${id}`, { method: "DELETE" });
    loadVaccinations();
}

// ==================== ЗАГРУЗКА ПРИ СТАРТЕ ====================
loadAnimals();
loadStats();
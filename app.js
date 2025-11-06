// BookWise Prototype (Vanilla JS)

const STORAGE_KEYS = Object.freeze({
  products: 'bookwise.products.v1',
  suppliers: 'bookwise.suppliers.v1',
  sales: 'bookwise.sales.v1',
  settings: 'bookwise.settings.v1',
});

const DEFAULT_SETTINGS = Object.freeze({
  lang: 'en',
  theme: 'system',
});

let settings = loadSettings();

// i18n dictionary
const I18N = {
  en: {
    'nav.dashboard': 'Dashboard',
    'nav.products': 'Products',
    'nav.sales': 'Sales (POS)',
    'nav.stock': 'Stock',
    'nav.suppliers': 'Suppliers',
    'nav.reports': 'Reports',
    'nav.settings': 'Settings',

    'user.profile': 'Profile',
    'user.logout': 'Logout',

    'kpi.salesToday': 'Sales Today',
    'kpi.itemsSold': 'Items Sold',
    'kpi.lowStock': 'Low Stock',
    'kpi.topProduct': 'Top Product',

    'dashboard.recentSales': 'Recent Sales',
    'dashboard.salesOverview': 'Sales Overview',

    'table.date': 'Date',
    'table.items': 'Items',
    'table.total': 'Total',
    'table.product': 'Product',
    'table.category': 'Category',
    'table.price': 'Price',
    'table.stock': 'Stock',
    'table.actions': 'Actions',
    'table.qty': 'Qty',
    'table.adjust': 'Adjust',
    'table.name': 'Name',
    'table.contact': 'Contact',

    'products.title': 'Products',
    'products.add': 'Add Product',

    'sales.catalog': 'Catalog',
    'sales.cart': 'Cart',
    'sales.clear': 'Clear',
    'sales.subtotal': 'Subtotal',
    'sales.tax': 'Tax',
    'sales.grandTotal': 'Grand Total',
    'sales.checkout': 'Checkout',

    'stock.title': 'Stock',

    'suppliers.title': 'Suppliers',
    'suppliers.add': 'Add Supplier',

    'reports.salesTrend': 'Sales Trend',
    'reports.inventoryMix': 'Inventory Mix',

    'settings.preferences': 'Preferences',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.light': 'Light',
    'settings.dark': 'Dark',
    'settings.system': 'System',
    'settings.about': 'About',
    'settings.aboutText': 'Bilingual bookstore management prototype.',

    'common.search': 'Search',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.remove': 'Remove',
    'common.increase': 'Increase',
    'common.decrease': 'Decrease',

    'form.nameEn': 'Name (EN)',
    'form.nameFr': 'Name (FR)',
    'form.category': 'Category',
    'form.price': 'Price',
    'form.stock': 'Stock',
    'form.supplierName': 'Supplier Name',
    'form.contact': 'Contact',
  },
  fr: {
    'nav.dashboard': 'Tableau de bord',
    'nav.products': 'Produits',
    'nav.sales': 'Ventes (POS)',
    'nav.stock': 'Stock',
    'nav.suppliers': 'Fournisseurs',
    'nav.reports': 'Rapports',
    'nav.settings': 'Param?tres',

    'user.profile': 'Profil',
    'user.logout': 'D?connexion',

    'kpi.salesToday': "Ventes d'aujourd'hui",
    'kpi.itemsSold': 'Articles vendus',
    'kpi.lowStock': 'Ruptures',
    'kpi.topProduct': 'Meilleur produit',

    'dashboard.recentSales': 'Ventes r?centes',
    'dashboard.salesOverview': 'Aper?u des ventes',

    'table.date': 'Date',
    'table.items': 'Articles',
    'table.total': 'Total',
    'table.product': 'Produit',
    'table.category': 'Cat?gorie',
    'table.price': 'Prix',
    'table.stock': 'Stock',
    'table.actions': 'Actions',
    'table.qty': 'Qt?',
    'table.adjust': 'Ajuster',
    'table.name': 'Nom',
    'table.contact': 'Contact',

    'products.title': 'Produits',
    'products.add': 'Ajouter un produit',

    'sales.catalog': 'Catalogue',
    'sales.cart': 'Panier',
    'sales.clear': 'Vider',
    'sales.subtotal': 'Sous-total',
    'sales.tax': 'Taxe',
    'sales.grandTotal': 'Total',
    'sales.checkout': 'Encaisser',

    'stock.title': 'Stock',

    'suppliers.title': 'Fournisseurs',
    'suppliers.add': 'Ajouter un fournisseur',

    'reports.salesTrend': 'Tendance des ventes',
    'reports.inventoryMix': "R?partition de l'inventaire",

    'settings.preferences': 'Pr?f?rences',
    'settings.language': 'Langue',
    'settings.theme': 'Th?me',
    'settings.light': 'Clair',
    'settings.dark': 'Sombre',
    'settings.system': 'Syst?me',
    'settings.about': '? propos',
    'settings.aboutText': 'Prototype bilingue de gestion de librairie.',

    'common.search': 'Rechercher',
    'common.cancel': 'Annuler',
    'common.save': 'Enregistrer',
    'common.edit': 'Modifier',
    'common.delete': 'Supprimer',
    'common.remove': 'Retirer',
    'common.increase': 'Augmenter',
    'common.decrease': 'Diminuer',

    'form.nameEn': 'Nom (EN)',
    'form.nameFr': 'Nom (FR)',
    'form.category': 'Cat?gorie',
    'form.price': 'Prix',
    'form.stock': 'Stock',
    'form.supplierName': 'Nom du fournisseur',
    'form.contact': 'Contact',
  }
};

function t(key){
  return (I18N[settings.lang] && I18N[settings.lang][key]) || I18N.en[key] || key;
}

function applyI18n(){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
    const key = el.getAttribute('data-i18n-placeholder');
    el.setAttribute('placeholder', t(key));
  });
}

// State and storage
let products = loadArray(STORAGE_KEYS.products, []);
let suppliers = loadArray(STORAGE_KEYS.suppliers, []);
let sales = loadArray(STORAGE_KEYS.sales, []);
let cart = new Map(); // productId -> quantity

if (products.length === 0) seedDemoData();

// Theme setup
applyTheme(settings.theme);

// Language UI setup
initLanguageUI();
applyI18n();

// Initial render
renderAll();
attachGlobalHandlers();

// --- Functions ---
function loadSettings(){
  try{
    const raw = localStorage.getItem(STORAGE_KEYS.settings);
    if(!raw) return {...DEFAULT_SETTINGS};
    return {...DEFAULT_SETTINGS, ...JSON.parse(raw)};
  }catch{ return {...DEFAULT_SETTINGS}; }
}
function saveSettings(){
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}
function loadArray(key, fallback){
  try{
    const raw = localStorage.getItem(key);
    if(!raw) return fallback;
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : fallback;
  }catch{ return fallback; }
}
function saveArray(key, arr){
  localStorage.setItem(key, JSON.stringify(arr));
}

function seedDemoData(){
  products = [
    { id: uid(), name_en: 'The Little Prince', name_fr: 'Le Petit Prince', category: 'Books', price: 12.99, stock: 14 },
    { id: uid(), name_en: 'Les Mis?rables', name_fr: 'Les Mis?rables', category: 'Books', price: 15.50, stock: 9 },
    { id: uid(), name_en: 'French Grammar', name_fr: 'Grammaire fran?aise', category: 'Books', price: 18.90, stock: 7 },
    { id: uid(), name_en: 'Notebook A5', name_fr: 'Cahier A5', category: 'Supplies', price: 3.20, stock: 42 },
    { id: uid(), name_en: 'Gel Pen Blue', name_fr: 'Stylo gel bleu', category: 'Supplies', price: 1.50, stock: 100 },
    { id: uid(), name_en: 'Highlighter Set', name_fr: 'Surligneurs', category: 'Supplies', price: 6.75, stock: 25 },
    { id: uid(), name_en: 'Oxford Dictionary', name_fr: 'Dictionnaire Oxford', category: 'Books', price: 22.00, stock: 6 },
    { id: uid(), name_en: 'Moleskine Journal', name_fr: 'Carnet Moleskine', category: 'Supplies', price: 19.00, stock: 12 },
  ];
  suppliers = [
    { id: uid(), name: 'Gallimard', contact: 'contact@gallimard.fr' },
    { id: uid(), name: 'Stationery Co', contact: 'sales@stationery.example' },
  ];
  // Seed a couple of historical sales
  const today = new Date();
  sales = [
    { id: uid(), date: addDays(today, -1).toISOString(), items: [{productId: products[0].id, qty: 1, price: products[0].price}], total: products[0].price },
    { id: uid(), date: addDays(today, -3).toISOString(), items: [{productId: products[3].id, qty: 3, price: products[3].price}], total: +(products[3].price*3).toFixed(2) },
  ];
  persistAll();
}

function persistAll(){
  saveArray(STORAGE_KEYS.products, products);
  saveArray(STORAGE_KEYS.suppliers, suppliers);
  saveArray(STORAGE_KEYS.sales, sales);
}

function uid(){
  return Math.random().toString(36).slice(2) + Date.now().toString(36).slice(4);
}

function addDays(date, days){
  const d = new Date(date);
  d.setDate(d.getDate()+days);
  return d;
}

function fmtMoney(amount){
  const locale = settings.lang === 'fr' ? 'fr-FR' : 'en-US';
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(amount || 0);
}

function fmtDate(iso){
  const locale = settings.lang === 'fr' ? 'fr-FR' : 'en-US';
  return new Date(iso).toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short' });
}

function currentName(p){
  return settings.lang === 'fr' ? p.name_fr : p.name_en;
}

// THEME
function applyTheme(pref){
  const root = document.documentElement;
  if(pref === 'system'){
    const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.removeAttribute('data-theme');
    if(!isDark){
      root.setAttribute('data-theme','light');
    }
  }else{
    root.setAttribute('data-theme', pref === 'light' ? 'light' : '');
    if(pref === 'dark') root.removeAttribute('data-theme');
  }
  // Icon
  const icon = document.querySelector('#theme-toggle .material-symbols-rounded');
  if(icon){ icon.textContent = (getEffectiveTheme() === 'dark') ? 'dark_mode' : 'light_mode'; }
}
function getEffectiveTheme(){
  if(settings.theme === 'system'){
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return settings.theme;
}

function initLanguageUI(){
  const buttons = document.querySelectorAll('#lang-switch .segmented__btn');
  buttons.forEach(btn=>{
    const lg = btn.getAttribute('data-lang');
    btn.setAttribute('aria-checked', String(lg === settings.lang));
    btn.addEventListener('click', ()=>{
      settings.lang = lg;
      saveSettings();
      buttons.forEach(b=>b.setAttribute('aria-checked', String(b===btn)));
      document.documentElement.lang = settings.lang;
      applyI18n();
      renderAll();
      // sync settings select
      const sel = document.getElementById('settings-language');
      if(sel) sel.value = settings.lang;
    })
  })
}

function attachGlobalHandlers(){
  // Sidebar nav routing
  document.querySelectorAll('.sidebar .nav__item').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const view = btn.getAttribute('data-view');
      setActiveView(view);
    })
  });

  // Toggle sidebar (collapse)
  document.getElementById('toggle-sidebar').addEventListener('click', ()=>{
    document.querySelector('.app').classList.toggle('sidebar-collapsed');
  });

  // Theme toggle
  document.getElementById('theme-toggle').addEventListener('click', ()=>{
    const next = { light: 'dark', dark: 'system', system: 'light' }[settings.theme] || 'light';
    settings.theme = next;
    saveSettings();
    applyTheme(settings.theme);
    // sync settings select
    const sel = document.getElementById('settings-theme');
    if(sel) sel.value = settings.theme;
  });

  // Products
  document.getElementById('btn-add-product').addEventListener('click', ()=> openProductModal());
  document.getElementById('products-search').addEventListener('input', renderProducts);

  // POS
  document.getElementById('pos-search').addEventListener('input', renderPOS);
  document.getElementById('pos-clear').addEventListener('click', ()=>{ cart.clear(); renderPOS(); });
  document.getElementById('pos-checkout').addEventListener('click', checkout);

  // Suppliers
  document.getElementById('btn-add-supplier').addEventListener('click', ()=> openSupplierModal());

  // Settings selects
  const langSel = document.getElementById('settings-language');
  const themeSel = document.getElementById('settings-theme');
  langSel.value = settings.lang;
  themeSel.value = settings.theme;
  langSel.addEventListener('change', (e)=>{
    settings.lang = e.target.value;
    saveSettings();
    document.documentElement.lang = settings.lang;
    applyI18n();
    renderAll();
    // header segmented buttons
    initLanguageUI();
  });
  themeSel.addEventListener('change', (e)=>{
    settings.theme = e.target.value;
    saveSettings();
    applyTheme(settings.theme);
  });

  // Modal forms
  document.getElementById('form-product').addEventListener('submit', saveProductFromModal);
  document.getElementById('form-supplier').addEventListener('submit', saveSupplierFromModal);
}

function setActiveView(view){
  document.querySelectorAll('.sidebar .nav__item').forEach(btn=>{
    btn.classList.toggle('is-active', btn.getAttribute('data-view') === view);
  });
  document.querySelectorAll('.view').forEach(v=>{
    v.classList.toggle('is-hidden', v.getAttribute('data-view') !== view);
  });
  if(view === 'dashboard') renderDashboard();
  if(view === 'products') renderProducts();
  if(view === 'sales') renderPOS();
  if(view === 'stock') renderStock();
  if(view === 'suppliers') renderSuppliers();
  if(view === 'reports') renderReports();
  if(view === 'settings') {/* no-op */}
}

function renderAll(){
  renderDashboard();
  renderProducts();
  renderPOS();
  renderStock();
  renderSuppliers();
  renderReports();
}

// DASHBOARD
let chartSalesOverview;
function renderDashboard(){
  // KPIs
  const todayStr = new Date().toDateString();
  const todaySales = sales.filter(s=> new Date(s.date).toDateString() === todayStr);
  const salesToday = todaySales.reduce((sum, s)=> sum + s.total, 0);
  const itemsSold = todaySales.reduce((sum, s)=> sum + s.items.reduce((n,i)=>n+i.qty,0), 0);
  const lowStock = products.filter(p=> p.stock <= 5).length;
  const soldCounts = new Map();
  sales.forEach(s=> s.items.forEach(i=>{ soldCounts.set(i.productId, (soldCounts.get(i.productId)||0)+i.qty); }));
  let topProduct = '?';
  if(soldCounts.size){
    const [pid] = [...soldCounts.entries()].sort((a,b)=> b[1]-a[1])[0];
    const prod = products.find(p=> p.id===pid);
    if(prod) topProduct = currentName(prod);
  }
  document.getElementById('kpi-sales-today').textContent = fmtMoney(salesToday);
  document.getElementById('kpi-items-sold').textContent = itemsSold;
  document.getElementById('kpi-low-stock').textContent = lowStock;
  document.getElementById('kpi-top-product').textContent = topProduct;

  // Recent sales table
  const tbody = document.getElementById('recent-sales-body');
  tbody.innerHTML = '';
  [...sales].sort((a,b)=> new Date(b.date)-new Date(a.date)).slice(0,8).forEach(s=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${fmtDate(s.date)}</td><td>${s.items.reduce((n,i)=>n+i.qty,0)}</td><td>${fmtMoney(s.total)}</td>`;
    tbody.appendChild(tr);
  });

  // Sales overview chart (last 7 days)
  const days = [...Array(7)].map((_,i)=>{
    const d = addDays(new Date(), -(6-i));
    const key = d.toDateString();
    const total = sales.filter(s=> new Date(s.date).toDateString()===key).reduce((sum,s)=>sum+s.total,0);
    return { label: d.toLocaleDateString(settings.lang==='fr'?'fr-FR':'en-US', { weekday:'short' }), total };
  });
  const ctx = document.getElementById('chart-sales');
  if(chartSalesOverview){ chartSalesOverview.destroy(); }
  chartSalesOverview = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: days.map(d=>d.label),
      datasets: [{
        label: t('dashboard.salesOverview'),
        data: days.map(d=> +(d.total.toFixed(2))),
        backgroundColor: 'rgba(91,141,239,0.35)',
        borderColor: 'rgba(91,141,239,0.9)',
        borderWidth: 1.5,
        borderRadius: 8,
      }]
    },
    options: { responsive:true, maintainAspectRatio:false, scales:{ y:{ beginAtZero:true } } }
  });
}

// PRODUCTS
function renderProducts(){
  const q = document.getElementById('products-search').value?.toLowerCase() || '';
  const tbody = document.getElementById('products-body');
  tbody.innerHTML = '';
  products
    .filter(p=> currentName(p).toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
    .forEach(p=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div style="display:flex; align-items:center; gap:8px">
            <span class="badge">${p.category}</span>
            <span>${currentName(p)}</span>
          </div>
        </td>
        <td>${p.category}</td>
        <td>${fmtMoney(p.price)}</td>
        <td>${p.stock}</td>
        <td>
          <button class="action-icon" title="${t('common.edit')}" data-action="edit" data-id="${p.id}"><span class="material-symbols-rounded">edit</span></button>
          <button class="action-icon" title="${t('common.delete')}" data-action="delete" data-id="${p.id}"><span class="material-symbols-rounded">delete</span></button>
        </td>`;
      tbody.appendChild(tr);
    });

  tbody.querySelectorAll('button[data-action]').forEach(btn=>{
    const id = btn.getAttribute('data-id');
    const action = btn.getAttribute('data-action');
    btn.addEventListener('click', ()=>{
      if(action==='edit') openProductModal(products.find(p=>p.id===id));
      if(action==='delete'){
        if(confirm(`${t('common.delete')}?`)){
          products = products.filter(p=> p.id!==id);
          saveArray(STORAGE_KEYS.products, products);
          renderAll();
        }
      }
    })
  })
}

function openProductModal(prod){
  const dlg = document.getElementById('modal-product');
  const title = document.getElementById('modal-product-title');
  title.textContent = prod ? t('common.edit') : t('products.add');
  dlg.dataset.mode = prod ? 'edit' : 'add';
  dlg.dataset.id = prod ? prod.id : '';
  document.getElementById('p-name-en').value = prod?.name_en || '';
  document.getElementById('p-name-fr').value = prod?.name_fr || '';
  document.getElementById('p-category').value = prod?.category || '';
  document.getElementById('p-price').value = prod?.price ?? '';
  document.getElementById('p-stock').value = prod?.stock ?? '';
  dlg.showModal();
}

function saveProductFromModal(ev){
  ev.preventDefault();
  const dlg = document.getElementById('modal-product');
  const data = {
    name_en: document.getElementById('p-name-en').value.trim(),
    name_fr: document.getElementById('p-name-fr').value.trim(),
    category: document.getElementById('p-category').value.trim(),
    price: parseFloat(document.getElementById('p-price').value),
    stock: parseInt(document.getElementById('p-stock').value, 10),
  };
  if(dlg.dataset.mode==='edit'){
    const id = dlg.dataset.id;
    products = products.map(p=> p.id===id ? { ...p, ...data } : p);
  }else{
    products.push({ id: uid(), ...data });
  }
  saveArray(STORAGE_KEYS.products, products);
  dlg.close();
  renderAll();
}

// POS
function renderPOS(){
  const q = document.getElementById('pos-search').value?.toLowerCase() || '';
  // Catalog
  const grid = document.getElementById('pos-products');
  grid.innerHTML = '';
  products
    .filter(p=> p.stock>0)
    .filter(p=> currentName(p).toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
    .forEach(p=>{
      const card = document.createElement('button');
      card.className = 'product';
      card.innerHTML = `
        <span class="name">${currentName(p)}</span>
        <span class="meta">${p.category} ? ${fmtMoney(p.price)}</span>
        <span class="badge">${t('table.stock')}: ${p.stock}</span>
      `;
      card.addEventListener('click', ()=> addToCart(p.id, 1));
      grid.appendChild(card);
    });

  // Cart table
  const tbody = document.getElementById('cart-body');
  tbody.innerHTML = '';
  let subtotal = 0;
  cart.forEach((qty, pid)=>{
    const p = products.find(x=> x.id===pid);
    if(!p) return;
    const rowTotal = +(p.price * qty).toFixed(2);
    subtotal += rowTotal;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${currentName(p)}</td>
      <td>
        <div style="display:flex; align-items:center; gap:6px">
          <button class="action-icon" title="${t('common.decrease')}"><span class="material-symbols-rounded">remove</span></button>
          <span style="min-width:24px; text-align:center">${qty}</span>
          <button class="action-icon" title="${t('common.increase')}"><span class="material-symbols-rounded">add</span></button>
        </div>
      </td>
      <td>${fmtMoney(rowTotal)}</td>
      <td><button class="action-icon" title="${t('common.remove')}"><span class="material-symbols-rounded">close</span></button></td>
    `;
    const [btnMinus, , btnPlus] = tr.querySelectorAll('button.action-icon');
    const btnRemove = tr.querySelectorAll('button.action-icon')[2];
    btnMinus.addEventListener('click', ()=> addToCart(pid, -1));
    btnPlus.addEventListener('click', ()=> addToCart(pid, +1));
    btnRemove.addEventListener('click', ()=> { cart.delete(pid); renderPOS(); });
    tbody.appendChild(tr);
  });
  const tax = +(subtotal * 0.10).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);
  document.getElementById('cart-subtotal').textContent = fmtMoney(subtotal);
  document.getElementById('cart-tax').textContent = fmtMoney(tax);
  document.getElementById('cart-total').textContent = fmtMoney(total);
}

function addToCart(productId, delta){
  const p = products.find(x=> x.id===productId);
  if(!p) return;
  const cur = cart.get(productId) || 0;
  const next = Math.max(0, Math.min(cur + delta, p.stock));
  if(next === 0) cart.delete(productId); else cart.set(productId, next);
  renderPOS();
}

function checkout(){
  if(cart.size === 0) return;
  // Calculate totals and commit sale
  let total = 0; const items=[];
  cart.forEach((qty, pid)=>{
    const p = products.find(x=> x.id===pid);
    if(!p) return;
    const lineTotal = +(p.price * qty).toFixed(2);
    items.push({ productId: pid, qty, price: p.price });
    total += lineTotal;
    p.stock = Math.max(0, p.stock - qty);
  });
  const sale = { id: uid(), date: new Date().toISOString(), items, total: +total.toFixed(2) };
  sales.push(sale);
  persistAll();
  cart.clear();
  renderAll();
  alert(settings.lang==='fr' ? 'Vente enregistr?e' : 'Sale recorded');
}

// STOCK
function renderStock(){
  const tbody = document.getElementById('stock-body');
  tbody.innerHTML = '';
  products.forEach(p=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${currentName(p)}</td>
      <td>${p.stock}</td>
      <td>
        <div style="display:flex; align-items:center; gap:6px">
          <button class="action-icon" title="${t('common.decrease')}"><span class="material-symbols-rounded">remove</span></button>
          <button class="action-icon" title="${t('common.increase')}"><span class="material-symbols-rounded">add</span></button>
        </div>
      </td>
    `;
    const [minus, plus] = tr.querySelectorAll('button.action-icon');
    minus.addEventListener('click', ()=>{ p.stock = Math.max(0, p.stock-1); saveArray(STORAGE_KEYS.products, products); renderStock(); });
    plus.addEventListener('click', ()=>{ p.stock = p.stock+1; saveArray(STORAGE_KEYS.products, products); renderStock(); });
    tbody.appendChild(tr);
  });
}

// SUPPLIERS
function renderSuppliers(){
  const tbody = document.getElementById('suppliers-body');
  tbody.innerHTML = '';
  suppliers.forEach(s=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${s.name}</td>
      <td>${s.contact}</td>
      <td>
        <button class="action-icon" title="${t('common.edit')}" data-action="edit" data-id="${s.id}"><span class="material-symbols-rounded">edit</span></button>
        <button class="action-icon" title="${t('common.delete')}" data-action="delete" data-id="${s.id}"><span class="material-symbols-rounded">delete</span></button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  tbody.querySelectorAll('[data-action]').forEach(btn=>{
    const id = btn.getAttribute('data-id');
    const action = btn.getAttribute('data-action');
    btn.addEventListener('click', ()=>{
      if(action==='edit') openSupplierModal(suppliers.find(s=> s.id===id));
      if(action==='delete'){
        if(confirm(`${t('common.delete')}?`)){
          suppliers = suppliers.filter(s=> s.id!==id);
          saveArray(STORAGE_KEYS.suppliers, suppliers);
          renderSuppliers();
        }
      }
    })
  })
}

function openSupplierModal(sup){
  const dlg = document.getElementById('modal-supplier');
  const title = document.getElementById('modal-supplier-title');
  title.textContent = sup ? t('common.edit') : t('suppliers.add');
  dlg.dataset.mode = sup ? 'edit' : 'add';
  dlg.dataset.id = sup ? sup.id : '';
  document.getElementById('s-name').value = sup?.name || '';
  document.getElementById('s-contact').value = sup?.contact || '';
  dlg.showModal();
}

function saveSupplierFromModal(ev){
  ev.preventDefault();
  const dlg = document.getElementById('modal-supplier');
  const data = {
    name: document.getElementById('s-name').value.trim(),
    contact: document.getElementById('s-contact').value.trim(),
  };
  if(dlg.dataset.mode==='edit'){
    const id = dlg.dataset.id;
    suppliers = suppliers.map(s=> s.id===id ? { ...s, ...data } : s);
  }else{
    suppliers.push({ id: uid(), ...data });
  }
  saveArray(STORAGE_KEYS.suppliers, suppliers);
  dlg.close();
  renderSuppliers();
}

// REPORTS
let chartTrend, chartInventory;
function renderReports(){
  // Sales trend by last 12 days
  const labels = [...Array(12)].map((_,i)=>{
    const d = addDays(new Date(), -(11-i));
    return d.toLocaleDateString(settings.lang==='fr'?'fr-FR':'en-US', { month:'short', day:'numeric' });
  });
  const values = [...Array(12)].map((_,i)=>{
    const d = addDays(new Date(), -(11-i));
    const key = d.toDateString();
    return sales.filter(s=> new Date(s.date).toDateString()===key).reduce((sum,s)=>sum+s.total,0);
  });
  const ctx1 = document.getElementById('chart-sales-trend');
  if(chartTrend) chartTrend.destroy();
  chartTrend = new Chart(ctx1, { type:'line', data:{ labels, datasets:[{ label:t('reports.salesTrend'), data: values, borderColor:'rgba(39,195,168,0.9)', backgroundColor:'rgba(39,195,168,0.25)', fill:true, tension:.35, pointRadius:2 }] }, options:{ responsive:true, maintainAspectRatio:false, scales:{ y:{ beginAtZero:true } } } });

  // Inventory mix by category
  const byCat = products.reduce((m,p)=>{ m.set(p.category, (m.get(p.category)||0)+p.stock); return m; }, new Map());
  const ctx2 = document.getElementById('chart-inventory');
  if(chartInventory) chartInventory.destroy();
  chartInventory = new Chart(ctx2, { type:'doughnut', data:{ labels:[...byCat.keys()], datasets:[{ data:[...byCat.values()], backgroundColor:['#5b8def','#27c3a8','#f5a524','#e24848','#7c74f2','#f27ab0'] }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom'}} } });
}

// ROUTE default
setActiveView('dashboard');

// Accessibility: close dialog on backdrop click
['modal-product','modal-supplier'].forEach(id=>{
  const dlg = document.getElementById(id);
  dlg.addEventListener('click', (e)=>{ const r = dlg.getBoundingClientRect(); if(!(e.clientX>r.left && e.clientX<r.right && e.clientY>r.top && e.clientY<r.bottom)) dlg.close(); });
});

// --- Helpers ---
window.addEventListener('storage', (e)=>{
  if(e.key===STORAGE_KEYS.settings){ settings = loadSettings(); applyI18n(); applyTheme(settings.theme); renderAll(); }
});

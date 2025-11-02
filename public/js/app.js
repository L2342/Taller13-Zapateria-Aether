const fmt = (n) => n.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });

async function loadProducts() {
  const res = await fetch('/api/products');
  const products = await res.json();
  const list = document.getElementById('product-list');
  list.innerHTML = products.map(p => `
    <div class="col-12 col-sm-6 col-lg-4">
      <div class="card h-100 shadow-sm">
        <img src="${p.image}" class="card-img-top" alt="${p.name}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${p.name}</h5>
          <p class="text-muted mb-2">${p.description}</p>
          <p class="fw-bold">${fmt(p.price)}</p>
          <div class="mt-auto d-flex gap-2">
            <button class="btn btn-primary" data-id="${p.id}" data-qty="1">Agregar</button>
            <a href="/cart.html" class="btn btn-outline-secondary">Ver carrito</a>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  list.querySelectorAll('button[data-id]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const productId = Number(btn.dataset.id);
      const qty = Number(btn.dataset.qty);
      await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, qty })
      });
      updateCartCount();
      showCartToast();
    });
  });

  updateCartCount();
  
  // Inicializar contador después de cargar productos
  setTimeout(() => {
    initializeProductCount();
  }, 100);
}

async function updateCartCount() {
  const res = await fetch('/api/cart');
  const cart = await res.json();
  const count = cart.reduce((acc, i) => acc + i.qty, 0);
  document.getElementById('cart-count').textContent = String(count);
}

// Formatear el precio
function extractPrice(priceText) {
  if (!priceText) return 0;
  let cleaned = priceText.replace(/[$\s.]/g, '');
  cleaned = cleaned.replace(',', '.');
  
  return parseFloat(cleaned) || 0;
}


//Función principal para filtrar productos
function filterProducts() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
  const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;
  
  const productList = document.getElementById('product-list');
  const noResults = document.getElementById('no-results');
  const cards = productList.querySelectorAll('.col-12');
  
  let visibleCount = 0;
  
  cards.forEach(card => {
    // Buscar el título del producto
    const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
    
    // Buscar el precio del producto
    const priceElement = card.querySelector('.fw-bold');
    const priceText = priceElement?.textContent || '0';
    const price = extractPrice(priceText);
    const matchesSearch = !searchTerm || title.includes(searchTerm);
    const matchesPrice = price >= minPrice && price <= maxPrice;
    
    // Mostrar u ocultar la card según los filtros
    if (matchesSearch && matchesPrice) {
      card.classList.remove('d-none');
      visibleCount++;
    } else {
      card.classList.add('d-none');
    }
  });
  
  // Actualizar conta
  document.getElementById('results-count').textContent = visibleCount;
  
  if (visibleCount === 0) {
    noResults.classList.remove('d-none');
    productList.classList.add('d-none');
  } else {
    noResults.classList.add('d-none');
    productList.classList.remove('d-none');
  }
}

function resetFilters() {
  document.getElementById('search-input').value = '';
  document.getElementById('min-price').value = '';
  document.getElementById('max-price').value = '';
  filterProducts();
}

function initializeProductCount() {
  const cards = document.querySelectorAll('#product-list .col-12');
  document.getElementById('results-count').textContent = cards.length;
}


function initializeFilters() {
  //  se usan Event listeners para filtrado en tiempo real
  const searchInput = document.getElementById('search-input');
  const minPriceInput = document.getElementById('min-price');
  const maxPriceInput = document.getElementById('max-price');
  const resetButton = document.getElementById('btn-reset-filters');
  
  if (searchInput) {
    searchInput.addEventListener('input', filterProducts);
  }
  
  if (minPriceInput) {
    minPriceInput.addEventListener('input', filterProducts);
  }
  
  if (maxPriceInput) {
    maxPriceInput.addEventListener('input', filterProducts);
  }
  
  if (resetButton) {
    resetButton.addEventListener('click', resetFilters);
  }
}

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
  initializeFilters();
  loadProducts();
});

// Toast de Bootstrap para notificación de producto agregado
function showCartToast() {
  const toastEl = document.getElementById('cart-toast');
  if (!toastEl) return;
  const toast = bootstrap.Toast ? new bootstrap.Toast(toastEl, { delay: 2000 }) : null;
  if (toast) toast.show();
}
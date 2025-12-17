/**
 * Módulo para renderizado de UI.
 * @module uiRenderer
 */
import { formatCurrency, createEl } from './utils.js';
import { getCart } from './cartManager.js';

/**
 * Renderiza el header con navegación y carrito.
 */
export function renderHeader() {
  const header = document.getElementById('main-header');
  if (!header) return;
  header.innerHTML = `
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-purple">
    <div class="container">
      <a class="navbar-brand d-flex align-items-center gap-2" href="index.html">
        <img src="assets/images/logo.jpg" alt="Logo" width="40" height="40" class="d-inline-block align-text-top">
        <span class="fw-bold" style="font-family: 'Orbitron', Arial, sans-serif; color:#00F5D4;">EGaming</span>
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item"><a class="nav-link" href="index.html">Inicio</a></li>
          <li class="nav-item"><a class="nav-link" href="products.html">Productos</a></li>
          <li class="nav-item"><a class="nav-link" href="contact.html">Contacto</a></li>
        </ul>
        <button class="btn position-relative ms-lg-3 btn-cyan" id="cart-btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#cartOffcanvas" aria-controls="cartOffcanvas">
          <i class="bi bi-cart3"></i>
          <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" id="cart-count-badge">0</span>
        </button>
      </div>
    </div>
  </nav>`;
}

/**
 * Renderiza el footer.
 */
export function renderFooter() {
  const footer = document.getElementById('main-footer');
  if (!footer) return;
  footer.innerHTML = `
    <div class="container py-3 d-flex flex-column flex-md-row justify-content-between align-items-center">
      <div>
        <a href="index.html" class="link-cyan me-3">Inicio</a>
        <a href="products.html" class="link-cyan me-3">Productos</a>
        <a href="contact.html" class="link-cyan">Contacto</a>
      </div>
      <div class="mt-2 mt-md-0">
        <a href="#" class="me-2"><i class="bi bi-instagram"></i></a>
        <a href="#" class="me-2"><i class="bi bi-twitter"></i></a>
        <a href="#"><i class="bi bi-facebook"></i></a>
      </div>
      <div class="text-muted mt-2 mt-md-0">&copy; 2025 Ecommerce Gaming</div>
    </div>`;
}

/**
 * Renderiza el hero con carrusel.
 */
export function renderHero() {
  const hero = document.getElementById('hero-section');
  if (!hero) return;
  hero.innerHTML = `
    <div class="container py-4">
      <h1>Gaming sin límites</h1>
      <h2 class="mb-3">Consolas, periféricos y hardware de última generación</h2>
      <a href="products.html" class="btn btn-cyan btn-lg">Explorar productos</a>
      <div id="hero-carousel" class="carousel slide mt-4" data-bs-ride="carousel">
        <div class="carousel-indicators">
          <button type="button" data-bs-target="#hero-carousel" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Consolas"></button>
          <button type="button" data-bs-target="#hero-carousel" data-bs-slide-to="1" aria-label="Periféricos"></button>
          <button type="button" data-bs-target="#hero-carousel" data-bs-slide-to="2" aria-label="Juegos"></button>
        </div>
        <div class="carousel-inner rounded-4 overflow-hidden">
          <div class="carousel-item active">
            <a href="products.html?cat=consolas"><img src="../assets/images/naruto.jpg" class="d-block w-100 carousel-img" alt="Consolas"></a>
            <div class="carousel-caption d-none d-md-block">
              <h5>Consolas</h5>
              <p>La nueva generación te espera</p>
            </div>
          </div>
          <div class="carousel-item">
            <a href="products.html?cat=periféricos"><img src="../assets/images/onepiece.jpg" class="d-block w-100 carousel-img" alt="Periféricos"></a>
            <div class="carousel-caption d-none d-md-block">
              <h5>Periféricos</h5>
              <p>Precisión y estilo gamer</p>
            </div>
          </div>
          <div class="carousel-item">
            <a href="products.html?cat=juegos"><img src="../assets/images/kimetsu.jpg" class="d-block w-100 carousel-img" alt="Juegos"></a>
            <div class="carousel-caption d-none d-md-block">
              <h5>Juegos</h5>
              <p>Los títulos más esperados</p>
            </div>
          </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#hero-carousel" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Anterior</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#hero-carousel" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Siguiente</span>
        </button>
      </div>
    </div>`;
}

// ...más funciones: renderProductGrid, renderPagination, renderProductModal, renderCartSidebar, renderHeaderCartCount, renderToasts, renderSpinners, renderErrorMsg...

import { getProducts } from './productManager.js';
import { addItem, updateQty, removeItem, clearCart, calculateTotals } from './cartManager.js';
import { debounce } from './utils.js';

/**
 * Renderiza el grid de productos.
 * @param {Array} products
 * @param {HTMLElement} container
 */
export function renderProductGrid(products, container) {
  if (!container) return;
  if (!products.length) {
    container.innerHTML = '<div class="alert alert-warning text-center">No se encontraron productos.</div>';
    return;
  }
  container.innerHTML = '<div class="row g-4">' +
    products.map(product => `
      <div class="col-12 col-sm-6 col-md-4">
        <div class="card h-100 shadow-sm">
          <img src="${product.image}" class="card-img-top" alt="${product.name}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text small text-secondary">${product.description}</p>
            <div class="mb-2 fw-bold">${formatCurrency(product.price)}</div>
            <div class="d-flex gap-2 mt-auto">
              <button class="btn btn-cyan btn-sm w-100" data-action="view" data-id="${product.id}">Ver</button>
              <button class="btn btn-purple btn-sm w-100" data-action="add" data-id="${product.id}">Agregar</button>
            </div>
          </div>
        </div>
      </div>
    `).join('') + '</div>';
}

/**
 * Renderiza la paginación.
 * @param {Object} meta
 * @param {Function} onPageChange
 */
export function renderPagination(meta, onPageChange) {
  const pag = document.getElementById('pagination');
  if (!pag || meta.pages <= 1) {
    if (pag) pag.innerHTML = '';
    return;
  }
  let html = '<nav><ul class="pagination justify-content-center">';
  for (let i = 1; i <= meta.pages; i++) {
    html += `<li class="page-item${i === meta.page ? ' active' : ''}"><button class="page-link" data-page="${i}">${i}</button></li>`;
  }
  html += '</ul></nav>';
  pag.innerHTML = html;
  pag.querySelectorAll('button[data-page]').forEach(btn => {
    btn.onclick = () => onPageChange(Number(btn.dataset.page));
  });
}

/**
 * Renderiza el modal de producto.
 * @param {Object} product
 */
export function renderProductModal(product) {
  let modal = document.getElementById('productModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'productModal';
    modal.tabIndex = -1;
    modal.innerHTML = `<div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content bg-dark text-light">
        <div class="modal-header border-0">
          <h5 class="modal-title">${product.name}</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>
        <div class="modal-body row g-4">
          <div class="col-md-5"><img src="${product.image}" class="img-fluid rounded" alt="${product.name}"></div>
          <div class="col-md-7">
            <p>${product.description}</p>
            <ul class="list-unstyled mb-2">
              ${product.features.map(f => `<li><i class="bi bi-check2-circle text-cyan"></i> ${f}</li>`).join('')}
            </ul>
            <div class="mb-2">Stock: <span class="fw-bold">${product.stock}</span></div>
            <div class="mb-2">Valoración: <span class="fw-bold">${product.rating} <i class="bi bi-star-fill text-warning"></i></span></div>
            <div class="h4 mb-3">${formatCurrency(product.price)}</div>
            <div class="input-group mb-3" style="max-width:180px;">
              <span class="input-group-text">Cantidad</span>
              <input type="number" class="form-control" id="modal-qty" min="1" max="${product.stock}" value="1">
            </div>
            <button class="btn btn-cyan w-100" id="modal-add-btn">Agregar al carrito</button>
          </div>
        </div>
      </div>
    </div>`;
    document.body.appendChild(modal);
  } else {
    modal.querySelector('.modal-title').textContent = product.name;
    modal.querySelector('img').src = product.image;
    modal.querySelector('img').alt = product.name;
    modal.querySelector('p').textContent = product.description;
    modal.querySelector('ul').innerHTML = product.features.map(f => `<li><i class="bi bi-check2-circle text-cyan"></i> ${f}</li>`).join('');
    modal.querySelector('.fw-bold').textContent = product.stock;
    modal.querySelector('.h4').textContent = formatCurrency(product.price);
    modal.querySelector('#modal-qty').max = product.stock;
  }
  // Evento agregar al carrito
  setTimeout(() => {
    document.getElementById('modal-add-btn').onclick = () => {
      const qty = Math.max(1, Math.min(Number(document.getElementById('modal-qty').value), product.stock));
      addItem(product.id, qty);
      renderToasts('Producto agregado al carrito', 'success');
      const bsModal = bootstrap.Modal.getOrCreateInstance(modal);
      bsModal.hide();
    };
  }, 100);
  const bsModal = new bootstrap.Modal(modal);
  bsModal.show();
}

/**
 * Renderiza el sidebar del carrito (offcanvas).
 * @param {Array} cart
 */
export function renderCartSidebar(cart) {
  let offcanvas = document.getElementById('cartOffcanvas');
  if (!offcanvas) {
    offcanvas = document.createElement('div');
    offcanvas.className = 'offcanvas offcanvas-end';
    offcanvas.id = 'cartOffcanvas';
    offcanvas.tabIndex = -1;
    offcanvas.setAttribute('aria-labelledby', 'cartOffcanvasLabel');
    document.body.appendChild(offcanvas);
  }
  const products = getProducts({ perPage: 1000 }).products;
  const { subtotal, impuestos, total } = calculateTotals(cart, products);
  let html = `<div class="offcanvas-header">
    <h5 class="offcanvas-title" id="cartOffcanvasLabel">Carrito</h5>
    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Cerrar"></button>
  </div><div class="offcanvas-body d-flex flex-column">
    <div class="flex-grow-1">`;
  if (!cart.length) {
    html += '<div class="alert alert-info">El carrito está vacío.</div>';
  } else {
    html += '<ul class="list-group mb-3">' + cart.map(item => {
      const prod = products.find(p => p.id === item.productId);
      if (!prod) return '';
      return `<li class="list-group-item bg-dark text-light d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center gap-2">
          <img src="${prod.image}" alt="${prod.name}" width="48" height="48" class="rounded">
          <div>
            <div class="fw-bold small">${prod.name}</div>
            <div class="small">${formatCurrency(prod.price)} x ${item.qty}</div>
          </div>
        </div>
        <div class="d-flex align-items-center gap-1">
          <button class="btn btn-sm btn-outline-cyan" data-action="dec" data-id="${item.productId}">-</button>
          <input type="number" class="form-control form-control-sm text-center" style="width:50px;" min="1" max="${prod.stock}" value="${item.qty}" data-action="qty" data-id="${item.productId}">
          <button class="btn btn-sm btn-outline-cyan" data-action="inc" data-id="${item.productId}">+</button>
          <button class="btn btn-sm btn-danger ms-2" data-action="remove" data-id="${item.productId}" title="Eliminar producto"><i class="bi bi-x-circle-fill"></i> Quitar</button>
        </div>
      </li>`;
    }).join('') + '</ul>';
  }
  html += `</div>
    <div class="border-top pt-3">
      <div>Subtotal: <span class="fw-bold">${formatCurrency(subtotal)}</span></div>
      <div>Impuestos (21%): <span class="fw-bold">${formatCurrency(impuestos)}</span></div>
      <div class="h5">Total: <span class="fw-bold text-cyan">${formatCurrency(total)}</span></div>
      <button class="btn btn-danger w-100 mt-3" id="clear-cart-btn">Vaciar carrito</button>
      <button class="btn btn-cyan w-100 mt-2" id="checkout-btn" ${!cart.length ? 'disabled' : ''}>Finalizar compra</button>
    </div>
  </div>`;
  offcanvas.innerHTML = html;
}

/**
 * Renderiza el contador de productos en el header.
 * @param {number} count
 */
export function renderHeaderCartCount(count) {
  const badge = document.getElementById('cart-count-badge');
  if (badge) badge.textContent = count;
}

/**
 * Renderiza un toast de feedback.
 * @param {string} msg
 * @param {string} type
 */
export function renderToasts(msg, type = 'info') {
  let toast = document.createElement('div');
  toast.className = `toast align-items-center text-bg-${type} border-0 show position-fixed bottom-0 end-0 m-3`;
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `<div class="d-flex"><div class="toast-body">${msg}</div><button type="button" class="btn-close btn-close-white ms-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button></div>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

/**
 * Renderiza un spinner de carga.
 * @param {HTMLElement} container
 */
export function renderSpinners(container) {
  if (container) container.innerHTML = '<div class="d-flex justify-content-center py-5"><div class="spinner-border text-cyan" role="status"><span class="visually-hidden">Cargando...</span></div></div>';
}

/**
 * Renderiza un mensaje de error.
 * @param {HTMLElement} container
 * @param {string} msg
 */
export function renderErrorMsg(container, msg) {
  if (container) container.innerHTML = `<div class="alert alert-danger text-center">${msg}</div>`;
}

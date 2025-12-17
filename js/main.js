
import { loadProducts, getProducts } from './modules/productManager.js';
import {
  renderHeader,
  renderFooter,
  renderHero,
  renderProductGrid,
  renderPagination,
  renderProductModal,
  renderCartSidebar,
  renderHeaderCartCount,
  renderToasts,
  renderSpinners,
  renderErrorMsg
} from './modules/uiRenderer.js';
import {
  getCart,
  addItem,
  updateQty,
  removeItem,
  clearCart,
  calculateTotals
} from './modules/cartManager.js';
import { debounce } from './modules/utils.js';

window.addEventListener('DOMContentLoaded', async () => {
  renderHeader();
  renderFooter();
  if (document.getElementById('hero-section')) {
    renderHero();
  }
  // --- PRODUCTOS ---
  const grid = document.getElementById('product-grid');
  if (grid) {
    renderSpinners(grid);
    try {
      await loadProducts();
      let state = {
        page: 1,
        perPage: 9,
        filter: '',
        query: '',
        sort: 'price-asc'
      };
      const renderAll = () => {
        const { products, meta } = getProducts(state);
        renderProductGrid(products, grid);
        renderPagination(meta, (page) => {
          state.page = page;
          renderAll();
        });
        renderHeaderCartCount(getCart().reduce((a, i) => a + i.qty, 0));
      };
      renderAll();

      // Filtros y búsqueda
      const searchInput = document.getElementById('search-input');
      const catFilter = document.getElementById('category-filter');
      const sortFilter = document.getElementById('sort-filter');
      if (searchInput) {
        searchInput.addEventListener('input', debounce(e => {
          state.query = e.target.value;
          state.page = 1;
          renderAll();
        }, 300));
      }
      if (catFilter) {
        catFilter.addEventListener('change', e => {
          state.filter = e.target.value;
          state.page = 1;
          renderAll();
        });
      }
      if (sortFilter) {
        sortFilter.addEventListener('change', e => {
          state.sort = e.target.value;
          renderAll();
        });
      }

      // Delegación de eventos en grid
      grid.addEventListener('click', e => {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;
        const id = btn.dataset.id;
        if (btn.dataset.action === 'view') {
          const { products } = getProducts({ perPage: 1000 });
          const prod = products.find(p => p.id === id);
          if (prod) renderProductModal(prod);
        }
        if (btn.dataset.action === 'add') {
          addItem(id, 1);
          renderHeaderCartCount(getCart().reduce((a, i) => a + i.qty, 0));
          renderToasts('Producto agregado al carrito', 'success');
        }
      });
    } catch (e) {
      renderErrorMsg(grid, 'Error al cargar productos. Intente más tarde.');
    }
  }

  // --- CARRITO SIDEBAR ---
  const updateCartSidebar = () => {
    renderCartSidebar(getCart());
    renderHeaderCartCount(getCart().reduce((a, i) => a + i.qty, 0));
  };
  updateCartSidebar();
  window.addEventListener('cart:updated', updateCartSidebar);

  // Delegación de eventos carrito
  document.body.addEventListener('click', e => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = btn.dataset.id;
    if (btn.dataset.action === 'inc') {
      updateQty(id, getCart().find(i => i.productId === id).qty + 1);
    }
    if (btn.dataset.action === 'dec') {
      updateQty(id, getCart().find(i => i.productId === id).qty - 1);
    }
    if (btn.dataset.action === 'remove') {
      removeItem(id);
      renderToasts('Producto eliminado', 'danger');
    }
    if (btn.id === 'clear-cart-btn') {
      clearCart();
      renderToasts('Carrito vaciado', 'danger');
    }
  });

  // Checkout a WhatsApp
  document.body.addEventListener('click', e => {
    if (e.target && e.target.id === 'checkout-btn') {
      const offcanvas = document.getElementById('cartOffcanvas');
      if (!offcanvas) return;
      offcanvas.innerHTML = `<div class="offcanvas-header">
        <h5 class="offcanvas-title">Finalizar compra</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Cerrar"></button>
      </div>
      <div class="offcanvas-body">
        <form id="checkout-form" autocomplete="off">
          <div class="mb-3">
            <label for="checkout-name" class="form-label">Nombre</label>
            <input type="text" class="form-control" id="checkout-name" required>
          </div>
          <div class="mb-3">
            <label for="checkout-email" class="form-label">Email</label>
            <input type="email" class="form-control" id="checkout-email" required>
          </div>
          <div class="mb-3">
            <label for="checkout-address" class="form-label">Dirección</label>
            <input type="text" class="form-control" id="checkout-address" required>
          </div>
          <button type="submit" class="btn btn-cyan w-100">Enviar a WhatsApp</button>
        </form>
      </div>`;
    }
  });
  document.body.addEventListener('submit', e => {
    if (e.target && e.target.id === 'checkout-form') {
      e.preventDefault();
      const name = document.getElementById('checkout-name').value.trim();
      const email = document.getElementById('checkout-email').value.trim();
      const address = document.getElementById('checkout-address').value.trim();
      if (!name || !email || !address) {
        renderToasts('Todos los campos son obligatorios', 'danger');
        return;
      }
      
      // Generar mensaje de WhatsApp
      const cart = getCart();
      const { products } = getProducts({ perPage: 1000 });
      const { subtotal, impuestos, total } = calculateTotals(cart, products);
      
      let mensaje = `*PEDIDO DE COMPRA*%0A%0A`;
      mensaje += `*Cliente:* ${name}%0A`;
      mensaje += `*Email:* ${email}%0A`;
      mensaje += `*Dirección:* ${address}%0A`;
      mensaje += `%0A*PRODUCTOS:*%0A`;
      
      cart.forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        if (prod) {
          const precioUnitario = prod.price;
          const precioTotal = precioUnitario * item.qty;
          mensaje += `• ${prod.name}%0A`;
          mensaje += `  Cantidad: ${item.qty} x ${precioUnitario.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })} = ${precioTotal.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}%0A`;
        }
      });
      
      mensaje += `%0A*TOTALES:*%0A`;
      mensaje += `Subtotal: ${subtotal.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}%0A`;
      mensaje += `Impuestos (21%): ${impuestos.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}%0A`;
      mensaje += `*TOTAL: ${total.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}*`;
      
      // Enviar a WhatsApp
      const whatsappUrl = `https://wa.me/5491568908235?text=${mensaje}`;
      window.open(whatsappUrl, '_blank');
      
      // Limpiar carrito y mostrar confirmación
      clearCart();
      renderToasts('¡Pedido enviado a WhatsApp!', 'success');
      renderHeaderCartCount(0);
      setTimeout(() => {
        const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(document.getElementById('cartOffcanvas'));
        bsOffcanvas.hide();
        updateCartSidebar();
      }, 1200);
    }
  });

  // --- CONTACTO: feedback decorativo ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      renderToasts('Mensaje enviado. ¡Gracias por contactarnos!', 'success');
      contactForm.reset();
    });
  }
});

/**
 * Módulo para gestión del carrito.
 * @module cartManager
 */
import { setItemLS, getItemLS, dispatchCustomEvent } from './utils.js';

const CART_KEY = 'EG_CART';

/**
 * Obtiene el carrito desde LocalStorage.
 * @returns {Array}
 */
export function getCart() {
  return getItemLS(CART_KEY) || [];
}

/**
 * Guarda el carrito en LocalStorage.
 * @param {Array} cart
 */
export function saveCart(cart) {
  setItemLS(CART_KEY, cart);
  dispatchCustomEvent('cart:updated', { cart });
}

/**
 * Añade un producto al carrito.
 * @param {string} productId
 * @param {number} qty
 */
export function addItem(productId, qty=1) {
  const cart = getCart();
  const idx = cart.findIndex(i => i.productId === productId);
  if (idx > -1) {
    cart[idx].qty += qty;
  } else {
    cart.push({ productId, qty });
  }
  saveCart(cart);
}

/**
 * Modifica la cantidad de un producto.
 * @param {string} productId
 * @param {number} qty
 */
export function updateQty(productId, qty) {
  const cart = getCart();
  const idx = cart.findIndex(i => i.productId === productId);
  if (idx > -1) {
    cart[idx].qty = qty;
    if (cart[idx].qty <= 0) cart.splice(idx, 1);
    saveCart(cart);
  }
}

/**
 * Elimina un producto del carrito.
 * @param {string} productId
 */
export function removeItem(productId) {
  let cart = getCart();
  cart = cart.filter(i => i.productId !== productId);
  saveCart(cart);
}

/**
 * Limpia el carrito.
 */
export function clearCart() {
  saveCart([]);
}

/**
 * Calcula totales del carrito.
 * @param {Array} cart
 * @param {Array} products
 * @returns {{subtotal:number, impuestos:number, total:number}}
 */
export function calculateTotals(cart, products) {
  const subtotal = cart.reduce((acc, item) => {
    const prod = products.find(p => p.id === item.productId);
    return prod ? acc + prod.price * item.qty : acc;
  }, 0);
  const impuestos = subtotal * 0.21;
  const total = subtotal + impuestos;
  return { subtotal, impuestos, total };
}

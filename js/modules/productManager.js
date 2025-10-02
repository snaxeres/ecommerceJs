/**
 * Módulo para gestión de productos.
 * @module productManager
 */
import { setItemLS, getItemLS } from './utils.js';

const PRODUCTS_KEY = 'EG_PRODUCTS';
let productsCache = [];

/**
 * Carga productos desde products.json y los guarda en LocalStorage.
 * Si falla, intenta cargar desde LocalStorage.
 * @returns {Promise<void>}
 */
export async function loadProducts() {
  try {
    const res = await fetch('data/products.json');
    if (!res.ok) throw new Error('Fetch error');
    const data = await res.json();
    setItemLS(PRODUCTS_KEY, data);
    productsCache = data;
  } catch (e) {
    const local = getItemLS(PRODUCTS_KEY);
    if (local) {
      productsCache = local;
    } else {
      throw new Error('No se pudieron cargar productos');
    }
  }
}

/**
 * Devuelve productos paginados, filtrados y ordenados.
 * @param {Object} params
 * @param {number} params.page
 * @param {number} params.perPage
 * @param {string} [params.filter]
 * @param {string} [params.query]
 * @param {string} [params.sort]
 * @returns {{products: Array, meta: Object}}
 */
export function getProducts({page=1, perPage=9, filter='', query='', sort=''} = {}) {
  let arr = [...productsCache];
  if (filter) arr = filterByCategory(arr, filter);
  if (query) arr = search(arr, query);
  if (sort) arr = sortBy(arr, sort);
  const total = arr.length;
  const start = (page-1)*perPage;
  const end = start+perPage;
  return {
    products: arr.slice(start, end),
    meta: { page, perPage, total, pages: Math.ceil(total/perPage) }
  };
}

/**
 * Filtra productos por categoría.
 * @param {Array} arr
 * @param {string} category
 * @returns {Array}
 */
export function filterByCategory(arr, category) {
  return arr.filter(p => p.category === category);
}

/**
 * Busca productos por nombre/descripción.
 * @param {Array} arr
 * @param {string} query
 * @returns {Array}
 */
export function search(arr, query) {
  const q = query.trim().toLowerCase();
  return arr.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
}

/**
 * Ordena productos por campo/dirección.
 * @param {Array} arr
 * @param {string} sort
 * @returns {Array}
 */
export function sortBy(arr, sort) {
  if (sort === 'price-asc') return arr.sort((a,b) => a.price-b.price);
  if (sort === 'price-desc') return arr.sort((a,b) => b.price-a.price);
  if (sort === 'rating-desc') return arr.sort((a,b) => b.rating-a.rating);
  return arr;
}

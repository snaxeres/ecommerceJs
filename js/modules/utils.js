/**
 * Utilidades generales para el proyecto.
 * @module utils
 */

/**
 * Formatea un número como moneda ARS.
 * @param {number} value
 * @returns {string}
 */
export function formatCurrency(value) {
  return value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 });
}

/**
 * Debounce para funciones.
 * @param {Function} fn
 * @param {number} ms
 * @returns {Function}
 */
export function debounce(fn, ms) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

/**
 * Crea un elemento DOM con atributos.
 * @param {string} tag
 * @param {Object} attrs
 * @returns {HTMLElement}
 */
export function createEl(tag, attrs = {}) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k.startsWith('on') && typeof v === 'function') {
      el.addEventListener(k.slice(2).toLowerCase(), v);
    } else if (k === 'class') {
      el.className = v;
    } else if (k === 'html') {
      el.innerHTML = v;
    } else {
      el.setAttribute(k, v);
    }
  }
  return el;
}

/**
 * Guarda un valor en LocalStorage.
 * @param {string} key
 * @param {any} value
 */
export function setItemLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Obtiene un valor de LocalStorage.
 * @param {string} key
 * @returns {any}
 */
export function getItemLS(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

/**
 * Despacha un evento custom global.
 * @param {string} name
 * @param {Object} detail
 */
export function dispatchCustomEvent(name, detail) {
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

/**
 * Validadores simples.
 */
export function isEmail(str) {
  return /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(str);
}
export function isNotEmpty(str) {
  return !!str && str.trim().length > 0;
}

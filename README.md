# Ecommerce Gaming

Sitio e-commerce temático gaming, moderno, responsive y mantenible, desarrollado en Vanilla JS (ES6 modules) y Bootstrap 5.3+.

## Instalación y uso

1. **Clonar o descargar el repositorio.**
2. **Abrir la carpeta `ecommerce-gaming` en VS Code.**
3. **Iniciar un servidor local** para poder hacer fetch de `products.json` (requerido por políticas de los navegadores):
   - Con Live Server (extensión VS Code) o
   - `npx http-server` (Node.js)
4. Acceder a `index.html` desde el navegador.

## Estructura del proyecto

```
ecommerce-gaming/
├── index.html
├── products.html
├── contact.html
├── css/
│   └── styles.css
├── js/
│   ├── main.js
│   ├── modules/
│   │   ├── productManager.js
│   │   ├── cartManager.js
│   │   ├── uiRenderer.js
│   │   └── utils.js
├── data/
│   └── products.json
└── assets/
    └── images/
```

## Funcionalidades principales

- **Catálogo de productos** con filtros, búsqueda en tiempo real (debounce 300ms), ordenamiento y paginación.
- **Carrito persistente** (LocalStorage), sidebar offcanvas, CRUD completo, validación de stock y totales dinámicos.
- **Checkout simulado** con validación de formulario y feedback visual.
- **Modal de producto** con detalles completos y agregar al carrito.
- **Feedback visual**: loaders, toasts, mensajes de error.
- **Accesibilidad mínima**: alt en imágenes, labels, aria.
- **Estilo moderno**: paleta #0b0f1a, #00F5D4, #7c3aed, #ef4444, #06b6d4, tipografía Orbitron/Poppins, animaciones sutiles.

## Módulos JavaScript

- `productManager.js`: carga, filtrado, búsqueda, orden y paginación de productos.
- `cartManager.js`: gestión y persistencia del carrito, totales, eventos custom.
- `uiRenderer.js`: renderizado de UI, modals, toasts, spinners, paginación, feedback.
- `utils.js`: utilidades, debounce, formateo, validadores, helpers DOM.

## Consideraciones

- **No requiere frameworks JS**. Solo ES6 modules y Bootstrap (CDN).
- **Para fetch local de products.json es obligatorio usar servidor local.**
- **Imágenes de productos**: usar las rutas indicadas en `products.json` (pueden ser reemplazadas por imágenes reales si se desea).

## Autor
- Enrique Alegre

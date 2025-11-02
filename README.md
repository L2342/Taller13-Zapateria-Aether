


<p align="center">
  <img src="public/Logo.png" alt="Logo Casa Alveré" width="300" />
</p>

# Casa Alveré (Bootstrap + TypeScript + Express)

<p align="center">
  <img src="https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express"/>
  <img src="https://img.shields.io/badge/Cookie--Session-ffca28?style=for-the-badge" alt="Cookie-Session"/>
</p>

Tienda de zapatos de ejemplo con frontend en Bootstrap y backend en Express (TypeScript). Incluye carrito persistente y catálogo de productos.

## Integrantes y Roles

- Samuel David Bolívar Trujillo — Desarrollador Fullstack
- Juan David Calderón Diaz - Tester y Security Manager
- Daniela Fierro Madrigal - Tester y Security Assistant

## Dependencias Utilizadas

- express
- cors
- cookie-session
- typescript
- ts-node

## Rutas del Backend

**/api/products**
- `GET /api/products` — Lista todos los productos
- `GET /api/products/:id` — Devuelve un producto por id

**/api/cart**
- `GET /api/cart` — Devuelve el carrito actual (JSON)
- `POST /api/cart/add` — Agrega producto al carrito `{ productId, qty }`
- `POST /api/cart/remove` — Elimina producto del carrito `{ productId }`
- `POST /api/cart/clear` — Vacía el carrito
- `GET /api/cart/total` — Devuelve el total del carrito `{ total }`

## Funcionamiento del Carrito e Integración Front-Back

- El carrito se almacena en el archivo `src/data/data.json` usando utilidades con `fs.promises`.
- Cada vez que se agrega, elimina o limpia el carrito, el backend actualiza este archivo.
- El frontend (JS) consume las rutas del backend usando `fetch` para mostrar productos, agregar al carrito y actualizar el total en tiempo real.
- Se utiliza un Toast de Bootstrap para notificar visualmente cuando un producto es agregado al carrito.

---

## Requisitos
- Node.js 18+
- npm

## Instalación
```bash
npm install
```

## Desarrollo con ts-node
```bash
npm run dev
```
Visita: http://localhost:3000

## Producción (build + start)
```bash
npm run build
npm start
```

## Estructura
```
zapateria-app/
├─ public/
│  ├─ index.html
│  ├─ cart.html
│  ├─ js/
│  │  ├─ app.js
│  │  └─ cart.js
│  └─ img/
│     └─ shoe_*.png
├─ src/
│  ├─ routes/
│  │  ├─ products.ts
│  │  └─ cart.ts
│  ├─ types/
│  │  └─ index.d.ts
│  └─ server.ts
├─ package.json
├─ tsconfig.json
└─ README.md
```

## Notas
- Este proyecto usa `type: module` para ESM.
- Las imágenes son generadas localmente y sirven como placeholders.

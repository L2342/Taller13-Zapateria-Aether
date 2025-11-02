import { Router } from "express";
import type { CartItem } from "../types/index.d.js";
import productsRouter from "./products.ts";
import type { Product } from "../types/index.d.js";


// Obtener productos del catálogo (import indirecto)
let products: Product[] = [];
try {
  // @ts-ignore
  products = (await import("./products")).default.products || [];
} catch {
  // fallback para import estático
  products = [
    { id: 1, name: "Runner Azul", price: 199999, image: "/img/shoe_1.png", description: "Zapatilla ligera para correr, malla transpirable.", stock: 12 },
    { id: 2, name: "Classic Rojo", price: 149999, image: "/img/shoe_2.png", description: "Clásico urbano para uso diario.", stock: 24 },
    { id: 3, name: "Eco Verde", price: 179999, image: "/img/shoe_3.png", description: "Materiales reciclados, cómodo y resistente.", stock: 8 },
    { id: 4, name: "Urban Naranja", price: 159999, image: "/img/shoe_4.png", description: "Estilo urbano con suela de alta tracción.", stock: 16 },
    { id: 5, name: "Sport Morado", price: 189999, image: "/img/shoe_5.png", description: "Para entrenamientos de alto rendimiento.", stock: 10 },
    { id: 6, name: "Trail Gris", price: 209999, image: "/img/shoe_6.png", description: "Ideal para montaña y terrenos irregulares.", stock: 7 },
    { id: 7, name: "Stellar Negro", price: 219999, image: "/img/shoe_7.png", description: "Diseño futurista con máxima comodidad.", stock: 5 },
    { id: 8, name: "Vibe Beige", price: 169999, image: "/img/shoe_8.png", description: "Estilo casual y minimalista, adaptable a diversas ocasiones urbanas.", stock: 20 },
    { id: 9, name: "Pulse Aqua", price: 195000, image: "/img/shoe_9.png", description: "Zapatilla deportiva con tecnología de amortiguación avanzada para mayor confort durante el ejercicio.", stock: 14 }
  ];
}

const router = Router();
// Ruta para calcular el total del carrito
router.get("/total", (req, res) => {
  const cart: CartItem[] = (req.session as any).cart || [];
  let total = 0;
  for (const item of cart) {
    const prod = products.find(p => p.id === item.productId);
    if (prod) total += prod.price * item.qty;
  }
  res.status(200).json({
    message: "Success",
    total: total
  });
});

// Cart is stored per-session in cookie-session
router.get("/", (req, res) => {
  const cart: CartItem[] = (req.session as any).cart || [];
  res.json(cart);
});

router.post("/add", (req, res) => {
  const { productId, qty } = req.body as CartItem;
  if (!productId || qty == null || qty <= 0) {
    return res.status(400).json({ error: "Datos inválidos" });
  }
  const sess: any = req.session;
  sess.cart = sess.cart || [];
  const idx = sess.cart.findIndex((i: CartItem) => i.productId === productId);
  if (idx >= 0) sess.cart[idx].qty += qty;
  else sess.cart.push({ productId, qty });
  res.json({ ok: true, cart: sess.cart });
});

router.post("/remove", (req, res) => {
  const { productId } = req.body as { productId: number };
  if (!productId) return res.status(400).json({ error: "productId requerido" });
  const sess: any = req.session;
  sess.cart = (sess.cart || []).filter((i: CartItem) => i.productId !== productId);
  res.json({ ok: true, cart: sess.cart });
});

router.post("/clear", (req, res) => {
  (req.session as any).cart = [];
  res.json({ ok: true, cart: [] });
});

export default router;

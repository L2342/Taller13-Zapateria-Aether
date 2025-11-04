import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/server';
import productsData from '../src/data/data.json';

// Definición del tipo Product para representar un producto
type Product = {
  id: string | number;
  name: string;
  price: number;
  [key: string]: any;
};

// Conversión de los datos importados al tipo Product[]
const products: Product[] = productsData as Product[];

describe('Pruebas de la API de productos', () => {
  it('retornar todos los productos con los campos correctos', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('name');
    expect(res.body[0]).toHaveProperty('price');
  });

  it('retornar los detalles de un producto válido por su ID', async () => {
    const listRes = await request(app).get('/api/products');
    expect(listRes.status).toBe(200);
    const product = listRes.body[0];
    expect(product).toBeDefined();
    const res = await request(app).get(`/api/products/${product.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', product.id);
  });

  it('servir archivos estáticos y retornar 404 para archivos inexistentes', async () => {
    const res = await request(app).get('/index.html');
    expect(res.status).toBe(200);

    const missing = await request(app).get('/nonexistent.html');
    expect(missing.status).toBe(404);
  });

  it('garantizar la consistencia de los datos de los productos', () => {
    const ids = products.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size); // No deben existir IDs duplicados

    // Verificación de que cada producto contenga los campos requeridos
    products.forEach((product) => {
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('price');
    });
  });
});

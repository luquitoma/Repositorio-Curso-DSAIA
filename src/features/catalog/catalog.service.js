import { pool } from '../../shared/db.js';

export async function listCategories() {
  const [rows] = await pool.execute(
    'SELECT id, name, slug, description FROM categories ORDER BY name'
  );
  return rows;
}

export async function listProducts(categorySlug) {
  const query = `SELECT p.id, p.name, p.slug, p.description, p.price_cents, p.image_url,
    p.available, c.name AS category_name, c.slug AS category_slug
    FROM products p JOIN categories c ON c.id = p.category_id
    ${categorySlug ? 'WHERE c.slug = ?' : ''}
    ORDER BY p.name`;
  const [rows] = await pool.execute(query, categorySlug ? [categorySlug] : []);
  return rows;
}

export async function findProduct(slug) {
  const [rows] = await pool.execute(
    `SELECT p.id, p.name, p.slug, p.description, p.price_cents, p.image_url,
      p.available, c.name AS category_name, c.slug AS category_slug
     FROM products p JOIN categories c ON c.id = p.category_id WHERE p.slug = ?`,
    [slug]
  );
  return rows[0] || null;
}

export async function createCategory({ name, slug, description }) {
  const [result] = await pool.execute(
    'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)',
    [name.trim(), slug.trim(), description.trim()]
  );
  return { id: result.insertId, name, slug, description };
}

export async function createProduct({ categoryId, name, slug, description, priceCents, imageUrl }) {
  const [result] = await pool.execute(
    `INSERT INTO products
      (category_id, name, slug, description, price_cents, image_url)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [categoryId, name.trim(), slug.trim(), description.trim(), priceCents, imageUrl || null]
  );
  return { id: result.insertId, name, slug, description, price_cents: priceCents };
}

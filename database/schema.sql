CREATE DATABASE IF NOT EXISTS instrument_store;
USE instrument_store;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(120) NOT NULL,
  role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
  balance_cents BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  slug VARCHAR(120) NOT NULL UNIQUE,
  description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id INT UNSIGNED NOT NULL,
  name VARCHAR(160) NOT NULL,
  slug VARCHAR(160) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  price_cents BIGINT UNSIGNED NOT NULL,
  image_url VARCHAR(500),
  available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS balance_movements (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  amount_cents BIGINT NOT NULL,
  type ENUM('credit', 'debit') NOT NULL,
  reason VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_movements_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS orders (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  total_cents BIGINT UNSIGNED NOT NULL,
  status ENUM('simulated', 'cancelled') NOT NULL DEFAULT 'simulated',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  product_id INT UNSIGNED NOT NULL,
  product_name VARCHAR(160) NOT NULL,
  unit_price_cents BIGINT UNSIGNED NOT NULL,
  quantity INT UNSIGNED NOT NULL DEFAULT 1,
  CONSTRAINT fk_items_order FOREIGN KEY (order_id) REFERENCES orders(id),
  CONSTRAINT fk_items_product FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT IGNORE INTO categories (name, slug, description) VALUES
  ('Cordas', 'cordas', 'Violões, guitarras e instrumentos de cordas para todos os estilos.'),
  ('Teclas', 'teclas', 'Pianos digitais e teclados para estudo, palco e produção.'),
  ('Percussão', 'percussao', 'Baterias e instrumentos de ritmo para criar sua música.'),
  ('Sopro', 'sopro', 'Instrumentos de sopro para performances expressivas.');

INSERT IGNORE INTO products (category_id, name, slug, description, price_cents, image_url)
SELECT id, 'Violão Aurora', 'violao-aurora',
  'Violão acústico de timbre equilibrado para estudo e apresentações.', 89900,
  'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800'
FROM categories WHERE slug = 'cordas';

INSERT IGNORE INTO products (category_id, name, slug, description, price_cents, image_url)
SELECT id, 'Teclado Horizonte', 'teclado-horizonte',
  'Teclado versátil com sons para prática e composição.', 129900,
  'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800'
FROM categories WHERE slug = 'teclas';

INSERT IGNORE INTO products (category_id, name, slug, description, price_cents, image_url)
SELECT id, 'Bateria Pulso', 'bateria-pulso',
  'Conjunto de bateria compacto para exercitar seu ritmo.', 219900,
  'https://images.unsplash.com/photo-1543443258-92b04ad5ec67?w=800'
FROM categories WHERE slug = 'percussao';

INSERT IGNORE INTO products (category_id, name, slug, description, price_cents, image_url)
SELECT id, 'Saxofone Brisa', 'saxofone-brisa',
  'Saxofone com projeção clara para músicos iniciantes e experientes.', 174900,
  'https://images.unsplash.com/photo-1605020420620-20c943cc4669?w=800'
FROM categories WHERE slug = 'sopro';

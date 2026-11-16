import { withTransaction } from '../../shared/db.js';

export async function purchase({ userId, productId }) {
  return withTransaction(async (connection) => {
    const [products] = await connection.execute(
      'SELECT id, name, price_cents, available FROM products WHERE id = ? FOR UPDATE',
      [productId]
    );
    if (!products.length || !products[0].available) {
      const error = new Error('Produto indisponível para compra.');
      error.status = 409;
      throw error;
    }
    const product = products[0];
    const [users] = await connection.execute(
      'SELECT balance_cents FROM users WHERE id = ? FOR UPDATE',
      [userId]
    );
    if (!users.length || users[0].balance_cents < product.price_cents) {
      const error = new Error('Saldo fictício insuficiente.');
      error.status = 422;
      throw error;
    }
    const [order] = await connection.execute(
      'INSERT INTO orders (user_id, total_cents) VALUES (?, ?)',
      [userId, product.price_cents]
    );
    await connection.execute(
      'INSERT INTO order_items (order_id, product_id, product_name, unit_price_cents) VALUES (?, ?, ?, ?)',
      [order.insertId, product.id, product.name, product.price_cents]
    );
    await connection.execute(
      'UPDATE users SET balance_cents = balance_cents - ? WHERE id = ?',
      [product.price_cents, userId]
    );
    await connection.execute(
      `INSERT INTO balance_movements (user_id, amount_cents, type, reason)
       VALUES (?, ?, 'debit', ?)`,
      [userId, product.price_cents, `Compra simulada #${order.insertId}`]
    );
    return { id: order.insertId, product: product.name, total_cents: product.price_cents };
  });
}

export async function listOrders(userId) {
  const [rows] = await import('../../shared/db.js').then(({ pool }) => pool.execute(
    `SELECT o.id, o.total_cents, o.status, o.created_at, i.product_name
     FROM orders o JOIN order_items i ON i.order_id = o.id
     WHERE o.user_id = ? ORDER BY o.created_at DESC`,
    [userId]
  ));
  return rows;
}

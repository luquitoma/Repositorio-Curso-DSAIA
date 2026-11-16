import { withTransaction } from '../../shared/db.js';

const MAX_CREDIT_CENTS = 1000000;

export async function addBalance({ userId, amountCents }) {
  if (!Number.isInteger(amountCents) || amountCents <= 0 || amountCents > MAX_CREDIT_CENTS) {
    const error = new Error('Informe um valor inteiro positivo dentro do limite permitido.');
    error.status = 400;
    throw error;
  }
  return withTransaction(async (connection) => {
    await connection.execute(
      'UPDATE users SET balance_cents = balance_cents + ? WHERE id = ?',
      [amountCents, userId]
    );
    await connection.execute(
      `INSERT INTO balance_movements (user_id, amount_cents, type, reason)
       VALUES (?, ?, 'credit', 'Crédito gerado no sandbox fictício')`,
      [userId, amountCents]
    );
    const [rows] = await connection.execute(
      'SELECT balance_cents FROM users WHERE id = ?',
      [userId]
    );
    return rows[0];
  });
}

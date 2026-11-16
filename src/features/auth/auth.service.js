import crypto from 'node:crypto';
import { pool } from '../../shared/db.js';

const sessions = new Map();
const sessionSecret = process.env.SESSION_SECRET || 'development-only-secret';

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, expected] = stored.split(':');
  const actual = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(actual, 'hex'), Buffer.from(expected, 'hex'));
}

function createToken(userId) {
  const payload = `${userId}.${Date.now()}`;
  const signature = crypto.createHmac('sha256', sessionSecret).update(payload).digest('hex');
  return `${payload}.${signature}`;
}

export function getSessionUser(request) {
  const token = request.headers.cookie?.match(/instrument_session=([^;]+)/)?.[1];
  const userId = token && sessions.get(token);
  return userId ? { id: userId } : null;
}

export function createSession(userId) {
  const token = createToken(userId);
  sessions.set(token, userId);
  return token;
}

export function removeSession(request) {
  const token = request.headers.cookie?.match(/instrument_session=([^;]+)/)?.[1];
  if (token) sessions.delete(token);
}

export async function register({ name, email, password }) {
  if (!name || !email || !password || password.length < 8) {
    const error = new Error('Nome, email e senha com pelo menos 8 caracteres são obrigatórios.');
    error.status = 400;
    throw error;
  }
  const normalizedEmail = email.trim().toLowerCase();
  const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [normalizedEmail]);
  if (existing.length) {
    const error = new Error('Este email já está cadastrado.');
    error.status = 409;
    throw error;
  }
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
    [name.trim(), normalizedEmail, hashPassword(password)]
  );
  return { id: result.insertId, name: name.trim(), email: normalizedEmail, role: 'customer' };
}

export async function login({ email, password }) {
  const [rows] = await pool.execute(
    'SELECT id, name, email, role, password_hash, balance_cents FROM users WHERE email = ?',
    [email.trim().toLowerCase()]
  );
  if (!rows.length || !verifyPassword(password, rows[0].password_hash)) {
    const error = new Error('Email ou senha inválidos.');
    error.status = 401;
    throw error;
  }
  const { password_hash: ignored, ...user } = rows[0];
  return user;
}

export async function currentUser(userId) {
  const [rows] = await pool.execute(
    'SELECT id, name, email, role, balance_cents FROM users WHERE id = ?',
    [userId]
  );
  return rows[0] || null;
}

export { hashPassword, verifyPassword };

import http from 'node:http';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import {
  register, login, createSession, getSessionUser, removeSession, currentUser
} from './features/auth/auth.service.js';
import {
  listCategories, listProducts, findProduct, createCategory, createProduct
} from './features/catalog/catalog.service.js';
import { addBalance } from './features/sandbox/sandbox.service.js';
import { purchase, listOrders } from './features/orders/orders.service.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const publicRoot = path.join(root, '..', 'public');
const port = Number(process.env.PORT || 3000);

function json(response, status, data, headers = {}) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...headers });
  response.end(JSON.stringify(data));
}

function errorResponse(response, error) {
  const status = Number.isInteger(error.status) ? error.status : 500;
  if (status === 500) console.error(error);
  json(response, status, { error: status === 500 ? 'Erro interno do servidor.' : error.message });
}

async function body(request) {
  let raw = '';
  for await (const chunk of request) raw += chunk;
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    const error = new Error('JSON inválido.');
    error.status = 400;
    throw error;
  }
}

async function requireUser(request) {
  const session = getSessionUser(request);
  if (!session) {
    const error = new Error('Autenticação necessária.');
    error.status = 401;
    throw error;
  }
  const user = await currentUser(session.id);
  if (!user) {
    const error = new Error('Sessão inválida.');
    error.status = 401;
    throw error;
  }
  return user;
}

async function requireAdmin(request) {
  const user = await requireUser(request);
  if (user.role !== 'admin') {
    const error = new Error('Acesso administrativo necessário.');
    error.status = 403;
    throw error;
  }
  return user;
}

async function api(request, response, url) {
  const { pathname, searchParams } = url;
  if (request.method === 'GET' && pathname === '/api/categories') {
    return json(response, 200, await listCategories());
  }
  if (request.method === 'GET' && pathname === '/api/products') {
    return json(response, 200, await listProducts(searchParams.get('category')));
  }
  if (request.method === 'GET' && pathname.startsWith('/api/products/')) {
    const product = await findProduct(pathname.split('/').pop());
    return product ? json(response, 200, product) : json(response, 404, { error: 'Produto não encontrado.' });
  }
  if (request.method === 'POST' && pathname === '/api/auth/register') {
    const user = await register(await body(request));
    return json(response, 201, user);
  }
  if (request.method === 'POST' && pathname === '/api/auth/login') {
    const user = await login(await body(request));
    return json(response, 200, user, {
      'Set-Cookie': `instrument_session=${createSession(user.id)}; HttpOnly; SameSite=Lax; Path=/`
    });
  }
  if (request.method === 'POST' && pathname === '/api/auth/logout') {
    removeSession(request);
    return json(response, 200, { ok: true }, {
      'Set-Cookie': 'instrument_session=; Max-Age=0; HttpOnly; SameSite=Lax; Path=/'
    });
  }
  if (request.method === 'GET' && pathname === '/api/auth/me') {
    return json(response, 200, await requireUser(request));
  }
  if (request.method === 'POST' && pathname === '/api/sandbox/credit') {
    const user = await requireUser(request);
    const result = await addBalance({ userId: user.id, amountCents: Number((await body(request)).amountCents) });
    return json(response, 200, result);
  }
  if (request.method === 'POST' && pathname === '/api/orders') {
    const user = await requireUser(request);
    return json(response, 201, await purchase({ userId: user.id, productId: Number((await body(request)).productId) }));
  }
  if (request.method === 'GET' && pathname === '/api/orders') {
    const user = await requireUser(request);
    return json(response, 200, await listOrders(user.id));
  }
  if (request.method === 'POST' && pathname === '/api/admin/categories') {
    await requireAdmin(request);
    return json(response, 201, await createCategory(await body(request)));
  }
  if (request.method === 'POST' && pathname === '/api/admin/products') {
    await requireAdmin(request);
    return json(response, 201, await createProduct(await body(request)));
  }
  return json(response, 404, { error: 'Rota não encontrada.' });
}

async function staticFile(request, response, url) {
  const requested = url.pathname === '/' ? '/index.html' : url.pathname;
  const filePath = path.normalize(path.join(publicRoot, requested));
  if (!filePath.startsWith(publicRoot)) return json(response, 403, { error: 'Acesso negado.' });
  try {
    const content = await readFile(filePath);
    const extension = path.extname(filePath);
    const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
    response.writeHead(200, { 'Content-Type': `${types[extension] || 'application/octet-stream'}; charset=utf-8` });
    response.end(content);
  } catch {
    if (request.method === 'GET') {
      const fallback = await readFile(path.join(publicRoot, 'index.html'));
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      response.end(fallback);
    } else {
      json(response, 404, { error: 'Recurso não encontrado.' });
    }
  }
}

export const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
    if (url.pathname.startsWith('/api/')) await api(request, response, url);
    else await staticFile(request, response, url);
  } catch (error) {
    errorResponse(response, error);
  }
});

if (process.env.NODE_ENV !== 'test') {
  server.listen(port, () => console.log(`Instrument Store em http://localhost:${port}`));
}

async function request(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
    body: options.body && JSON.stringify(options.body)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Não foi possível concluir a operação.');
  return data;
}

export const api = {
  categories: () => request('/categories'),
  products: (category) => request(`/products${category ? `?category=${encodeURIComponent(category)}` : ''}`),
  product: (slug) => request(`/products/${encodeURIComponent(slug)}`),
  me: () => request('/auth/me'),
  register: (body) => request('/auth/register', { method: 'POST', body }),
  login: (body) => request('/auth/login', { method: 'POST', body }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  credit: (amountCents) => request('/sandbox/credit', { method: 'POST', body: { amountCents } }),
  order: (productId) => request('/orders', { method: 'POST', body: { productId } }),
  orders: () => request('/orders'),
  createCategory: (body) => request('/admin/categories', { method: 'POST', body }),
  createProduct: (body) => request('/admin/products', { method: 'POST', body })
};

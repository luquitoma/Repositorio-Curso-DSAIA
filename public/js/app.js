import { api } from './api.js';

const app = document.querySelector('#app');
const categoryLinks = document.querySelector('#category-links');
const accountLink = document.querySelector('#account-link');
let categories = [];
let user = null;

const money = (cents) => `R$ ${(Number(cents) / 100).toFixed(2).replace('.', ',')}`;
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
const showToast = (message) => {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3500);
};
const card = (product) => `<article class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
  <img class="h-52 w-full object-cover" src="${escapeHtml(product.image_url || '')}" alt="${escapeHtml(product.name)}">
  <div class="p-5">
    <p class="text-xs font-bold uppercase tracking-wider text-amber">${escapeHtml(product.category_name)}</p>
    <h3 class="mt-2 text-xl font-bold">${escapeHtml(product.name)}</h3>
    <p class="mt-2 text-sm text-slate-600">${escapeHtml(product.description)}</p>
    <div class="mt-5 flex items-center justify-between">
      <strong>${money(product.price_cents)}</strong>
      <a class="rounded-full bg-ink px-4 py-2 text-sm font-bold text-white" href="#/produto/${product.slug}">Ver instrumento</a>
    </div>
  </div>
</article>`;

async function renderShell() {
  categories = await api.categories();
  categoryLinks.innerHTML = categories.map((category) =>
    `<a href="#/categoria/${category.slug}" class="hover:text-amber">${escapeHtml(category.name)}</a>`).join('');
  try { user = await api.me(); } catch { user = null; }
  accountLink.textContent = user ? `Olá, ${user.name.split(' ')[0]}` : 'Entrar';
}

async function renderHome() {
  const products = await api.products();
  app.innerHTML = `<section class="grid items-center gap-10 py-12 md:grid-cols-2">
    <div>
      <p class="font-bold uppercase tracking-[0.3em] text-amber">Encontre seu som</p>
      <h1 class="mt-4 text-5xl font-black leading-tight md:text-7xl">A música começa com uma escolha.</h1>
      <p class="mt-6 max-w-xl text-lg text-slate-600">Instrumentos selecionados para quem está começando,
        praticando e criando novas histórias.</p>
      <a href="#/sobre" class="mt-8 inline-block rounded-full bg-amber px-6 py-3 font-bold text-ink">Conheça nossa filosofia</a>
    </div>
    <div class="rounded-[2rem] bg-ink p-8 text-white shadow-xl">
      <p class="text-sm uppercase tracking-widest text-amber">Experiência Harmonia</p>
      <p class="mt-6 text-3xl font-bold">Explore categorias, descubra instrumentos e simule sua compra.</p>
      <p class="mt-6 text-slate-300">Tudo aqui é fictício: use o sandbox para experimentar sem qualquer cobrança real.</p>
    </div>
  </section>
  <section class="py-8">
    <div class="mb-6 flex items-end justify-between"><div><p class="font-bold text-amber">Seleção da casa</p><h2 class="text-3xl font-black">Um pouco de cada universo</h2></div></div>
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">${products.map(card).join('')}</div>
  </section>`;
}

async function renderCategory(slug) {
  const category = categories.find((item) => item.slug === slug);
  const products = await api.products(slug);
  app.innerHTML = `<section><p class="font-bold uppercase tracking-widest text-amber">Categoria</p>
    <h1 class="mt-2 text-5xl font-black">${escapeHtml(category?.name || 'Instrumentos')}</h1>
    <p class="mt-4 max-w-2xl text-slate-600">${escapeHtml(category?.description || '')}</p>
    <div class="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">${products.length ? products.map(card).join('') :
      '<p class="rounded-xl bg-white p-8 text-slate-600">Ainda não há instrumentos nesta categoria.</p>'}</div></section>`;
}

async function renderProduct(slug) {
  const product = await api.product(slug);
  app.innerHTML = `<section class="grid gap-10 md:grid-cols-2">
    <img class="h-[28rem] w-full rounded-3xl object-cover" src="${escapeHtml(product.image_url || '')}" alt="${escapeHtml(product.name)}">
    <div class="self-center"><p class="font-bold uppercase tracking-widest text-amber">${escapeHtml(product.category_name)}</p>
      <h1 class="mt-3 text-5xl font-black">${escapeHtml(product.name)}</h1>
      <p class="mt-6 text-lg text-slate-600">${escapeHtml(product.description)}</p>
      <p class="mt-8 text-3xl font-black">${money(product.price_cents)}</p>
      <p class="mt-3 text-sm text-slate-500">Compra totalmente fictícia, sem pagamento ou entrega real.</p>
      <button id="buy" class="mt-8 rounded-full bg-amber px-6 py-3 font-bold disabled:opacity-50" ${product.available ? '' : 'disabled'}>
        ${product.available ? 'Simular compra' : 'Indisponível'}
      </button></div></section>`;
  document.querySelector('#buy')?.addEventListener('click', async () => {
    try { await api.order(product.id); showToast('Compra simulada criada com sucesso.'); await renderAccount(); }
    catch (error) { showToast(error.message); }
  });
}

function renderAbout() {
  app.innerHTML = `<section class="mx-auto max-w-3xl py-10"><p class="font-bold uppercase tracking-widest text-amber">Sobre a Harmonia</p>
    <h1 class="mt-3 text-5xl font-black">Instrumentos para aproximar pessoas da própria voz.</h1>
    <p class="mt-8 text-lg leading-8 text-slate-600">Acreditamos que aprender música é construir uma relação
      paciente, curiosa e pessoal com o som. Por isso, nossa loja fictícia apresenta opções para diferentes
      caminhos, sem prometer atalhos e sem transformar a descoberta em pressão.</p>
    <p class="mt-5 text-lg leading-8 text-slate-600">A experiência é transparente: o saldo e os pedidos são
      demonstrações, não representam dinheiro real e não envolvem cobrança, entrega ou saque.</p></section>`;
}

function renderContact() {
  app.innerHTML = `<section class="mx-auto max-w-2xl py-10"><p class="font-bold uppercase tracking-widest text-amber">Contato</p>
    <h1 class="mt-3 text-5xl font-black">Vamos conversar sobre música?</h1>
    <p class="mt-6 text-lg text-slate-600">Para conhecer mais sobre o projeto, visite o perfil:</p>
    <a class="mt-8 inline-block rounded-full bg-ink px-6 py-3 font-bold text-white" href="https://github.com/luquitoma" target="_blank" rel="noreferrer">github.com/luquitoma</a></section>`;
}

function renderAuth() {
  app.innerHTML = `<section class="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
    <form id="login" class="rounded-2xl bg-white p-8 shadow-sm"><h1 class="text-3xl font-black">Entrar</h1>
      <label class="mt-6 block text-sm font-bold">Email<input required type="email" name="email" class="mt-2 w-full rounded-lg border p-3"></label>
      <label class="mt-4 block text-sm font-bold">Senha<input required type="password" name="password" class="mt-2 w-full rounded-lg border p-3"></label>
      <button class="mt-6 rounded-full bg-ink px-5 py-3 font-bold text-white">Entrar</button></form>
    <form id="register" class="rounded-2xl bg-white p-8 shadow-sm"><h2 class="text-3xl font-black">Criar conta</h2>
      <label class="mt-6 block text-sm font-bold">Nome<input required name="name" class="mt-2 w-full rounded-lg border p-3"></label>
      <label class="mt-4 block text-sm font-bold">Email<input required type="email" name="email" class="mt-2 w-full rounded-lg border p-3"></label>
      <label class="mt-4 block text-sm font-bold">Senha (8+ caracteres)<input required minlength="8" type="password" name="password" class="mt-2 w-full rounded-lg border p-3"></label>
      <button class="mt-6 rounded-full bg-amber px-5 py-3 font-bold">Cadastrar</button></form></section>`;
  document.querySelector('#login').addEventListener('submit', async (event) => {
    event.preventDefault();
    try { await api.login(Object.fromEntries(new FormData(event.target))); location.hash = '/conta'; }
    catch (error) { showToast(error.message); }
  });
  document.querySelector('#register').addEventListener('submit', async (event) => {
    event.preventDefault();
    try { await api.register(Object.fromEntries(new FormData(event.target))); showToast('Conta criada. Agora entre com seus dados.'); }
    catch (error) { showToast(error.message); }
  });
}

async function renderAccount() {
  if (!user) return renderAuth();
  user = await api.me();
  const orders = await api.orders();
  app.innerHTML = `<section><div class="flex flex-wrap items-end justify-between gap-4"><div><p class="font-bold text-amber">Minha conta</p>
    <h1 class="mt-2 text-5xl font-black">${escapeHtml(user.name)}</h1></div><button id="logout" class="rounded-full border border-ink px-5 py-2 font-bold">Sair</button></div>
    <div class="mt-10 grid gap-6 md:grid-cols-2"><div class="rounded-2xl bg-ink p-8 text-white"><p class="text-sm uppercase tracking-widest text-amber">Saldo fictício</p>
      <p class="mt-3 text-4xl font-black">${money(user.balance_cents)}</p><p class="mt-3 text-sm text-slate-300">Sem valor monetário real.</p>
      <form id="credit" class="mt-6 flex gap-2"><input name="amount" type="number" min="1" step="1" placeholder="Valor em R$" class="min-w-0 flex-1 rounded-lg p-3 text-ink"><button class="rounded-lg bg-amber px-4 font-bold text-ink">Gerar</button></form></div>
      <div class="rounded-2xl bg-white p-8 shadow-sm"><h2 class="text-2xl font-black">Sandbox</h2><p class="mt-3 text-slate-600">Gere créditos de demonstração e simule compras sem cobrança.</p><a href="#/" class="mt-6 inline-block font-bold text-amber">Continuar explorando →</a></div></div>
    ${user.role === 'admin' ? '<a href="#/admin" class="mt-6 inline-block font-bold text-amber">Abrir painel administrativo →</a>' : ''}
    <h2 class="mt-12 text-3xl font-black">Histórico simulado</h2><div class="mt-5 space-y-3">${orders.length ? orders.map((order) =>
      `<div class="flex flex-wrap justify-between gap-3 rounded-xl bg-white p-5 shadow-sm"><span><strong>#${order.id}</strong> ${escapeHtml(order.product_name)}<small class="ml-3 text-slate-500">${new Date(order.created_at).toLocaleDateString('pt-BR')}</small></span><strong>${money(order.total_cents)}</strong></div>`).join('') :
      '<p class="mt-4 text-slate-600">Nenhuma compra simulada ainda.</p>'}</div></section>`;
  document.querySelector('#logout').addEventListener('click', async () => { await api.logout(); user = null; location.hash = '/'; });
  document.querySelector('#credit').addEventListener('submit', async (event) => {
    event.preventDefault();
    try { await api.credit(Math.round(Number(new FormData(event.target).get('amount')) * 100)); showToast('Saldo fictício atualizado.'); await renderAccount(); }
    catch (error) { showToast(error.message); }
  });
}

function renderAdmin() {
  if (!user || user.role !== 'admin') return renderAuth();
  app.innerHTML = `<section><p class="font-bold text-amber">Gestão do catálogo</p><h1 class="mt-2 text-5xl font-black">Painel administrativo</h1>
    <p class="mt-4 max-w-2xl text-slate-600">Cadastre categorias e produtos que aparecerão no catálogo público.</p>
    <div class="mt-10 grid gap-8 md:grid-cols-2"><form id="new-category" class="rounded-2xl bg-white p-8 shadow-sm"><h2 class="text-2xl font-black">Nova categoria</h2>
      <input required name="name" placeholder="Nome" class="mt-5 w-full rounded-lg border p-3"><input required name="slug" placeholder="slug" class="mt-3 w-full rounded-lg border p-3">
      <textarea required name="description" placeholder="Descrição" class="mt-3 w-full rounded-lg border p-3"></textarea><button class="mt-4 rounded-full bg-ink px-5 py-3 font-bold text-white">Salvar categoria</button></form>
    <form id="new-product" class="rounded-2xl bg-white p-8 shadow-sm"><h2 class="text-2xl font-black">Novo produto</h2>
      <select required name="categoryId" class="mt-5 w-full rounded-lg border p-3">${categories.map((category) => `<option value="${category.id}">${escapeHtml(category.name)}</option>`).join('')}</select>
      <input required name="name" placeholder="Nome" class="mt-3 w-full rounded-lg border p-3"><input required name="slug" placeholder="slug" class="mt-3 w-full rounded-lg border p-3">
      <textarea required name="description" placeholder="Descrição" class="mt-3 w-full rounded-lg border p-3"></textarea><input required name="priceCents" type="number" min="1" placeholder="Preço em centavos" class="mt-3 w-full rounded-lg border p-3">
      <input name="imageUrl" placeholder="URL da imagem (opcional)" class="mt-3 w-full rounded-lg border p-3"><button class="mt-4 rounded-full bg-amber px-5 py-3 font-bold">Salvar produto</button></form></div></section>`;
  document.querySelector('#new-category').addEventListener('submit', async (event) => {
    event.preventDefault();
    try { await api.createCategory(Object.fromEntries(new FormData(event.target))); showToast('Categoria criada.'); await renderShell(); renderAdmin(); }
    catch (error) { showToast(error.message); }
  });
  document.querySelector('#new-product').addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      const data = Object.fromEntries(new FormData(event.target));
      data.categoryId = Number(data.categoryId); data.priceCents = Number(data.priceCents);
      await api.createProduct(data); showToast('Produto criado.'); event.target.reset();
    } catch (error) { showToast(error.message); }
  });
}

async function render() {
  try {
    await renderShell();
    const [route, value] = location.hash.slice(1).split('/').filter(Boolean);
    if (!route) await renderHome();
    else if (route === 'categoria') await renderCategory(value);
    else if (route === 'produto') await renderProduct(value);
    else if (route === 'sobre') renderAbout();
    else if (route === 'contato') renderContact();
    else if (route === 'conta') await renderAccount();
    else if (route === 'admin') renderAdmin();
    else renderHome();
  } catch (error) {
    app.innerHTML = `<div class="rounded-xl bg-red-50 p-6 text-red-800">Não foi possível carregar esta página: ${escapeHtml(error.message)}</div>`;
  }
}

window.addEventListener('hashchange', render);
render();

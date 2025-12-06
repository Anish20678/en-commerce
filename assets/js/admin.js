function renderAdmin() {
  const navLinks = document.querySelectorAll('[data-admin-tab]');
  const sections = document.querySelectorAll('[data-admin-section]');
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.forEach((l) => l.classList.remove('active'));
      sections.forEach((s) => (s.style.display = 'none'));
      link.classList.add('active');
      const target = document.querySelector(`#${link.dataset.adminTab}`);
      if (target) target.style.display = 'grid';
    });
  });

  renderProductManager();
  renderCategoryManager();
  renderOrders();
  renderCustomers();
  renderPages();
  renderDiscounts();
  renderAnalytics();
}

document.addEventListener('DOMContentLoaded', renderAdmin);

function renderProductManager() {
  const table = document.querySelector('[data-admin-products]');
  const form = document.querySelector('[data-product-form]');
  if (!table || !form) return;
  const products = getProducts();
  table.innerHTML = products
    .map(
      (p, idx) => `
      <tr data-index="${idx}">
        <td>${p.name}</td>
        <td>${p.category}</td>
        <td>${formatPrice(p.price)}</td>
        <td class="badge-muted">${p.sizes.join(', ')}</td>
        <td><button class="button secondary" data-edit="${idx}">Edit</button></td>
      </tr>
    `
    )
    .join('');

  form.reset();
  form.onsubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());
    const images = payload.images.split(',').map((src) => src.trim()).filter(Boolean);
    const product = {
      id: payload.id || `custom-${Date.now()}`,
      name: payload.name,
      price: Number(payload.price),
      category: payload.category,
      shortDescription: payload.shortDescription,
      description: payload.description,
      images: images.length ? images : ['https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=60'],
      sizes: payload.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      colors: payload.colors.split(',').map((c) => c.trim()).filter(Boolean),
      featured: payload.featured === 'on',
    };
    const products = getProducts();
    const existingIndex = products.findIndex((p) => p.id === product.id);
    if (existingIndex >= 0) products[existingIndex] = product;
    else products.unshift(product);
    saveProducts(products);
    alert('Product saved');
    renderProductManager();
  };

  table.addEventListener('click', (e) => {
    const idx = e.target.dataset.edit;
    if (idx === undefined) return;
    const product = getProducts()[Number(idx)];
    if (!product) return;
    form.querySelector('[name="id"]').value = product.id;
    form.querySelector('[name="name"]').value = product.name;
    form.querySelector('[name="price"]').value = product.price;
    form.querySelector('[name="category"]').value = product.category;
    form.querySelector('[name="shortDescription"]').value = product.shortDescription;
    form.querySelector('[name="description"]').value = product.description;
    form.querySelector('[name="images"]').value = product.images.join(', ');
    form.querySelector('[name="sizes"]').value = product.sizes.join(', ');
    form.querySelector('[name="colors"]').value = product.colors.join(', ');
    form.querySelector('[name="featured"]').checked = product.featured;
  });
}

function renderCategoryManager() {
  const list = document.querySelector('[data-category-list]');
  const form = document.querySelector('[data-category-form]');
  if (!list || !form) return;
  const categories = getCategories();
  list.innerHTML = categories.map((cat) => `<span class="pill">${cat}</span>`).join('');
  form.onsubmit = (e) => {
    e.preventDefault();
    const value = form.querySelector('[name="category"]').value.trim();
    if (!value) return;
    const categories = getCategories();
    if (!categories.includes(value)) categories.push(value);
    saveCategories(categories);
    renderCategoryManager();
    form.reset();
  };
}

function renderOrders() {
  const table = document.querySelector('[data-orders]');
  if (!table) return;
  const orders = getOrders();
  table.innerHTML = orders
    .map(
      (order, idx) => `
      <tr data-index="${idx}">
        <td>${order.id}</td>
        <td>${order.customer}</td>
        <td>${order.status}</td>
        <td>${formatPrice(order.total)}</td>
        <td>${new Date(order.created).toLocaleDateString()}</td>
        <td><button class="button secondary" data-view="${idx}">View</button></td>
      </tr>
    `
    )
    .join('');

  table.addEventListener('click', (e) => {
    const idx = e.target.dataset.view;
    if (idx === undefined) return;
    const order = orders[idx];
    if (!order) return;
    const detail = document.querySelector('[data-order-detail]');
    detail.innerHTML = `
      <div class="flex-between">
        <h3>Order ${order.id}</h3>
        <div class="status">${order.status}</div>
      </div>
      <p class="badge-muted">${order.address}</p>
      <ul>
        ${order.items
          .map((item) => `<li>${item.quantity} × ${item.name} (${item.selectedColor || ''} ${item.selectedSize || ''})</li>`)
          .join('')}
      </ul>
      <p><strong>Total:</strong> ${formatPrice(order.total)}</p>
      <p><strong>Transaction:</strong> ${order.transaction}</p>
      <button class="button" data-status="Completed">Mark Completed</button>
      <button class="button secondary" data-status="Refunded">Refund</button>
    `;
    detail.querySelectorAll('button[data-status]').forEach((btn) =>
      btn.addEventListener('click', () => {
        order.status = btn.dataset.status;
        saveOrders(orders);
        renderOrders();
        detail.innerHTML = '<div class="alert">Order updated.</div>';
      })
    );
  });
}

function renderCustomers() {
  const table = document.querySelector('[data-customers]');
  if (!table) return;
  const customers = getCustomers();
  table.innerHTML = customers
    .map((c) => `<tr><td>${c.name}</td><td>${c.email}</td><td>${c.phone || ''}</td></tr>`)
    .join('');
}

function renderPages() {
  const form = document.querySelector('[data-pages-form]');
  if (!form) return;
  const pages = getPages();
  form.heroTitle.value = pages.heroTitle || '';
  form.heroSubtitle.value = pages.heroSubtitle || '';
  form.featured.value = (pages.featured || []).join(', ');
  form.testimonials.value = (pages.testimonials || [])
    .map((t) => `${t.name}|${t.role}|${t.quote}`)
    .join('\n');

  form.onsubmit = (e) => {
    e.preventDefault();
    const testimonials = form.testimonials.value
      .split('\n')
      .map((row) => row.split('|'))
      .filter((t) => t.length === 3)
      .map(([name, role, quote]) => ({ name, role, quote }));
    savePages({
      heroTitle: form.heroTitle.value,
      heroSubtitle: form.heroSubtitle.value,
      featured: form.featured.value.split(',').map((id) => id.trim()).filter(Boolean),
      testimonials,
    });
    alert('Page content updated');
  };
}

function renderDiscounts() {
  const form = document.querySelector('[data-discount-form]');
  const list = document.querySelector('[data-discount-list]');
  if (!form || !list) return;
  const discounts = getDiscounts();
  list.innerHTML = discounts
    .map((d, idx) => `<li>${d.code} — ${d.amount}% <button data-remove="${idx}" class="button secondary">Remove</button></li>`)
    .join('');

  form.onsubmit = (e) => {
    e.preventDefault();
    const d = {
      code: form.code.value.toUpperCase(),
      amount: Number(form.amount.value),
    };
    const discounts = getDiscounts();
    discounts.push(d);
    saveDiscounts(discounts);
    renderDiscounts();
    form.reset();
  };

  list.addEventListener('click', (e) => {
    const idx = e.target.dataset.remove;
    if (idx === undefined) return;
    const discounts = getDiscounts();
    discounts.splice(Number(idx), 1);
    saveDiscounts(discounts);
    renderDiscounts();
  });
}

function renderAnalytics() {
  const orders = getOrders();
  const products = getProducts();
  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  const customers = getCustomers().length;
  const topProduct = products[0]?.name || '—';
  const analyticsWrap = document.querySelector('[data-analytics]');
  if (!analyticsWrap) return;
  analyticsWrap.innerHTML = `
    <div class="analytics-card"><h4>Revenue</h4><p class="section-title">${formatPrice(revenue)}</p></div>
    <div class="analytics-card"><h4>Orders</h4><p class="section-title">${orders.length}</p></div>
    <div class="analytics-card"><h4>Customers</h4><p class="section-title">${customers}</p></div>
    <div class="analytics-card"><h4>Top Product</h4><p class="section-title">${topProduct}</p></div>
  `;
}

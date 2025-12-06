function formatPrice(value) {
  return `$${value.toFixed(2)}`;
}

function renderNav() {
  const cartCount = getCart().reduce((sum, item) => sum + item.quantity, 0);
  const cartBadge = document.querySelector('.cart-count');
  if (cartBadge) cartBadge.textContent = cartCount;
}

document.addEventListener('DOMContentLoaded', () => {
  renderNav();
  attachShopHandlers();
  attachProductPageHandlers();
  attachCartHandlers();
  attachCheckoutHandlers();
  attachContactHandlers();
});

function attachShopHandlers() {
  const grid = document.querySelector('[data-product-grid]');
  if (!grid) return;
  const products = getProducts();
  const html = products
    .map(
      (p) => `
      <article class="product-card">
        <a href="product.html?id=${p.id}">
          <img loading="lazy" src="${p.images[0]}" alt="${p.name}">
          <div class="product-meta">
            <div>
              <h3>${p.name}</h3>
              <p class="badge-muted">${p.category}</p>
            </div>
            <span class="price">${formatPrice(p.price)}</span>
          </div>
        </a>
      </article>
    `
    )
    .join('');
  grid.innerHTML = html;
}

function attachProductPageHandlers() {
  const productContainer = document.querySelector('[data-product-detail]');
  if (!productContainer) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const product = getProducts().find((p) => p.id === id) || getProducts()[0];

  if (!product) return;

  document.title = `${product.name} – Envara Ventures`;
  document.querySelector('[data-product-title]').textContent = product.name;
  document.querySelector('[data-product-price]').textContent = formatPrice(product.price);
  document.querySelector('[data-product-short]').textContent = product.shortDescription;
  document.querySelector('[data-product-description]').textContent = product.description;
  const gallery = document.querySelector('[data-gallery]');
  gallery.innerHTML = product.images
    .map((src) => `<img loading="lazy" src="${src}" alt="${product.name}">`)
    .join('');

  const sizeWrap = document.querySelector('[data-size-options]');
  sizeWrap.innerHTML = product.sizes
    .map((s, idx) => `<div class="pill ${idx === 0 ? 'active' : ''}" data-value="${s}">${s}</div>`) 
    .join('');
  const colorWrap = document.querySelector('[data-color-options]');
  colorWrap.innerHTML = product.colors
    .map((c, idx) => `<div class="pill ${idx === 0 ? 'active' : ''}" data-value="${c}">${c}</div>`) 
    .join('');

  function toggleActive(container, target) {
    container.querySelectorAll('.pill').forEach((pill) => pill.classList.remove('active'));
    target.classList.add('active');
  }

  sizeWrap.addEventListener('click', (e) => {
    if (e.target.classList.contains('pill')) toggleActive(sizeWrap, e.target);
  });
  colorWrap.addEventListener('click', (e) => {
    if (e.target.classList.contains('pill')) toggleActive(colorWrap, e.target);
  });

  const qtyInput = document.querySelector('[data-qty]');
  document.querySelector('[data-qty-plus]').addEventListener('click', () => {
    qtyInput.value = Math.min(20, Number(qtyInput.value) + 1);
  });
  document.querySelector('[data-qty-minus]').addEventListener('click', () => {
    qtyInput.value = Math.max(1, Number(qtyInput.value) - 1);
  });

  document.querySelector('[data-add-to-cart]').addEventListener('click', () => {
    const selectedSize = sizeWrap.querySelector('.pill.active')?.dataset.value;
    const selectedColor = colorWrap.querySelector('.pill.active')?.dataset.value;
    addToCart({ ...product, selectedSize, selectedColor }, Number(qtyInput.value));
  });

  renderRelated(product.id);
}

function addToCart(product, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id && item.selectedSize === product.selectedSize && item.selectedColor === product.selectedColor);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, image: product.images[0], quantity, selectedSize: product.selectedSize, selectedColor: product.selectedColor });
  }
  saveCart(cart);
  renderNav();
  alert('Added to cart');
}

function renderRelated(currentId) {
  const wrap = document.querySelector('[data-related]');
  if (!wrap) return;
  const products = getProducts().filter((p) => p.id !== currentId).slice(0, 3);
  wrap.innerHTML = products
    .map(
      (p) => `
      <article class="product-card">
        <a href="product.html?id=${p.id}">
          <img loading="lazy" src="${p.images[0]}" alt="${p.name}">
          <div class="product-meta">
            <div>
              <h3>${p.name}</h3>
              <p class="badge-muted">${p.category}</p>
            </div>
            <span class="price">${formatPrice(p.price)}</span>
          </div>
        </a>
      </article>
    `
    )
    .join('');
}

function attachCartHandlers() {
  const cartTable = document.querySelector('[data-cart-items]');
  if (!cartTable) return;
  const cart = getCart();
  const body = cart
    .map(
      (item, idx) => `
      <tr data-index="${idx}">
        <td><strong>${item.name}</strong><div class="badge-muted">${item.selectedSize || ''} ${item.selectedColor || ''}</div></td>
        <td>${formatPrice(item.price)}</td>
        <td>
          <div class="quantity">
            <button data-action="minus">–</button>
            <input type="number" min="1" value="${item.quantity}">
            <button data-action="plus">+</button>
          </div>
        </td>
        <td>${formatPrice(item.price * item.quantity)}</td>
        <td><button class="button secondary" data-action="remove">Remove</button></td>
      </tr>
    `
    )
    .join('');
  cartTable.innerHTML = body || '<tr><td colspan="5">Your cart is empty.</td></tr>';
  updateCartTotals();

  cartTable.addEventListener('click', (e) => {
    const row = e.target.closest('tr');
    const index = Number(row?.dataset.index);
    if (Number.isNaN(index)) return;
    const cart = getCart();
    const item = cart[index];
    if (!item) return;
    if (e.target.dataset.action === 'plus') item.quantity += 1;
    if (e.target.dataset.action === 'minus') item.quantity = Math.max(1, item.quantity - 1);
    if (e.target.dataset.action === 'remove') cart.splice(index, 1);
    const input = row.querySelector('input[type="number"]');
    if (input) item.quantity = Number(input.value);
    saveCart(cart);
    attachCartHandlers();
    renderNav();
  });
}

function updateCartTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const summary = document.querySelector('[data-cart-summary]');
  if (summary) summary.textContent = formatPrice(subtotal);
  const checkoutTotal = document.querySelector('[data-checkout-total]');
  if (checkoutTotal) checkoutTotal.textContent = formatPrice(subtotal);
}

function attachCheckoutHandlers() {
  const form = document.querySelector('[data-checkout-form]');
  if (!form) return;
  updateCartTotals();
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(form).entries());
    const cart = getCart();
    if (!cart.length) {
      alert('Cart is empty');
      return;
    }
    const orders = getOrders();
    const order = {
      id: `EV-${Date.now()}`,
      customer: formData.name,
      email: formData.email,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      items: cart,
      status: 'Processing',
      address: `${formData.address}, ${formData.city}, ${formData.country}`,
      notes: formData.notes || '',
      created: new Date().toISOString(),
      transaction: 'Captured',
    };
    orders.unshift(order);
    saveOrders(orders);
    saveCart([]);

    const customers = getCustomers();
    const existing = customers.find((c) => c.email === formData.email);
    if (!existing) customers.push({ name: formData.name, email: formData.email, phone: formData.phone });
    saveCustomers(customers);

    alert('Order placed successfully');
    window.location.href = 'thank-you.html';
  });
}

function attachContactHandlers() {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Message received. Our team will reply shortly.');
    form.reset();
  });
}

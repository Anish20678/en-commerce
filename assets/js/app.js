function formatPrice(value) {
  return `$${value.toFixed(2)}`;
}

function calculateShipping(country, subtotal) {
  const rules = getShippingRules();
  const normalizedCountry = (country || '').trim().toLowerCase();
  const validRules = rules
    .filter((rule) => {
      const countryMatch =
        rule.country === '*' || (rule.country || '').trim().toLowerCase() === normalizedCountry;
      return countryMatch && subtotal >= Number(rule.minTotal || 0);
    })
    .sort((a, b) => Number(a.cost) - Number(b.cost));
  if (validRules.length) return Number(validRules[0].cost);
  const fallback = rules.find((rule) => rule.country === '*');
  return fallback ? Number(fallback.cost) : 0;
}

function renderNav() {
  const cartCount = getCart().reduce((sum, item) => sum + item.quantity, 0);
  const cartBadge = document.querySelector('.cart-count');
  if (cartBadge) cartBadge.textContent = cartCount;
  const authLink = document.querySelector('[data-auth-link]');
  const session = getUserSession();
  if (authLink) {
    if (session) {
      authLink.textContent = 'Dashboard';
      authLink.href = 'dashboard.html';
    } else {
      authLink.textContent = 'Sign in';
      authLink.href = 'account.html';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderNav();
  enforceAdminAccess();
  attachAccountHandlers();
  attachShopHandlers();
  attachProductPageHandlers();
  attachCartHandlers();
  attachCheckoutHandlers();
  attachContactHandlers();
  attachDashboardHandlers();
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
  const allImages = [...(product.images || []), ...(product.gallery || [])].filter(Boolean);
  const uniqueImages = [...new Set(allImages)];
  gallery.innerHTML = uniqueImages.length
    ? uniqueImages.map((src) => `<img loading="lazy" src="${src}" alt="${product.name}">`).join('')
    : '<div class="alert">No imagery available for this product.</div>';

  const sizeOptions = (product.sizes && product.sizes.length
    ? product.sizes
    : (product.variations || []).map((v) => v.title).filter(Boolean)) || ['Standard'];
  const sizeWrap = document.querySelector('[data-size-options]');
  sizeWrap.innerHTML = sizeOptions
    .map((s, idx) => `<div class="pill ${idx === 0 ? 'active' : ''}" data-value="${s}">${s}</div>`)
    .join('');
  const colorWrap = document.querySelector('[data-color-options]');
  const colors = product.colors && product.colors.length ? product.colors : ['Default'];
  colorWrap.innerHTML = colors
    .map((c, idx) => `<div class="pill ${idx === 0 ? 'active' : ''} ${product.colors?.length ? '' : 'muted'}" data-value="${c}">${c}</div>`)
    .join('');

  const attributesTarget = document.querySelector('[data-product-attributes]');
  if (attributesTarget) {
    const attributes = product.attributes || [];
    attributesTarget.innerHTML = attributes.length
      ? attributes
          .map((attr) => `<span class="chip">${attr.name}: ${attr.value}</span>`)
          .join('')
      : '<span class="badge-muted">No attributes added yet.</span>';
  }

  const variationTarget = document.querySelector('[data-product-variations]');
  if (variationTarget) {
    const variations = product.variations || [];
    variationTarget.innerHTML = variations.length
      ? variations
          .map(
            (v) => `
          <div class="payment-card">
            <strong>${v.title || 'Variation'}</strong>
            <p class="badge-muted">SKU: ${v.sku || product.sku || '—'} · ${v.stock ?? 0} in stock</p>
            <p class="badge-muted">${v.price ? formatPrice(Number(v.price)) : 'Uses base price'}</p>
          </div>
        `
          )
          .join('')
      : '<p class="badge-muted">All purchases use the base configuration.</p>';
  }

  const shippingTarget = document.querySelector('[data-product-shipping]');
  if (shippingTarget) {
    if (product.requiresShipping === false) {
      shippingTarget.textContent = 'Digital delivery — no shipping needed.';
    } else {
      const classLabel = product.shippingClass ? `${product.shippingClass} shipping` : 'Standard shipping';
      const weightLabel = product.weight ? ` · approx. ${product.weight}kg` : '';
      const codLabel = product.allowCod ? 'COD accepted' : 'COD disabled for this item';
      shippingTarget.textContent = `${classLabel}${weightLabel}. ${codLabel}.`;
    }
  }

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
    cart.push({
      id: product.id,
      name: product.name,
      sku: product.sku,
      price: product.price,
      image: product.images[0],
      quantity,
      selectedSize: product.selectedSize,
      selectedColor: product.selectedColor,
    });
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

function updateCartTotals(countryValue = '') {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const summary = document.querySelector('[data-cart-summary]');
  if (summary) summary.textContent = formatPrice(subtotal);
  const checkoutSubtotal = document.querySelector('[data-checkout-subtotal]');
  const checkoutShipping = document.querySelector('[data-checkout-shipping]');
  const checkoutTotal = document.querySelector('[data-checkout-total]');
  let shippingCost = 0;
  if (checkoutSubtotal) checkoutSubtotal.textContent = formatPrice(subtotal);
  if (checkoutShipping || checkoutSubtotal) shippingCost = calculateShipping(countryValue, subtotal);
  if (checkoutShipping) checkoutShipping.textContent = formatPrice(shippingCost);
  if (checkoutTotal) checkoutTotal.textContent = formatPrice(subtotal + shippingCost);
}

function attachCheckoutHandlers() {
  const form = document.querySelector('[data-checkout-form]');
  if (!form) return;
  const paymentOptions = document.querySelector('[data-payment-options]');
  const paymentHint = document.querySelector('[data-payment-hint]');

  const renderPaymentOptions = () => {
    if (!paymentOptions) return;
    const settings = getPaymentSettings();
    const options = [];
    if (settings.stripeEnabled) {
      options.push({
        id: 'stripe',
        label: 'Card via Stripe',
        description: `Collect payment with Stripe (${settings.stripeMode} mode)${settings.stripeKey ? ` · ${settings.stripeKey}` : ''}`,
      });
    }
    if (settings.codEnabled) {
      options.push({ id: 'cod', label: 'Cash on Delivery', description: 'Pay with cash when your order arrives.' });
    }
    if (!options.length) {
      paymentOptions.innerHTML = '<p class="badge-muted">No payment methods are enabled. Configure them in admin.</p>';
      if (paymentHint) paymentHint.textContent = 'Enable Stripe or COD in admin settings to accept orders.';
      return;
    }
    paymentOptions.innerHTML = options
      .map(
        (opt, idx) => `
        <label class="payment-card">
          <input type="radio" name="paymentMethod" value="${opt.id}" ${idx === 0 ? 'checked' : ''}>
          <strong>${opt.label}</strong>
          <span class="badge-muted">${opt.description}</span>
        </label>
      `
      )
      .join('');
    if (paymentHint) paymentHint.textContent = 'Payments are simulated for this demo store.';
  };

  renderPaymentOptions();

  const countryInput = form.country;
  updateCartTotals(countryInput.value);
  countryInput.addEventListener('input', () => updateCartTotals(countryInput.value));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(form).entries());
    const cart = getCart();
    if (!cart.length) {
      alert('Cart is empty');
      return;
    }
    if (!formData.paymentMethod) {
      alert('Select a payment method');
      return;
    }
    const orders = getOrders();
    const session = getUserSession();
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCost = calculateShipping(formData.country, subtotal);
    const total = subtotal + shippingCost;
    const transactionLabel =
      formData.paymentMethod === 'stripe' ? 'Stripe (pending capture)' : 'Awaiting COD settlement';
    const order = {
      id: `EV-${Date.now()}`,
      customer: formData.name,
      email: formData.email,
      userEmail: session?.email || formData.email,
      total,
      items: cart,
      status: formData.paymentMethod === 'stripe' ? 'Awaiting Payment' : 'Processing',
      address: `${formData.address}, ${formData.city}, ${formData.country}`,
      notes: formData.notes || '',
      created: new Date().toISOString(),
      transaction: transactionLabel,
      shippingCost,
      paymentMethod: formData.paymentMethod,
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

function enforceAdminAccess(isLoginPage = false) {
  const onAdminPage = document.body.classList.contains('admin-page') || document.body.classList.contains('admin-login');
  const loginView = isLoginPage || document.body.classList.contains('admin-login');
  if (!onAdminPage && !isLoginPage) return;
  const session = getAdminSession();
  if (!session && !loginView) {
    window.location.href = 'admin-login.html';
  }
  if (session && loginView) {
    window.location.href = 'admin.html';
  }
}

function attachAccountHandlers() {
  const form = document.querySelector('[data-auth-form]');
  if (!form) return;
  const existingSession = getUserSession();
  if (existingSession) {
    window.location.href = 'dashboard.html';
    return;
  }
  const modeToggle = document.querySelector('[data-auth-mode]');
  const title = document.querySelector('[data-auth-title]');
  let mode = 'signin';

  modeToggle.addEventListener('click', (e) => {
    e.preventDefault();
    mode = mode === 'signin' ? 'signup' : 'signin';
    title.textContent = mode === 'signin' ? 'Sign in to continue' : 'Create your account';
    modeToggle.textContent = mode === 'signin' ? 'Create an account' : 'Already have an account? Sign in';
    form.querySelector('[data-name-field]').style.display = mode === 'signup' ? 'block' : 'none';
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const email = fd.get('email');
    const password = fd.get('password');
    const name = fd.get('name');
    const users = getUsers();

    if (mode === 'signup') {
      if (users.some((u) => u.email === email)) {
        alert('Account already exists. Sign in instead.');
        return;
      }
      users.push({ email, password, name });
      saveUsers(users);
      saveUserSession({ email, name });
      alert('Account created. Redirecting to dashboard.');
      window.location.href = 'dashboard.html';
      return;
    }

    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) {
      alert('Invalid credentials.');
      return;
    }
    saveUserSession({ email: user.email, name: user.name });
    window.location.href = 'dashboard.html';
  });
}

function attachDashboardHandlers() {
  const dashboard = document.querySelector('[data-dashboard]');
  if (!dashboard) return;
  const session = getUserSession();
  if (!session) {
    window.location.href = 'account.html';
    return;
  }

  dashboard.querySelector('[data-dashboard-name]').textContent = session.name || 'Customer';
  dashboard.querySelector('[data-dashboard-email]').textContent = session.email;
  dashboard.querySelector('[data-signout]').addEventListener('click', () => {
    clearUserSession();
    window.location.href = 'account.html';
  });

  const profileForm = dashboard.querySelector('[data-profile-form]');
  if (profileForm) {
    const users = getUsers();
    const record = users.find((u) => u.email === session.email);
    if (record) {
      profileForm.name.value = record.name || '';
      profileForm.password.value = record.password || '';
      profileForm.phone.value = record.phone || '';
    }
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(profileForm);
      const users = getUsers();
      const existing = users.find((u) => u.email === session.email);
      if (existing) {
        existing.name = fd.get('name');
        existing.password = fd.get('password');
        existing.phone = fd.get('phone');
        saveUsers(users);
        saveUserSession({ email: existing.email, name: existing.name });
        alert('Profile updated.');
      }
    });
  }

  renderUserOrders(session.email);
}

function renderUserOrders(email) {
  const table = document.querySelector('[data-user-orders]');
  if (!table) return;
  const orders = getOrders().filter((o) => o.userEmail === email || o.email === email);
  if (!orders.length) {
    table.innerHTML = '<tr><td colspan="5">No orders yet.</td></tr>';
    table.onclick = null;
    return;
  }
  table.innerHTML = orders
    .map(
      (order, idx) => `
      <tr data-index="${idx}">
        <td>${order.id}</td>
        <td>${new Date(order.created).toLocaleDateString()}</td>
        <td>${order.status}</td>
        <td>${formatPrice(order.total)}</td>
        <td>
          ${order.status === 'Processing' ? `<button class="button secondary" data-cancel="${order.id}">Cancel</button>` : ''}
        </td>
      </tr>
    `
    )
    .join('');
  table.onclick = (e) => {
    const id = e.target.dataset.cancel;
    if (!id) return;
    const orders = getOrders();
    const order = orders.find((o) => o.id === id);
    if (!order) return;
    order.status = 'Cancelled';
    saveOrders(orders);
    renderUserOrders(email);
    alert('Order cancelled.');
  };
}

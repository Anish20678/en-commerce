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
  renderSettings();
}

document.addEventListener('DOMContentLoaded', renderAdmin);

document.addEventListener('DOMContentLoaded', () => {
  const signout = document.querySelector('[data-admin-signout]');
  if (signout) {
    signout.addEventListener('click', () => {
      clearAdminSession();
      window.location.href = 'admin-login.html';
    });
  }
});

function renderProductManager() {
  const table = document.querySelector('[data-admin-products]');
  const form = document.querySelector('[data-product-form]');
  if (!table || !form) return;
  const enhanced = form.dataset.enhanced === 'true';
  ['images', 'gallery', 'attributes', 'variations'].forEach((field) => {
    if (!form[field].value) form[field].value = '[]';
  });

  const placeholderImage =
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=60';

  const getJsonField = (name, fallback = []) => {
    try {
      return JSON.parse(form[name].value || '[]');
    } catch (err) {
      console.warn('Failed to parse field', name, err);
      return fallback;
    }
  };

  const setJsonField = (name, value) => {
    form[name].value = JSON.stringify(value || []);
  };

  const renderMediaPreviews = (name, container) => {
    const media = getJsonField(name);
    container.innerHTML = media
      .map(
        (src, idx) => `
        <div class="media-preview">
          <img src="${src}" alt="Product media ${idx + 1}">
          <button type="button" data-remove="${idx}" data-target="${name}">×</button>
        </div>
      `
      )
      .join('');
  };

  const removeMediaItem = (name, index, container) => {
    const media = getJsonField(name);
    media.splice(index, 1);
    setJsonField(name, media);
    renderMediaPreviews(name, container);
  };

  const addMediaFromFiles = (files, name, container) => {
    const list = getJsonField(name);
    [...files].forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        list.push(reader.result);
        setJsonField(name, list);
        renderMediaPreviews(name, container);
      };
      reader.readAsDataURL(file);
    });
  };

  const addMediaFromUrl = (input, name, container) => {
    const url = input.value.trim();
    if (!url) return;
    const list = getJsonField(name);
    list.push(url);
    setJsonField(name, list);
    input.value = '';
    renderMediaPreviews(name, container);
  };

  const setupDropzone = ({ dropzone, input, jsonField, previewContainer, urlInput, urlButton }) => {
    if (!dropzone || !input || !previewContainer) return;
    dropzone.addEventListener('click', () => input.click());
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragging');
    });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragging'));
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragging');
      addMediaFromFiles(e.dataTransfer.files, jsonField, previewContainer);
    });
    input.addEventListener('change', (e) => addMediaFromFiles(e.target.files, jsonField, previewContainer));
    if (urlButton && urlInput) {
      urlButton.addEventListener('click', () => addMediaFromUrl(urlInput, jsonField, previewContainer));
    }
    previewContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-remove]');
      if (!btn) return;
      removeMediaItem(btn.dataset.target, Number(btn.dataset.remove), previewContainer);
    });
  };

  const attributeList = form.querySelector('[data-attribute-list]');
  const variationList = form.querySelector('[data-variation-list]');
  const imagePreview = form.querySelector('[data-image-previews]');
  const galleryPreview = form.querySelector('[data-gallery-previews]');

  const renderAttributes = () => {
    const attributes = getJsonField('attributes');
    attributeList.innerHTML = attributes
      .map(
        (attr, idx) => `
        <span class="chip">${attr.name}: ${attr.value} <button type="button" data-remove-attribute="${idx}">×</button></span>
      `
      )
      .join('');
  };

  const renderVariations = () => {
    const variations = getJsonField('variations');
    variationList.innerHTML = variations
      .map(
        (variation, idx) => `
        <div class="payment-card">
          <strong>${variation.title || 'Variation'}</strong>
          <p class="badge-muted">SKU: ${variation.sku || '—'} · ${variation.stock || 0} in stock</p>
          <p class="badge-muted">${variation.price ? formatPrice(Number(variation.price)) : 'Uses base price'}</p>
          <button class="button secondary" type="button" data-remove-variation="${idx}">Remove</button>
        </div>
      `
      )
      .join('');
  };

  const resetForm = (product = null) => {
    form.reset();
    const base = product || {
      images: [],
      gallery: [],
      attributes: [],
      variations: [],
      sizes: [],
      colors: [],
      inventory: 0,
      weight: '',
      shippingClass: '',
      requiresShipping: true,
      allowCod: false,
    };
    setJsonField('images', base.images || []);
    setJsonField('gallery', base.gallery || []);
    setJsonField('attributes', base.attributes || []);
    setJsonField('variations', base.variations || []);
    form.querySelector('[name="id"]').value = base.id || '';
    form.querySelector('[name="name"]').value = base.name || '';
    form.querySelector('[name="price"]').value = base.price || '';
    form.querySelector('[name="category"]').value = base.category || '';
    form.querySelector('[name="sku"]').value = base.sku || '';
    form.querySelector('[name="inventory"]').value = base.inventory ?? 0;
    form.querySelector('[name="shortDescription"]').value = base.shortDescription || '';
    form.querySelector('[name="description"]').value = base.description || '';
    form.querySelector('[name="sizes"]').value = (base.sizes || []).join(', ');
    form.querySelector('[name="colors"]').value = (base.colors || []).join(', ');
    form.querySelector('[name="weight"]').value = base.weight || '';
    form.querySelector('[name="shippingClass"]').value = base.shippingClass || '';
    form.querySelector('[name="featured"]').checked = Boolean(base.featured);
    form.querySelector('[name="requiresShipping"]').checked = base.requiresShipping !== false;
    form.querySelector('[name="allowCod"]').checked = Boolean(base.allowCod);
    renderMediaPreviews('images', imagePreview);
    renderMediaPreviews('gallery', galleryPreview);
    renderAttributes();
    renderVariations();
  };

  const products = getProducts();
  table.innerHTML = products
    .map(
      (p, idx) => `
      <tr data-index="${idx}">
        <td>${p.name}</td>
        <td>${p.sku || '—'}</td>
        <td>${p.category}</td>
        <td>${formatPrice(p.price)}</td>
        <td class="badge-muted">${p.inventory ?? 0} in stock</td>
        <td class="badge-muted">${(p.variations || []).length} variations</td>
        <td><button class="button secondary" data-edit="${idx}">Edit</button></td>
      </tr>
    `
    )
    .join('');

  resetForm();

  if (!enhanced) {
    setupDropzone({
      dropzone: form.querySelector('[data-image-drop]'),
      input: form.querySelector('[data-image-input]'),
      jsonField: 'images',
      previewContainer: imagePreview,
      urlInput: form.querySelector('[data-image-url]'),
      urlButton: form.querySelector('[data-add-image-url]'),
    });

    setupDropzone({
      dropzone: form.querySelector('[data-gallery-drop]'),
      input: form.querySelector('[data-gallery-input]'),
      jsonField: 'gallery',
      previewContainer: galleryPreview,
      urlInput: form.querySelector('[data-gallery-url]'),
      urlButton: form.querySelector('[data-add-gallery-url]'),
    });

    const attributeName = form.querySelector('[data-attribute-name]');
    const attributeValue = form.querySelector('[data-attribute-value]');
    form.querySelector('[data-add-attribute]').addEventListener('click', () => {
      if (!attributeName.value.trim() || !attributeValue.value.trim()) return;
      const list = getJsonField('attributes');
      list.push({ name: attributeName.value.trim(), value: attributeValue.value.trim() });
      setJsonField('attributes', list);
      attributeName.value = '';
      attributeValue.value = '';
      renderAttributes();
    });
    attributeList.addEventListener('click', (e) => {
      const idx = e.target.dataset.removeAttribute;
      if (idx === undefined) return;
      const list = getJsonField('attributes');
      list.splice(Number(idx), 1);
      setJsonField('attributes', list);
      renderAttributes();
    });

    const variationTitle = form.querySelector('[data-variation-title]');
    const variationSku = form.querySelector('[data-variation-sku]');
    const variationPrice = form.querySelector('[data-variation-price]');
    const variationStock = form.querySelector('[data-variation-stock]');
    form.querySelector('[data-add-variation]').addEventListener('click', () => {
      if (!variationTitle.value.trim()) return;
      const list = getJsonField('variations');
      list.push({
        title: variationTitle.value.trim(),
        sku: variationSku.value.trim(),
        price: variationPrice.value ? Number(variationPrice.value) : null,
        stock: variationStock.value ? Number(variationStock.value) : 0,
      });
      setJsonField('variations', list);
      variationTitle.value = '';
      variationSku.value = '';
      variationPrice.value = '';
      variationStock.value = '';
      renderVariations();
    });
    variationList.addEventListener('click', (e) => {
      const idx = e.target.dataset.removeVariation;
      if (idx === undefined) return;
      const list = getJsonField('variations');
      list.splice(Number(idx), 1);
      setJsonField('variations', list);
      renderVariations();
    });
    form.dataset.enhanced = 'true';
  }

  form.onsubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());
    const images = getJsonField('images');
    const gallery = getJsonField('gallery');
    const attributes = getJsonField('attributes');
    const variations = getJsonField('variations');
    const product = {
      id: payload.id || `custom-${Date.now()}`,
      name: payload.name,
      price: Number(payload.price),
      category: payload.category,
      sku: payload.sku,
      inventory: Number(payload.inventory) || 0,
      shortDescription: payload.shortDescription,
      description: payload.description,
      images: images.length ? images : [placeholderImage],
      gallery,
      attributes,
      variations,
      sizes: payload.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      colors: payload.colors.split(',').map((c) => c.trim()).filter(Boolean),
      featured: payload.featured === 'on',
      weight: payload.weight ? Number(payload.weight) : null,
      shippingClass: payload.shippingClass,
      requiresShipping: payload.requiresShipping === 'on',
      allowCod: payload.allowCod === 'on',
    };
    const list = getProducts();
    const existingIndex = list.findIndex((p) => p.id === product.id);
    if (existingIndex >= 0) list[existingIndex] = product;
    else list.unshift(product);
    saveProducts(list);
    alert('Product saved');
    renderProductManager();
  };

  table.onclick = (e) => {
    const idx = e.target.dataset.edit;
    if (idx === undefined) return;
    const product = getProducts()[Number(idx)];
    if (!product) return;
    resetForm(product);
  };
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
      <p><strong>Shipping:</strong> ${formatPrice(order.shippingCost || 0)}</p>
      <p><strong>Total:</strong> ${formatPrice(order.total)}</p>
      <p><strong>Payment:</strong> ${order.paymentMethod || '—'}</p>
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

function renderSettings() {
  const paymentForm = document.querySelector('[data-payment-form]');
  if (paymentForm) {
    const paymentSettings = getPaymentSettings();
    paymentForm.codEnabled.checked = paymentSettings.codEnabled;
    paymentForm.stripeEnabled.checked = paymentSettings.stripeEnabled;
    paymentForm.stripeKey.value = paymentSettings.stripeKey || '';
    paymentForm.stripeMode.value = paymentSettings.stripeMode || 'test';
    paymentForm.onsubmit = (e) => {
      e.preventDefault();
      savePaymentSettings({
        codEnabled: paymentForm.codEnabled.checked,
        stripeEnabled: paymentForm.stripeEnabled.checked,
        stripeKey: paymentForm.stripeKey.value.trim(),
        stripeMode: paymentForm.stripeMode.value,
      });
      alert('Payment settings updated');
    };
  }

  const shippingForm = document.querySelector('[data-shipping-form]');
  const shippingList = document.querySelector('[data-shipping-list]');
  if (shippingForm && shippingList) {
    const renderRules = () => {
      const rules = getShippingRules();
      shippingList.innerHTML = rules
        .map(
          (rule, idx) => `
          <div class="payment-card">
            <strong>${rule.region || 'Rule'} (${rule.country})</strong>
            <p class="badge-muted">Min total: ${formatPrice(Number(rule.minTotal) || 0)}</p>
            <p class="badge-muted">Cost: ${formatPrice(Number(rule.cost) || 0)}</p>
            <button class="button secondary" type="button" data-remove-shipping="${idx}">Remove</button>
          </div>
        `
        )
        .join('');
    };

    renderRules();

    shippingForm.onsubmit = (e) => {
      e.preventDefault();
      const rule = {
        region: shippingForm.region.value,
        country: shippingForm.country.value,
        minTotal: Number(shippingForm.minTotal.value) || 0,
        cost: Number(shippingForm.cost.value) || 0,
      };
      const rules = getShippingRules();
      rules.push(rule);
      saveShippingRules(rules);
      shippingForm.reset();
      renderRules();
    };

    shippingList.addEventListener('click', (e) => {
      const idx = e.target.dataset.removeShipping;
      if (idx === undefined) return;
      const rules = getShippingRules();
      rules.splice(Number(idx), 1);
      saveShippingRules(rules);
      renderRules();
    });
  }
}

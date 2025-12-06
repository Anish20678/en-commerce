const defaultProducts = [
  { 
    id: 'ev-aurora',
    name: 'Aurora Studio Lamp',
    price: 180,
    category: 'Lighting',
    shortDescription: 'Sculpted aluminum lamp with adjustable glow.',
    description:
      'Built for modern studios, Aurora uses precision milled aluminum and soft diffusion to deliver balanced light for creators and interiors. Minimal controls keep the experience effortless.',
    sku: 'EV-001',
    inventory: 12,
    images: ['https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=60'],
    gallery: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=60&sat=-20',
    ],
    attributes: [
      { name: 'Material', value: 'Milled aluminum' },
      { name: 'Power', value: 'USB-C' },
    ],
    variations: [
      { title: 'Desk mount', sku: 'EV-001-A', price: 180, stock: 8 },
      { title: 'Clamp mount', sku: 'EV-001-B', price: 195, stock: 4 },
    ],
    sizes: ['Standard'],
    colors: ['Matte Black', 'Frost'],
    featured: true,
    weight: 1.3,
    shippingClass: 'Standard',
    requiresShipping: true,
    allowCod: true,
  },
  {
    id: 'ev-edge',
    name: 'Edge Wireless Desk',
    price: 920,
    category: 'Furniture',
    shortDescription: 'Wireless charging workspace with cable-free power.',
    description:
      'Edge Desk integrates multi-coil wireless charging and modular storage so you can work cable-free. Sustainable oak veneer and steel framing ensure longevity with a premium finish.',
    sku: 'EV-002',
    inventory: 6,
    images: ['https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=60'],
    gallery: ['https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=60&sat=-30'],
    attributes: [
      { name: 'Finish', value: 'Oak veneer' },
      { name: 'Power', value: 'Multi-coil wireless' },
    ],
    variations: [
      { title: '120 cm', sku: 'EV-002-120', price: 920, stock: 3 },
      { title: '150 cm', sku: 'EV-002-150', price: 990, stock: 3 },
    ],
    sizes: ['120cm', '150cm'],
    colors: ['Natural', 'Onyx'],
    featured: true,
    weight: 18,
    shippingClass: 'Freight',
    requiresShipping: true,
    allowCod: true,
  },
  {
    id: 'ev-flow',
    name: 'Flow Chair',
    price: 420,
    category: 'Seating',
    shortDescription: 'Breathable mesh chair with floating lumbar support.',
    description:
      'Flow adapts to your posture with a dynamic mesh back, balanced recline tension, and intuitive adjustments. Designed for long sessions without visual clutter.',
    sku: 'EV-003',
    inventory: 22,
    images: ['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=60'],
    gallery: ['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=60&sat=-25'],
    attributes: [
      { name: 'Support', value: 'Floating lumbar' },
      { name: 'Frame', value: 'Steel' },
    ],
    variations: [
      { title: 'Standard', sku: 'EV-003-STD', price: 420, stock: 12 },
      { title: 'Tall', sku: 'EV-003-TALL', price: 440, stock: 10 },
    ],
    sizes: ['Standard', 'Tall'],
    colors: ['Ink', 'Cloud'],
    featured: true,
    weight: 10,
    shippingClass: 'Standard',
    requiresShipping: true,
    allowCod: true,
  },
  {
    id: 'ev-halo',
    name: 'Halo Monitor Light',
    price: 160,
    category: 'Accessories',
    shortDescription: 'Balanced top-light that reduces screen glare.',
    description:
      'Halo delivers studio-grade top lighting with tunable warmth and adaptive brightness. The magnetic mount keeps your monitor free of adhesives or clamps.',
    sku: 'EV-004',
    inventory: 30,
    images: ['https://images.unsplash.com/photo-1527430253228-e93688616381?auto=format&fit=crop&w=800&q=60'],
    gallery: ['https://images.unsplash.com/photo-1527430253228-e93688616381?auto=format&fit=crop&w=800&q=60&sat=-35'],
    attributes: [
      { name: 'Lighting', value: 'Tunable white' },
      { name: 'Mount', value: 'Magnetic rail' },
    ],
    variations: [
      { title: 'Standard', sku: 'EV-004-STD', price: 160, stock: 30 },
    ],
    sizes: ['Standard'],
    colors: ['Slate'],
    featured: false,
    weight: 0.9,
    shippingClass: 'Standard',
    requiresShipping: true,
    allowCod: true,
  },
  {
    id: 'ev-still',
    name: 'Still Ceramic Mug',
    price: 38,
    category: 'Objects',
    shortDescription: 'Double-walled ceramic with soft-touch glaze.',
    description:
      'Still keeps beverages at the right temperature while feeling comfortable to hold. The matte glaze pairs with the Envara palette for a cohesive desk setup.',
    sku: 'EV-005',
    inventory: 80,
    images: ['https://images.unsplash.com/photo-1523419400524-fc1e0d5428f4?auto=format&fit=crop&w=800&q=60'],
    gallery: ['https://images.unsplash.com/photo-1523419400524-fc1e0d5428f4?auto=format&fit=crop&w=800&q=60&sat=-25'],
    attributes: [
      { name: 'Insulation', value: 'Double wall' },
      { name: 'Finish', value: 'Soft-touch' },
    ],
    variations: [
      { title: '12oz', sku: 'EV-005-12', price: 38, stock: 80 },
    ],
    sizes: ['12oz'],
    colors: ['Ash', 'Snow'],
    featured: false,
    weight: 0.4,
    shippingClass: 'Standard',
    requiresShipping: true,
    allowCod: true,
  },
  {
    id: 'ev-fold',
    name: 'Fold Travel Tote',
    price: 120,
    category: 'Carry',
    shortDescription: 'Pack-flat tote crafted with recycled fibers.',
    description:
      'Fold packs down in seconds and features waterproof zippers, a padded laptop sleeve, and internal segmentation for daily gear.',
    sku: 'EV-006',
    inventory: 40,
    images: ['https://images.unsplash.com/photo-1462396881884-de2c07cb95ed?auto=format&fit=crop&w=900&q=60'],
    gallery: ['https://images.unsplash.com/photo-1462396881884-de2c07cb95ed?auto=format&fit=crop&w=900&q=60&sat=-25'],
    attributes: [
      { name: 'Fabric', value: 'Recycled fibers' },
      { name: 'Feature', value: 'Waterproof zipper' },
    ],
    variations: [
      { title: 'One size', sku: 'EV-006-OS', price: 120, stock: 40 },
    ],
    sizes: ['One Size'],
    colors: ['Shadow', 'Ivory'],
    featured: false,
    weight: 0.8,
    shippingClass: 'Standard',
    requiresShipping: true,
    allowCod: true,
  },
];

const defaultCategories = ['Lighting', 'Furniture', 'Seating', 'Accessories', 'Objects', 'Carry'];

const defaultPaymentSettings = {
  codEnabled: true,
  stripeEnabled: false,
  stripeKey: '',
  stripeMode: 'test',
};

const defaultShippingRules = [
  { region: 'Domestic', country: 'Denmark', minTotal: 0, cost: 9 },
  { region: 'Free shipping', country: '*', minTotal: 200, cost: 0 },
];

const defaultAdmin = {
  email: 'admin@envara.com',
  password: 'admin123',
  name: 'Store Admin',
};

const storage = {
  fetch(key, fallback) {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  },
  save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
};

function initStore() {
  if (!localStorage.getItem('ev_products')) storage.save('ev_products', defaultProducts);
  if (!localStorage.getItem('ev_categories')) storage.save('ev_categories', defaultCategories);
  if (!localStorage.getItem('ev_orders')) storage.save('ev_orders', []);
  if (!localStorage.getItem('ev_customers')) storage.save('ev_customers', []);
  if (!localStorage.getItem('ev_discounts')) storage.save('ev_discounts', []);
  if (!localStorage.getItem('ev_users')) storage.save('ev_users', []);
  if (!localStorage.getItem('ev_admin_user')) storage.save('ev_admin_user', defaultAdmin);
  if (!localStorage.getItem('ev_payment_settings')) storage.save('ev_payment_settings', defaultPaymentSettings);
  if (!localStorage.getItem('ev_shipping_rules')) storage.save('ev_shipping_rules', defaultShippingRules);
  if (!localStorage.getItem('ev_pages')) storage.save('ev_pages', {
    heroTitle: 'Design-forward essentials for thoughtful workspaces.',
    heroSubtitle: 'Envara Ventures curates precision-built products with minimal aesthetics, adaptive functionality, and sustainable materials.',
    featured: ['ev-aurora', 'ev-edge', 'ev-flow'],
    testimonials: [
      { name: 'Clara Jensen', role: 'Creative Director', quote: 'The finish and ergonomics are unmatched. Everything feels intentional.' },
      { name: 'Aidan Mistry', role: 'Founder, Atelier North', quote: 'Orders ship fast and the admin makes our resupply effortless.' },
      { name: 'Mia Ortega', role: 'Product Ops', quote: 'Clean, premium, and purpose-built for modern teams.' },
    ],
  });
}

initStore();

function getProducts() {
  return storage.fetch('ev_products', defaultProducts);
}

function saveProducts(products) {
  storage.save('ev_products', products);
}

function getCategories() {
  return storage.fetch('ev_categories', defaultCategories);
}

function saveCategories(list) {
  storage.save('ev_categories', list);
}

function getOrders() {
  return storage.fetch('ev_orders', []);
}

function saveOrders(orders) {
  storage.save('ev_orders', orders);
}

function getCustomers() {
  return storage.fetch('ev_customers', []);
}

function saveCustomers(customers) {
  storage.save('ev_customers', customers);
}

function getDiscounts() {
  return storage.fetch('ev_discounts', []);
}

function saveDiscounts(discounts) {
  storage.save('ev_discounts', discounts);
}

function getPages() {
  return storage.fetch('ev_pages', {});
}

function savePages(pages) {
  storage.save('ev_pages', pages);
}

function getCart() {
  return storage.fetch('ev_cart', []);
}

function saveCart(cart) {
  storage.save('ev_cart', cart);
}

function getUsers() {
  return storage.fetch('ev_users', []);
}

function saveUsers(users) {
  storage.save('ev_users', users);
}

function getUserSession() {
  return storage.fetch('ev_user_session', null);
}

function saveUserSession(session) {
  storage.save('ev_user_session', session);
}

function clearUserSession() {
  localStorage.removeItem('ev_user_session');
}

function getAdminUser() {
  return storage.fetch('ev_admin_user', defaultAdmin);
}

function saveAdminUser(user) {
  storage.save('ev_admin_user', user);
}

function getAdminSession() {
  return storage.fetch('ev_admin_session', null);
}

function saveAdminSession(session) {
  storage.save('ev_admin_session', session);
}

function clearAdminSession() {
  localStorage.removeItem('ev_admin_session');
}

function getPaymentSettings() {
  return storage.fetch('ev_payment_settings', defaultPaymentSettings);
}

function savePaymentSettings(settings) {
  storage.save('ev_payment_settings', settings);
}

function getShippingRules() {
  return storage.fetch('ev_shipping_rules', defaultShippingRules);
}

function saveShippingRules(rules) {
  storage.save('ev_shipping_rules', rules);
}

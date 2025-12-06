const defaultProducts = [
  {
    id: 'ev-aurora',
    name: 'Aurora Studio Lamp',
    price: 180,
    category: 'Lighting',
    shortDescription: 'Sculpted aluminum lamp with adjustable glow.',
    description:
      'Built for modern studios, Aurora uses precision milled aluminum and soft diffusion to deliver balanced light for creators and interiors. Minimal controls keep the experience effortless.',
    images: ['https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=60'],
    sizes: ['Standard'],
    colors: ['Matte Black', 'Frost'],
    featured: true,
  },
  {
    id: 'ev-edge',
    name: 'Edge Wireless Desk',
    price: 920,
    category: 'Furniture',
    shortDescription: 'Wireless charging workspace with cable-free power.',
    description:
      'Edge Desk integrates multi-coil wireless charging and modular storage so you can work cable-free. Sustainable oak veneer and steel framing ensure longevity with a premium finish.',
    images: ['https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=60'],
    sizes: ['120cm', '150cm'],
    colors: ['Natural', 'Onyx'],
    featured: true,
  },
  {
    id: 'ev-flow',
    name: 'Flow Chair',
    price: 420,
    category: 'Seating',
    shortDescription: 'Breathable mesh chair with floating lumbar support.',
    description:
      'Flow adapts to your posture with a dynamic mesh back, balanced recline tension, and intuitive adjustments. Designed for long sessions without visual clutter.',
    images: ['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=60'],
    sizes: ['Standard', 'Tall'],
    colors: ['Ink', 'Cloud'],
    featured: true,
  },
  {
    id: 'ev-halo',
    name: 'Halo Monitor Light',
    price: 160,
    category: 'Accessories',
    shortDescription: 'Balanced top-light that reduces screen glare.',
    description:
      'Halo delivers studio-grade top lighting with tunable warmth and adaptive brightness. The magnetic mount keeps your monitor free of adhesives or clamps.',
    images: ['https://images.unsplash.com/photo-1527430253228-e93688616381?auto=format&fit=crop&w=800&q=60'],
    sizes: ['Standard'],
    colors: ['Slate'],
    featured: false,
  },
  {
    id: 'ev-still',
    name: 'Still Ceramic Mug',
    price: 38,
    category: 'Objects',
    shortDescription: 'Double-walled ceramic with soft-touch glaze.',
    description:
      'Still keeps beverages at the right temperature while feeling comfortable to hold. The matte glaze pairs with the Envara palette for a cohesive desk setup.',
    images: ['https://images.unsplash.com/photo-1523419400524-fc1e0d5428f4?auto=format&fit=crop&w=800&q=60'],
    sizes: ['12oz'],
    colors: ['Ash', 'Snow'],
    featured: false,
  },
  {
    id: 'ev-fold',
    name: 'Fold Travel Tote',
    price: 120,
    category: 'Carry',
    shortDescription: 'Pack-flat tote crafted with recycled fibers.',
    description:
      'Fold packs down in seconds and features waterproof zippers, a padded laptop sleeve, and internal segmentation for daily gear.',
    images: ['https://images.unsplash.com/photo-1462396881884-de2c07cb95ed?auto=format&fit=crop&w=900&q=60'],
    sizes: ['One Size'],
    colors: ['Shadow', 'Ivory'],
    featured: false,
  },
];

const defaultCategories = ['Lighting', 'Furniture', 'Seating', 'Accessories', 'Objects', 'Carry'];

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

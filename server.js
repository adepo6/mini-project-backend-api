// const express = require('express');
// const app = express();
// const PORT = 5001;

// app.use(express.json());
// // Storage
// let products = [];
// let cart = [];
// let orders = [];
// let productId = 1;
// let orderId = 1;

// // Home
// app.get('/', (req, res) => {
//   res.json({ 
//     message: 'E-commerce API',
//     endpoints: [
//       'GET /api/products',
//       'GET /api/products/:id',
//       'POST /api/products',
//       'PUT /api/products/:id',
//       'DELETE /api/products/:id',
//       'GET /api/cart',
//       'POST /api/cart',
//       'PUT /api/cart',
//       'DELETE /api/cart/:productId',
//       'GET /api/orders',
//       'GET /api/orders/:id',
//       'POST /api/orders'
//     ]
//   });
// });

// // ----- PRODUCTS -----
// // GET all products (with filters)
// app.get('/api/products', (req, res) => {
//   const { category, minPrice, maxPrice } = req.query;
//   let result = [...products];
  
//   if (category) result = result.filter(p => p.category === category);
//   if (minPrice) result = result.filter(p => p.price >= Number(minPrice));
//   if (maxPrice) result = result.filter(p => p.price <= Number(maxPrice));
  
//   res.json(result);
// });

// // GET single product
// app.get('/api/products/:id', (req, res) => {
//   const product = products.find(p => p.id === Number(req.params.id));
//   if (!product) return res.status(404).json({ error: 'Product not found' });
//   res.json(product);
// });

// // POST create product
// app.post('/api/products', (req, res) => {
//   const { name, description, price, stock, category, imageUrl } = req.body;
  
//   // Validation
//   if (!name || !description || !price || !category) {
//     return res.status(400).json({ error: 'Missing required fields' });
//   }
//   if (price < 0) return res.status(400).json({ error: 'Price must be positive' });
//   if (stock < 0) return res.status(400).json({ error: 'Stock cannot be negative' });
  
//   const newProduct = {
//     id: productId++,
//     name, description, price, 
//     stock: stock || 0,
//     category,
//     imageUrl: imageUrl || ''
//   };
//   products.push(newProduct);
//   res.status(201).json(newProduct);
// });
// S
// // ----- CART -----
// // GET cart
// app.get('/api/cart', (req, res) => {
//   res.json(cart);
// });

// // POST add to cart
// app.post('/api/cart', (req, res) => {
//   const { productId, quantity } = req.body;
//   const product = products.find(p => p.id === Number(productId));
  
//   if (!product) return res.status(404).json({ error: 'Product not found' });
//   if (quantity > product.stock) return res.status(400).json({ error: 'Not enough stock' });
  
//   cart.push({ productId: Number(productId), quantity: quantity || 1 });
//   res.status(201).json(cart);
// });

// // ----- ORDERS -----
// // POST create order
// app.post('/api/orders', (req, res) => {
//   if (cart.length === 0) return res.status(400).json({ error: 'Cart is empty' });
  
//   const order = {
//     id: orderId++,
//     items: [...cart],
//     total: cart.reduce((sum, item) => {
//       const product = products.find(p => p.id === item.productId);
//       return sum + (product.price * item.quantity);
//     }, 0),
//     date: new Date().toISOString(),
//     customerInfo: req.body.customerInfo || {}
//   };
  
//   orders.push(order);
//   cart = []; // Clear cart
//   res.status(201).json(order);
// });

// // GET all orders
// app.get('/api/orders', (req, res) => {
//   res.json(orders);
// });

// app.listen(PORT, () => {
//   console.log(`✅ E-commerce API: http://localhost:${PORT}`);
// });
// // Home
// app.get('/', (req, res) => {
//   res.json({ 
//     message: 'E-commerce API IS WORKING NOW!',
//     status: 'active',
//     endpoints: {
//       products: 'GET/POST /api/products',
//       cart: 'GET/POST /api/cart',
//       orders: 'GET/POST /api/orders'
//     }
//   });
// });

// // Products
// app.get('/api/products', (req, res) => {
//   res.json([{ id: 1, name: 'Test Product', price: 100 }]);
// });

// // Cart
// app.get('/api/cart', (req, res) => {
//   res.json([]);
// });

// // Orders
// app.get('/api/orders', (req, res) => {
//   res.json([]);
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server LIVE: http://localhost:${PORT}`);
//   console.log(`✅ Open browser to see JSON`);
// });

// // const express = require('express');
// // // const app = express();
// // // const PORT = 5001; // Back to 5000
// // app.use(express.json());



const express = require('express');
const app = express();
const PORT = 5001;

app.use(express.json());

// In-memory storage (for testing)
let products = [];
let cart = [];
let orders = [];
let productCounter = 1;

// Home
app.get('/', (req, res) => {
  res.json({ 
    message: 'E-commerce API',
    endpoints: {
      products: {
        GET: '/api/products',
        POST: '/api/products',
        GET_ONE: '/api/products/:id',
        PUT: '/api/products/:id',
        DELETE: '/api/products/:id'
      },
      cart: {
        GET: '/api/cart',
        POST: '/api/cart',
        DELETE: '/api/cart/:id'
      },
      orders: {
        GET: '/api/orders',
        POST: '/api/orders',
        GET_ONE: '/api/orders/:id'
      }
    }
  });
});

// ----- PRODUCT ENDPOINTS -----
// GET all products
app.get('/api/products', (req, res) => {
  const { category, minPrice, maxPrice } = req.query;
  let filtered = [...products];
  
  if (category) filtered = filtered.filter(p => p.category === category);
  if (minPrice) filtered = filtered.filter(p => p.price >= Number(minPrice));
  if (maxPrice) filtered = filtered.filter(p => p.price <= Number(maxPrice));
  
  res.json(filtered);
});

// GET single product
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// POST create product
app.post('/api/products', (req, res) => {
  const { name, description, price, stock, category, imageUrl } = req.body;
  
  // Validation
  if (!name || !description || !price || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (price < 0) return res.status(400).json({ error: 'Price must be positive' });
  if (stock < 0) return res.status(400).json({ error: 'Stock cannot be negative' });
  
  const product = {
    id: productCounter++,
    name,
    description,
    price,
    stock: stock || 0,
    category,
    imageUrl: imageUrl || '',
    createdAt: new Date()
  };
  
  products.push(product);
  res.status(201).json(product);
});

// PUT update product
app.put('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = products.findIndex(p => p.id === id);
  
  if (index === -1) return res.status(404).json({ error: 'Product not found' });
  
  const updates = req.body;
  if (updates.price && updates.price < 0) {
    return res.status(400).json({ error: 'Price must be positive' });
  }
  if (updates.stock && updates.stock < 0) {
    return res.status(400).json({ error: 'Stock cannot be negative' });
  }
  
  products[index] = { ...products[index], ...updates };
  res.json(products[index]);
});

// DELETE product
app.delete('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = products.findIndex(p => p.id === id);
  
  if (index === -1) return res.status(404).json({ error: 'Product not found' });
  
  products.splice(index, 1);
  res.json({ message: 'Product deleted' });
});

// ----- CART ENDPOINTS -----
// GET cart
app.get('/api/cart', (req, res) => {
  res.json(cart);
});

// POST add to cart
app.post('/api/cart', (req, res) => {
  const { productId, quantity } = req.body;
  const product = products.find(p => p.id === Number(productId));
  
  if (!product) return res.status(404).json({ error: 'Product not found' });
  if (quantity > product.stock) {
    return res.status(400).json({ error: 'Not enough stock' });
  }
  
  cart.push({ productId: Number(productId), quantity: quantity || 1 });
  res.status(201).json(cart);
});

// DELETE from cart
app.delete('/api/cart/:productId', (req, res) => {
  const productId = Number(req.params.productId);
  const index = cart.findIndex(item => item.productId === productId);
  
  if (index === -1) return res.status(404).json({ error: 'Item not found in cart' });
  
  cart.splice(index, 1);
  res.json({ message: 'Item removed from cart' });
});

// ----- ORDER ENDPOINTS -----
// GET all orders
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

// POST create order
app.post('/api/orders', (req, res) => {
  if (cart.length === 0) return res.status(400).json({ error: 'Cart is empty' });
  
  // Check stock
  for (const item of cart) {
    const product = products.find(p => p.id === item.productId);
    if (item.quantity > product.stock) {
      return res.status(400).json({ 
        error: `Not enough stock for ${product.name}` 
      });
    }
  }
  
  // Create order
  const order = {
    id: orders.length + 1,
    items: [...cart],
    total: cart.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      return sum + (product.price * item.quantity);
    }, 0),
    date: new Date().toISOString(),
    customerInfo: req.body.customerInfo || {}
  };
  
  // Update stock
  cart.forEach(item => {
    const product = products.find(p => p.id === item.productId);
    product.stock -= item.quantity;
  });
  
  orders.push(order);
  cart = []; // Clear cart
  res.status(201).json(order);
});

// GET single order
app.get('/api/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === Number(req.params.id));
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

// Start server
app.listen(PORT, () => {
  console.log(` Server running: http://localhost:${PORT}`);
  console.log(` Sample endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/api/products`);
  console.log(`   POST http://localhost:${PORT}/api/products`);
  console.log(`   POST http://localhost:${PORT}/api/cart`);
  console.log(`   POST http://localhost:${PORT}/api/orders`);
});

const express = require('express');
const app = express();
const PORT = 5001;

app.use(express.json());

// In-memory storage
let products = [];
let cart = [];
let orders = [];
let productCounter = 1;

app.get('/', (req, res) => {
  res.json({ 
    message: 'E-commerce API',
    endpoints: {
      products: '/api/products',
      cart: '/api/cart',
      orders: '/api/orders'
    }
  });
});

app.get('/api/products', (req, res) => {
  res.json(products);
});

// POST create products
app.post('/api/products', (req, res) => {
  try {
    const { name, price } = req.body || {};
    
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price required' });
    }
    
    const product = {
      id: productCounter++,
      name,
      price: Number(price),
      createdAt: new Date()
    };
    
    products.push(product);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// . CART
app.get('/api/cart', (req, res) => {
  res.json(cart);
});

// POST add to cart
app.post('/api/cart', (req, res) => {
  try {
    const { productId } = req.body || {};
    
    const item = {
      productId: productId || 1,
      quantity: 1
    };
    
    cart.push(item);
    res.status(201).json(cart);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

//  ORDERS
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

// POST create order
app.post('/api/orders', (req, res) => {
  try {
    const order = {
      id: orders.length + 1,
      items: [...cart],
      total: 100,
      date: new Date(),
      customerInfo: {}
    };
    
    orders.push(order);
    cart = []; 
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
  console.log(' Endpoints  are ready for testing');
});

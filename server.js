
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// ========== MONGODB CONNECTION ==========
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000
})
.then(() => {
  console.log('MongoDB Atlas Connected');
  // ========== ADD SAMPLE PRODUCTS AFTER CONNECTION ==========
  addSampleProducts();
})
.catch(err => console.log('MongoDB Error:', err.message));

// ========== MODELS ==========
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, default: 0, min: 0 },
  category: { type: String, default: 'General' },
  imageUrl: { type: String, default: '' }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

const cartSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 }
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

const orderSchema = new mongoose.Schema({
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true }
  }],
  total: { type: Number, required: true, min: 0 },
  customerInfo: { type: Object, default: {} },
  status: { type: String, default: 'pending' }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

// ========== SAMPLE PRODUCTS FUNCTION ==========
async function addSampleProducts() {
  try {
    // Check if products already exist
    const count = await Product.countDocuments();
    
    if (count === 0) {
      console.log('Adding sample products to database...');
      
      const sampleProducts = [
        {
          name: 'MacBook Pro 16"',
          description: 'Apple M3 chip, 16GB RAM, 512GB SSD',
          price: 2499,
          stock: 15,
          category: 'Laptops',
          imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8'
        },
        {
          name: 'Wireless Mouse',
          description: 'Ergonomic Bluetooth mouse, rechargeable',
          price: 49,
          stock: 50,
          category: 'Accessories',
          imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46'
        },
        {
          name: 'Smartphone',
          description: '6.7" display, 128GB storage, 5G',
          price: 899,
          stock: 20,
          category: 'Phones',
          imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9'
        },
        {
          name: 'Tablet',
          description: '11" display, 64GB WiFi',
          price: 449,
          stock: 18,
          category: 'Tablets',
          imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0'
        }    
      ];
      
      await Product.insertMany(sampleProducts);
      console.log(` Added ${sampleProducts.length} sample products to database!`);
      console.log(' Sample products ready for testing');
    } else {
      console.log(`Database already has ${count} products`);
    }
  } catch (error) {
    console.error(' Error adding sample products:', error.message);
  }
}

app.use(express.json());

// ========== TEST ROUTE ==========
app.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running!',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// ========== ROUTES ==========
app.get('/', (req, res) => {
  res.json({ 
    message: 'E-commerce API with MongoDB',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    endpoints: {
      test: '/test',
      products: '/api/products',
      cart: '/api/cart',
      orders: '/api/orders'
    }
  });
});

// ===== PRODUCT ENDPOINTS =====
app.get('/api/products', async (req, res) => {
  try {
    const { category, minPrice, maxPrice } = req.query;
    let filter = {};
    
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create product
app.post('/api/products', async (req, res) => {
  try {
    console.log('POST /api/products - Request body:', req.body);
    
    const { name, description, price, stock, category, imageUrl } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price required' });
    }
    
    const product = new Product({
      name,
      description: description || '',
      price: Number(price),
      stock: stock || 0,
      category: category || 'General',
      imageUrl: imageUrl || ''
    });
    
    await product.save();
    console.log(' Product saved:', product._id);
    res.status(201).json(product);
  } catch (error) {
    console.error('Product creation error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== CART ENDPOINTS =====
app.get('/api/cart', async (req, res) => {
  try {
    const cartItems = await Cart.find().populate('productId');
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/cart', async (req, res) => {
  try {
    console.log('POST /api/cart - Request body:', req.body);
    
    const { productId, quantity } = req.body;
    
    if (!productId) {
      return res.status(400).json({ error: 'productId required' });
    }
    
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    const cartItem = new Cart({
      productId,
      quantity: quantity || 1
    });
    
    await cartItem.save();
    console.log('Cart item saved:', cartItem._id);
    res.status(201).json(cartItem);
  } catch (error) {
    console.error(' Cart error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/cart/:id', async (req, res) => {
  try {
    const cartItem = await Cart.findByIdAndDelete(req.params.id);
    if (!cartItem) return res.status(404).json({ error: 'Cart item not found' });
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== ORDER ENDPOINTS =====
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('items.productId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    console.log('POST /api/orders - Starting order creation');
    
    const cartItems = await Cart.find();
    
    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    
    let total = 0;
    const orderItems = [];
    
    for (const item of cartItems) {
      const product = await Product.findById(item.productId);
      if (product) {
        total += product.price * item.quantity;
        orderItems.push({
          productId: item.productId,
          quantity: item.quantity
        });
      }
    }
    
    const order = new Order({
      items: orderItems,
      total,
      customerInfo: req.body.customerInfo || {},
      status: 'pending'
    });
    
    await order.save();
    await Cart.deleteMany({});
    
    console.log(' Order created:', order._id);
    res.status(201).json(order);
  } catch (error) {
    console.error(' Order error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.productId');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== START SERVER ==========
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log(` SERVER RUNNING: http://localhost:${PORT}`);
  console.log(` TEST ENDPOINT: http://localhost:${PORT}/test`);
  console.log(' MongoDB Atlas Integrated');
  console.log('ENDPOINTS READY:');
  console.log(`   GET/POST  http://localhost:${PORT}/api/products`);
  console.log(`   GET/POST  http://localhost:${PORT}/api/cart`);
  console.log(`   GET/POST  http://localhost:${PORT}/api/orders`);
  console.log('='.repeat(60) + '\n');
});
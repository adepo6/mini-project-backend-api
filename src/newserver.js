require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db.js');
const productRoutes = require('./src/routes/productRoutes');

const app = express();

// Connect to MongoDB Atlas
connectDB();

// Middleware to parse JSON (Requirement: All responses should be JSON)
app.use(express.json());

// Use Product Routes
app.use('/products', productRoutes);

// Basic test route
app.get('/', (res, req) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
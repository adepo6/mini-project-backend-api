const express = require('express');
const router = express.Router();
const { getAllProducts, createProduct } = require('../controllers/productController');

// Map endpoints to controller functions [cite: 20, 24]
router.get('/', getAllProducts);
router.post('/', createProduct);

module.exports = router;
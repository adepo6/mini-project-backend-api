const Product = require('./models/Product');
// @desc    Get all products (with optional filters)
// @route   GET /products
exports.getAllProducts = async (req, res) => {
    try {
        const { category, minPrice, maxPrice } = req.query;
        let query = {};

        // Requirement: support simple filters [cite: 21, 22]
        if (category) query.category = category;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const products = await Product.find(query);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a product
// @route   POST /products
exports.createProduct = async (req, res) => {
    try {
        // Requirement: Product name required, price positive, stock non-negative [cite: 43]
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct); // 201 for successful creation 
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 for validation errors 
    }
};

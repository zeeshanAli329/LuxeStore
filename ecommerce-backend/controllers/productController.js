const Product = require("../models/Product");

// GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
    try {
        // Simple search & filter
        const { keyword, category, featured, limit } = req.query;
        let query = {};

        if (keyword) {
            query.title = { $regex: keyword, $options: "i" };
        }
        if (category && category !== 'All' && category !== '') {
            query.category = category;
        }
        if (featured === 'true') {
            query.isFeatured = true;
        }

        let productsQuery = Product.find(query);

        if (limit) {
            productsQuery = productsQuery.limit(Number(limit));
        }

        const products = await productsQuery.sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET SINGLE PRODUCT
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// CREATE PRODUCT (ADMIN)
exports.createProduct = async (req, res) => {
    try {
        const { title, description, image, images, oldPrice, newPrice, discount, category, stock, isFeatured, colors, sizes } = req.body;

        // Calculate discount if not provided but old/new prices are
        let finalDiscount = discount;
        if (!finalDiscount && oldPrice && newPrice) {
            finalDiscount = Math.round(((oldPrice - newPrice) / oldPrice) * 100);
        }

        const product = await Product.create({
            title,
            description,
            image,
            images: images || [],
            oldPrice,
            newPrice,
            discount: finalDiscount || 0,
            category,
            stock,
            isFeatured,
            colors: colors || [],
            sizes: sizes || []
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE PRODUCT (ADMIN)
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.title = req.body.title || product.title;
        product.description = req.body.description || product.description;
        product.image = req.body.image || product.image;
        product.images = req.body.images || product.images; // Array replacement
        product.oldPrice = req.body.oldPrice || product.oldPrice;
        product.newPrice = req.body.newPrice || product.newPrice;
        product.discount = req.body.discount || product.discount;
        product.category = req.body.category || product.category;
        product.stock = req.body.stock || product.stock;
        product.isFeatured = req.body.isFeatured !== undefined ? req.body.isFeatured : product.isFeatured;
        product.colors = req.body.colors || product.colors;
        product.sizes = req.body.sizes || product.sizes;

        // Recalculate discount if prices changed
        if (req.body.oldPrice || req.body.newPrice) {
            const oPrice = product.oldPrice;
            const nPrice = product.newPrice;
            if (oPrice && nPrice) {
                product.discount = Math.round(((oPrice - nPrice) / oPrice) * 100);
            }
        }

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE PRODUCT (ADMIN)
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await Product.deleteOne({ _id: req.params.id });
        res.json({ message: "Product removed" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

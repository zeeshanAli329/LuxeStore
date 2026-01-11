const Product = require("../models/Product");

// GET ALL PRODUCTS
const getProducts = async (req, res) => {
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
const getProductById = async (req, res) => {
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
const createProduct = async (req, res) => {
    try {
        const { title, description, image, images, video, oldPrice, newPrice, discount, category, stock, isFeatured, colors, sizes, isBoutique, designTimeMinDays, designTimeMaxDays, visitLocationText, visitLocationMapUrl, isOnSale, saleLabel, saleEndsAt, isDeal, dealLabel, dealEndsAt, dealNote } = req.body;

        // Calculate discount if not provided but old/new prices are
        let finalDiscount = discount;
        if (!finalDiscount && oldPrice && newPrice) {
            finalDiscount = Math.round(((oldPrice - newPrice) / oldPrice) * 100);
        }

        const product = await Product.create({
            title,
            description,
            image,
            images: Array.isArray(images) ? images.filter(img => img.trim() !== "") : [],
            video: video ? video.trim() : "",
            oldPrice,
            newPrice,
            discount: finalDiscount || 0,
            category,
            stock,
            isFeatured,
            colors: colors || [],
            sizes: sizes || [],
            isBoutique: isBoutique || false,
            designTimeMinDays,
            designTimeMaxDays,
            visitLocationText,
            visitLocationMapUrl,
            isOnSale: isOnSale || false,
            saleLabel: saleLabel || "",
            saleEndsAt: saleEndsAt || null,
            isDeal: isDeal || false,
            dealLabel: dealLabel || "",
            dealEndsAt: dealEndsAt || null,
            dealNote: dealNote || ""
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE PRODUCT (ADMIN)
// UPDATE PRODUCT (ADMIN)
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`[UpdateProduct] Request for ID: ${id}`);
        console.log(`[UpdateProduct] Payload keys:`, Object.keys(req.body));

        // 1. Validate ID
        // Note: mongoose.Types.ObjectId.isValid might be needed if not handled globally, 
        // but try/catch usually catches CastError.

        // 2. Find product first to ensure it exists
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            console.log(`[UpdateProduct] Product not found: ${id}`);
            return res.status(404).json({ message: "Product not found" });
        }

        // 3. Build updates object safely
        // Only include keys that are explicitly in provided body to avoiding overwriting with undefined
        const updates = {};
        const allowedFields = [
            'title', 'description', 'image', 'images', 'video',
            'oldPrice', 'newPrice', 'discount', 'category', 'stock',
            'isFeatured', 'isBoutique', 'colors', 'sizes',
            'designTimeMinDays', 'designTimeMaxDays',
            'visitLocationText', 'visitLocationMapUrl',
            'isOnSale', 'saleLabel', 'saleEndsAt',
            'isDeal', 'dealLabel', 'dealEndsAt', 'dealNote'
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                // Special handling for numbers
                if (['oldPrice', 'newPrice', 'discount', 'stock', 'designTimeMinDays', 'designTimeMaxDays'].includes(field)) {
                    updates[field] = req.body[field] === "" ? null : Number(req.body[field]);
                }
                // Special handling for Arrays
                else if (['images', 'colors', 'sizes'].includes(field)) {
                    // Expecting arrays from frontend now, or ensure they are processed
                    updates[field] = req.body[field];
                }
                // Special handling for dates (empty string -> null)
                else if (['saleEndsAt', 'dealEndsAt'].includes(field)) {
                    updates[field] = req.body[field] ? req.body[field] : null;
                }
                else {
                    updates[field] = req.body[field];
                }
            }
        });

        // Auto-calculate discount if prices are updated or prices exist in DB
        const oPrice = updates.oldPrice !== undefined ? updates.oldPrice : existingProduct.oldPrice;
        const nPrice = updates.newPrice !== undefined ? updates.newPrice : existingProduct.newPrice;

        // If discount is NOT manually provided in this update, calculate it
        if (updates.discount === undefined || updates.discount === null) {
            if (oPrice && nPrice) {
                updates.discount = Math.round(((oPrice - nPrice) / oPrice) * 100);
            }
        }

        console.log(`[UpdateProduct] Final updates object:`, JSON.stringify(updates, null, 2));

        const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });

        res.json(updatedProduct);
    } catch (error) {
        console.error(`[UpdateProduct] Error:`, error);
        // Return specific validation message if available
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message || "Server Error during product update", stack: error.stack });
    }
};

// DELETE PRODUCT (ADMIN)
const deleteProduct = async (req, res) => {
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

// GET SALE PRODUCTS
const getSaleProducts = async (req, res) => {
    try {
        const now = new Date();
        const products = await Product.find({
            isOnSale: true,
            $or: [
                { saleEndsAt: { $exists: false } },
                { saleEndsAt: null },
                { saleEndsAt: { $gt: now } }
            ]
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET DEAL PRODUCTS
const getDealProducts = async (req, res) => {
    try {
        const now = new Date();
        const products = await Product.find({
            isDeal: true,
            $or: [
                { dealEndsAt: { $exists: false } },
                { dealEndsAt: null },
                { dealEndsAt: { $gt: now } }
            ]
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET UNIQUE CATEGORIES
const getUniqueCategories = async (req, res) => {
    try {
        const categories = await Product.distinct("category");
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getSaleProducts,
    getDealProducts,
    getUniqueCategories
};

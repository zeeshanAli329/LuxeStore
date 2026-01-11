const express = require("express");
const productController = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", productController.getProducts); // Updated to use productController prefix
// Routes
router.get('/sale', productController.getSaleProducts);
router.get('/deals', productController.getDealProducts);
router.get("/:id", productController.getProductById); // Updated to use productController prefix

// Admin routes
router.post("/", protect, admin, productController.createProduct);
router.put("/:id", protect, admin, productController.updateProduct);
router.delete("/:id", protect, admin, productController.deleteProduct);

module.exports = router;

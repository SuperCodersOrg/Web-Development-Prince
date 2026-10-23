const express = require('express');
const isAuthenticated = require('../middleware/isAuthenticated');
const productController = require('../controllers/productController');
const router = express.Router();

router.get('/dashboard', isAuthenticated, productController.dashboard);
router.get('/products', isAuthenticated, productController.products);
router.get('/products/:id', isAuthenticated, productController.productDetails);
router.get('/cart', isAuthenticated,productController.cart);
router.get('/profile', isAuthenticated, productController.profile);
router.post('/logout', productController.logout);

module.exports = router;

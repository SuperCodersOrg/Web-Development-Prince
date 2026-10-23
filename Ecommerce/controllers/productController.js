const Product = require('../Models/Product');

const dashboard = async (req, res) => {
    try {
        const products = await Product.find().limit(6);
        console.log(products)

        res.render('dashboard', {
            user: req.user,
            page: 'dashboard',
            products: products
        });

    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
};

const products = async (req, res) => {
    try {
        const products = await Product.find();

        res.render('products', {
            user: req.user,
            page: 'products',
            products: products
        });

    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
};

const productDetails = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).send('Product not found');
        }

        res.render('product-details', {
            user: req.user,
            product: product
        });

    } catch (error) {
        console.log(error);
        res.status(404).send('Product not found');
    }
};

const cart = (req, res) => {
    res.render('dashboard', {
        user: req.user,
        page: 'cart',
        products: []
    });
};

const profile = (req, res) => {
    res.render('dashboard', {
        user: req.user,
        page: 'profile',
    });
};

const logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
};

module.exports = { dashboard, products, productDetails, cart, profile, logout };

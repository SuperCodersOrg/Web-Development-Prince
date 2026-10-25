const mongoose = require('mongoose');
const Product = require('../Models/Product');
const PAGE_SIZE = 6;

async function getPage(cursor) {
    const filter = cursor ? { _id: { $lt: new mongoose.Types.ObjectId(cursor) } } : {};
    const results = await Product.find(filter).limit(PAGE_SIZE + 1);
    const hasMore = results.length > PAGE_SIZE;
    const products = results.slice(0, PAGE_SIZE);
    return { products, nextCursor: hasMore ? String(products[products.length - 1]._id) : null };
}

const dashboard = async (req, res) => {
    try {
        const { products } = await getPage();
      res.render('dashboard', {
    page: 'dashboard',
    user: req.user || null,
    products
});
    } catch (error) { res.status(500).send('Server Error'); }
};

const products = async (req, res) => {
    try {
        const page = await getPage();
        res.render('products', { user: req.user, page: 'products', ...page });
    } catch (error) { res.status(500).send('Server Error'); }
};

const moreProducts = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.query.cursor)) return res.status(400).json({ message: 'Invalid cursor' });
        const page = await getPage(req.query.cursor);
        res.render('partials/product-cards', { products: page.products }, (err, html) => {
            if (err) return res.status(500).json({ message: 'Failed to load products' });
            res.json({ html, nextCursor: page.nextCursor });
        });
    } catch (error) { res.status(500).json({ message: 'Failed to load products' }); }
};

const productDetails = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).send('Product not found');
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send('Product not found');
        res.render('product-details', { user: req.user, product });
    } catch (error) { res.status(404).send('Product not found'); }
};

const profile = (req, res) => res.render('dashboard', { user: req.user, page: 'profile', products: [] });
const logout = (req, res) => { res.clearCookie('token'); res.redirect('/login'); };
module.exports = { dashboard, products, moreProducts, productDetails, profile, logout };

require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');
const User = require('./Models/User');
const Product = require('./Models/Product');
const { router } = require('./auth/auth');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'Public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(router);

async function isAuthenticated(req, res, next){
  try {
    const data = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    const user = await User.findById(data.id);
    if (!user || data.version !== user.tokenVersion) return res.redirect('/login');
    req.user = user;
    next();
  } catch (error) {
    return res.redirect('/login');
  }
}



app.get('/dashboard', isAuthenticated, async (req, res) => {
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
});

app.get('/products', isAuthenticated, async (req, res) => {
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
});



app.get('/products/:id', isAuthenticated, async (req, res) => {
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
});

app.get('/cart', isAuthenticated, (req, res) => {
    res.render('dashboard', {
        user: req.user,
        page: 'cart',
        products: []
    });
});

app.get('/profile', isAuthenticated, (req, res) => {
    res.render('dashboard', {
        user: req.user,
        page: 'profile',
    });
});

app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

connectDB().then(() => app.listen(process.env.PORT || 7000, () => console.log('CARTFORGE started')))
  .catch(error => console.error('MongoDB connection failed:', error.message));
module.exports = app;

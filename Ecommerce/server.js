require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'Public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(authRoutes);
app.use(productRoutes);

connectDB().then(() => app.listen(process.env.PORT || 7000, () => console.log('CARTFORGE started')))
  .catch(error => console.error('MongoDB connection failed:', error.message));

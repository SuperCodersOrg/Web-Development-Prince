
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../Models/User');

const router = express.Router();

const mailer = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

function createLoginCookie(res, user) {
    const token = jwt.sign(
        { id: user.id, version: user.tokenVersion },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 86400000
    });
}

router.get('/', (req, res) => res.redirect('/dashboard'));

router.get('/signup', (req, res) => {
    res.render('signup', { message: '' });
});

router.get('/login', (req, res) => {
    res.render('login', { message: '' });
});

router.get('/forgot-password', (req, res) => {
    res.render('forgot-password', { message: '' });
});

router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        const email = (req.body.email || '').trim().toLowerCase();

        if (!username || username.trim().length < 2 || !password || password.length < 8 || !/^\S+@\S+\.\S+$/.test(email)) {
            return res.render('signup', { message: 'Enter valid details. Password must contain at least 8 characters.' });
        }

        const user = await User.findOne({ email });

        if (user) {
            return res.render('signup', { message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const pendingUser = await PendingUser.findOneAndUpdate(
            { email },
            {
                username: username.trim(),
                email,
                password: hashedPassword,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000)
            },
            { upsert: true, new: true, runValidators: true }
        );

        const token = jwt.sign(
            { id: pendingUser.id, email, purpose: 'verify' },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const link = `${process.env.BASE_URL || 'http://localhost:8000'}/verify-email/${token}`;

        await mailer.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify CARTFORGE Account',
            text: `Click here to verify your email: ${link}`
        });

        res.render('signup', { message: 'Verification email sent. Check your inbox.' });

    } catch (error) {
        console.log(error);
        res.render('signup', { message: 'Signup failed. Please try again.' });
    }
});

router.get('/verify-email/:token', async (req, res) => {
    try {
        const data = jwt.verify(req.params.token, process.env.JWT_SECRET);

        if (data.purpose !== 'verify') {
            return res.render('login', { message: 'Invalid verification link' });
        }

        const pendingUser = await PendingUser.findById(data.id);

        if (!pendingUser || pendingUser.email !== data.email || pendingUser.expiresAt <= new Date()) {
            return res.render('login', { message: 'Verification link expired' });
        }

        let user = await User.findOne({ email: pendingUser.email });

        if (!user) {
            user = await User.create({
                username: pendingUser.username,
                email: pendingUser.email,
                password: pendingUser.password
            });
        }

        createLoginCookie(res, user);
        res.redirect('/dashboard');

    } catch (error) {
        console.log(error);
        res.render('login', { message: 'Invalid or expired verification link' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const email = (req.body.email || '').trim().toLowerCase();
        const password = req.body.password || '';

        const user = await User.findOne({ email });

        if (!user) {
            return res.render('login', { message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.render('login', { message: 'Invalid email or password' });
        }

        createLoginCookie(res, user);
        res.redirect('/dashboard');

    } catch (error) {
        console.log(error);
        res.render('login', { message: 'Login failed' });
    }
});

router.post('/forgot-password', async (req, res) => {
    try {
        const email = (req.body.email || '').trim().toLowerCase();
        const user = await User.findOne({ email });

        if (user) {
            const token = jwt.sign(
                { id: user.id, version: user.tokenVersion, purpose: 'reset' },
                process.env.JWT_SECRET,
                { expiresIn: '15m' }
            );

            const link = `${process.env.BASE_URL || 'http://localhost:8000'}/reset-password/${token}`;

            await mailer.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Reset CARTFORGE Password',
                text: `Click here to reset your password: ${link}`
            });
        }

        res.render('forgot-password', {
            message: 'If your email exists, a reset link has been sent.'
        });

    } catch (error) {
        console.log(error);
        res.render('forgot-password', { message: 'Could not send reset email' });
    }
});

router.get('/reset-password/:token', async (req, res) => {
    try {
        const data = jwt.verify(req.params.token, process.env.JWT_SECRET);

        if (data.purpose !== 'reset') {
            return res.render('login', { message: 'Invalid reset link' });
        }

        const user = await User.findById(data.id);

        if (!user || user.tokenVersion !== data.version) {
            return res.render('login', { message: 'Invalid reset link' });
        }

        res.render('reset-password', {
            token: req.params.token,
            message: ''
        });

    } catch (error) {
        res.render('login', { message: 'Invalid or expired reset link' });
    }
});

router.post('/reset-password/:token', async (req, res) => {
    try {
        const data = jwt.verify(req.params.token, process.env.JWT_SECRET);

        if (data.purpose !== 'reset') {
            return res.render('login', { message: 'Invalid reset link' });
        }

        const user = await User.findById(data.id);

        if (!user || user.tokenVersion !== data.version) {
            return res.render('login', { message: 'Reset link expired or already used' });
        }

        const { password, confirmPassword } = req.body;

        if (!password || password.length < 8 || password !== confirmPassword) {
            return res.render('reset-password', {
                token: req.params.token,
                message: 'Passwords must match and contain at least 8 characters'
            });
        }

        user.password = await bcrypt.hash(password, 10);
        user.tokenVersion += 1;

        await user.save();

        res.clearCookie('token');
        res.render('login', { message: 'Password updated successfully. Please login.' });

    } catch (error) {
        console.log(error);
        res.render('login', { message: 'Invalid or expired reset link' });
    }
});

module.exports = { router };

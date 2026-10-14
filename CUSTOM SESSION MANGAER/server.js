const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();

const dataFolder = path.join(__dirname, 'DATA');
const userFile = path.join(dataFolder, 'users.json');
const sessionFile = path.join(dataFolder, 'sessions.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

function getData(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function saveData(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}



app.get('/', (req, res) => {
    res.redirect("/login");
});

app.get('/login', (req, res) => {
    res.render("login");
});

app.get('/signup', (req, res) => {
    res.render("signup");
});

app.post('/signup', (req, res) => {
    const  {name, email, password } = req.body;
    const users = getData(userFile);

    const user = users.find(user => user.email === email);

    if (user) {
        return res.status(409).send('User already exists');
    }

    bcrypt.hash(password, 10).then(hashedPassword => {
        const newUser = {
            id: Date.now(),
            name,
            email,
            password: hashedPassword
        };

        users.push(newUser);
        saveData(userFile, users);

        res.redirect("/dashboard");
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const users = getData(userFile);

    const user = users.find(user => user.email === email);

    if (!user) {
        return res.status(401).send('Invalid email or password');
    }

    bcrypt.compare(password, user.password).then(match => {
        if (!match) {
            return res.status(401).send('Invalid email or password');
        }

        const sessions = getData(sessionFile);

        const sessionId =
            Date.now().toString() + Math.random().toString(36).slice(2);

        const session = {
            sessionId,
            userId: user.id,
            expiresAt: Date.now() + 2 * 60 * 1000
        };

        sessions.push(session);
        saveData(sessionFile, sessions);

        res.setHeader(
            'Set-Cookie',
            `sessionid=${sessionId}; Max-Age=120; Path=/; HttpOnly; SameSite=Lax`
        );

        res.redirect('/dashboard');
    });
});

app.get('/dashboard', isAuthenticated, (req, res) => {
    const users = getData(userFile);

    const user = users.find(
        user => user.id === req.session.userId
    );

    if (!user) {
        return res.redirect('/login');
    }
  res.render('dashboard', { user: user });
});

app.post('/logout', (req, res) => {
    const sessionId = getCookie(req);
    const sessions = getData(sessionFile);

    saveData( sessionFile,sessions.filter(session => session.sessionId !== sessionId));

    res.setHeader(
        'Set-Cookie',
        'sessionid=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax'
    );
    
    res.redirect("/login");
});

app.listen(5000, () => {
    console.log('Server running at http://localhost:5000');
});

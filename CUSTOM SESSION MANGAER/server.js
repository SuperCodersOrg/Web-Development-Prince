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

function getCookie(req) {
    const cookies = (req.headers.cookie || '').split(';');
    const cookie = cookies.find(cookie =>
        cookie.trim().startsWith('sessionid=')
    );
    if (cookie) {
        return cookie.trim().split('=')[1];
    }
    return null;
}


function isAuthenticated(req, res, next) {
    const sessionId = getCookie(req);

    if (!sessionId) {
        return res.redirect('/login');
    }

    const sessions = getData(sessionFile);
    const session = sessions.find(
        session => session.sessionId === sessionId
    );
   if (!session || Date.now() >= session.expiresAt) {
        saveData(
            sessionFile,
            sessions.filter(session => session.sessionId !== sessionId)
        );
        res.setHeader(
            'Set-Cookie',
            'sessionid=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax'
        );
        return res.redirect('/login');
    }
    req.session = session;
    next();
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
        const newuser = {
            id: Date.now(),
            name,
            email,
            password: hashedPassword
        };

        users.push(newuser);
        saveData(userFile, users);

        res.redirect("/dashboard");
    });
});

app.post('/login', (req, res) => {
    const { name, email, password } = req.body;
    const users = getData(userFile);
//console.log(users)
    const user = users.find(user => user.name == name && user.email === email);

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
    console.log(users);
    res.status(200).render(("dashboard"),{
        user: users.id,
        email:users.email
        
    });
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

require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

// Create a MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to the database.');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure: true if using HTTPS
}));

// Serve the login page on the root URL
app.get('/', (req, res) => {
    if (req.session.user) {
        return res.redirect('/index');
    }
    res.redirect('/login');
});

// Serve the login form
app.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/index');
    }
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Serve the registration form
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Handle login form submission
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const [rows] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(401).send('Invalid email or password.');
        }

        const user = rows[0];
        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send('Invalid email or password.');
        }

        // Store user info in session
        req.session.user = user;
        res.redirect('/index');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred.');
    }
});

// Serve the index page
app.get('/index', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle logout
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.status(500).send('An error occurred.');
        }
        res.redirect('/login');
    });
});

// Define routes for static pages
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/services', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'services.html'));
});

app.get('/blog', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'blog.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// Handle form submission from contact page
app.post('/send-message', (req, res) => {
    const { name, email, message } = req.body;
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Message: ${message}`);
    res.send('Thank you for your message. We will get back to you soon.');
});

// Endpoint to fetch news articles with pagination and search
app.get('/api/news', async (req, res) => {
    const API_KEY = process.env.NEWS_API_KEY;
    const { page = 1, pageSize = 5, query = 'cybersecurity' } = req.query;
    const url = `https://newsapi.org/v2/everything?q=${query}&pageSize=${pageSize}&page=${page}&apiKey=${API_KEY}`;
  
    try {
        const response = await axios.get(url);
        res.json({
            articles: response.data.articles,
            totalResults: response.data.totalResults,
            page: Number(page),
            pageSize: Number(pageSize)
        });
    } catch (error) {
        console.error('Error fetching news articles:', error);
        res.status(500).json({ error: 'Failed to fetch news articles' });
    }
});

// Handle 404 - Page Not Found
app.use((req, res) => {
    res.status(404).send('404 - Page Not Found');
});
  
// Handle 500 - Server Error
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('500 - Server Error');
});  

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

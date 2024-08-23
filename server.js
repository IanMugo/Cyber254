const express = require('express');
const path = require('path');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');

// Define the port to run the server on
const PORT = process.env.PORT || 3000;

// Middleware to serve static files (CSS, JS, Images)
app.use(express.static(path.join(__dirname, 'public')));

// Define routes for each page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

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

// Handle form submission
app.post('/send-message', (req, res) => {
  const { name, email, message } = req.body;

  // Here you can process the form data, e.g., send an email or save to a database
  console.log(`Name: ${name}`);
  console.log(`Email: ${email}`);
  console.log(`Message: ${message}`);

  // Send a response back to the client
  res.send('Thank you for your message. We will get back to you soon.');
});

// Endpoint to fetch news articles with pagination
app.get('/api/news', async (req, res) => {
  const API_KEY = '62fe330673cd4de7b2f3627d6c54a9aa'; // Use your actual API key
  const { page = 1, pageSize = 5, query = 'cybersecurity' } = req.query; // Default to page 1, 5 articles per page
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
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

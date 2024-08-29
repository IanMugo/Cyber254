// Prevent form submission if fields are empty
document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    if (name === '' || email === '') {
        alert('Please fill in all fields.');
    } else {
        alert('Form submitted successfully!');
        // Here, you can add more actions, like sending data to a server.
    }
});

// Fetch and display news articles with pagination
let currentPage = 1;
const pageSize = 5;

// Fetch news articles from the server
async function fetchNewsArticles(page = 1, query = 'cybersecurity') {
    try {
        const response = await fetch(`/api/news?page=${page}&pageSize=${pageSize}&query=${query}`);
        const data = await response.json();
        displayNewsArticles(data.articles);
        setupPagination(data.totalResults, data.page, data.pageSize, query);
    } catch (error) {
        console.error('Error fetching news articles:', error);
    }
}

// Display news articles
function displayNewsArticles(articles) {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = ''; // Clear existing articles

    articles.forEach(article => {
        const articleElement = document.createElement('div');
        articleElement.className = 'news-article';
        articleElement.innerHTML = `
            <h3>${article.title}</h3>
            <p>${article.description || 'No description available.'}</p>
            <a href="${article.url}" target="_blank">Read more</a>
        `;
        newsContainer.appendChild(articleElement);
    });
}

// Set up pagination controls
function setupPagination(totalResults, currentPage, pageSize, query) {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = ''; // Clear existing pagination

    const totalPages = Math.ceil(totalResults / pageSize);

    for (let page = 1; page <= totalPages; page++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = page;
        pageButton.className = page === currentPage ? 'active' : '';
        pageButton.addEventListener('click', () => fetchNewsArticles(page, query));
        paginationContainer.appendChild(pageButton);
    }
}

// Handle search form submission
function handleSearch(event) {
    event.preventDefault();
    const query = document.getElementById('search-input').value;
    currentPage = 1;
    fetchNewsArticles(currentPage, query);
}

// Event listener for search form
document.getElementById('search-form').addEventListener('submit', handleSearch);

// Initial fetch when the page loads
window.onload = () => fetchNewsArticles();

// Manage user session data
document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse('<%= JSON.stringify(user || null) %>'); // Fetch the user object from server-side
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const userIcon = document.getElementById('user-icon');
    const userEmail = document.getElementById('user-email');
    const logoutBtn = document.getElementById('logout-btn');

    if (user && user.isLoggedIn) {
        loginLink.style.display = 'none';
        registerLink.style.display = 'none';
        userIcon.style.display = 'block';
        userEmail.textContent = user.email;
        logoutBtn.style.display = 'block';
    } else {
        userIcon.style.display = 'none';
        userEmail.textContent = '';
        logoutBtn.style.display = 'none';
    }
});

// Logout function
function logout() {
    fetch('/logout', {
        method: 'GET',
        credentials: 'same-origin' // Include credentials (cookies) in the request
    })
    .then(response => {
        if (response.ok) {
            // Redirect to the login page after successful logout
            window.location.href = '/login';
        } else {
            alert('Failed to log out.');
        }
    })
    .catch(error => {
        console.error('Error during logout:', error);
        alert('An error occurred during logout.');
    });
}

// Fetch cybercrime news data
async function fetchCybercrimeNews() {
    const API_KEY = process.env.NEWS_API_KEY; // Replace with your actual API key
    const url = `https://newsapi.org/v2/everything?q=cybercrime&apiKey=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'ok') {
            return data.articles;
        } else {
            console.error('Error fetching news:', data);
        }
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

// Categorize articles based on keywords
async function categorizeCybercrimeArticles() {
    const articles = await fetchCybercrimeNews();
    
    const categories = {
        Phishing: 0,
        Ransomware: 0,
        'DDoS Attack': 0,
        'Data Breach': 0,
        Other: 0,
    };

    articles.forEach(article => {
        const content = article.title + ' ' + article.description;

        if (content.match(/phishing/i)) {
            categories.Phishing++;
        } else if (content.match(/ransomware/i)) {
            categories.Ransomware++;
        } else if (content.match(/DDoS/i)) {
            categories['DDoS Attack']++;
        } else if (content.match(/data breach/i)) {
            categories['Data Breach']++;
        } else {
            categories.Other++;
        }
    });

    return categories;
}

// Initialize and render the chart
async function renderPieChart() {
    const categories = await categorizeCybercrimeArticles();

    const ctx = document.getElementById('cyberCrimeChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });
}

// Call function to render the chart
document.addEventListener('DOMContentLoaded', renderPieChart);

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

document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the form from submitting

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    if (name === '' || email === '') {
        alert('Please fill in all fields.');
    } else {
        alert('Form submitted successfully!');
        // Here, you can add more actions, like sending data to a server.
    }
});

// Function to display news articles on the blog page
function displayNewsArticles() {
    const newsContainer = document.getElementById('news-container');
    newsArticles.forEach(article => {
        const articleElement = document.createElement('div');
        articleElement.className = 'news-article';
        articleElement.innerHTML = `
            <h3>${article.title}</h3>
            <p>${article.summary}</p>
            <a href="${article.link}">Read more</a>
        `;
        newsContainer.appendChild(articleElement);
    });
}

let currentPage = 1;
const pageSize = 5;

// Function to fetch news articles from server endpoint with pagination and search
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

// Function to display news articles on the blog page
function displayNewsArticles(articles) {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = ''; // Clear any existing articles

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

// Function to set up pagination controls
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

// Function to handle search form submission
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



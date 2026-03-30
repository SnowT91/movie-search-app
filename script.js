const API_KEY = '84c366cf';
const BASE_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const clearButton = document.getElementById('clear-button');
const moviesContainer = document.getElementById('movies-container');
const message = document.getElementById('message');

function showMessage(text, isError = false) {
    message.textContent = text;
    message.style.color = isError ? '#f87171' : '#fbbf24';
}

function clearMessage() {
    message.textContent = '';
}

function setLoading(isLoading) {
    searchButton.disabled = isLoading;
    clearButton.disabled = isLoading;
    searchButton.textContent = isLoading ? 'Searching...' : 'Search';
}

function showLoader() {
    moviesContainer.innerHTML = `<div class="loader">Loading movies...</div>`;
}

function clearMovies() {
    moviesContainer.innerHTML = '';
}

function createMovieCard(movie) {
    const posterHTML = 
        movie.Poster !== 'N/A' 
            ? `<img class="movie-poster" src="${movie.Poster}" alt="${movie.Title}" />`
            : `<div class="no-poster">No Image</div>`;

    return `
        <div class="movie-card">
            ${posterHTML}
            <div class="movie-info">
                <h3 class="movie-title">${movie.Title}</h3>
                <div class="movie-meta">
                    <span><strong>Year:</strong> ${movie.Year}</span>
                    <span><strong>Type:</strong> ${movie.Type}</span>
                </div>
            </div>
        </div>
    `;
}

function renderMovies(movies) {
    moviesContainer.innerHTML = movies.map(createMovieCard).join('');
}

function resetAppState() {
    searchInput.value = '';
    clearMovies();
    clearMessage();
    showMessage('Search for your favorite movies to get started.');
}

async function fetchMovies(searchTerm) {
    try {
        setLoading(true);
        clearMessage();
        showLoader();

        const response = await fetch(`${BASE_URL}&s=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();

        if (data.Response === 'False') {
            clearMovies();
            showMessage(data.Error || "No movies found.", true);
            return;
        }

        renderMovies(data.Search);
        showMessage(`Found ${data.Search.length} result(s) for "${searchTerm}".`);
    } catch (error) {
        clearMovies();
        showMessage('Something went wrong. Please try again.', true);
    } finally {
        setLoading(false);
    }
}

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const searchTerm = searchInput.value.trim();

    if (!searchTerm) {
        clearMovies();
        showMessage('Please enter a movie title.', true);
        return;
    }

    fetchMovies(searchTerm);
});

clearButton.addEventListener('click', resetAppState);

showMessage('Search for your favorite movies to get started.');

const API_KEY = '84c366cf';
const BASE_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const movieContainer = document.getElementById('movies-container');
const message = document.getElementById('message');

function showMessage(text, isError = false) {
    message.textContent = text;
    message.style.color = isError ? '#f87171' : '#fbbf24';
}

function clearMessage() {
    message.textContent = '';
}

function showLoader() {
    movieContainer.innerHTML = `<div class="loader">Loading movies...</div>`;
}

function clearMovies() {
    movieContainer.innerHTML = '';
}

function createMovieCard(movie) {
    const poster = 
        movie.Poster !== 'N/A' 
            ? movie.Poster 
            : 'https://via.placeholder.com/300x450?text=No+Image';

    return `
        <div class="movie-card">
            <img class="movie-poster" src="${poster}" alt="${movie.Title}" />
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
    movieContainer.innerHTML = movies.map(createMovieCard).join('');
}

async function fetchMovies(searchTerm) {
    try {
        showLoader();
        clearMessage();

        const response = await fetch(`${BASE_URL}&s=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();

        if (data.Response === 'False') {
            clearMovies();
            showMessage(data.Error || "No movies found.", true);
            return;
        }

        renderMovies(data.Search);
    } catch (error) {
        clearMovies();
        showMessage('Something went wrong. Please try again.', true);
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
    searchInput.value = '';
});

showMessage('Search for your favorite movies to get started.');

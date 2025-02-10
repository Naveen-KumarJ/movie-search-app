const apikey = '80707406';
const movieListContainer = document.querySelector('.movies-list');
const detailsContainer = document.querySelector('.movie-details');
const searchInput = document.querySelector('#movie-search-input');
const prevButton = document.getElementById("prev-page");
const nextButton = document.getElementById("next-page");
const paginationControls = document.getElementById("pagination-controls");
const movieMoreDetailsParentContainer = document.querySelector('.movie-details-container');
let currentPage = 1;
let currentQuery = '';

function updateUI(results) {
    movieListContainer.innerHTML = results.map((eachMovie) => (
        `<div class="movie-card w-[200px] h-[380px] bg-white p-2 flex flex-col justify-between rounded">
            <div class="poster w-full h-2/3">
              <img src="${eachMovie.Poster}" alt="" class="h-full w-full object-contain">
            </div>
            <div class="details flex flex-col gap-1">
              <h2 class="uppercase font-extrabold">${eachMovie.Title.length > 16 ? eachMovie.Title.slice(0, 16) + "..." : eachMovie.Title}</h2>
              <p class="text-sm">Year: ${eachMovie.Year}</p>
              <button class="details-btn bg-[#111155] text-white px-3 py-1 md:px-8 md:py-1 rounded font-semibold cursor-pointer" data-id="${eachMovie.imdbID}">See Details</button>
            </div>
        </div>`
    )).join('');

    document.querySelectorAll('.details-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            fetchMovieDetails(e.target.dataset.id);
        });
    });
}

async function fetchMovieList(query, page = 1) {
    currentQuery = query;
    currentPage = page;
    const response = await fetch(`https://www.omdbapi.com/?s=${query}&page=${page}&apikey=${apikey}`);
    const data = await response.json();
    if (data.Search) {
        updateUI(data.Search);
    }
    updatePaginationButtons(data.totalResults);
}

async function fetchMovieDetails(id) {
    const response = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${apikey}`);
    const data = await response.json();
    movieMoreDetailsParentContainer.style.display = "block";
    detailsContainer.innerHTML = `
        <div class="movie-info p-4 bg-gray-100 rounded">
            <h2 class="text-2xl font-bold">${data.Title}</h2>
            <p><strong>Year:</strong> ${data.Year}</p>
            <p><strong>Genre:</strong> ${data.Genre}</p>
            <p><strong>Director:</strong> ${data.Director}</p>
            <p><strong>Actors:</strong> ${data.Actors}</p>
            <p><strong>Plot:</strong> ${data.Plot}</p>
            <button class="close-details bg-red-500 text-white px-4 py-2 rounded mt-2">Close</button>
        </div>
    `;
    document.querySelector('.close-details').addEventListener('click', () => {
        movieMoreDetailsParentContainer.style.display = "none";
        detailsContainer.innerHTML = '';
    });
}

function updatePaginationButtons(totalResults) {
    if (!totalResults) {
        paginationControls.classList.add("hidden");
        return;
    }


    paginationControls.classList.remove("hidden");
    paginationControls.style.display = "flex"; // Explicitly set display

    const totalPages = Math.ceil(totalResults / 10);
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage >= totalPages;
}


prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
        fetchMovieList(currentQuery, currentPage - 1);
    }
});

nextButton.addEventListener('click', () => {
    fetchMovieList(currentQuery, currentPage + 1);
});

let timer;
searchInput.addEventListener('input', () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
        fetchMovieList(searchInput.value);
    }, 400);
});

const url = 'http://www.omdbapi.com';
const apikey = 'dd1ef959';
const i = 'tt3896198';

const fetchData = async (search) => {
	const res = await axios.get(url, {
		params: {
			apikey,
			s: search
		}
	});
	return res;
}

const root = document.querySelector('.autocomplete');
root.innerHTML = `
	<label><b>Search for a movie</b></label>
	<input type="text" />
	<div class="dropdown">
	<div class="dropdown-menu">
		<div class="dropdown-content results"></div>
	</div>	
	</div>
	<div id="target"></div>
`;

const input = document.querySelector('input');
input.classList.add('input')
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');

let timeoutId;

const onInput = async e => {
	const res = await fetchData(e.target.value);
	const movies = !res.data.Error ? res.data.Search : [];
	if(!movies.length) {
		dropdownRemove();
		return;
	}
	resultsWrapper.innerHTML = '';
	dropdown.classList.add('is-active');
	for (let movie of movies) {
		const option = document.createElement('a');
		const imageSrc = movie.Poster === "N/A" ? '' : movie.Poster;
		option.classList.add('dropdown-item')
		option.innerHTML = `
			<img src=${imageSrc} />
			${movie.Title}
		`;
		option.addEventListener('click', e => {
			dropdownRemove();
			input.value = movie.Title;
			onMovieSelect(movie).then(res => {
				console.log(res.data);
			});
		})
		resultsWrapper.append(option);
	}
};

input.addEventListener('input', debounce(onInput, 1000));

document.addEventListener('click', e => {
	if (!root.contains(e.target)) {
		dropdownRemove();
	}
});

const onMovieSelect = async movie => {	
	const res = await axios.get(url, {
		params: {
			apikey,
			i: movie.imdbID
		}
	})
	document.querySelector('#summary').innerHTML = movieTempelate(res.data);
}

const movieTempelate = movie => {
	return `
		<article class="media">
			<figure class="media-left">
				<p class="image">
					<img src=${movie.Poster} />
				</p>
			</figure>
			<div class="media-content">
				<div class="content">
					<h1>${movie.Title}</h1>
					<h4>${movie.Genre}</h4>
					<p>${movie.Plot}</p>
				</div>
			</div>
		</article>
		<article class="notification is-primary">
			<p class="title">${movie.Awards}</p>
			<p class="subtitle">Awards</p>
		</article>
		<article class="notification is-primary">
			<p class="title">${movie.BoxOffice}</p>
			<p class="subtitle">BoxOffice</p>
		</article>
		<article class="notification is-primary">
			<p class="title">${movie.Metascore}</p>
			<p class="subtitle">Metascore</p>
		</article>
		<article class="notification is-primary">
			<p class="title">${movie.imdbRating}</p>
			<p class="subtitle">IMDB Rating</p>
		</article>
		<article class="notification is-primary">
			<p class="title">${movie.imdbVotes}</p>
			<p class="subtitle">IMDB Votes</p>
		</article>
	`;
}

const dropdownRemove = () => {
	dropdown.classList.remove('is-active')
}

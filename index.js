const url = 'http://www.omdbapi.com';
const apikey = 'dd1ef959';
const i = 'tt3896198';

const autoCompleteConfig = {
	renderOption: (movie) => {
		const imageSrc = movie.Poster === "N/A" ? '' : movie.Poster;
		return `
			<img src=${imageSrc} />
			${movie.Title} (${movie.Year})
		`;
	},
	inputValue: movie => {
		return movie.Title;
	},
	fetchData: async (search) => {
		const res = await axios.get(url, {
			params: {
				apikey,
				s: search
			}
		});
		return res;
	}
}

createAutocomplete({
	...autoCompleteConfig,
	root: document.querySelector('#left-autocomplete'),
	onOptionSelect: (movie) => {
		document.querySelector('.tutorial').classList.add('is-hidden');
		onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
	}
});
createAutocomplete({
	...autoCompleteConfig,
	root: document.querySelector('#right-autocomplete'),
	onOptionSelect: (movie) => {
		document.querySelector('.tutorial').classList.add('is-hidden');
		onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
	}
});

let leftMovie, rightMovie;

const onMovieSelect = async (movie, summaryElement, side) => {
	const res = await axios.get(url, {
		params: {
			apikey,
			i: movie.imdbID
		}
	})
	summaryElement.innerHTML = movieTempelate(res.data);
	if(side === 'left') {
		leftMovie = res.data;
	} else {
		rightMovie = res.data;
	}

	if(leftMovie && rightMovie) {
		runComparison();
	}
}

const runComparison = () => {
	const leftSideStats = document.querySelectorAll('#left-summary .notification');
	const rightSideStats = document.querySelectorAll('#right-summary .notification');
	leftSideStats.forEach((leftStat, index) => {
		const rightStat = rightSideStats[index];
		const leftSideValue = leftStat.dataset.value;
		const rightSideValue = rightStat.dataset.value;
		console.log({leftSideValue, rightSideValue})
		if(parseInt(rightSideValue) > parseInt(leftSideValue)) {
			leftStat.classList.remove('is-primary');
			leftStat.classList.add('is-warning');
		} else {
			rightStat.classList.remove('is-primary');
			rightStat.classList.add('is-warning');
		}
	})
}

const movieTempelate = movie => {
	// console.log(movie)
	let count = 0;
	const awards = movie.Awards.split(' ').reduce((prev, word) => {
		console.log(word)
		const value = parseInt(word);
		if(isNaN(value)) {
			console.log('not a number')
		} else {
			count += value;
		}
	}, 0);
	const dollars = parseInt(movie.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
	const metascore = parseInt(movie.Metascore);
	const imdbRating = parseFloat(movie.imdbRating);
	const imdbVotes = parseInt(movie.imdbVotes.replace(/,/g, ''));
	
	console.log({count})
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
		<article data-value=${count} class="notification is-primary">
			<p class="title">${movie.Awards}</p>
			<p class="subtitle">Awards (${count})</p>
		</article>
		<article data-value=${dollars} class="notification is-primary">
			<p class="title">${movie.BoxOffice}</p>
			<p class="subtitle">BoxOffice</p>
		</article>
		<article data-value=${metascore} class="notification is-primary">
			<p class="title">${movie.Metascore}</p>
			<p class="subtitle">Metascore</p>
		</article>
		<article data-value=${imdbRating} class="notification is-primary">
			<p class="title">${movie.imdbRating}</p>
			<p class="subtitle">IMDB Rating</p>
		</article>
		<article data-value=${imdbVotes} class="notification is-primary">
			<p class="title">${movie.imdbVotes}</p>
			<p class="subtitle">IMDB Votes</p>
		</article>
	`;
}

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

const input = document.querySelector('input');

let timeoutId;

const onInput = async e => {
	const res = await fetchData(e.target.value);
	const movies = !res.data.Error ? res.data.Search : [];
	for (let movie of movies) {
		const div = document.createElement('div');
		div.innerHTML = `
			<h1>${movie.Title}</h1>
			<img src=${movie.Poster} />			
		`;
		document.querySelector('#target').append(div);
	}
};

input.addEventListener('input', debounce(onInput, 1000));

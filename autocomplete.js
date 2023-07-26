const createAutocomplete = ({ root, renderOption, onOptionSelect, inputValue, fetchData }) => {
	root.innerHTML = `
		<label><b>Search</b></label>
		<input type="text" placeholder="e.g: aliens" />
		<div class="dropdown">
		<div class="dropdown-menu">
			<div class="dropdown-content results"></div>
		</div>	
		</div>
		<div id="target"></div>
	`;

	const input = root.querySelector('input');
	input.classList.add('input')
	const dropdown = root.querySelector('.dropdown');
	const resultsWrapper = root.querySelector('.results');

	const onInput = async e => {
		const res = await fetchData(e.target.value);
		const items = !res.data.Error ? res.data.Search : [];
		if (!items.length) {
			dropdownRemove();
			return;
		}
		resultsWrapper.innerHTML = '';
		dropdown.classList.add('is-active');
		for (let item of items) {
			const option = document.createElement('a');
			option.classList.add('dropdown-item')
			option.innerHTML = renderOption(item);
			option.addEventListener('click', e => {
				dropdownRemove();
				input.value = inputValue(item);
				onOptionSelect(item);
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

	const dropdownRemove = () => {
		dropdown.classList.remove('is-active')
	}
}
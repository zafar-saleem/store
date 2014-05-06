CORE.register('search-box', function (sb) {
	'use strict';
	
	var input, button, reset,
	
	init = function () {
		input = sb.find('#search_input')[0],
		button = sb.find('#search_button')[0],
		reset = sb.find('#quit_search')[0];

		sb.addEvent(button, 'click', handleSearch);
		sb.addEvent(reset, 'click', quitSearch);
	},

	destroy = function () {
		sb.removeEvent(button, 'click', handleSearch);
		sb.removeEvent(reset, 'click', quitSearch);
		input = button = reset = null;
	},

	handleSearch = function () {
		var query = input.value;
		if (query) {
			sb.notify({
				type: 'perform-search',
				data: query
			});
		}
	},

	quitSearch = function () {
		input.value = '';
		sb.notify({
			type: 'quit-search',
			data: null
		});
	};

	return {
		init: init,
		destroy: destroy
	};
});

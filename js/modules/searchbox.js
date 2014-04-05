CORE.register('search-box', function (sb) {
	var input, button, reset;
	
	return {
		init: function () {
			input = sb.find('#search_input')[0],
			button = sb.find('#search_button')[0],
			reset = sb.find('#quit_search')[0];
			//console.log(button);
			sb.addEvent(button, 'click', this.handleSearch);
			sb.addEvent(reset, 'click', this.quitSearch);
		},
		destroy: function () {
			sb.removeEvent(button, 'click', this.handleSearch);
			sb.removeEvent(reset, 'click', this.quitSearch);
			input = button = reset = null;
		},
		handleSearch: function () {
			var query = input.value;
			if (query) {
				sb.notify({
					type: 'perform-search',
					data: query
				});
			}
		},
		quitSearch: function () {
			input.value = '';
			sb.notify({
				type: 'quit-search',
				data: null
			});
		}
	};
});
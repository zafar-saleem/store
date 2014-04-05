CORE.register('filters-bar', function (sb) {
	var filters,

	init = function () {
		filters = sb.find('a');
		sb.addEvent(filters, 'click', filterProducts);
	},

	destroy = function () {
		filters = null;
		sb.removeEvent(filters, 'click', filterProducts);
	},

	filterProducts = function (e) {
		sb.notify({
			type: 'change-filter',
			data: e.currentTarget.innerHTML
		});
	};

	return {
		init: init,
		destroy: destroy
	};
});
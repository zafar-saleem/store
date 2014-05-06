CORE.register('product-panel', function (sb) {
	'use strict';
	
	var products,

	init = function () {
		products = sb.find('li');
		sb.listen({
			'change-filter'  : change_filter,
			'reset-filter'   : reset,
			'perform-search' : search,
			'quit-search' 	 : reset
		});

		eachProduct(function (product) {
			sb.addEvent(product, 'click', addToCart);
		});
	},

	destroy = function () {
		eachProduct(function (product) {
			sb.removeEvent(product, 'click', addToCart);
		});

		sb.ignore(['change-filter', 'reset-filter', 'perform-search', 'quit-search']);
	},

	filterProducts = function (e) {
		sb.notify({
			type: 'change-filter',
			data: e.currentTarget.innerHTML
		});
	},

	change_filter = function (filter) {
		reset();

		eachProduct(function (product) {
			if (product.getAttribute('data-8088-keyword').toLowerCase().indexOf(filter.toLowerCase()) < 0) {
				product.style.opacity = '0.2';
			}
		});
	},

	search = function (query) {
		reset();
		query = query.toLowerCase();
		eachProduct(function (product) {
			if (product.getElementsByTagName('p')[0].innerHTML.toLowerCase().indexOf(query.toLowerCase()) < 0) {
				product.style.opacity = '0.2';
			}
		});
	},

	addToCart = function (e) {
		var li = e.currentTarget;
		sb.notify({
			type: 'add-item',
			data: { id: li.id, name: li.getElementsByTagName('p')[0].innerHTML, price: parseInt(li.id, 10) }
		});
	};

	function eachProduct(fn) {
		var i = 0, product;

		for ( ; product = products[i++]; ) {
			fn(product);
		}
	}

	function reset () {
		eachProduct(function (product) {
			product.style.opacity = '1';
		});
	}

	return {
		init: init,
		destroy: destroy
	};
});
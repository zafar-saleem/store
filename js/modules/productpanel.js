CORE.register('product-panel', function (sb) {
	var products;

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
		init: function () {
			var that = this;

			products = sb.find('li');
			sb.listen({
				'change-filter'  : this.change_filter,
				'reset-filter'   : this.reset,
				'perform-search' : this.search,
				'quit-search' 	 : this.reset
			});

			eachProduct(function (product) {
				sb.addEvent(product, 'click', that.addToCart);
			});
		},

		destroy: function () {
			var that = this;

			eachProduct(function (product) {
				sb.removeEvent(product, 'click', that.addToCart);
			});

			sb.ignore(['change-filter', 'reset-filter', 'perform-search', 'quit-search']);
		},

		filterProducts: function () {
			sb.notify({
				type: 'change-filter',
				data: e.currentTarget.innerHTML
			});
		},

		reset: reset,

		change_filter: function (filter) {
			reset();

			eachProduct(function (product) {
				if (product.getAttribute('data-8088-keyword').toLowerCase().indexOf(filter.toLowerCase()) < 0) {
					product.style.opacity = '0.2';
				}
			});
		},

		search: function (query) {
			reset();
			query = query.toLowerCase();
			eachProduct(function (product) {
				if (product.getElementsByTagName('p')[0].innerHTML.toLowerCase().indexOf(query.toLowerCase()) < 0) {
					product.style.opacity = '0.2';
				}
			});
		},

		addToCart: function (e) {
			var li = e.currentTarget;
			sb.notify({
				type: 'add-item',
				data: { id: li.id, name: li.getElementsByTagName('p')[0].innerHTML, price: parseInt(li.id, 10) }
			});
		}
	};
});
CORE.register('shopping-cart', function (sb) {
	'use strict';
	
	var cart, cartItem, emptyMessage,

	init = function () {
		cart = sb.find('ul')[0];
		emptyMessage = sb.find('p')[0];
		cartItems = {};

		sb.listen({
			'add-item': addItem
		});

		sb.addEvent('.delete', 'click', deleteIt);
	},

	destroy = function () {
		cart = cartItems = null;
		sb.ignore(['add-item']);
	},

	addItem = function (product) {
		var entry;
		entry = sb.find('#cart-' + product.id + ' .quantity')[0];
		emptyMessage.remove();
		if (entry) {
			entry.innerHTML = parseInt(entry.innerHTML, 10) + 1;
			cartItems[product.id]++;
		} else {
			entry = sb.create_element('li', { id: 'cart-' + product.id, children: [ 
				sb.create_element('span', { 'class': 'product-name', text: product.name}),
				sb.create_element('span', { 'class': 'quantity', text: '1' }),
				sb.create_element('span', { 'class': 'price', text: '$' + product.price.toFixed(2) }),
				sb.create_element('a', { 'class': 'delete', text: 'X', href: '#' })
			],
			'class': 'cart_entry' });
			cart.appendChild(entry);
			cartItems[product.id] = 1;
		}
	},

	deleteIt = function () {
		console.log('aljsdlaksjdlkas');
	};

	return {
		init: init,
		destroy: destroy
	};
});

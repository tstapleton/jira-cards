(function(document) {
	function request(method, path, body, onSuccess, onError) {
		var xhr = new XMLHttpRequest();
		xhr.open(method, encodeURI(path), true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.setRequestHeader('Accept', 'application/json');
		xhr.onload = function() {
			if (xhr.status === 200) {
				onSuccess(xhr.responseText ? JSON.parse(xhr.responseText) : null);
			} else {
				onError(xhr.status);
			}
		};
		xhr.send(JSON.stringify(body));
	}

	function isOverflowed(element) {
		return element.scrollHeight > element.clientHeight;
	}
	function addOverflowIndicator(cards) {
		for (let i = 0; i < cards.length; i++) {
			if (isOverflowed(cards[i].querySelector('.description'))) {
				cards[i].querySelector('.content').classList.add('has-more');
			}
		}
	}
	ts.ui.ready(function() {
		ts.ui.TopBar.title('No 💔 for Jira');
		ts.ui.TopBar.buttons([{
			label: 'Archive issues',
			type: 'ts-primary',
			onclick: function() {
				request('POST', '/rest/cards/archive', undefined, function(response) {
					ts.ui.Notification.success(`Archived ${response.count} cards`);
				});
			},
		}]);

		// blah, overflow isn't computed correctly unless we wait a bit
		setTimeout(() => {
			const cards = document.querySelectorAll('.card');
			addOverflowIndicator(cards);
		}, 500);
	});
})(document);

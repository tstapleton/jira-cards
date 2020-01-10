(function init(document) {
	const request = (method, path, body, onSuccess, onError) => {
		const xhr = new XMLHttpRequest();
		xhr.open(method, encodeURI(path), true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.setRequestHeader('Accept', 'application/json');
		xhr.onload = () => {
			if (xhr.status === 200) {
				onSuccess(xhr.responseText ? JSON.parse(xhr.responseText) : null);
			} else {
				onError(xhr.status);
			}
		};
		xhr.send(JSON.stringify(body));
	};

	const addIndicatorClass = (card) => card.querySelector('.content').classList.add('has-more');

	const isOverflowed = (card) => {
		const element = card.querySelector('.description');
		return element.scrollHeight > element.clientHeight;
	};

	ts.ui.ready(() => {
		ts.ui.TopBar.title('No 💔 for Jira');
		ts.ui.TopBar.buttons([{
			label: 'Archive issues',
			type: 'ts-primary',
			onclick: () => {
				request('POST', '/rest/cards/archive', undefined, ({ count }) => {
					ts.ui.Notification.success(`Archived ${count} cards`);
				});
			},
		}]);

		// blah, overflow isn't computed correctly unless we wait a bit
		setTimeout(() => {
			Array.from(document.querySelectorAll('.card')).filter(isOverflowed).map(addIndicatorClass);
		}, 500);
	});
}(document));

const storeService = require('./store');

const store = storeService.getStore();

function archiveIssues() {
	const issues = store.get('issues')
		.filter((issue) => issue.printStatus === 'TODO')
		.filter((issue) => issue.type === 'Story' || issue.type === 'Bug')
		.write();
	issues.map((issue) => store.get('issues').set(issue.key, Object.assign({}, issue, { printStatus: 'ARCHIVED' })).write());
	return issues.length;
}

function getIssues() {
	return store.get('issues')
		.filter((issue) => issue.printStatus === 'TODO')
		.filter((issue) => issue.type === 'Story' || issue.type === 'Bug')
		.map((issue) => {
			if (!issue.epicLink) {
				return issue;
			}
			const epicIssue = store.get('issues').get(issue.epicLink).value();
			if (!epicIssue) {
				return issue;
			}
			const epic = `${epicIssue.key}: ${epicIssue.epicName}`;
			return Object.assign({}, issue, { epic });
		})
		.value();
}
module.exports = { archiveIssues, getIssues };

const store = require('./store');

function archiveIssues() {
	const issues = store.get('issues')
		.filter((issue) => issue.printStatus === 'TODO')
		.filter((issue) => issue.type === 'Story')
		.write();
	issues.map((issue) => store.get('issues').set(issue.key, Object.assign({}, issue, { printStatus: 'ARCHIVED' })).write());
	return issues.length;
}

function getIssues() {
	return store.get('issues')
		.filter((issue) => issue.printStatus === 'TODO')
		.filter((issue) => issue.type === 'Story')
		.map((issue) => {
			if (!issue.epicLink) {
				return issue;
			}
			const epicIssue = store.get('issues').get(issue.epicLink).value();
			const epic = `${epicIssue.description} (${epicIssue.key})`;
			return Object.assign({}, issue, { epic });
		})
		.value();
}
module.exports = { archiveIssues, getIssues };

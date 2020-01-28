const crypto = require('crypto');
const csv = require('csvtojson');
const fs = require('fs');
const path = require('path');
const storeService = require('./store');

storeService.initStore();

const store = storeService.getStore();
const rows = [];
const importFilePath = path.resolve(process.cwd(), process.argv[2]);

if (!fs.existsSync(importFilePath)) {
	console.error(`Cannot find file ${importFilePath}`); // eslint-disable-line no-console
	process.exit(1);
}

console.log(`Importing ${importFilePath}`); // eslint-disable-line no-console

const getHash = (issue) => crypto.createHash('sha256').update(JSON.stringify(issue)).digest('base64');

const hasIssue = (issue) => !store.get('issues').has(issue.key).value();

const hasHashChanged = (issue) => store.get('issues').get(issue.key).get('hash').value() !== issue.hash;

const hasIssueChanged = (issue) => !hasIssue(issue) || hasHashChanged(issue);

const mapFields = (json) => ({
	component: json['Component/s'],
	description: json.Description,
	epicLink: json['Custom field (Epic Link)'],
	estimate: parseInt(json['Custom field (Story Points)'], 10),
	key: json['Issue key'],
	parentId: json['Parent id'],
	status: json.Status,
	summary: json.Summary,
	type: json['Issue Type'],
});

const storeIssue = (issue) => {
	console.log(`Storing issue ${issue.key} - ${issue.summary}`); // eslint-disable-line no-console
	const printStatus = 'TODO';
	store.get('issues').set(issue.key, Object.assign({}, issue, { printStatus })).write();
};

const storeIssues = (issues) => {
	issues
		.map((issue) => Object.assign({}, issue, { hash: getHash(issue) }))
		.filter((issue) => hasIssueChanged(issue))
		.map((issue) => storeIssue(issue));
};

csv()
	.fromFile(importFilePath)
	.on('json', (row) => rows.push(mapFields(row)))
	.on('done', () => storeIssues(rows));

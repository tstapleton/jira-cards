const crypto = require('crypto');
const csv = require('csvtojson/v2');
const fs = require('fs');
const path = require('path');
const storeService = require('./store');

storeService.initStore();
const store = storeService.getStore();

const getFilePath = () => {
	const importFilePath = path.resolve(process.cwd(), process.argv[2]);

	if (!fs.existsSync(importFilePath)) {
		console.error(`Cannot find file ${importFilePath}`); // eslint-disable-line no-console
		process.exit(1);
	}

	return importFilePath;
};

const getHash = (issue) => crypto.createHash('sha256').update(JSON.stringify(issue)).digest('base64');

const assignHash = (issue) => Object.assign({}, issue, { hash: getHash(issue) });

const hasIssue = (issue) => store.get('issues').has(issue.key).value();

const hasHashChanged = (issue) => store.get('issues').get(issue.key).get('hash').value() !== issue.hash;

const hasIssueChanged = (issue) => !hasIssue(issue) || hasHashChanged(issue);

const mapFields = (json) => ({
	component: json['Component/s'],
	description: json.Description,
	epicLink: json['Custom field (Epic Link)'],
	epicName: json['Custom field (Epic Name)'],
	estimate: parseInt(json['Custom field (Story Points)'], 10),
	hasComments: !!json.Comment,
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

const doImport = async (file) => {
	console.log(`\nImporting ${file}...\n`); // eslint-disable-line no-console

	const readIssues = await csv().fromFile(file);
	const storedIssues = readIssues
		.map(mapFields)
		.map(assignHash)
		.filter(hasIssueChanged)
		.map(storeIssue);

	console.log(`\nImported ${storedIssues.length} new issues from ${readIssues.length} imported issues 🚀\n`); // eslint-disable-line no-console
};

// run the import
const filePath = getFilePath();
doImport(filePath);

const crypto = require('crypto');
const csv = require('csvtojson/v2');
const fs = require('fs');
const path = require('path');
const storeService = require('./store');
const uuid = require('uuid');

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
	id: uuid.v4(),
	acceptanceCriteria: json['Custom field (Acceptance Criteria)'],
	created: new Date(json.Created).getTime(),
	currentPoints: parseInt(json['Custom field (Story Points)'], 10),
	description: json.Description,
	epicId: '', // need to make a second loop on the issues to find the uuid for the epic based on epicKey
	epicKey: json['Custom field (Epic Link)'],
	key: json['Issue key'],
	originalPoints: parseInt(json['Custom field (Story Points)'], 10),
	reporter: json.Reporter,
	status: json.Status,
	title: json.Summary,
	type: json['Issue Type'],
});

const assignEpicId = (issue, issues) => {
	if (!issue.epicKey) {
		return issue;
	}
	const epic = issues.find((i) => i.key === issue.epicKey);
	if (!epic) {
		return issue;
	}
	return {
		...issue,
		epicId: epic.id,
	};
};

const storeIssue = (issue) => {
	console.log(`Storing issue ${issue.key} - ${issue.title}`); // eslint-disable-line no-console
	const { epicKey, ...rest } = issue;
	store.get('issues').push(rest).write();
};

const doImport = async (file) => {
	console.log(`\nImporting ${file}...\n`); // eslint-disable-line no-console

	const readIssues = await csv().fromFile(file);
	const issues = readIssues.map(mapFields);
	const storedIssues = issues
		.map((issue) => assignEpicId(issue, issues))
		.map(storeIssue);

	console.log(`\nImported ${storedIssues.length} new issues from ${readIssues.length} imported issues 🚀\n`); // eslint-disable-line no-console
};

// run the import
const filePath = getFilePath();
doImport(filePath);

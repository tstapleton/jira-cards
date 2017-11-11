const crypto = require('crypto');
const csv = require('csvtojson');
const fs = require('fs');
const path = require('path');
const store = require('./store');

const rows = [];
const filePath = path.resolve(process.cwd(), process.argv[2]);

if (!fs.existsSync(filePath)) {
	console.error(`Cannot find file ${filePath}`);
	process.exit(1);
}

console.log(`Importing ${filePath}`);

const getHash = (issue) => crypto.createHash('sha256').update(JSON.stringify(issue)).digest('base64');

const hasChanged = (issue) => {
	return !store.get('issues').has(issue.key).value() ||
		store.get('issues').get(issue.key).get('hash').value() !== issue.hash;
};

const mapFields = (json) => ({
	component: json['Component/s'],
	description: json.Description,
	epicLink: json['Custom field (Epic Link)'],
	estimate: parseInt(json['Custom field (Story Points)']),
	key: json['Issue key'],
	parentId: json['Parent id'],
	status: json.Status,
	summary: json.Summary,
	type: json['Issue Type'],
});

const storeIssue = (issue) => {
	console.log(`Storing issue ${issue.key} - ${issue.summary}`);
	const printStatus = 'TODO';
	store.get('issues').set(issue.key, Object.assign({}, issue, { printStatus })).write();
};

const storeIssues = (issues) => {
	issues
		.map((issue) => Object.assign({}, issue, { hash: getHash(issue) }))
		.filter((issue) => hasChanged(issue))
		.map((issue) => storeIssue(issue));
};

csv()
	.fromFile(filePath)
	.on('json', (row) => rows.push(mapFields(row)))
	.on('done', () => storeIssues(rows));

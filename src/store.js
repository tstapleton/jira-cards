const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { resolve } = require('path');

const adapter = new FileSync(resolve(__dirname, '../data/store.json'));
const store = low(adapter);

let didInit = false;

if (!didInit) {
	store.defaults({ issues: {} }).write();
	didInit = true;
}

module.exports = store;

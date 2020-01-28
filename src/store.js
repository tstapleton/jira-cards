const defaultStore = require('../data/defaults.json');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { resolve } = require('path');

const adapter = new FileSync(resolve(__dirname, '../data/store.json'));
const store = low(adapter);

module.exports = {
	initStore: () => store.defaults(defaultStore).write(),
	getStore: () => store,
};

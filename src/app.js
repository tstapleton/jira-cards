const Koa = require('koa');
const path = require('path');
const router = require('./router');
const serve = require('koa-static');
const views = require('koa-views');

const app = new Koa();

// must be used before any router is used
app.use(views(__dirname, {
	map: { hbs: 'handlebars' },
	options: {
		extname: '.hbs',
		helpers: {
			breaklines: (text) => text ? text.replace(/(\r\n|\n|\r)/gm, '<br>') : '',
		},
	},
}));

app.use(serve(path.resolve(__dirname, '../public')));

app.use(router.middleware());

module.exports = app;

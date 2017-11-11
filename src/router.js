const cards = require('./cards');
const Router = require('koa-better-router');

const router = new Router().loadMethods();

router.get('/', async (ctx) => {
	await ctx.render('view.hbs', {
		issues: cards.getIssues(),
	});
});

router.post('/rest/cards/archive', async (ctx) => {
	const count = cards.archiveIssues();
	ctx.body = { count };
});

module.exports = router;

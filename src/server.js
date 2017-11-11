const app = require('./app');
const http = require('http');

// 9830 is jica (JIra CArds) on zero-based alphabet
const port = process.env.port || 9830;

http.createServer(app.callback()).listen(port, () => {
	console.log(`See your Jira cards at http://localhost:${port}`); // eslint-disable-line no-console
});

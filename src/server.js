const app = require('./app');
const http = require('http');

const port = process.env.port || 1337;

http.createServer(app.callback()).listen(port, () => {
	console.log(`See your Jira cards at http://localhost:${port}`);
});

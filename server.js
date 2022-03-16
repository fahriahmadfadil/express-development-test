const http = require('http')
const app = require('./app')
const port = process.env.APP_PORT;

const server = http.createServer(app);

server.listen(port);
console.log("Starting Server At Port = "+port);
console.log("Docs api you can read on /api-docs");
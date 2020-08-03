const http = require('http');
const app = require('./app');
require('express-async-errors');

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port, () => console.log(`Listening on port ${port}...`));
'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const server = http.createServer(app);
const PORT = 3333;

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./routes')(app); //Routes

server.listen(PORT,() => {
    console.log(`Council Expenses API has been started on http://localhost:${PORT}`);
});

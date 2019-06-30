'use strict';

const scraper = require('./src');

module.exports = (app) => {
    app.use('/scraper', scraper);
    
    app.get('/', (req, res) => {
        res.status(200).json({"message": `Welcome to Council Expenses API v0.1`});
    });
};

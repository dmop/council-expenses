'use strict';

const expenseRoutes = require('./expense');
const councilRoutes = require('./council');
const proposeRoutes = require('./propose');

module.exports = (app) => {

    app.use('/expense', expenseRoutes);
    app.use('/council', councilRoutes);
    // app.use('/propose', proposeRoutes);
    app.get('/', (req, res) => {
        res.status(200).json({"message": `Welcome to Council Expenses API v0.1`});
    });
};

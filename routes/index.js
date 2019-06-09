'use strict';

const remunerationRoutes = require('./remuneration');
const councilRoutes = require('./council');
// const proposeRoutes = require('./propose');
const indemnityRoutes = require('./indemnity');

module.exports = (app) => {

    app.use('/remuneration', remunerationRoutes);
    app.use('/council', councilRoutes);
    app.use('/indemnity', indemnityRoutes);
    app.get('/', (req, res) => {
        res.status(200).json({"message": `Welcome to Council Expenses API v0.1`});
    });
};
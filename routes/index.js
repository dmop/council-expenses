'use strict';

const express = require("express");
const router = express.Router();

// const remunerationRoutes = require('./remuneration');
// const councilRoutes = require('./council');
// const proposeRoutes = require('./propose');
// const indemnityRoutes = require('./indemnity');
const plenary = require("../src/services/plenarySession")();

module.exports = (app) => {

    app.get("/plenary", plenary.index);

    // app.use('/remuneration', remunerationRoutes);
    // app.use('/council', councilRoutes);
    // app.use('/propose', proposeRoutes);
    // app.use('/indemnity', indemnityRoutes);
    app.get('/', (req, res) => {
        res.status(200).json({"message": `Welcome to Council Expenses API v0.1`});
    });
};

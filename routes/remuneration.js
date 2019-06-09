"use strict";

const express = require("express");
const router = express.Router();
const remuneration = require("../src/controllers/remunerationController")();

router.get("/pastRemunerations", remuneration.pastRemunerations);

module.exports = router;

"use strict";

const express = require("express");
const router = express.Router();
const propose = require("../src/controllers/proposeController")();

router.get("/pastProposes", propose.pastProposes);

module.exports = router;

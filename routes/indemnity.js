"use strict";

const express = require("express");
const router = express.Router();
const indemnity = require("../src/controllers/indemnityController")();

router.get("/pastIndemnities", indemnity.pastIndemnities);

module.exports = router;

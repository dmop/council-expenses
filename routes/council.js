"use strict";

const express = require("express");
const router = express.Router();
const council = require("../src/controllers/councilController")();

router.get("/", council.index);
// router.get("/all", council.all);

module.exports = router;
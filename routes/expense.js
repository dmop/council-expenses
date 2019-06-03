"use strict";

const express = require("express");
const router = express.Router();
const expense = require("../src/controllers/expenseController")();

router.get("/all", expense.all);
router.get("/indemnitys", expense.indemnitys);

module.exports = router;

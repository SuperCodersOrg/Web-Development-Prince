
const express = require("express");
const { signupValidation, loginValidation } = require("../Middleware/validation");
const { signup, login } = require("../Controller/authcontroller");

const router = express.Router();

router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);

module.exports = router;

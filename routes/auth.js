const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth")

/* Router of materials module. */
router.post('/login',authController.requestLogin)
router.post('/register',authController.registerUsers)

module.exports = router;

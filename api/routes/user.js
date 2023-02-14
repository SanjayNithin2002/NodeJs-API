const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/user");
const checkAuth = require("../middleware/checkAuth");

router.post("/signup", UsersController.userSignup);
router.post('/login', UsersController.userLogin);
router.delete("/:email", checkAuth, UsersController.userDelete);

module.exports = router;

const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/user");

router.post("/signup", UsersController.userSignup);
router.post('/login', UsersController.userLogin);
router.delete("/:email", UsersController.userDelete);

module.exports = router;

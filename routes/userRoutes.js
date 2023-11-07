const express = require("express");
const postControllers = require("../controllers/userControllers");
const router = express.Router();


router.route("/").get(postControllers.getAllUsers).post(postControllers.createNewUser);

router.route("/:id").get(postControllers.getUserById)

module.exports = router;
const express = require("express");
const adminControllers = require("../controllers/adminControllers");
const router = express.Router();

router.route("/dashboard").post(adminControllers.dashboard)

router.route("/update_slider").post(adminControllers.updateSlider)


module.exports = router;
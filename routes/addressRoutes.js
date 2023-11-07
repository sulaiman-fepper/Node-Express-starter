const express = require("express");
const addressControllers = require("../controllers/addressControllers");
const router = express.Router();


router.route("/get").post(addressControllers.getAddresses)

router.route("/save").post(addressControllers.saveAddress)

router.route("/delete").post(addressControllers.deleteAddress)

router.route("/set_default").post(addressControllers.setDefaultAddress)
// router.route("/:id").get(addressControllers.getPostById)

module.exports = router;
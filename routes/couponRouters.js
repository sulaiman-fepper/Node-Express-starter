const express = require("express");
const couponControllers = require("../controllers/couponControllers");
const router = express.Router();


router.route("/").get(couponControllers.demo);

router.route("/apply").post(couponControllers.applyCoupon)

router.route("/get_all").post(couponControllers.coupons)

router.route("/save").post(couponControllers.saveNewCoupon)

router.route("/get_edit").post(couponControllers.getEditCoupon)

router.route("/update").post(couponControllers.updateCoupon)

router.route("/delete").post(couponControllers.deleteCoupon)

module.exports = router;
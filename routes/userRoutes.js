const express = require("express");
const userControllers = require("../controllers/userControllers");
const router = express.Router();


router.route("/").get(userControllers.getAllUsers).post(userControllers.createNewUser);

router.route("/:id").get(userControllers.getUserById)

router.route("/send_otp").post(userControllers.sendOTP)

router.route("/new_login").post(userControllers.newLogin)

router.route("/blocked_user").post(userControllers.blockedUser)

router.route("/get-map-api-list").post(userControllers.googleMapApiList)

router.route("/save-notification-token").post(userControllers.saveToken)

router.route("/get-restaurant-category-slides").post(userControllers.getRestaurantCategorySlider)

router.route("/get-delivery-restaurants").post(userControllers.getDeliveryRestaurants)

router.route("/get-selfpickup-restaurants").post(userControllers.getSelfPickupRestaurants)

router.route("/get-filtered-restaurants").post(userControllers.getFilteredRestaurants)

router.route("/get-filtered-restaurants-self-pickup").post(userControllers.getFilteredRestaurantsSelfPickup)

router.route("/get-map-api-list").post(userControllers.googleMapApiList)

router.route("/promo-slider").post(userControllers.promoSlider) // pending

router.route("/search-restaurants").post(userControllers.searchRestaurants) 

router.route("/search-restaurants-self-pickup").post(userControllers.searchRestaurantsSelfPickup) 

router.route("/apply-coupon").post(userControllers.applyCoupon)

router.route("/check-cart-items-availability").post(userControllers.checkCartItemsAvailability)

router.route("/set-default-address").post(userControllers.setDefaultAddress)

router.route("/save-address").post(userControllers.saveAddress)

router.route("/delete-address").post(userControllers.deleteAddress)

router.route("/change-avatar").post(userControllers.changeAvatar)

router.route("/get-pages").post(userControllers.getPages)

router.route("/get-restaurant-info-and-operational-status").post(userControllers.getRestaurantInfoAndOperationalStatus)

router.route("/update-user-info").post(userControllers.updateUserInfo)

router.route("/get-wallet-transactions").post(userControllers.getWalletTransactions)

router.route("/get-restaurant-items-search").post(userControllers.getRestaurantItemsSearch)

router.route("/get-restaurant-items-veg").post(userControllers.getRestaurantItemsVeg)

router.route("/get-restaurant-items").post(userControllers.getRestaurantItems)

router.route("/get-restaurant-info-with-favourite").post(userControllers.getRestaurantInfoWithFavourite)

router.route("/get-user-notifications").post(userControllers.getUserNotifications)

router.route("/get-orders").post(userControllers.getOrders)

router.route("/cancel-order").post(userControllers.cancelOrder)

router.route("/place-order").post(userControllers.placeOrder)

router.route("/rate-order").post(userControllers.rateOrder)

router.route("/register").post(userControllers.register)


module.exports = router;
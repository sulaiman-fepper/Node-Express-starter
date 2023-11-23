

const express = require("express");
const deliveryCollectionController = require("../controllers/deliveryCollectionController");
const deliveryControllers = require("../controllers/deliveryControllers");
const router = express.Router();


router.route("/delivery_collections").post(deliveryCollectionController.deliveryCollections);

router.route("/collect_delivery_collection").post(deliveryCollectionController.collectDeliveryCollection);

router.route("/delivery_collection_logs").post(deliveryCollectionController.deliveryCollectionLogs);

router.route("/delivery_collection_logs_for_single_user").post(deliveryCollectionController.deliveryCollectionLogsForSingleUser);



router.route("/update_delivery_user_info").post(deliveryControllers.updateDeliveryUserInfo);

router.route("/get_delivery_orders").post(deliveryControllers.getDeliveryOrders);

router.route("/get_single_delivery_order").post(deliveryControllers.getSingleDeliveryOrder);

router.route("/set-delivery-guy-gps-location").post(deliveryControllers.setDeliveryGuyGpsLocation);

router.route("/get-delivery-guy-gps-location").post(deliveryControllers.getDeliveryGuyGpsLocation);

module.exports = router;

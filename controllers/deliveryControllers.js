const AcceptDeliveries = require("../models/AcceptDeliveries");
const Transactions = require("../models/Transactions");
const DeliveryCollection = require("../models/DeliveryCollection");
const User = require("../models/User");
const Ratings = require("../models/Ratings");
const Orders = require("../models/Orders");


exports.updateDeliveryUserInfo = async (req, res, next) => {

    let deliveryUser = await User.findById(req.body['id']);

    deliveryUser = deliveryUser[0][0];


    if(deliveryUser['delivery_guy_detail_id'] != null) {

        let onGoingDeliveriesCount = await AcceptDeliveries.onGoingDeliveriesCount(req.body['id'])
        onGoingDeliveriesCount = onGoingDeliveriesCount[0][0]['count'];

        let completedDeliveriesCount = await AcceptDeliveries.completedDeliveriesCount(req.body['id'])
        completedDeliveriesCount = completedDeliveriesCount[0][0]['count'];

        let orders = await AcceptDeliveries.orders(req.body['id'])

        orders = (orders[0].map((item)=>item['accept']['orders'][0]))

        var earnings = await Transactions.getTransactionById(req.body['id'])

        earnings = earnings[0];

        var totalEarnings = 0;
        for(var i = 0; i < earnings.length; i++) {
            if(earnings[i]['type'] == 'deposit') {
                totalEarnings = totalEarnings + earnings[i]['amount'] / 100;
            }
        }


        var deliveryCollection = await DeliveryCollection.getDeliveryCollectionByUser(req.body['id'])

        var deliveryCollectionAmount = 0;
        if(deliveryCollection[0].length != 0){
            deliveryCollection = deliveryCollection[0][0];
            deliveryCollectionAmount = deliveryCollection['amount']
        }
        var getChartData = await Transactions.getChartData(req.body['id']);
        getChartData = getChartData[0];
        var ratings = await Ratings.getRatingsById(req.body['id']);
        ratings = ratings[0];

        var averageRating = 0;
        ratings.map((i) => averageRating = averageRating + i['rating_delivery'])


        res.status(200).json({
            'success': true,
            'data': {
                'id': deliveryUser['id'],
                'auth_token': deliveryUser['auth_token'],
                'name': deliveryUser['name'],
                'email': deliveryUser['email'],
                'wallet_balance': averageRating/ratings.length,
                'onGoingCount': onGoingDeliveriesCount,
                'completedCount': completedDeliveriesCount,
                'orders': orders,
                'earnings': earnings,
                'totalEarnings': totalEarnings,
                'deliveryCollection': deliveryCollectionAmount,
                'averageRating': averageRating,
                'ratings': ratings,
                'status': true
            },
            'chart': [{
                'chartData': getChartData
            }]
        });
        return 0;
    }
    res.status(500).json({
        'success': false
    })
}

exports.getDeliveryOrders = async (req, res, next) => {

    let deliveryGuyNewOrders = await Orders.deliveryGuyNewOrders(req.body['id']);
    deliveryGuyNewOrders = (deliveryGuyNewOrders[0].map((item)=>item['orders']))


    let acceptDeliveries = await AcceptDeliveries.acceptDeliveries(req.body['id']);
    acceptDeliveries = (acceptDeliveries[0].map((item)=>item['orders']))

    let pickedupOrders = await AcceptDeliveries.pickedupOrders(req.body['id']);
    pickedupOrders = (pickedupOrders[0].map((item)=>item['orders']))

    res.status(200).json({
        'new_orders': deliveryGuyNewOrders,
        'accepted_orders': acceptDeliveries,
        'pickedup_orders': pickedupOrders
    })
}



exports.getSingleDeliveryOrder = async (req, res, next) => {
    let checkOrder = await AcceptDeliveries.checkOrder(req.body['order_id'], req.body['user_id']);
    checkOrder = checkOrder[0];

    let singleOrder = await Orders.singleOrder(req.body['order_id'])
    singleOrder = singleOrder[0];

    if(checkOrder.length != 0){

    }
    res.status(200).json({
        'new_orders': checkOrder,
        'accepted_orders': singleOrder,
        // 'pickedup_orders': pickedupOrders
    })
    
}



exports.setDeliveryGuyGpsLocation = async (req, res, next) => {
    res.send("ignored")
}

exports.getDeliveryGuyGpsLocation = async (req, res, next) => {
    res.send("ignored")
}

exports.acceptToDeliver = async (req, res, next) => {
    
}
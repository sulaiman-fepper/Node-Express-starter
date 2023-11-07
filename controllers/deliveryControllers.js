const AcceptDeliveries = require("../models/AcceptDeliveries");
const Transactions = require("../models/Transactions");
const DeliveryCollection = require("../models/DeliveryCollection");
const User = require("../models/User");
const Ratings = require("../models/Ratings");


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
    let deliveryUser = await User.findById(req.body['id']);
    deliveryUser = deliveryUser[0][0];

    
}
const DeliveryCollection = require("../models/DeliveryCollection");
const DeliveryCollectionLog = require("../models/DeliveryCollectionLog");







exports.deliveryCollections = async (req, res, next) => {

    let delivery_collections_count = await DeliveryCollection.getDeliveryCollectionCount()
    let from = (req.body['page'] - 1) * req.body['limit'];
    let delivery_collections = await DeliveryCollection.getDeliveryCollection(from, req.body['limit'])
    res.status(200).json({
        'count': delivery_collections_count[0][0]['count'],
        'deliveryCollections': delivery_collections[0]
    });
    
}


exports.collectDeliveryCollection = async (req, res, next) => {
    let delivery_collections = await DeliveryCollection.getDeliveryCollectionId(req.body['delivery_collection_id'])
    delivery_collections = delivery_collections[0][0];
    let logAmount;
    let amount;
    if(req.body['type'] == 'FULL') {
        logAmount = delivery_collections['amount'];
        amount = 0;
    }
    if(req.body['type'] == 'CUSTOM') {
        logAmount = req.body['custom_amount'];
        if(req.body['custom_amount'] > delivery_collections['amount']) {
            res.status(200).json({
                'success': false,
                'message': 'The entered amount is greater than the pending amount'
            });
            return 0;
        }
        else {
            amount = delivery_collections['amount'] - req.body['custom_amount']
        }
    }

    let save_delivery_collection_logs = new DeliveryCollectionLog(req.body['delivery_collection_id'], logAmount, req.body['type'], req.body['message'])
    save_delivery_collection_logs = await save_delivery_collection_logs.save();

    let save_delivery_collections = await DeliveryCollection.update(req.body['delivery_collection_id'], amount)

    // let delivery_collection_log = await DeliveryCollectionLog.getDeliveryCollectionLog()
    res.status(200).json({
        'delivery_collection_logs': save_delivery_collection_logs,
        'delivery_collections': save_delivery_collections,
        'success': true
    });
}


exports.deliveryCollectionLogs = async (req, res, next) => {
    let delivery_collection_logs_count = await DeliveryCollectionLog.getDeliveryCollectionLogCount()
    let from = (req.body['page'] - 1) * req.body['limit'];
    let delivery_collection_logs = await DeliveryCollectionLog.getDeliveryCollectionLogPagination(from, req.body['limit'])
    res.status(200).json({
        'count': delivery_collection_logs_count[0][0]['count'],
        'logs': delivery_collection_logs[0]
    });
}


exports.deliveryCollectionLogsForSingleUser = async (req, res, next) => {
    let hasSomeCollection = await DeliveryCollection.getDeliveryCollectionByUser(req.body['id']);
    if(hasSomeCollection[0].length != 0) {
        let from = (req.body['page'] - 1) * req.body['limit'];
        let count = await DeliveryCollectionLog.getDeliveryCollectionLogByUserCount(hasSomeCollection[0][0]['id']);
        let logs = await DeliveryCollectionLog.getDeliveryCollectionLogByUserPagination(from, req.body['limit'], hasSomeCollection[0][0]['id']);
        res.status(200).json({
            'count': count[0][0]['count'],
            'logs': logs[0]
        });
        return 0
    }
    res.status(200).json({
        'success': false,
        'message': 'Not Found'
    });
}
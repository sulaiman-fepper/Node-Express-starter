const db = require("../config/db");

class DeliveryCollectionLog {

    constructor(delivery_collection_id, amount, type, message) {
        this.delivery_collection_id = delivery_collection_id;
        this.amount = amount;
        this.type = type;
        this.message = message;
    }

    save(){
        let createdDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        let sql = `INSERT INTO delivery_collection_logs(
            delivery_collection_id,
            amount,
            type,
            message,
            created_at,
            updated_at
        )
        VALUES(
            "${this.delivery_collection_id}",
            "${this.amount}",
            "${this.type}",
            "${this.message}",
            "${createdDate}",
            "${createdDate}"
        )`;
        return db.execute(sql);
    }

    static getDeliveryCollectionLog(){
        let sql = `SELECT * FROM delivery_collection_logs;`;
        return db.execute(sql);
    }

    static getDeliveryCollectionLogPagination(from, limit){
        let sql = `SELECT * FROM delivery_collection_logs ORDER BY id DESC LIMIT ${limit} OFFSET ${from};`;
        return db.execute(sql);
    }

    static getDeliveryCollectionLogCount(){
        let sql = `SELECT COUNT(id) AS count FROM delivery_collection_logs;`;
        return db.execute(sql);
    }

    static getDeliveryCollectionLogByUserPagination(from, limit, id){
        let sql = `SELECT * FROM delivery_collection_logs WHERE delivery_collection_id = ${id} ORDER BY id DESC LIMIT ${limit} OFFSET ${from};`;
        return db.execute(sql);
    }

    static getDeliveryCollectionLogByUserCount(id){
        let sql = `SELECT COUNT(id) AS count FROM delivery_collection_logs WHERE delivery_collection_id = ${id};`;
        return db.execute(sql);
    }
}


module.exports = DeliveryCollectionLog;

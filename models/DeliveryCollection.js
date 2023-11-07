const db = require("../config/db");

class DeliveryCollection {

    constructor(user_id, amount) {
        this.user_id = user_id;
        this.amount = amount;
    }


    static update(id, amount){
        let sql = `UPDATE delivery_collections SET
            amount = "${amount}" WHERE id = ${id};`;
        return db.execute(sql);

    }


    static getDeliveryCollection(from, limit){
        let sql = `SELECT * FROM delivery_collections ORDER BY id DESC LIMIT ${limit} OFFSET ${from};`;
        return db.execute(sql);
    }

    static getDeliveryCollectionByUser(id){
        let sql = `SELECT * FROM delivery_collections WHERE user_id = ${id};`;
        return db.execute(sql);
    }

    static getDeliveryCollectionId(id){
        let sql = `SELECT * FROM delivery_collections WHERE id = ${id};`;
        return db.execute(sql);
    }


    static getDeliveryCollectionCount(){
        let sql = `SELECT COUNT(id) AS count FROM delivery_collections;`;
        return db.execute(sql);
    }






}




module.exports = DeliveryCollection;

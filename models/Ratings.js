const db = require("../config/db");

class Ratings {
    constructor(user_id, order_id, restaurant_id, delivery_id, rating_store, rating_delivery, review_store, review_delivery) {
        this.user_id = user_id;
        this.order_id = order_id;
        this.restaurant_id = restaurant_id;
        this.delivery_id = delivery_id;
        this.rating_store = rating_store;
        this.rating_delivery = rating_delivery;
        this.review_store = review_store;
        this.review_delivery = review_delivery;
    }

    save(){
        let createdDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        let isActive = 1;
        let sql = `INSERT INTO ratings(
            user_id,
            order_id,
            restaurant_id,
            delivery_id,
            rating_store,
            rating_delivery,
            review_store,
            review_delivery,
            is_active,
            created_at,
            updated_at
        ) 
        VALUES(
            "${this.user_id}",
            "${this.order_id}",
            "${this.restaurant_id}",
            "${this.delivery_id}",
            "${this.rating_store}",
            "${this.rating_delivery}",
            "${this.review_store}",
            "${this.review_delivery}",
            "${isActive}",
            "${createdDate}",
            "${createdDate}"
        )`;

        return db.execute(sql);
    }


    static getRatingsByDeliveryId(id){
        let sql = `SELECT rating_delivery, review_delivery, AVG(rating_delivery) FROM ratings WHERE delivery_id = ${id};`;

        return db.execute(sql);
    }

    static getRatingsByOrderId(id){
        let sql = `SELECT * FROM ratings WHERE order_id = ${id};`;

        return db.execute(sql);
    }

    static getAvgRatingsById(id){
        let sql = `SELECT AVG(rating_delivery) AS rating FROM ratings WHERE delivery_id = ${id};`;

        return db.execute(sql);
    }

}

module.exports = Ratings;
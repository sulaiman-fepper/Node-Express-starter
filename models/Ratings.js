const db = require("../config/db");

class Ratings {
    constructor(user_id, order_id, restaurant_id, delivery_id, rating_store, rating_delivery, review_store, review_delivery, is_active) {

        this.user_id = user_id;
        this.order_id = order_id;
        this.restaurant_id = restaurant_id;
        this.delivery_id = delivery_id;
        this.rating_store = rating_store;
        this.rating_delivery = rating_delivery;
        this.review_store = review_store;
        this.review_delivery = review_delivery;
        this.is_active = is_active;

    }


    static getRatingsById(id){
        let sql = `SELECT rating_delivery, review_delivery FROM ratings WHERE delivery_id = ${id};`;

        return db.execute(sql);
    }

}

module.exports = Ratings;
const db = require("../config/db");

class RestaurantCategory {

    constructor() {

    }


    static restaurantCategoryById(id) {
        let sql = `SELECT * FROM restaurant_categories WHERE id IN (${id.toString().replace("[", '').replace("]", '')});`;
        return db.execute(sql);
    }

}


module.exports = RestaurantCategory;
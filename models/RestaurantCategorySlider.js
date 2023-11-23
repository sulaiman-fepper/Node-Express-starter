const db = require("../config/db");

class RestaurantCategorySlider {

    constructor() {

    }


    static restaurantCategorySlider() {
        let sql = `SELECT id, name, image, image_placeholder, categories_ids FROM restaurant_category_sliders WHERE is_active = 1 ORDER BY order_column;`;
        return db.execute(sql);
    }

}


module.exports = RestaurantCategorySlider;
const db = require("../config/db");

class Restaurant {
    constructor(name, description, location_id, image, rating, delivery_time, price_range, is_pureveg, slug, placeholder_image, latitude, longitude, restaurant_charges, 
        delivery_charge, address, pincode, landmark, is_active, is_accepted, is_featured, commission_rate, delivery_type, delivery_radius, delivery_charge_type, 
        base_delivery_charge, base_delivery_distance, extra_delivery_charge, extra_delivery_distance, min_order_price, is_notifiable, 
        auto_acceptable, schedule_data, is_schedulable, order_column, custom_message, is_orderscheduling, branch_id ) {

            this.name = name;
            this.description = description;
            this.location_id = location_id;
            this.image = image;
            this.rating = rating;
            this.delivery_time = delivery_time;
            this.price_range = price_range;
            this.is_pureveg = is_pureveg;
            this.slug = slug;
            this.placeholder_image = placeholder_image;
            this.latitude = latitude;
            this.longitude = longitude;
            this.restaurant_charges = restaurant_charges;
            this.delivery_charge = delivery_charge;
            this.address = address;
            this.pincode = pincode;
            this.landmark = landmark;
            this.is_active = is_active;
            this.is_accepted = is_accepted;
            this.is_featured = is_featured;
            this.commission_rate = commission_rate;
            this.delivery_type = delivery_type;
            this.delivery_radius = delivery_radius;
            this.delivery_charge_type = delivery_charge_type;
            this.base_delivery_charge = base_delivery_charge;
            this.base_delivery_distance = base_delivery_distance
            this.extra_delivery_charge = extra_delivery_charge;
            this.extra_delivery_distance = extra_delivery_distance;
            this.min_order_price = min_order_price;
            this.is_notifiable = is_notifiable;
            this.auto_acceptable = auto_acceptable;
            this.schedule_data = schedule_data;
            this.is_schedulable = is_schedulable;
            this.order_column = order_column;
            this.custom_message = custom_message;
            this.is_orderscheduling = is_orderscheduling;
            this.branch_id = branch_id
    }


    static getRestaurantById(id){
        let sql = `SELECT * FROM restaurants WHERE id = ${id};`;

        return db.execute(sql);
    }

    static getAllRestaurant(){
        let sql = `SELECT id, name FROM restaurants;`;
        return db.execute(sql);
    }

    static count(){
        let sql = `SELECT COUNT(id) AS count FROM restaurants;`;
        return db.execute(sql);
    }


    static getActiveRestaurantWithDeliveryAreasAndRatings(is_active) {

        let sql = `SELECT 
        JSON_OBJECT(
            'id', res.id,
            'name', res.name,
            'description', res.description,
            'image', res.image,
            'rating', res.rating,
            'delivery_time', res.delivery_time,
            'price_range', res.price_range,
            'slug', res.slug,
            'is_featured', res.is_featured,
            'is_active', res.is_active,
            'is_pureveg', res.is_pureveg,
            'delivery_type', res.delivery_type,
            'delivery_radius', res.delivery_radius,
            'latitude', res.latitude,
            'longitude', res.longitude,
            'avgRating', AVG(r.rating_store)
        ) AS restaurants
        FROM restaurants AS res 
        JOIN ratings r ON r.restaurant_id = res.id
        WHERE res.is_accepted = 1 AND res.is_active = ${is_active} AND delivery_type IN (1, 3) GROUP BY res.id ORDER BY order_column;`;


        // let sql = `SELECT * FROM restaurants WHERE is_accepted = 1 AND delivery_type IN (1, 3) ORDER BY order_column;`;
        return db.execute(sql);
    }

    static getActiveRestaurantWithDeliveryAreasAndRatingsAndCategory(is_active, id) {

        let sql = `SELECT 
        JSON_OBJECT(
            'id', res.id,
            'name', res.name,
            'description', res.description,
            'image', res.image,
            'rating', res.rating,
            'delivery_time', res.delivery_time,
            'price_range', res.price_range,
            'slug', res.slug,
            'is_featured', res.is_featured,
            'is_active', res.is_active,
            'is_pureveg', res.is_pureveg,
            'delivery_type', res.delivery_type,
            'delivery_radius', res.delivery_radius,
            'latitude', res.latitude,
            'longitude', res.longitude,
            'avgRating', AVG(r.rating_store)
        ) AS restaurants
        FROM restaurants AS res 
        JOIN ratings r ON r.restaurant_id = res.id
        JOIN restaurant_category_restaurant rcr ON rcr.restaurant_id = res.id
        WHERE res.is_accepted = 1 AND res.is_active = ${is_active} AND delivery_type IN (1, 3) AND rcr.restaurant_category_id IN (${id.toString().replace("[", '').replace("]", '')}) GROUP BY res.id ORDER BY order_column;`;


        // let sql = `SELECT * FROM restaurants WHERE is_accepted = 1 AND delivery_type IN (1, 3) ORDER BY order_column;`;
        return db.execute(sql);
    }


    static getActiveSelfPickupRestaurantWithDeliveryAreasAndRatings(is_active) {

        let sql = `SELECT 
        JSON_OBJECT(
            'id', res.id,
            'name', res.name,
            'description', res.description,
            'image', res.image,
            'rating', res.rating,
            'delivery_time', res.delivery_time,
            'price_range', res.price_range,
            'slug', res.slug,
            'is_featured', res.is_featured,
            'is_active', res.is_active,
            'is_pureveg', res.is_pureveg,
            'delivery_type', res.delivery_type,
            'delivery_radius', res.delivery_radius,
            'latitude', res.latitude,
            'longitude', res.longitude,
            'avgRating', AVG(r.rating_store)
        ) AS restaurants
        FROM restaurants AS res 
        JOIN ratings r ON r.restaurant_id = res.id
        WHERE res.is_accepted = 1 AND res.is_active = ${is_active} AND delivery_type IN (2, 3) GROUP BY res.id ORDER BY order_column;`;


        // let sql = `SELECT * FROM restaurants WHERE is_accepted = 1 AND delivery_type IN (1, 3) ORDER BY order_column;`;
        return db.execute(sql);
    }


    static getActiveSelfPickupRestaurantWithDeliveryAreasAndRatingsAndCategory(is_active, id) {

        let sql = `SELECT 
        JSON_OBJECT(
            'id', res.id,
            'name', res.name,
            'description', res.description,
            'image', res.image,
            'rating', res.rating,
            'delivery_time', res.delivery_time,
            'price_range', res.price_range,
            'slug', res.slug,
            'is_featured', res.is_featured,
            'is_active', res.is_active,
            'is_pureveg', res.is_pureveg,
            'delivery_type', res.delivery_type,
            'delivery_radius', res.delivery_radius,
            'latitude', res.latitude,
            'longitude', res.longitude,
            'avgRating', AVG(r.rating_store)
        ) AS restaurants
        FROM restaurants AS res 
        JOIN ratings r ON r.restaurant_id = res.id
        JOIN restaurant_category_restaurant rcr ON rcr.restaurant_id = res.id
        WHERE res.is_accepted = 1 AND res.is_active = ${is_active} AND delivery_type IN (2, 3) AND rcr.restaurant_category_id IN (${id.toString().replace("[", '').replace("]", '')}) GROUP BY res.id ORDER BY order_column;`;


        // let sql = `SELECT * FROM restaurants WHERE is_accepted = 1 AND delivery_type IN (1, 3) ORDER BY order_column;`;
        return db.execute(sql);
    }


    static searchRestaurants(params){
        // let sql = `SELECT * FROM restaurants WHERE is_accepted = 1 AND name LIKE "%${params}%";`;
        let sql = `SELECT 
        JSON_OBJECT(
            'id', res.id,
            'name', res.name,
            'description', res.description,
            'image', res.image,
            'rating', res.rating,
            'delivery_time', res.delivery_time,
            'price_range', res.price_range,
            'slug', res.slug,
            'is_featured', res.is_featured,
            'is_active', res.is_active,
            'is_pureveg', res.is_pureveg,
            'delivery_type', res.delivery_type,
            'delivery_radius', res.delivery_radius,
            'latitude', res.latitude,
            'longitude', res.longitude,
            'avgRating', AVG(r.rating_store)
        ) AS restaurants
        FROM restaurants AS res
        LEFT JOIN ratings r ON r.restaurant_id = res.id
        WHERE is_accepted = 1 AND name LIKE "%${params}%"
        GROUP BY res.id;`;

        return db.execute(sql);
    }

    static searchItems(params){
        // let sql = `SELECT * FROM restaurants WHERE is_accepted = 1 AND name LIKE "%${params}%";`;
        let sql = `SELECT JSON_OBJECT(
            'id', i.id,
            'restaurant_id', i.restaurant_id,
            'item_category_id', i.item_category_id,
            'name', i.name,
            'price', i.price,
            'old_price', i.old_price,
            'image', i.image,
            'is_recommended', i.is_recommended,
            'is_popular', i.is_popular,
            'is_new', i.is_new,
            'desc', i.desc,
            'placeholder_image', i.placeholder_image,
            'is_active', i.is_active,
            'is_veg', i.is_veg,
            'order_column', i.order_column,
            'restaurant', JSON_OBJECT(
                'id', res.id,
                'name', res.name,
                'description', res.description,
                'image', res.image,
                'rating', res.rating,
                'delivery_time', res.delivery_time,
                'price_range', res.price_range,
                'slug', res.slug,
                'is_featured', res.is_featured,
                'is_accepted', res.is_accepted,
                'is_active', res.is_active,
                'is_pureveg', res.is_pureveg,
                'delivery_type', res.delivery_type,
                'delivery_radius', res.delivery_radius,
                'latitude', res.latitude,
                'longitude', res.longitude
            ),
            'addon_categories', IF(ac.id IS NULL, NULL, 
                JSON_OBJECT(
                    'id', ac.id,
                    'name', ac.name,
                    'type', ac.type,
                    'user_id', ac.user_id,
                    'description', ac.description,
                    'addon_limit', ac.addon_limit,
                    'addons', IF(a.id IS NULL, NULL, 
                        JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'id', a.id,
                                'name', a.name,
                                'price', a.price,
                                'addon_category_id', a.addon_category_id,
                                'user_id', a.user_id,
                                'is_active', a.is_active
                            )
                        )
                    )
                )
            )
        ) AS items
        FROM items AS i
        LEFT JOIN restaurants res ON i.restaurant_id = res.id
        LEFT JOIN addon_category_item aci ON aci.item_id = i.id
        LEFT JOIN addon_categories ac ON aci.addon_category_id = ac.id
        LEFT JOIN addons a ON a.addon_category_id = ac.id
        WHERE i.is_active = 1 AND i.name LIKE "%${params}%" AND a.is_active = 1
        GROUP BY i.restaurant_id;`;
        return db.execute(sql);
    }
}

module.exports = Restaurant;

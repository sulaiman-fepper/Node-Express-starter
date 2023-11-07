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
}

module.exports = Restaurant;

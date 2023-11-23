const db = require("../config/db");

class Coupon {
    constructor(name, description, code, success_count, success_amount, discount_type, discount, expiry_date, is_restaurant, restaurant_id, count, max_count, min_subtotal, max_discount, 
        subtotal_message, user_type, max_count_per_user) {
        this.name = name;
        this.description = description;
        this.code = code;
        this.success_count = success_count;
        this.success_amount = success_amount;
        this.discount_type = discount_type;
        this.discount = discount;
        this.expiry_date = expiry_date;
        this.is_restaurant = is_restaurant;
        this.restaurant_id = restaurant_id;
        this.count = count;
        this.max_count = max_count;
        this.min_subtotal = min_subtotal;
        this.max_discount = max_discount;
        this.subtotal_message = subtotal_message;
        this.user_type = user_type;
        this.max_count_per_user = max_count_per_user;
    }


    save(isActive){
        let createdDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        let sql = `INSERT INTO coupons(
            name,
            description,
            code,
            discount_type,
            discount,
            expiry_date,
            is_active,
            is_restaurant,
            created_at,
            updated_at,
            restaurant_id,
            count,
            max_count,
            min_subtotal,
            max_discount,
            subtotal_message,
            user_type,
            max_count_per_user
            ) 
            
        VALUES(
            "${this.name}",
            "${this.description}",
            "${this.code}",
            "${this.discount_type}",
            "${this.discount}",
            "${this.expiry_date}",
            "${isActive}",
            "${this.is_restaurant}",
            "${createdDate}",
            "${createdDate}",
            "${this.restaurant_id}",
            "${this.count}",    
            "${this.max_count}",
            "${this.min_subtotal}",
            "${this.max_discount}",
            "${this.subtotal_message}",
            "${this.user_type}",
            "${this.max_count_per_user}"

            )`;

            // let sql2 = `SELECT * FROM users WHERE id = SCOPE_IDENTITY();`
            // db.execute(sql);

        return db.execute(sql);
    }



    update(id, isActive){
        let createdDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        let sql = `UPDATE coupons SET 
            name = "${this.name}",
            description = "${this.description}",
            code = "${this.code}",
            discount_type = "${this.discount_type}",
            discount = "${this.discount}",
            expiry_date = "${this.expiry_date}",
            is_active = "${isActive}",
            is_restaurant = "${this.is_restaurant}",
            updated_at = "${createdDate}",
            restaurant_id = "${this.restaurant_id}",
            count = "${this.count}",
            max_count = "${this.max_count}",
            min_subtotal = "${this.min_subtotal}",
            max_discount = "${this.max_discount}",
            subtotal_message = "${this.subtotal_message}",
            user_type = "${this.user_type}",
            max_count_per_user = "${this.max_count_per_user}"
            WHERE id = ${id}`;

            // let sql2 = `SELECT * FROM users WHERE id = SCOPE_IDENTITY();`
            // db.execute(sql);

        return db.execute(sql);
    }

    static updateCouponCount(id, count){
        let sql = `UPDATE coupons SET count = ${count} WHERE id = ${id}`
        return db.execute(sql);
    }


    static getCouponWithCode(coupon_code){
        let sql = `SELECT * FROM coupons WHERE code = "${coupon_code}";`;
        return db.execute(sql);
    }

    static isCouponBelongsToRestaurant(coupon_id, restaurant_id){
        let sql = `SELECT * FROM coupon_restaurant WHERE coupon_id = ${coupon_id} AND restaurant_id = ${restaurant_id} LIMIT 1;`;
        return db.execute(sql);
    }

    static orderAlreadyPlacedWithCoupon(user_id, coupon_code){
        let sql = `SELECT * FROM orders WHERE user_id = ${user_id} AND coupon_name = ${coupon_code};`;
        return db.execute(sql);
    }

    static orderAlreadyPlacedWithCouponCount(user_id, coupon_code){
        let sql = `SELECT COUNT(id) as orderCount FROM orders WHERE user_id = ${user_id} AND coupon_name = ${coupon_code};`;
        return db.execute(sql);
    }


    static couponWithRestaurant(){




        // Restaurant Data

        // 'id', res.id, 
        // 'name', res.name, 
        // 'description', res.description, 
        // 'location_id', res.location_id, 
        // 'image', res.image, 
        // 'rating', res.rating, 
        // 'delivery_time', res.delivery_time, 
        // 'price_range', res.price_range, 
        // 'is_pureveg', res.is_pureveg, 
        // 'created_at', res.created_at, 
        // 'updated_at', res.updated_at, 
        // 'slug', res.slug, 
        // 'placeholder_image', res.placeholder_image, 
        // 'latitude', res.latitude, 
        // 'longitude', res.longitude, 
        // 'certificate', res.certificate, 
        // 'restaurant_charges', res.restaurant_charges, 
        // 'delivery_charges', res.delivery_charges, 
        // 'address', res.address, 
        // 'pincode', res.pincode, 
        // 'landmark', res.landmark, 
        // 'sku', res.sku, 
        // 'is_active', res.is_active,
        // 'is_accepted', res.is_accepted,
        // 'is_featured', res.is_featured,
        // 'commission_rate', res.commission_rate,
        // 'delivery_type', res.delivery_type,
        // 'delivery_radius', res.delivery_radius,
        // 'delivery_charge_type', res.delivery_charge_type,
        // 'base_delivery_charge', res.base_delivery_charge,
        // 'base_delivery_distance', res.base_delivery_distance,
        // 'extra_delivery_charge', res.extra_delivery_charge,
        // 'extra_delivery_distance', res.extra_delivery_distance,
        // 'min_order_price', res.min_order_price,
        // 'is_notifiable', res.is_notifiable,
        // 'auto_acceptable', res.auto_acceptable,
        // 'schedule_data', res.schedule_data,
        // 'is_schedulable', res.is_schedulable,
        // 'order_column', res.order_column,
        // 'custom_message', res.custom_message,
        // 'is_orderscheduling', res.is_orderscheduling,
        // 'branch_id', res.branch_id






        // let sql = `SELECT * FROM coupons INNER JOIN coupon_restaurant ON coupons.id = coupon_restaurant.coupon_id INNER JOIN restaurants ON restaurants.id = coupon_restaurant.restaurant_id;`
        let sql = `SELECT JSON_OBJECT(
            'id', c.id, 
            'name', c.name, 
            'description', c.description, 
            'code', c.code, 
            'success_count', c.success_count, 
            'success_amount', c.success_amount, 
            'discount_type', c.discount_type, 
            'discount', c.discount, 
            'expiry_date', c.expiry_date, 
            'is_active', c.is_active, 
            'is_restaurant', c.is_restaurant, 
            'created_at', c.created_at, 
            'updated_at', c.updated_at, 
            'restaurant_id', c.restaurant_id, 
            'count', c.count, 
            'max_count', c.max_count, 
            'min_subtotal', c.min_subtotal, 
            'max_discount', c.max_discount, 
            'subtotal_message', c.subtotal_message, 
            'user_type', c.user_type, 
            'max_count_per_user', c.max_count_per_user, 
            'restaurants', JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', res.id, 
                    'name', res.name
                )
            )
        ) AS coupons FROM coupons AS c JOIN coupon_restaurant r on c.id = r.coupon_id JOIN restaurants res on r.restaurant_id = res.id GROUP BY c.id;`
        return db.execute(sql);
    }


    static couponWithRestaurantById(id){

        // Restaurant Data

        // 'id', res.id, 
        // 'name', res.name, 
        // 'description', res.description, 
        // 'location_id', res.location_id, 
        // 'image', res.image, 
        // 'rating', res.rating, 
        // 'delivery_time', res.delivery_time, 
        // 'price_range', res.price_range, 
        // 'is_pureveg', res.is_pureveg, 
        // 'created_at', res.created_at, 
        // 'updated_at', res.updated_at, 
        // 'slug', res.slug, 
        // 'placeholder_image', res.placeholder_image, 
        // 'latitude', res.latitude, 
        // 'longitude', res.longitude, 
        // 'certificate', res.certificate, 
        // 'restaurant_charges', res.restaurant_charges, 
        // 'delivery_charges', res.delivery_charges, 
        // 'address', res.address, 
        // 'pincode', res.pincode, 
        // 'landmark', res.landmark, 
        // 'sku', res.sku, 
        // 'is_active', res.is_active,
        // 'is_accepted', res.is_accepted,
        // 'is_featured', res.is_featured,
        // 'commission_rate', res.commission_rate,
        // 'delivery_type', res.delivery_type,
        // 'delivery_radius', res.delivery_radius,
        // 'delivery_charge_type', res.delivery_charge_type,
        // 'base_delivery_charge', res.base_delivery_charge,
        // 'base_delivery_distance', res.base_delivery_distance,
        // 'extra_delivery_charge', res.extra_delivery_charge,
        // 'extra_delivery_distance', res.extra_delivery_distance,
        // 'min_order_price', res.min_order_price,
        // 'is_notifiable', res.is_notifiable,
        // 'auto_acceptable', res.auto_acceptable,
        // 'schedule_data', res.schedule_data,
        // 'is_schedulable', res.is_schedulable,
        // 'order_column', res.order_column,
        // 'custom_message', res.custom_message,
        // 'is_orderscheduling', res.is_orderscheduling,
        // 'branch_id', res.branch_id






        // let sql = `SELECT * FROM coupons INNER JOIN coupon_restaurant ON coupons.id = coupon_restaurant.coupon_id INNER JOIN restaurants ON restaurants.id = coupon_restaurant.restaurant_id;`
        let sql = `SELECT JSON_OBJECT(
            'id', c.id, 
            'name', c.name, 
            'description', c.description, 
            'code', c.code, 
            'success_count', c.success_count, 
            'success_amount', c.success_amount, 
            'discount_type', c.discount_type, 
            'discount', c.discount, 
            'expiry_date', c.expiry_date, 
            'is_active', c.is_active, 
            'is_restaurant', c.is_restaurant, 
            'created_at', c.created_at, 
            'updated_at', c.updated_at, 
            'restaurant_id', c.restaurant_id, 
            'count', c.count, 
            'max_count', c.max_count, 
            'min_subtotal', c.min_subtotal, 
            'max_discount', c.max_discount, 
            'subtotal_message', c.subtotal_message, 
            'user_type', c.user_type, 
            'max_count_per_user', c.max_count_per_user, 
            'restaurants', JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', res.id, 
                    'name', res.name
                )
            )
        ) AS coupons FROM coupons AS c JOIN coupon_restaurant r on c.id = r.coupon_id JOIN restaurants res on r.restaurant_id = res.id WHERE c.id = ${id} GROUP BY c.id;`
        return db.execute(sql);
    }


    static deleteCoupon(id){
        let sql = `DELETE FROM coupons WHERE id = ${id}`;
        return db.execute(sql);
    }
    

} 






module.exports = Coupon;
 
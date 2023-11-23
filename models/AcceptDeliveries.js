const db = require("../config/db");

class AcceptDeliveries {
    constructor(order_id, user_id, customer_id, is_complete) {
        this.order_id = order_id;
        this.user_id = user_id;
        this.customer_id = customer_id;
        this.is_complete = is_complete;
    }

    static onGoingDeliveriesCount(id){
        let sql = `SELECT COUNT(*) AS count
         FROM accept_deliveries AS a 
        JOIN orders o ON a.order_id = o.id
        WHERE a.user_id = ${id} AND a.is_complete = 0 AND (o.orderstatus_id = 3 OR o.orderstatus_id = 4);`;
        return db.execute(sql);
    }

    static completedDeliveriesCount(id){
        let sql = `SELECT COUNT(*) AS count
         FROM accept_deliveries AS a 
        JOIN orders o ON a.order_id = o.id
        WHERE a.user_id = ${id} AND a.is_complete = 0 AND (o.orderstatus_id = 5);`;
        return db.execute(sql);
    }

    static orders(id){
        let sql = `SELECT 
        JSON_OBJECT(
            'orders', JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', o.id,
                    'orderstatus_id', o.orderstatus_id,
                    'unique_order_id', o.unique_order_id,
                    'address', o.address,
                    'payment_mode', o.payment_mode,
                    'payable', o.payable
                )
            )
        ) AS accept
         FROM accept_deliveries AS a 
        JOIN orders o ON a.order_id = o.id
        WHERE a.user_id = ${id} AND (o.orderstatus_id = 3 OR o.orderstatus_id = 4 OR o.orderstatus_id = 5) GROUP BY a.id ORDER BY o.created_at DESC LIMIT 50;`;
        return db.execute(sql);
    }

    static acceptDeliveries(id) {
        let sql = `SELECT 
        JSON_OBJECT(
            'id', o.id,
            'unique_order_id', o.unique_order_id,
            'orderstatus_id', o.orderstatus_id,
            'user_id', o.user_id,
            'coupon_name', o.coupon_name,
            'location', o.location,
            'address', o.address,
            'restaurant_charge', o.restaurant_charge,
            'delivery_charge', o.delivery_charge,
            'total', o.total,
            'payment_mode', o.payment_mode,
            'order_comment', o.order_comment,
            'restaurant_id', o.restaurant_id,
            'transaction_id', o.transaction_id,
            'delivery_type', o.delivery_type,
            'wallet_amount', o.wallet_amount,
            'tip_amount', o.tip_amount,
            'tax_amount', o.tax_amount,
            'coupon_amount', o.coupon_amount,
            'coupon_isrestaurant', o.coupon_isrestaurant,
            'sub_total', o.sub_total,
            'cash_change_amount', o.cash_change_amount,
            'online_payment_status', o.online_payment_status,
            'rain_charge', o.rain_charge,
            'extra_charge', o.extra_charge,
            'extra_title', o.extra_title,
            'commission', o.delivery_charge,
            'restaurants', 
                JSON_OBJECT(
                    'id', r.id,
                    'name', r.name,
                    'description', r.description,
                    'location_id', r.location_id,
                    'image', r.image,
                    'rating', r.rating,
                    'delivery_time', r.delivery_time,
                    'price_range', r.price_range,
                    'is_pureveg', r.is_pureveg,
                    'slug', r.slug,
                    'placeholder_image', r.placeholder_image,
                    'latitude', r.latitude,
                    'longitude', r.longitude,
                    'certificate', r.certificate,
                    'restaurant_charges', r.restaurant_charges,
                    'delivery_charges', r.delivery_charges,
                    'address', r.address,
                    'pincode', r.pincode,
                    'landmark', r.landmark,
                    'sku', r.sku,
                    'is_active', r.is_active,
                    'is_accepted', r.is_accepted,
                    'is_featured', r.is_featured,
                    'commission_rate', r.commission_rate,
                    'delivery_type', r.delivery_type,
                    'delivery_radius', r.delivery_radius,
                    'delivery_charge_type', r.delivery_charge_type,
                    'base_delivery_charge', r.base_delivery_charge,
                    'base_delivery_distance', r.base_delivery_distance,
                    'extra_delivery_charge', r.extra_delivery_charge,
                    'extra_delivery_distance', r.extra_delivery_distance,
                    'min_order_price', r.min_order_price,
                    'is_notifiable', r.is_notifiable,
                    'auto_acceptable', r.auto_acceptable,
                    'schedule_data', r.schedule_data,
                    'is_schedulable', r.is_schedulable,
                    'order_column', r.order_column,
                    'custom_message', r.custom_message,
                    'is_orderscheduling', r.is_orderscheduling,
                    'branch_id', r.branch_id
                )
            
        ) AS orders
         FROM accept_deliveries AS a 
        JOIN orders o ON a.order_id = o.id
        JOIN restaurants r ON o.restaurant_id = r.id
        WHERE a.user_id = ${id} AND o.orderstatus_id = 3 AND a.is_complete = 0 GROUP BY a.id ORDER BY o.created_at DESC;`;
        console.log(sql);
        return db.execute(sql);

    }


    static pickedupOrders(id) {
        let sql = `SELECT 
        JSON_OBJECT(
            'id', o.id,
            'unique_order_id', o.unique_order_id,
            'orderstatus_id', o.orderstatus_id,
            'user_id', o.user_id,
            'coupon_name', o.coupon_name,
            'location', o.location,
            'address', o.address,
            'restaurant_charge', o.restaurant_charge,
            'delivery_charge', o.delivery_charge,
            'total', o.total,
            'payment_mode', o.payment_mode,
            'order_comment', o.order_comment,
            'restaurant_id', o.restaurant_id,
            'transaction_id', o.transaction_id,
            'delivery_type', o.delivery_type,
            'wallet_amount', o.wallet_amount,
            'tip_amount', o.tip_amount,
            'tax_amount', o.tax_amount,
            'coupon_amount', o.coupon_amount,
            'coupon_isrestaurant', o.coupon_isrestaurant,
            'sub_total', o.sub_total,
            'cash_change_amount', o.cash_change_amount,
            'online_payment_status', o.online_payment_status,
            'rain_charge', o.rain_charge,
            'extra_charge', o.extra_charge,
            'extra_title', o.extra_title,
            'commission', o.delivery_charge,
            'restaurants', 
                JSON_OBJECT(
                    'id', r.id,
                    'name', r.name,
                    'description', r.description,
                    'location_id', r.location_id,
                    'image', r.image,
                    'rating', r.rating,
                    'delivery_time', r.delivery_time,
                    'price_range', r.price_range,
                    'is_pureveg', r.is_pureveg,
                    'slug', r.slug,
                    'placeholder_image', r.placeholder_image,
                    'latitude', r.latitude,
                    'longitude', r.longitude,
                    'certificate', r.certificate,
                    'restaurant_charges', r.restaurant_charges,
                    'delivery_charges', r.delivery_charges,
                    'address', r.address,
                    'pincode', r.pincode,
                    'landmark', r.landmark,
                    'sku', r.sku,
                    'is_active', r.is_active,
                    'is_accepted', r.is_accepted,
                    'is_featured', r.is_featured,
                    'commission_rate', r.commission_rate,
                    'delivery_type', r.delivery_type,
                    'delivery_radius', r.delivery_radius,
                    'delivery_charge_type', r.delivery_charge_type,
                    'base_delivery_charge', r.base_delivery_charge,
                    'base_delivery_distance', r.base_delivery_distance,
                    'extra_delivery_charge', r.extra_delivery_charge,
                    'extra_delivery_distance', r.extra_delivery_distance,
                    'min_order_price', r.min_order_price,
                    'is_notifiable', r.is_notifiable,
                    'auto_acceptable', r.auto_acceptable,
                    'schedule_data', r.schedule_data,
                    'is_schedulable', r.is_schedulable,
                    'order_column', r.order_column,
                    'custom_message', r.custom_message,
                    'is_orderscheduling', r.is_orderscheduling,
                    'branch_id', r.branch_id
                )
            
        ) AS orders
         FROM accept_deliveries AS a 
        JOIN orders o ON a.order_id = o.id
        JOIN restaurants r ON o.restaurant_id = r.id
        WHERE a.user_id = ${id} AND o.orderstatus_id = 4 AND a.is_complete = 0 GROUP BY a.id ORDER BY o.created_at DESC;`;
        console.log(sql);
        return db.execute(sql);

    }



    static checkOrder(order_id, user_id) {
        let sql = `SELECT id FROM accept_deliveries WHERE order_id = ${order_id} AND user_id = ${user_id};`;
        return db.execute(sql);
    }

    static findByOrderID(order_id) {
        let sql = `SELECT id FROM accept_deliveries WHERE order_id = ${order_id};`;
        return db.execute(sql);
    }
} 



module.exports = AcceptDeliveries;

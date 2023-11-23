const db = require("../config/db");


class Orders {

    constructor(unique_order_id, orderstatus_id, user_id, coupon_name, location, address, tax, restaurant_charge, delivery_charge, total, payment_mode
        , order_comment, restaurant_id, transaction_id, delivery_type, payable, wallet_amount, tip_amount, tax_amount, coupon_amount, coupon_isrestaurant
        , sub_total, cash_change_amount, restaurant_tax, online_payment_status, rain_charge, extra_charge, extra_title) {
        this.unique_order_id = unique_order_id;
        this.orderstatus_id = orderstatus_id;
        this.user_id = user_id;
        this.coupon_name = coupon_name;
        this.location = location;
        this.address = address;
        this.tax = tax;
        this.restaurant_charge = restaurant_charge;
        this.delivery_charge = delivery_charge;
        this.total = total;
        this.payment_mode = payment_mode;
        this.order_comment = order_comment;
        this.restaurant_id = restaurant_id;
        this.transaction_id = transaction_id;
        this.delivery_type = delivery_type;
        this.payable = payable;
        this.wallet_amount = wallet_amount;
        this.tip_amount = tip_amount;
        this.tax_amount = tax_amount;
        this.coupon_amount = coupon_amount;
        this.coupon_isrestaurant = coupon_isrestaurant;
        this.sub_total = sub_total;
        this.cash_change_amount = cash_change_amount;
        this.restaurant_tax = restaurant_tax;
        this.online_payment_status = online_payment_status;
        this.rain_charge = rain_charge;
        this.extra_charge = extra_charge;
        this.extra_title = extra_title;
    }

    save(){
        let createdDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        let sql = `INSERT INTO ratings(
            unique_order_id,
            orderstatus_id,
            user_id,
            coupon_name,
            location,
            address,
            tax,
            restaurant_charge,
            delivery_charge,
            total,
            payment_mode,
            order_comment,
            restaurant_id,
            transaction_id,
            delivery_type,
            payable,
            wallet_amount,
            tip_amount,
            tax_amount,
            coupon_amount,
            coupon_isrestaurant,
            sub_total,
            cash_change_amount,
            restaurant_tax,
            online_payment_status,
            rain_charge,
            extra_charge,
            extra_title,
            created_at,
            updated_at
        ) 
        VALUES(
            "${this.unique_order_id}",
            "${this.orderstatus_id}",
            "${this.user_id}",
            "${this.coupon_name}",
            "${this.location}",
            "${this.address}",
            "${this.tax}",
            "${this.restaurant_charge}",
            "${this.delivery_charge}",
            "${this.total}",
            "${this.payment_mode}",
            "${this.order_comment}",
            "${this.restaurant_id}",
            "${this.transaction_id}",
            "${this.delivery_type}",
            "${this.payable}",
            "${this.wallet_amount}",
            "${this.tip_amount}",
            "${this.tax_amount}",
            "${this.coupon_amount}",
            "${this.coupon_isrestaurant}",
            "${this.sub_total}",
            "${this.cash_change_amount}",
            "${this.restaurant_tax}",
            "${this.online_payment_status}",
            "${this.rain_charge}",
            "${this.extra_charge}",
            "${this.extra_title}",
            "${createdDate}",
            "${createdDate}"
        )`;

        return db.execute(sql);
    }

    static getOrderByID(id){
        let sql = `SELECT * FROM orders WHERE id = ${id};`;
        return db.execute(sql);
    }

    static updateOrderStatus(id, order_status){
        let sql = `UPDATE orders SET orderstatus_id = ${order_status} WHERE id = ${id};`;
        return db.execute(sql);
    }

    static lastOrder(){
        let sql = `SELECT * FROM orders ORDER BY id DESC LIMIT 1;`;
        return db.execute(sql);
    }

    static deliveryGuyNewOrders(id) {
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
            
        ) AS accept
         FROM orders AS o 
        JOIN restaurants r ON o.restaurant_id = r.id
        WHERE o.delivery_type = 1 AND o.orderstatus_id = 2 GROUP BY o.id ORDER BY o.id DESC;`;
        return db.execute(sql);
    }


    static singleOrder(id) {
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
            'restaurants', JSON_OBJECT(
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
            ),
            'orderitems', JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', oi.id,
                    'order_id', oi.order_id,
                    'item_id', oi.item_id,
                    'name', oi.name,
                    'quantity', oi.quantity,
                    'price', oi.price
                    
                )
            ),
            'user',JSON_OBJECT(
                'id', u.id,
                'name', u.name,
                'phone', u.phone
            )        
        ) AS accept
         FROM orders AS o 
        JOIN restaurants r ON o.restaurant_id = r.id
        JOIN orderitems oi ON oi.order_id = o.id
        JOIN users u ON o.user_id = u.id
        WHERE o.id = ${id} GROUP BY o.id ORDER BY o.id DESC;`;
        return db.execute(sql);
    }


    static displayTodaysSales(){
        // let today = new Date().toISOString().split('T')[0]
        let today = '2023-10-10'

        let sql = `SELECT * FROM orders WHERE orderstatus_id = 5 AND (created_at BETWEEN '${today} 00:00:00' AND '${today} 23:59:59');`;

        return db.execute(sql);
    }


    static getorderByUniqueOrderID(unique_order_id){
        let sql = `SELECT * FROM orders WHERE unique_order_id = ${unique_order_id};`;
    }


    static ordersWith10() {
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
         FROM orders AS o 
        JOIN restaurants r ON o.restaurant_id = r.id
        GROUP BY o.id ORDER BY o.id DESC LIMIT 10;`;
        return db.execute(sql);

    }


    static ordersWithPagination(user_id, start, limit) {
        let sql = `SELECT JSON_OBJECT(
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
            'restaurants', JSON_OBJECT(
                'id', r.id,
                'name', r.name,
                'image', r.image
            ),
            'ratings', IF(rat.id IS NULL, NULL, JSON_OBJECT(
                'id', rat.id,
                'user_id', rat.user_id,
                'order_id', rat.order_id,
                'restaurant_id', rat.restaurant_id,
                'rating_store', rat.rating_store,
                'rating_delivery', rat.rating_delivery,
                'review_store', rat.review_store,
                'review_delivery', rat.review_delivery,
                'is_active', rat.is_active
            )),
            'orderitems', JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', oi.id,
                    'order_id', oi.order_id,
                    'item_id', oi.item_id,
                    'name', oi.name,
                    'quantity', oi.quantity,
                    'price', oi.price,
                    'order_item_addons', IF(oia.id IS NULL, NULL, 
                        JSON_OBJECT(
                            'id', oia.id,
                            'orderitem_id', oia.orderitem_id,
                            'addon_category_name', oia.addon_category_name,
                            'addon_name', oia.addon_name,
                            'addon_price', oia.addon_price                           
                        )
                    )
                )
            )
        ) AS orders
         FROM orders AS o 
        LEFT JOIN restaurants r ON o.restaurant_id = r.id
        LEFT JOIN ratings rat ON rat.order_id = o.id
        LEFT JOIN orderitems oi ON oi.order_id = o.id
        LEFT JOIN order_item_addons oia ON oia.orderitem_id = oi.id
        WHERE o.user_id = ${user_id} AND o.orderstatus_id != 8
        GROUP BY o.id 
        ORDER BY o.id DESC 
        LIMIT ${start}, ${limit};`;
        return db.execute(sql);
    }
    // ,
    // 'order_item_addons', (SELECT JSON_ARRAYAGG(
    //     JSON_OBJECT(
    //         'id', id,
    //         'orderitem_id', orderitem_id,
    //         'addon_category_name', addon_category_name,
    //         'addon_name', addon_name,
    //         'addon_price', addon_price
    //     )
    // ) FROM order_item_addons WHERE orderitem_id = oi.id)

    static runningOrders(user_id, unique_order_id){
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
         FROM orders AS o 
        JOIN restaurants r ON o.restaurant_id = r.id
        WHERE user_id = ${user_id} AND unique_order_id = "${unique_order_id}" AND orderstatus_id IN (1, 2, 3, 4, 5, 6, 7, 8)
        GROUP BY o.id;`;
        return db.execute(sql);

    }


}
module.exports = Orders;
const db = require("../config/db");

class Slide {

    constructor() {

    }


    static mainSlider(id){
        let sql = `SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', s.id,
                'promo_slider_id', s.promo_slider_id,
                'unique_id', s.unique_id,
                'name', s.name,
                'image', s.image,
                'image_placeholder', s.image_placeholder,
                'url', s.url,
                'is_active', s.is_active,
                'order_column', s.order_column,
                'model', s.model,
                'item_id', s.item_id,
                'restaurant_id', s.restaurant_id,
                'is_locationset', s.is_locationset,
                'latitude', s.latitude,
                'longitude', s.longitude,
                'radius', s.radius,
                'promo_sliders', JSON_OBJECT(
                    'id', ps.id,
                    'name', ps.name,
                    'is_active', ps.is_active,
                    'location_id', ps.location_id,
                    'position_id', ps.position_id,
                    'size', ps.size
                ),
                'restaurants', IF(res.id IS NULL, NULL,
                    JSON_OBJECT(
                        'id', res.id,
                        'name', res.name,
                        'description', res.description,
                        'location_id', res.location_id,
                        'image', res.image,
                        'rating', res.rating,
                        'delivery_time', res.delivery_time,
                        'price_range', res.price_range,
                        'is_pureveg', res.is_pureveg,
                        'slug', res.slug,
                        'placeholder_image', res.placeholder_image,
                        'latitude', res.latitude,
                        'longitude', res.longitude,
                        'certificate', res.certificate,
                        'restaurant_charges', res.restaurant_charges,
                        'delivery_charges', res.delivery_charges,
                        'address', res.address,
                        'pincode', res.pincode,
                        'landmark', res.landmark,
                        'sku', res.sku,
                        'is_active', res.is_active,
                        'is_accepted', res.is_accepted,
                        'is_featured', res.is_featured,
                        'commission_rate', res.commission_rate,
                        'delivery_type', res.delivery_type,
                        'delivery_radius', res.delivery_radius,
                        'delivery_charge_type', res.delivery_charge_type,
                        'base_delivery_charge', res.base_delivery_charge,
                        'base_delivery_distance', res.base_delivery_distance,
                        'extra_delivery_charge', res.extra_delivery_charge,
                        'extra_delivery_distance', res.extra_delivery_distance,
                        'min_order_price', res.min_order_price,
                        'is_notifiable', res.is_notifiable,
                        'auto_acceptable', res.auto_acceptable,
                        'schedule_data', res.schedule_data,
                        'is_schedulable', res.is_schedulable,
                        'order_column', res.order_column,
                        'custom_message', res.custom_message,
                        'is_orderscheduling', res.is_orderscheduling,
                        'branch_id', res.branch_id
                    )
                ),
                'items', IF(i.id IS NULL, NULL,
                    JSON_OBJECT(
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
                        'restaurants', IF(ir.id IS NULL, NULL,
                            JSON_OBJECT(
                                'id', ir.id,
                                'name', ir.name,
                                'description', ir.description,
                                'location_id', ir.location_id,
                                'image', ir.image,
                                'rating', ir.rating,
                                'delivery_time', ir.delivery_time,
                                'price_range', ir.price_range,
                                'is_pureveg', ir.is_pureveg,
                                'slug', ir.slug,
                                'placeholder_image', ir.placeholder_image,
                                'latitude', ir.latitude,
                                'longitude', ir.longitude,
                                'certificate', ir.certificate,
                                'restaurant_charges', ir.restaurant_charges,
                                'delivery_charges', ir.delivery_charges,
                                'address', ir.address,
                                'pincode', ir.pincode,
                                'landmark', ir.landmark,
                                'sku', ir.sku,
                                'is_active', ir.is_active,
                                'is_accepted', ir.is_accepted,
                                'is_featured', ir.is_featured,
                                'commission_rate', ir.commission_rate,
                                'delivery_type', ir.delivery_type,
                                'delivery_radius', ir.delivery_radius,
                                'delivery_charge_type', ir.delivery_charge_type,
                                'base_delivery_charge', ir.base_delivery_charge,
                                'base_delivery_distance', ir.base_delivery_distance,
                                'extra_delivery_charge', ir.extra_delivery_charge,
                                'extra_delivery_distance', ir.extra_delivery_distance,
                                'min_order_price', ir.min_order_price,
                                'is_notifiable', ir.is_notifiable,
                                'auto_acceptable', ir.auto_acceptable,
                                'schedule_data', ir.schedule_data,
                                'is_schedulable', ir.is_schedulable,
                                'order_column', ir.order_column,
                                'custom_message', ir.custom_message,
                                'is_orderscheduling', ir.is_orderscheduling,
                                'branch_id', ir.branch_id
                            )
                        )
                    )
                ) 
            )
        ) AS slides
        FROM slides AS s
        LEFT JOIN promo_sliders ps ON s.promo_slider_id = ps.id
        LEFT JOIN restaurants res ON s.restaurant_id = res.id
        LEFT JOIN items i ON s.item_id = i.id
        LEFT JOIN restaurants ir ON i.restaurant_id = ir.id
        WHERE s.promo_slider_id = ${id}
        GROUP BY ps.id;`;

        return db.execute(sql);
    }


    static otherSlider(id){
        let sql = `SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', s.id,
                'promo_slider_id', s.promo_slider_id,
                'unique_id', s.unique_id,
                'name', s.name,
                'image', s.image,
                'image_placeholder', s.image_placeholder,
                'url', s.url,
                'is_active', s.is_active,
                'order_column', s.order_column,
                'model', s.model,
                'item_id', s.item_id,
                'restaurant_id', s.restaurant_id,
                'is_locationset', s.is_locationset,
                'latitude', s.latitude,
                'longitude', s.longitude,
                'radius', s.radius,
                'promo_sliders', JSON_OBJECT(
                    'id', ps.id,
                    'name', ps.name,
                    'is_active', ps.is_active,
                    'location_id', ps.location_id,
                    'position_id', ps.position_id,
                    'size', ps.size
                ),
                'restaurants', IF(res.id IS NULL, NULL,
                    JSON_OBJECT(
                        'id', res.id,
                        'name', res.name,
                        'description', res.description,
                        'location_id', res.location_id,
                        'image', res.image,
                        'rating', res.rating,
                        'delivery_time', res.delivery_time,
                        'price_range', res.price_range,
                        'is_pureveg', res.is_pureveg,
                        'slug', res.slug,
                        'placeholder_image', res.placeholder_image,
                        'latitude', res.latitude,
                        'longitude', res.longitude,
                        'certificate', res.certificate,
                        'restaurant_charges', res.restaurant_charges,
                        'delivery_charges', res.delivery_charges,
                        'address', res.address,
                        'pincode', res.pincode,
                        'landmark', res.landmark,
                        'sku', res.sku,
                        'is_active', res.is_active,
                        'is_accepted', res.is_accepted,
                        'is_featured', res.is_featured,
                        'commission_rate', res.commission_rate,
                        'delivery_type', res.delivery_type,
                        'delivery_radius', res.delivery_radius,
                        'delivery_charge_type', res.delivery_charge_type,
                        'base_delivery_charge', res.base_delivery_charge,
                        'base_delivery_distance', res.base_delivery_distance,
                        'extra_delivery_charge', res.extra_delivery_charge,
                        'extra_delivery_distance', res.extra_delivery_distance,
                        'min_order_price', res.min_order_price,
                        'is_notifiable', res.is_notifiable,
                        'auto_acceptable', res.auto_acceptable,
                        'schedule_data', res.schedule_data,
                        'is_schedulable', res.is_schedulable,
                        'order_column', res.order_column,
                        'custom_message', res.custom_message,
                        'is_orderscheduling', res.is_orderscheduling,
                        'branch_id', res.branch_id
                    )
                ),
                'items', IF(i.id IS NULL, NULL,
                    JSON_OBJECT(
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
                        'restaurants', IF(ir.id IS NULL, NULL,
                            JSON_OBJECT(
                                'id', ir.id,
                                'name', ir.name,
                                'description', ir.description,
                                'location_id', ir.location_id,
                                'image', ir.image,
                                'rating', ir.rating,
                                'delivery_time', ir.delivery_time,
                                'price_range', ir.price_range,
                                'is_pureveg', ir.is_pureveg,
                                'slug', ir.slug,
                                'placeholder_image', ir.placeholder_image,
                                'latitude', ir.latitude,
                                'longitude', ir.longitude,
                                'certificate', ir.certificate,
                                'restaurant_charges', ir.restaurant_charges,
                                'delivery_charges', ir.delivery_charges,
                                'address', ir.address,
                                'pincode', ir.pincode,
                                'landmark', ir.landmark,
                                'sku', ir.sku,
                                'is_active', ir.is_active,
                                'is_accepted', ir.is_accepted,
                                'is_featured', ir.is_featured,
                                'commission_rate', ir.commission_rate,
                                'delivery_type', ir.delivery_type,
                                'delivery_radius', ir.delivery_radius,
                                'delivery_charge_type', ir.delivery_charge_type,
                                'base_delivery_charge', ir.base_delivery_charge,
                                'base_delivery_distance', ir.base_delivery_distance,
                                'extra_delivery_charge', ir.extra_delivery_charge,
                                'extra_delivery_distance', ir.extra_delivery_distance,
                                'min_order_price', ir.min_order_price,
                                'is_notifiable', ir.is_notifiable,
                                'auto_acceptable', ir.auto_acceptable,
                                'schedule_data', ir.schedule_data,
                                'is_schedulable', ir.is_schedulable,
                                'order_column', ir.order_column,
                                'custom_message', ir.custom_message,
                                'is_orderscheduling', ir.is_orderscheduling,
                                'branch_id', ir.branch_id
                            )
                        )
                    )
                ) 
            )
        ) AS slides
        FROM slides AS s
        LEFT JOIN promo_sliders ps ON s.promo_slider_id = ps.id
        LEFT JOIN restaurants res ON s.restaurant_id = res.id
        LEFT JOIN items i ON s.item_id = i.id
        LEFT JOIN restaurants ir ON i.restaurant_id = ir.id
        WHERE s.promo_slider_id = ${id} AND s.is_active = 1
        GROUP BY ps.id;`;

        return db.execute(sql);
    }
}

module.exports = Slide;
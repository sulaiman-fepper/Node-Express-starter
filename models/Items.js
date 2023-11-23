const db = require("../config/db");

class Item {
    constructor() {

    }

    static cartItems(ids){
        let sql = `SELECT id, price, is_active FROM items WHERE id IN (${ids.toString().replace("[", '').replace("]", '')});`;
        return db.execute(sql);
    }


    static getItemByID(id){
        let sql = `SELECT * FROM items WHERE id = ${id};`;
        return db.execute(sql);
    }

    static getItemsForSearch(id){
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
            'category_name', ic.name,
            'addon_categories', IF(ac.id IS NULL, NULL, 
                JSON_OBJECT(
                    'id', ac.id,
                    'name', ac.name,
                    'type', ac.type,
                    'created_at', ac.created_at,
                    'updated_at', ac.updated_at,
                    'description', ac.description,
                    'user_id', ac.user_id,
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
        LEFT JOIN item_categories ic ON ic.id = i.item_category_id
        LEFT JOIN addon_category_item aci ON aci.item_id = i.id
        LEFT JOIN addon_categories ac ON ac.id = aci.addon_category_id
        LEFT JOIN addons a ON a.addon_category_id = ac.id
        WHERE i.restaurant_id = ${id} AND ic.is_enabled = 1
        GROUP BY i.id ORDER BY i.order_column;`;
        // let sql = `SELECT * FROM items WHERE restaurant_id = ${id};`;
        return db.execute(sql);
    }


    static getItemsForVeg(id){
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
            'category_name', ic.name,
            'addon_categories', IF(ac.id IS NULL, NULL, 
                JSON_OBJECT(
                    'id', ac.id,
                    'name', ac.name,
                    'type', ac.type,
                    'created_at', ac.created_at,
                    'updated_at', ac.updated_at,
                    'description', ac.description,
                    'user_id', ac.user_id,
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
        LEFT JOIN item_categories ic ON ic.id = i.item_category_id
        LEFT JOIN addon_category_item aci ON aci.item_id = i.id
        LEFT JOIN addon_categories ac ON ac.id = aci.addon_category_id
        LEFT JOIN addons a ON a.addon_category_id = ac.id
        WHERE i.restaurant_id = ${id} AND ic.is_enabled = 1 AND i.is_veg = 1
        GROUP BY i.id ORDER BY i.order_column;`;
        // let sql = `SELECT * FROM items WHERE restaurant_id = ${id};`;
        return db.execute(sql);
    }


    static recommendedItemsVeg(id){
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
            'addon_categories', JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', ac.id,
                    'name', ac.name,
                    'type', ac.type,
                    'created_at', ac.created_at,
                    'updated_at', ac.updated_at,
                    'description', ac.description,
                    'user_id', ac.user_id,
                    'addons', (SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id', id,
                            'name', name,
                            'price', price,
                            'addon_category_id', addon_category_id,
                            'user_id', user_id,
                            'created_at', created_at,
                            'updated_at', updated_at,
                            'is_active', is_active
                        )
                    ) FROM addons WHERE addon_category_id = ac.id),
                    'addon_limit', ac.addon_limit
                )
            )
        ) AS items
        FROM items AS i
        LEFT JOIN item_categories ic ON ic.id = i.item_category_id
        LEFT JOIN addon_category_item aci ON aci.item_id = i.id
        LEFT JOIN addon_categories ac ON ac.id = aci.addon_category_id
        WHERE i.restaurant_id = ${id} AND ic.is_enabled = 1 AND is_recommended = 1 AND i.is_veg = 1
        GROUP BY i.id ORDER BY i.order_column;`;
        // let sql = `SELECT * FROM items WHERE restaurant_id = ${id};`;
        return db.execute(sql);
    }


    static getItems(id){
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
            'category_name', ic.name,
            'addon_categories', IF(ac.id IS NULL, NULL, 
                JSON_OBJECT(
                    'id', ac.id,
                    'name', ac.name,
                    'type', ac.type,
                    'created_at', ac.created_at,
                    'updated_at', ac.updated_at,
                    'description', ac.description,
                    'user_id', ac.user_id,
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
        LEFT JOIN item_categories ic ON ic.id = i.item_category_id
        LEFT JOIN addon_category_item aci ON aci.item_id = i.id
        LEFT JOIN addon_categories ac ON ac.id = aci.addon_category_id
        LEFT JOIN addons a ON a.addon_category_id = ac.id
        WHERE i.restaurant_id = ${id} AND ic.is_enabled = 1
        GROUP BY i.id ORDER BY i.order_column;`;
        // let sql = `SELECT * FROM items WHERE restaurant_id = ${id};`;
        return db.execute(sql);
    }


    static recommendedItems(id){
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
            'addon_categories', JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', ac.id,
                    'name', ac.name,
                    'type', ac.type,
                    'created_at', ac.created_at,
                    'updated_at', ac.updated_at,
                    'description', ac.description,
                    'user_id', ac.user_id,
                    'addons', (SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id', id,
                            'name', name,
                            'price', price,
                            'addon_category_id', addon_category_id,
                            'user_id', user_id,
                            'created_at', created_at,
                            'updated_at', updated_at,
                            'is_active', is_active
                        )
                    ) FROM addons WHERE addon_category_id = ac.id),
                    'addon_limit', ac.addon_limit
                )
            )
        ) AS items
        FROM items AS i
        LEFT JOIN item_categories ic ON ic.id = i.item_category_id
        LEFT JOIN addon_category_item aci ON aci.item_id = i.id
        LEFT JOIN addon_categories ac ON ac.id = aci.addon_category_id
        WHERE i.restaurant_id = ${id} AND ic.is_enabled = 1 AND is_recommended = 1
        GROUP BY i.id ORDER BY i.order_column;`;
        // let sql = `SELECT * FROM items WHERE restaurant_id = ${id};`;
        return db.execute(sql);
    }

}

module.exports = Item;

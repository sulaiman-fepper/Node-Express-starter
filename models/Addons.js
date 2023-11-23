const db = require("../config/db");

class Addon {
    constructor() {

    }

    static save(item){
        let createdDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        let isActive = 1;
        let sql = `INSERT INTO orderitems(
            name,
            price,
            addon_category_id,
            user_id,
            created_at,
            updated_at,
            is_active
        ) 
        VALUES(
            "${item['name']}",
            "${item['price']}",
            "${item['addon_category_id']}",
            "${item['user_id']}",
            "${createdDate}",
            "${createdDate}",
            "${isActive}"
        )`;
        return db.execute(sql);
    }
    static getAddonByID(id){
        let sql = `SELECT * FROM addons WHERE id = ${id};`;
        return db.execute(sql);
    }

}

module.exports = Addon;

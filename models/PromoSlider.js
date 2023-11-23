const db = require("../config/db");

class PromoSlider {
    cconstructor(name, location_id, position_id, size) {
        this.name = name;
        this.position_id = position_id;
        this.size = size;
        this.location_id = location_id
    }
    
    // static getbyId(id){
    //     let sql = `SELECT * FROM promo_sliders WHERE id =${id};`;
    //     return db.execute(sql);
    // }

    static updatePromoSlider(id, name, position_id, size){
        let sql = `UPDATE promo_sliders SET name = "${name}", position_id = ${position_id}, size = ${size} WHERE id = ${id};`;
        return db.execute(sql);
    }

    // static promoSliders(){
    //     let sql = `SELECT COUNT(*) as count FROM promo_sliders WHERE is_active = 1;`;
    //     return db.execute(sql);
    // }

    // static disableslider(id){
    //     let sql = `UPDATE promo_sliders SET is_active = ${slider.is_active} WHERE id = ${id};`;
    //     return db.execute(sql);
    // }

    // static createSliders(name, location_id, position_id, size){
    //     let sql = `INSERT INTO promo_sliders (name, location_id, position_id, size, is_active) VALUES (${name},
    //     ${location_id},
    //     ${position_id},
    //     ${size},
    //     "1");`;
    //     return db.execute(sql);
    // }

    static checkMainSlider(){
        let sql = `SELECT id FROM promo_sliders WHERE position_id = 0 AND is_active = 1;`;

        return db.execute(sql);
    }

    


    static checkOtherSlider(){
        let sql = `SELECT id FROM promo_sliders WHERE position_id IN (1, 2, 3, 4, 5, 6) AND is_active = 1;`;

        return db.execute(sql);
    }

}

module.exports = PromoSlider;
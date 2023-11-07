const db = require("../config/db");

class Address {
    constructor(user_id, address, house, landmark, tag, latitude, longitude) {
       this.user_id = user_id;
       this.address = address;
       this.house = house;
       this.landmark = landmark;
       this.tag = tag;
       this.latitude = latitude;
       this.longitude = longitude;
    }



    saveAddress() {

        var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') 

        let sql = `INSERT INTO addresses(
            user_id,
            address,
            house,
            landmark,
            tag,
            latitude,
            longitude,
            created_at,
            updated_at
            ) 
        VALUES(
            "${this.user_id}",
            "${this.address}",
            "${this.house}",
            "${this.landmark}",
            "${this.tag}",
            "${this.latitude}",
            "${this.longitude}",
            "${date}",
            "${date}"
            )`;

        
        
        return db.execute(sql);

    }


    static getAddressId(id){
        let sql = `SELECT * FROM addresses WHERE id = ${id} ORDER BY id DESC;`;

        return db.execute(sql);

    }




    static getAddressesByUserId(id){
        let sql = `SELECT * FROM addresses WHERE user_id = ${id} ORDER BY id DESC;`;

        return db.execute(sql);

    }

    static deleteAddress(user_id, address_id){
        let sql = `DELETE FROM addresses WHERE user_id = ${user_id} AND id = ${address_id};`;
        return db.execute(sql);
    }


}

module.exports = Address;

const db = require("../config/db");

class User {
    constructor(name, email, password, remember_token, auth_token, phone, delivery_pin, 
        avatar, user_ip) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.remember_token = remember_token;
        this.auth_token = auth_token;
        this.phone = phone;
        this.delivery_pin = delivery_pin;
        this.avatar = avatar, 
        this.user_ip = user_ip
    }


    save(){
        let createdDate = new Date();

        let isActive = 1;

        let sql = `INSERT INTO users(
            name,
            email,
            password,
            remember_token,
            auth_token,
            phone,
            delivery_pin,
            avatar,
            user_ip,
            is_active
            ) 
            
        VALUES(
            "${this.name}",
            "${this.email}",
            "${this.password}",
            "${this.remember_token}",
            "${this.auth_token}",
            "${this.phone}",
            "${this.delivery_pin}",
            "${this.avatar}",
            "${this.user_ip}",
            "${isActive}"
            )`;

            // let sql2 = `SELECT * FROM users WHERE id = SCOPE_IDENTITY();`
            // db.execute(sql);

        return db.execute(sql);
    }

    static findAll() {
        let sql = `SELECT * FROM users;`;

        return db.execute(sql);
    }

    static findById(id) {
        let sql = `SELECT * FROM users WHERE id = ${id};`;

        return db.execute(sql);
    }

    static updateDefaultAddress(userId, AddressId) {
        let sql = `UPDATE users SET default_address_id = ${AddressId} WHERE id = ${userId};`;

        return db.execute(sql);
    }

    static userOrderCount(id){
        let sql = `SELECT COUNT(id) as userCount FROM orders WHERE user_id = ${id};`;
        return db.execute(sql);
    }



}

module.exports = User;

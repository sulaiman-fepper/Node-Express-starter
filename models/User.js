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
        let createdDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

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
            is_active,
            created_at,
            updated_at
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
            "${isActive}",
            "${createdDate}",
            "${createdDate}"
            )`;

            // let sql2 = `SELECT * FROM users WHERE id = SCOPE_IDENTITY();`
            // db.execute(sql);

        return db.execute(sql);
    }

    static findAll() {
        let sql = `SELECT * FROM users;`;

        return db.execute(sql);
    }

    static find9() {
        let sql = `SELECT * FROM users ORDER BY id DESC LIMIT 9;`;

        return db.execute(sql);
    }

    static count() {
        let sql = `SELECT COUNT(id) AS count FROM users;`;

        return db.execute(sql);
    }

    static findById(id) {
        let sql = `SELECT * FROM users WHERE id = ${id};`;

        return db.execute(sql);
    }


    static checkEmail(email){
        let sql = `SELECT * FROM users WHERE email = "${email}";`;

        return db.execute(sql);
    }

    static checkPhone(phone){
        let sql = `SELECT * FROM users WHERE phone = "${phone}";`;

        return db.execute(sql);
    }


    static findByIdWithBalance(id) {
        let sql = `SELECT JSON_OBJECT(
            'id', u.id,
            'auth_token', u.auth_token,
            'name', u.name,
            'email', u.email,
            'phone', u.phone,
            'default_address_id', u.default_address_id,
            'delivery_pin', u.delivery_pin,
            'delivery_guy_detail_id', u.delivery_guy_detail_id,
            'avatar', u.avatar,
            'tax_number', u.tax_number,
            'wallet_balance', w.balance / 100
        ) AS users 
        FROM users AS u
        LEFT JOIN wallets w ON w.holder_id = u.id
        WHERE u.id = ${id}
        GROUP BY u.id`;

        return db.execute(sql);
    }


    static findByIdWithDelivery(id) {
        let sql = `SELECT JSON_OBJECT(
            'id', u.id,
            'auth_token', u.auth_token,
            'name', u.name,
            'email', u.email,
            'phone', u.phone,
            'default_address_id', u.default_address_id,
            'delivery_pin', u.delivery_pin,
            'delivery_guy_detail_id', u.delivery_guy_detail_id,
            'avatar', u.avatar,
            'tax_number', u.tax_number,
            'delivery_guy_detail', JSON_OBJECT(
                'id', d.id,
                'name', d.name,
                'vehicle_number', d.vehicle_number
            )
        ) AS users 
        FROM users AS u
        LEFT JOIN delivery_guy_details d ON d.id = u.delivery_guy_detail_id
        WHERE u.id = ${id}
        GROUP BY d.id`;

        return db.execute(sql);
    }
    

    static findByPhone(phone) {
        let sql = `SELECT JSON_ARRAYAGG(JSON_OBJECT(
                'id', u.id,
                'auth_token', u.auth_token,
                'name', u.name,
                'email', u.email,
                'phone', u.phone,
                'delivery_pin', u.delivery_pin,
                'avatar', u.avatar,
                'wallet', w.balance
            )) AS users FROM users AS u
            JOIN wallets w ON w.holder_id = u.id
            WHERE phone = ${phone}
            GROUP BY u.id`;

        return db.execute(sql);
    }

    static getUserByPhone(phone) {
        let sql = `SELECT * FROM users WHERE phone = ${phone}`;
        console.log(phone);
        return db.execute(sql);
    }

    static updateDefaultAddress(userId, AddressId) {
        let sql = `UPDATE users SET default_address_id = "${AddressId}" WHERE id = ${userId};`;

        return db.execute(sql);
    }

    static updateUser(userId, email, name) {
        let sql = `UPDATE users SET name = "${name}", email = ${email}  WHERE id = ${userId};`;

        return db.execute(sql);
    }

    static updateAvatar(userId, avatar) {
        let sql = `UPDATE users SET avatar = "${avatar}" WHERE id = ${userId};`;

        return db.execute(sql);
    }

    static updateDeliveryPin(userId, deliveryPin) {
        let sql = `UPDATE users SET delivery_pin = "${deliveryPin}" WHERE id = ${userId};`;

        return db.execute(sql);
    }

    static userOrderCount(id){
        let sql = `SELECT COUNT(id) as userCount FROM orders WHERE user_id = ${id};`;
        return db.execute(sql);
    }


    static userForOTP(mobile) {
        let sql = `SELECT is_active FROM users WHERE phone = ${mobile};`;
        return db.execute(sql);
    }



}

module.exports = User;

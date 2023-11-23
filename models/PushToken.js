const db = require("../config/db");

class PushToken {

    constructor(token, status, is_sent, is_active, user_id) {
        this.token = token;
        this.status = status;
        this.is_sent = is_sent;
        this.is_active = is_active;
        this.user_id = user_id;
    }

    save() {
        let createdDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        let sql = `INSERT INTO push_tokens(
            token,
            status,
            is_sent,
            is_active,
            user_id,
            created_at,
            updated_at
            ) 
            
        VALUES(
            "${this.token}",
            "${this.status}",
            "${this.is_sent}",
            "${this.is_active}",
            "${this.user_id}",
            "${createdDate}",
            "${createdDate}"
            )`;
        return db.execute(sql);
    }
    

    static update(id, token) {
        let createdDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        let sql = `UPDATE push_tokens SET
        token = "${token}",
        updated_at = "${createdDate}"
            WHERE user_id = ${id}`;
        return db.execute(sql);
    }


    static getByData(user_id) {
        let sql = `SELECT * FROM push_tokens WHERE user_id = ${user_id};`;
        return db.execute(sql);
    }

}

module.exports = PushToken;
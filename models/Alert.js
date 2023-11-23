const db = require("../config/db");

class Alert {
    constructor() {

    }

    static getUserNotifications(id){
        let sql = `SELECT * FROM alerts WHERE user_id = ${id} ORDER BY created_at DESC LIMIT 20;`;
        return db.execute(sql);
    }

}

module.exports = Alert;

const db = require("../config/db");

class Settings {
    constructor() {

    }

    static settingsByIds(ids){
        let sql = `SELECT value FROM settings WHERE id IN (${ids.toString().replace("[", '').replace("]", '')});`;
        return db.execute(sql);
    }

}

module.exports = Settings;

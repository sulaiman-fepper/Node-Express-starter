const db = require("../config/db");

class Page {
    constructor() {

    }

    static cartItems(){
        let sql = `SELECT * FROM pages;`;
        return db.execute(sql);
    }

}

module.exports = Page;

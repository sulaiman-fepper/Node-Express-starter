const db = require("../config/db");

class Wallets {
    constructor() {

    }

    static userBalance(id){
        let sql = `SELECT balance/100 AS balance FROM wallets WHERE holder_id = ${id};`;
        return db.execute(sql);
    }


    static deposit(id, wallet_balance, addon_amount){
        let total = wallet_balance + addon_amount;
        let sql = `UPDATE wallets SET balance = ${total} WHERE id = ${id};`
        return db.execute(sql);
    }

    static withdrawal(id, wallet_balance, addon_amount){
        let total = wallet_balance - addon_amount;
        let sql = `UPDATE wallets SET balance = ${total} WHERE id = ${id};`
        return db.execute(sql);
    }

}

module.exports = Wallets;

const db = require("../config/db");
const { v4: uuidv4 } = require('uuid');

class Transactions {

    constructor(payable_type, payable_id, wallet_id, type, amount, confirmed, meta) {
        this.payable_type = payable_type;
        this.payable_id = payable_id;
        this.wallet_id = wallet_id;
        this.type = type;
        this.amount = amount;
        this.confirmed = confirmed;
        this.meta = meta;
    }


    save(){
        let createdDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        let uuid = uuidv4();
        let sql = `INSERT INTO 
        transactions(
            payable_type,
            payable_id,
            wallet_id,
            type,
            amount,
            confirmed,
            meta,
            uuid,
            created_at,
            updated_at
        ) 
        VALUES(
            "${this.payable_type}",
            "${this.payable_id}",
            "${this.wallet_id}",
            "${this.type}",
            "${this.amount}",
            "${this.confirmed}",
            "${this.meta}",
            "${uuid}",
            "${createdDate}",
            "${createdDate}"
        )`;

            // let sql2 = `SELECT * FROM users WHERE id = SCOPE_IDENTITY();`
            // db.execute(sql);

        return db.execute(sql);
    }


    static getTransactionById(id){
        let sql = `SELECT * FROM transactions WHERE payable_id = ${id} ORDER BY id DESC LIMIT 50;`;

        return db.execute(sql);
    }

    static getChartData(id){
        // let sql = `SELECT SUM(amount) FROM transactions WHERE payable_id = ${id} AND type = 'deposit' AND (created_at BETWEEN '${beforeday} 00:00:00' AND '${today} 11:59:59');`;
        let sql = `SELECT DATE_FORMAT(created_at, "%a") AS x, SUM(amount)/100 AS y FROM transactions WHERE payable_id = ${id} AND type = 'deposit' AND (created_at BETWEEN DATE_SUB(NOW(), INTERVAL 12 DAY)  AND NOW()) GROUP BY x;`;
        return db.execute(sql);
    }

}


module.exports = Transactions;

const db = require("../config/db");

class OrderItem {
    constructor(order_id, item_id, name, quantity, price) {
        this.order_id = order_id;
        this.item_id = item_id;
        this.name = name;
        this.quantity = quantity;
        this.price = price;
    }

    static save(item){
        let createdDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        let sql = `INSERT INTO orderitems(
            order_id,
            item_id,
            name,
            quantity,
            price,
            created_at,
            updated_at
        ) 
        VALUES(
            "${item['order_id']}",
            "${item['item_id']}",
            "${item['name']}",
            "${item['quantity']}",
            "${item['price']}",
            "${createdDate}",
            "${createdDate}"
        )`;
        return db.execute(sql);
    }


    static getOrderItemByID(){

    }

}

module.exports = OrderItem;

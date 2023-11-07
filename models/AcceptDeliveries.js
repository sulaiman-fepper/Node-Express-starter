const db = require("../config/db");

class AcceptDeliveries {
    constructor(order_id, user_id, customer_id, is_complete) {
        this.order_id = order_id;
        this.user_id = user_id;
        this.customer_id = customer_id;
        this.is_complete = is_complete;
    }

    static onGoingDeliveriesCount(id){
        let sql = `SELECT COUNT(*) AS count
         FROM accept_deliveries AS a 
        JOIN orders o ON a.order_id = o.id
        WHERE a.user_id = ${id} AND a.is_complete = 0 AND (o.orderstatus_id = 3 OR o.orderstatus_id = 4);`;
        return db.execute(sql);
    }

    static completedDeliveriesCount(id){
        let sql = `SELECT COUNT(*) AS count
         FROM accept_deliveries AS a 
        JOIN orders o ON a.order_id = o.id
        WHERE a.user_id = ${id} AND a.is_complete = 0 AND (o.orderstatus_id = 5);`;
        return db.execute(sql);
    }

    static orders(id){
        let sql = `SELECT 
        JSON_OBJECT(
            'orders', JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', o.id,
                    'orderstatus_id', o.orderstatus_id,
                    'unique_order_id', o.unique_order_id,
                    'address', o.address,
                    'payment_mode', o.payment_mode,
                    'payable', o.payable
                )
            )
        ) AS accept
         FROM accept_deliveries AS a 
        JOIN orders o ON a.order_id = o.id
        WHERE a.user_id = ${id} AND (o.orderstatus_id = 3 OR o.orderstatus_id = 4 OR o.orderstatus_id = 5) GROUP BY a.id ORDER BY o.created_at DESC;`;
        return db.execute(sql);
    }
} 

module.exports = AcceptDeliveries;

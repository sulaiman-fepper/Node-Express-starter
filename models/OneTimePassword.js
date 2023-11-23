const db = require("../config/db");
class OneTimePassword {
    constructor(mobile_number, otp, otp_numbers) {
        this.mobile_number = mobile_number;
        this.otp = otp;
        this.otp_numbers = otp_numbers;
    }


    save() {
        let createdDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        let sql = `INSERT INTO one_time_passwords(
            mobile_number,
            otp,
            otp_numbers,
            created_at,
            updated_at
            ) 
            
        VALUES(
            "${this.mobile_number}",
            "${this.otp}",
            "${this.otp_numbers}",
            "${createdDate}",
            "${createdDate}"
            )`;
        return db.execute(sql);
    }


    update(id) {
        let createdDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        let sql = `UPDATE one_time_passwords SET
            mobile_number = "${this.mobile_number}",
            otp = "${this.otp}",
            otp_numbers = "${this.otp_numbers}",
            updated_at = "${createdDate}"
            WHERE id = ${id}`;
        return db.execute(sql);
    }


    static getOTPByNumber(mobile) {
        let sql = `SELECT * FROM one_time_passwords WHERE mobile_number = ${mobile};`;
        return db.execute(sql);
    }


}

module.exports = OneTimePassword;
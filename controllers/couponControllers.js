const Restaurant = require("../models/Restaurant");
const Coupon = require("../models/Coupon");
const User = require("../models/User");


exports.demo = async (req, res, next) => {
    var date = new Date()
    console.log(date);
    let restaurants = await Coupon.couponWithRestaurantById(5)
    // coupon = (coupon[0].map((item)=>item['coupons']))
    res.status(200).json(restaurants[0][0]['coupons']);
    // res.status(200).json((coupon[0]));
}



exports.applyCoupon = async (req, res, next) => {
    if(req.body['user_id'] != null){
        let coupon = await Coupon.getCouponWithCode(req.body['coupon'])
        // res.status(200).json(coupon[0]);
        if(coupon[0].length != 0){
            coupon = coupon[0][0]
            if(coupon['is_active']){
                let isCoupon = await Coupon.isCouponBelongsToRestaurant(coupon['id'],req.body['restaurant_id'])
                if(isCoupon[0].length != 0){
                    if (coupon['expiry_date'] > new Date() && coupon['count'] < coupon['max_count']) {
                        if(req.body['subtotal'] >= coupon['min_subtotal']){
                            let userOrderCount = await User.userOrderCount(req.body['user_id']);

                            if(coupon['user_type'] == 'ONCE'){
                                let orderAlreadyPlacedWithCoupon = await Coupon.orderAlreadyPlacedWithCoupon(req.body['user_id'], req.body['coupon']);
                                if(orderAlreadyPlacedWithCoupon[0].length != 0){
                                    res.status(200).json(
                                        {
                                            success: false, 
                                            type: 'ALREADYUSEDONCE', 
                                            message: 'This coupon can only be used once per one user'
                                        }
                                    );
                                }
                            }

                            else if(coupon['user_type'] == 'ONCENEW'){
                                if(userOrderCount[0].length != 0){
                                    res.status(200).json(
                                        {
                                            success: false, 
                                            type: 'FORNEWUSER', 
                                            message: 'This coupon can only be used for first order'
                                        }
                                    );
                                }
                            }

                            else if(coupon['CUSTOM'] == 'CUSTOM'){
                                let orderAlreadyPlacedWithCouponCount = await Coupon.orderAlreadyPlacedWithCouponCount(req.body['user_id'], req.body['coupon_code'])
                                if(orderAlreadyPlacedWithCouponCount[0][0]['orderCount'] >= coupon['max_count_per_user']){
                                    if(userOrderCount[0].length != 0){
                                        res.status(200).json(
                                            {
                                                success: false, 
                                                type: 'MAXLIMITREACHEDPERUSER', 
                                                message: 'Max limit reached for this coupon'
                                            }
                                        );
                                    }
                                }
                            }
                            else{
                                coupon['success'] = true;
                                res.status(200).json(coupon)
                            }
                        }
                        else {
                            res.status(200).json(
                                {
                                    success: false, 
                                    type: 'MINSUBTOTAL', 
                                    message: coupon['subtotal_message']
                                }
                            );
                        }
                    }
                    else {
                        console.log("1");
                        res.status(200).json(
                            {
                                success: false, 
                            }
                        );
                    }
                }
                else {
                    console.log("2");
                    res.status(200).json(
                        {
                            success: false,
                            body: {
                                "coupon_id": coupon['id'],
                                "restaurant_id": req.body['restaurant_id']
                            },
                            data: isCoupon[0]
                        }
                    );
                }
            }
            else {
                console.log("3");
                res.status(200).json(
                    {
                        success: false, 
                    }
                );
            }
        }
        else {
            console.log("4");
            res.status(200).json(
                {
                    success: false, 
                }
            );
        }
    }
    else {
        console.log("5");
        res.status(200).json(
            {
                success: false, 
            }
        );
    }
}



//admin
exports.coupons = async (req, res, next) => {
    var date = new Date()
    console.log(date);
    let coupon = await Coupon.couponWithRestaurant()
    coupon = (coupon[0].map((item)=>item['coupons']))
    let restaurants = await Restaurant.getAllRestaurant()
    res.json({
        'coupons': coupon,
        'restaurants': restaurants[0],
        'todaysDate': date
    })
}




exports.saveNewCoupon = async (req, res, next) => {



    var min_subtotal = req.body['min_subtotal'] == null ? 0 : req.body['min_subtotal'];
    var max_discount = 1000000000000;
    if(req.body['discount_type'] == 'PERCENTAGE') {
        max_discount = req.body['max_discount'];
    }
    else {
        max_discount = 1000000000000;
    }

    var is_active;
    if(req.body['is_active'] == 'true') {
        is_active = 1;
    }
    else {
        is_active = 0;
    }
    var max_count_per_user = 10000000;
    if(req.body['user_type'] == 'CUSTOM') {
        max_count_per_user = req.body['max_count_per_user']
    }

    let coupon = new Coupon(req.body['name'], req.body['description'], req.body['code'], req.body['success_count'], req.body['success_amount'], req.body['discount_type'], 
                             req.body['discount'],req.body['expiry_date'],req.body['is_restaurant'],req.body['restaurant_id'],0,req.body['max_count'],min_subtotal,
                             max_discount,req.body['subtotal_message'],req.body['user_type'],max_count_per_user)

    coupon = await coupon.save(is_active)

    coupon[0]['success'] = true;
    res.json(coupon[0])
}

exports.getEditCoupon = async (req, res, next) => {
    let coupon = await Coupon.couponWithRestaurantById(req.body['id'])
    coupon = coupon[0][0]['coupons']
    let restaurants = await Restaurant.getAllRestaurant()
    res.json({
        'coupon': coupon,
        'restaurants': restaurants[0]
    })
}


exports.updateCoupon = async (req, res, next) => {


    var min_subtotal = req.body['min_subtotal'] == null ? 0 : req.body['min_subtotal'];
    var max_discount = 1000000000000;
    if(req.body['discount_type'] == 'PERCENTAGE') {
        max_discount = req.body['max_discount'];
    }
    else {
        max_discount = 1000000000000;
    }

    var is_active;
    if(req.body['is_active'] == 'true') {
        is_active = 1;
    }
    else {
        is_active = 0;
    }
    var max_count_per_user = 10000000;
    if(req.body['user_type'] == 'CUSTOM') {
        max_count_per_user = req.body['max_count_per_user']
    }
    let coupon = new Coupon(req.body['name'], req.body['description'], req.body['code'], req.body['success_count'], req.body['success_amount'], req.body['discount_type'], 
                             req.body['discount'],req.body['expiry_date'],req.body['is_restaurant'],req.body['restaurant_id'],0,req.body['max_count'],min_subtotal,
                             max_discount,req.body['subtotal_message'],req.body['user_type'],max_count_per_user)

    coupon = await coupon.update(req.body['id'], is_active)

    coupon[0]['success'] = true;
    res.json(coupon[0])
}



exports.deleteCoupon = async (req, res, next) => {
    let coupon = await Coupon.deleteCoupon(req.body['id'])
    coupon[0]['success'] = true;
    res.json(coupon[0])
}
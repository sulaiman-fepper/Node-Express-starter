const Hashids = require('hashids/cjs')
const AcceptDeliveries = require("../models/AcceptDeliveries");
const Address = require("../models/Address");
const Alert = require("../models/Alert");
const Coupon = require("../models/Coupon");
const Item = require("../models/Items");
const OneTimePassword = require("../models/OneTimePassword");
const Orders = require("../models/Orders");
const PromoSlider = require("../models/PromoSlider");
const PushToken = require("../models/PushToken");
const Ratings = require("../models/Ratings");
const Restaurant = require("../models/Restaurant");
const RestaurantCategory = require("../models/RestaurantCategory");
const RestaurantCategorySlider = require("../models/RestaurantCategorySlider");
const Settings = require("../models/Settings");
const Slide = require("../models/Slide");
const Transactions = require("../models/Transactions");
const User = require("../models/User");
const Wallets = require("../models/Wallets");
const Addon = require('../models/Addons');
const { v4: uuidv4 } = require('uuid');
const OrderItem = require('../models/OrderItems');


function deg2rad(degrees){
    var pi = Math.PI;
    return degrees * (pi/180);
}


function getDistance(latitudeFrom, longitudeFrom, restaurant){

    let latFrom = deg2rad(latitudeFrom);
    let lonFrom = deg2rad(longitudeFrom);
    let latTo = deg2rad(restaurant['latitude']);
    let lonTo = deg2rad(restaurant['longitude']);


    let latDelta = latTo - latFrom;
    let lonDelta = lonTo - lonFrom;
    let angle = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(latDelta / 2), 2) + Math.cos(latFrom) * Math.cos(latTo) * Math.pow(Math.sin(lonDelta / 2), 2)));


    let distance = angle * 6371;
    // if (distance <= restaurant['delivery_radius']) {
    //     return true;
    // } else {
    //     return false;
    // }
    return distance;
}

function checkOperation(latitudeFrom, longitudeFrom, restaurant){
    let latFrom = deg2rad(latitudeFrom);
    let lonFrom = deg2rad(longitudeFrom);
    let latTo = deg2rad(restaurant['latitude']);
    let lonTo = deg2rad(restaurant['longitude']);

    let latDelta = latTo - latFrom;
    let lonDelta = lonTo - lonFrom;
    let angle = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(latDelta / 2), 2) + Math.cos(latFrom) * Math.cos(latTo) * Math.pow(Math.sin(lonDelta / 2), 2)));


    let distance = angle * 6371;
    if (distance <= restaurant['delivery_radius']) {
        return true;
    } else {
        return false;
    }
    // return distance;
}


async function deposit(amount, description, unique_order_id, user_id) {

    let wallet = await Wallets.userBalance(user_id);
    wallet = wallet[0][0];

    let updateWallet = await Wallets.deposit(wallet['id'], wallet['balance'], amount)

    if(updateWallet[0]['affectedRows'] != 0){
        let newTransactions = new Transactions('App/User', user_id, wallet['id'], 'deposit', amount, 1, `{"description": "${description}"}`);
        newTransactions.save();
        res.json({
            success: true
        })
    }
    else{
        res.json({
            success: false
        })
    }
}

async function withdrawal(amount, description, user_id) {

    let wallet = await Wallets.userBalance(user_id);
    wallet = wallet[0][0];
    if(wallet['balance'] >= amount){
        let updateWallet = await Wallets.deposit(wallet['id'], wallet['balance'], amount)

        if(updateWallet[0]['affectedRows'] != 0){
            let newTransactions = new Transactions('App/User', user_id, wallet['id'], 'withdrawal', amount, 1, `{"description": "${description}"}`);
            newTransactions.save();
            res.json({
                success: true
            })
        }
        else{
            res.json({
                success: false
            })
        }
    } else {
        res.json({
            success: false,
            type: 'NOBALANCE'
        })
    }
    
}

exports.getAllUsers = async (req, res, next) => {

    try{
        const users= await User.findAll();
        console.log(users);
        // res.setHeader('Content-Type', 'text/plain');
        res.status(200).json({users});

    }
    catch(error){
        console.log(error);
        next(error);
    }
}


exports.createNewUser = async (req, res, next) => {

    try{
        let user = new User("sulaiman", "sulaimankckc18111s11@gmail.com", "Hello", "Hiiii", "Hiiiii", "99072830213", "123456", "Hello.jpg", "127");
        user = await user.save();

        res.status(201).json(user)
    }
    catch (error){
        console.log(error);
        next(error);
    }

}


exports.getUserById = async (req, res, next) => {

    try {
        let userId = req.params.id;
        let [user, _] = await User.findById(userId);
        res.status(200).json({user: user[0]});
    }
    catch (error){
        console.log(error);
        next(error);
    }

}



exports.sendOTP = async (req, res, next) => {
    let user = await User.userForOTP(req.body['mobile'])
    user = user[0][0];

    let oneTimePassword = await OneTimePassword.getOTPByNumber(req.body['mobile'])

    if(user == undefined) {

        if(oneTimePassword[0] == undefined) {
            oneTimePassword = oneTimePassword[0][0];

            let otp = Math.floor(Math.random() * (999999 - 100000) ) + 100000;

            oneTimePassword = new OneTimePassword(req.body['mobile'], otp, 1);

            oneTimePassword.save();
        }
        else{
            let otp = Math.floor(Math.random() * (999999 - 100000) ) + 100000;

            oneTimePassword['otp_numbers'] = oneTimePassword['otp_numbers'] + 1;

            updateOneTimePassword = new OneTimePassword(req.body['mobile'], otp, oneTimePassword['otp_numbers']);

            updateOneTimePassword.update(oneTimePassword['id']);
        }
        res.status(200).json({is_active: 1});
    }
    else {
        if(user['is_active'] == 1) {
            if(oneTimePassword[0] == undefined) {
                oneTimePassword = oneTimePassword[0][0];

                let otp = Math.floor(Math.random() * (999999 - 100000) ) + 100000;
    
                oneTimePassword = new OneTimePassword(req.body['mobile'], otp, 1);
    
                oneTimePassword.save();
            }
            else{
                let otp = Math.floor(Math.random() * (999999 - 100000) ) + 100000;
    
                oneTimePassword['otp_numbers'] = oneTimePassword['otp_numbers'] + 1;
    
                updateOneTimePassword = new OneTimePassword(req.body['mobile'], otp, oneTimePassword['otp_numbers']);
    
                updateOneTimePassword.update(oneTimePassword['id']);
            }
        }
        user['msg'] = "This number is blocked by Admin";

        res.status(200).json({user: user});
    }
}



exports.newLogin = async (req, res, next) => {
    let user = await User.findByPhone(req.body['phone'])
    user = user[0][0];

    let oneTimePassword = await OneTimePassword.getOTPByNumber(req.body['phone'])
    oneTimePassword = oneTimePassword[0][0];


    if(oneTimePassword['otp'] == req.body['otp']) {
        if(user == undefined) {
            res.status(200).json({
                success: false,
                data: 'USERNOTEXIST'
            });
        }
        else {
            res.status(200).json({
                success: true,
                data: {
                    id: user['users'][0]['id'],
                    auth_token: user['users'][0]['auth_token'],
                    name: user['users'][0]['name'],
                    email: user['users'][0]['email'],
                    phone: user['users'][0]['phone'],
                    delivery_pin: user['users'][0]['delivery_pin'],
                    wallet_balance: user['users'][0]['wallet'],
                    avatar: user['users'][0]['avatar']
                }
            });
        }
    }
    else {
        res.status(200).json({
            success: false,
            data: 'OTPDONOTMATCH'
        });
    }
}


exports.saveToken = async (req, res, next) => {
    let pushToken = await PushToken.getByData(req.body['user_id'])
    pushToken = pushToken[0][0];


    if(pushToken[0] == undefined){
        pushToken = pushToken[0][0];
        let newPushToken = new PushToken(req.body['token'], 0, 0, 1, req.body['user_id']);
        newPushToken.save();
    }
    else {
        let updatePushToken = await PushToken.update(req.body['user_id'], req.body['token'])
        console.log(updatePushToken);
    }
    res.json({'status': 'success'})
}



exports.getRestaurantCategorySlider = async (req, res, next) => {
    let slides = await RestaurantCategorySlider.restaurantCategorySlider()
    slides = slides[0];



    for(var i = 0; i < slides.length; i++){
        let newArr = [];
        let resCats = await RestaurantCategory.restaurantCategoryById(JSON.parse(slides[i]['categories_ids']));
        resCats = resCats[0]
        for(var j = 0; j < resCats.length; j++){
            newArr.push({
                'value': parseInt(resCats[j]['id']),
                'label': resCats[j]['name']
            })
        }
        slides[i]['categories_ids'] = newArr;
    }

    res.json(slides)

}



exports.getDeliveryRestaurants = async (req, res, next) => {
    let restaurants = await Restaurant.getActiveRestaurantWithDeliveryAreasAndRatings(1);
    restaurants = restaurants[0].map((res) => res['restaurants']);


    let nearMe = [];
    for(var i = 0; i < restaurants.length; i++){
        restaurants[i]['distance'] = getDistance(req.body['latitude'], req.body['longitude'], restaurants[i]);
        if(restaurants[i]['distance'] <= restaurants[i]['delivery_radius']) {
            nearMe.push(restaurants[i])
        }
    }

    // if(distance)
    // nearMe.sort(function(a,b){return a['distance'] - b['distance']});
    let inactiveRestaurants = await Restaurant.getActiveRestaurantWithDeliveryAreasAndRatings(0);
    inactiveRestaurants = inactiveRestaurants[0].map((res) => res['restaurants']);


    let nearMeInActive = [];
    for(var i = 0; i < inactiveRestaurants.length; i++){
        inactiveRestaurants[i]['distance'] = getDistance(req.body['latitude'], req.body['longitude'], inactiveRestaurants[i]);
        if(inactiveRestaurants[i]['distance'] <= inactiveRestaurants[i]['delivery_radius']) {
            nearMeInActive.push(inactiveRestaurants[i])
        }
    }
    let rest = nearMe.concat(nearMeInActive)
    res.json(rest)
}


exports.getFilteredRestaurants = async (req, res, next) => {
    let restaurants = await Restaurant.getActiveRestaurantWithDeliveryAreasAndRatingsAndCategory(1, req.body['category_ids']);
    restaurants = restaurants[0].map((res) => res['restaurants']);


    let nearMe = [];
    for(var i = 0; i < restaurants.length; i++){
        restaurants[i]['distance'] = getDistance(req.body['latitude'], req.body['longitude'], restaurants[i]);
        if(restaurants[i]['distance'] <= restaurants[i]['delivery_radius']) {
            nearMe.push(restaurants[i])
        }
    }

    // if(distance)
    // nearMe.sort(function(a,b){return a['distance'] - b['distance']});
    let inactiveRestaurants = await Restaurant.getActiveRestaurantWithDeliveryAreasAndRatingsAndCategory(0, req.body['category_ids']);
    inactiveRestaurants = inactiveRestaurants[0].map((res) => res['restaurants']);


    let nearMeInActive = [];
    for(var i = 0; i < inactiveRestaurants.length; i++){
        inactiveRestaurants[i]['distance'] = getDistance(req.body['latitude'], req.body['longitude'], inactiveRestaurants[i]);
        if(inactiveRestaurants[i]['distance'] <= inactiveRestaurants[i]['delivery_radius']) {
            nearMeInActive.push(inactiveRestaurants[i])
        }
    }
    let rest = nearMe.concat(nearMeInActive)
    res.json(rest)
}



exports.getSelfPickupRestaurants = async (req, res, next) => {

    let restaurants = await Restaurant.getActiveSelfPickupRestaurantWithDeliveryAreasAndRatings(1);
    restaurants = restaurants[0].map((res) => res['restaurants']);


    let nearMe = [];
    for(var i = 0; i < restaurants.length; i++){
        restaurants[i]['distance'] = getDistance(req.body['latitude'], req.body['longitude'], restaurants[i]);
        if(restaurants[i]['distance'] <= restaurants[i]['delivery_radius']) {
            nearMe.push(restaurants[i])
        }
    }

    // if(distance)
    // nearMe.sort(function(a,b){return a['distance'] - b['distance']});
    let inactiveRestaurants = await Restaurant.getActiveSelfPickupRestaurantWithDeliveryAreasAndRatings(0);
    inactiveRestaurants = inactiveRestaurants[0].map((res) => res['restaurants']);


    let nearMeInActive = [];
    for(var i = 0; i < inactiveRestaurants.length; i++){
        inactiveRestaurants[i]['distance'] = getDistance(req.body['latitude'], req.body['longitude'], inactiveRestaurants[i]);
        if(inactiveRestaurants[i]['distance'] <= inactiveRestaurants[i]['delivery_radius']) {
            nearMeInActive.push(inactiveRestaurants[i])
        }
    }
    let rest = nearMe.concat(nearMeInActive)
    res.json(rest)
    
}


exports.getFilteredRestaurantsSelfPickup = async (req, res, next) => {
    let restaurants = await Restaurant.getActiveSelfPickupRestaurantWithDeliveryAreasAndRatingsAndCategory(1, req.body['category_ids']);
    restaurants = restaurants[0].map((res) => res['restaurants']);


    let nearMe = [];
    for(var i = 0; i < restaurants.length; i++){
        restaurants[i]['distance'] = getDistance(req.body['latitude'], req.body['longitude'], restaurants[i]);
        if(restaurants[i]['distance'] <= restaurants[i]['delivery_radius']) {
            nearMe.push(restaurants[i])
        }
    }

    // if(distance)
    // nearMe.sort(function(a,b){return a['distance'] - b['distance']});
    let inactiveRestaurants = await Restaurant.getActiveSelfPickupRestaurantWithDeliveryAreasAndRatingsAndCategory(0, req.body['category_ids']);
    inactiveRestaurants = inactiveRestaurants[0].map((res) => res['restaurants']);


    let nearMeInActive = [];
    for(var i = 0; i < inactiveRestaurants.length; i++){
        inactiveRestaurants[i]['distance'] = getDistance(req.body['latitude'], req.body['longitude'], inactiveRestaurants[i]);
        if(inactiveRestaurants[i]['distance'] <= inactiveRestaurants[i]['delivery_radius']) {
            nearMeInActive.push(inactiveRestaurants[i])
        }
    }
    let rest = nearMe.concat(nearMeInActive)
    res.json(rest)
}


exports.googleMapApiList = async (req, res, next) => {
    res.json({
        'mapApiForAndroid': '',
        'mapApiForIos': '',
        'placeApiForAndroid': '',
        'placeApiForIos': '',
        'mapApiForAndroidConfig': '',
        'mapApiForIosConfig': ''
    })
    
}


exports.promoSlider = async (req, res, next) => {
    let mainSlider = await PromoSlider.checkMainSlider();

    let otherPosition = await PromoSlider.checkOtherSlider();

    let availableMainSlides = [];


    if(mainSlider[0].length == 0){
        availableMainSlides = null;
    }
    else {
        mainSlider = mainSlider[0][0];
        mainSlider = await Slide.mainSlider(mainSlider['id'])
        mainSlider = mainSlider[0].map((i) => i['slides'])[0];
        for(var i = 0; i < mainSlider.length; i++){
            let check;
            if(mainSlider[i]['model'] == null){
                check = true;
            }
            if(mainSlider[i]['model'] == 1 && mainSlider[i]['restaurant'] != null){
                check = checkOperation(req.body['latitude'], req.body['longitude'], mainSlider[i]['restaurant']);
                if(check){
                    mainSlider[i]['slug'] = 'stores/' + mainSlider[i]['restaurants']['slug']
                }
            }
            if(mainSlider[i]['model'] == 2 && mainSlider[i]['items'] != null){
                check = checkOperation(req.body['latitude'], req.body['longitude'], mainSlider[i]['item']['restaurant']);
                if(check){
                    mainSlider[i]['slug'] = 'stores/' + mainSlider[i]['item']['restaurants']['slug'] + '/' + mainSlider[i]['item']['id']
                }
            }
            if(mainSlider[i]['model'] == 3){
                if(mainSlider[i]['is_locationset'] == 1){
                    let data = {
                        'latitude': mainSlider[i]['latitude'],
                        'longitude': mainSlider[i]['longitude'],
                        'delivery_radius': mainSlider[i]['radius'],
                        'delivery_areas': []
                    }

                    check = checkOperation(req.body['latitude'], req.body['longitude'], data);

                    if(check){
                        mainSlider[i]['slug'] = mainSlider['url'];
                    }
                }
                else{
                    check = true;
                    if (check) {
                        mainSlider[i]['slug'] = mainSlider['url'];
                    }
                }
            }

            if(check) {
                availableMainSlides.push(mainSlider)
            }
        }
        availableMainSlides = availableMainSlides[0].map((slide) => {
            return {
                data: {
                    id: slide['id'],
                    name: slide['name'],
                    image: slide['image'],
                    model: slide['model']
                },
                url: slide['slug'],
                delivery_type: (slide['restaurants'] != null)?slide['restaurants']['delivery_type']:(slide['items'] != null)?slide['items']['restaurants']['delivery_type']:0,
                promo_slider:{
                    size: slide['promo_sliders']['size']
                }
            }
        })
    }



    let availableOtherSlides = [];


    if(otherPosition[0].length == 0){
        availableOtherSlides = null;
    }
    else {
        otherPosition = otherPosition[0][0];
        otherPosition = await Slide.otherSlider(otherPosition['id'])
        otherPosition = otherPosition[0].map((i) => i['slides'])[0];
        for(var i = 0; i < otherPosition.length; i++){
            let url = null;
            let check;
            if(otherPosition[i]['model'] == null){
                check = true;
            }

            if(otherPosition[i]['model'] == 1 && otherPosition[i]['restaurants'] != null){
                check = checkOperation(req.body['latitude'], req.body['longitude'], otherPosition[i]['restaurants']);
                if(check){
                    otherPosition[i]['slug'] = 'stores/' + otherPosition[i]['restaurants']['slug']
                }
            }

            if(otherPosition[i]['model'] == 2 && otherPosition[i]['items'] != null){
                
                check = checkOperation(req.body['latitude'], req.body['longitude'], otherPosition[i]['items']['restaurants']);
                
                if(check){
                    otherPosition[i]['slug'] = 'stores/' + otherPosition[i]['items']['restaurants']['slug'] + '/' + otherPosition[i]['items']['id']
                }
            }


            if(otherPosition[i]['model'] == 3){
                if(otherPosition[i]['is_locationset'] == 1){
                    let data = {
                        'latitude': otherPosition[i]['latitude'],
                        'longitude': otherPosition[i]['longitude'],
                        'delivery_radius': otherPosition[i]['radius'],
                        'delivery_areas': []
                    }

                    check = checkOperation(req.body['latitude'], req.body['longitude'], data);

                    if(check){
                        otherPosition[i]['slug'] = otherPosition['url'];
                    }
                }
                else{
                    check = true;
                    if (check) {
                        otherPosition[i]['slug'] = otherPosition['url'];
                    }
                }
            }
            // console.log(check);
            if(check) {
                availableOtherSlides.push(otherPosition)
            }
        }

        availableOtherSlides = availableOtherSlides[0].map((slide) => {
            return {
                data: {
                    id: slide['id'],
                    name: slide['name'],
                    image: slide['image'],
                    model: slide['model']
                },
                url: slide['slug'],
                delivery_type: (slide['restaurants'] != null)?slide['restaurants']['delivery_type']:(slide['items'] != null)?slide['items']['restaurants']['delivery_type']:0,
                promo_slider:{
                    size: slide['promo_sliders']['size'],
                    position_id: slide['promo_sliders']['position_id']
                }
            }
        })
    }



    res.json({
        mainSlides: availableMainSlides,
        otherSlides: availableOtherSlides
    })
}


exports.searchRestaurants = async (req, res, next) => {

    let restaurants = await Restaurant.searchRestaurants(req.body['q'])
    restaurants = restaurants[0].map((res) => res['restaurants']);

    nearMeRestaurants = [];

    for(var i = 0; i < restaurants.length; i++){
        let distance = getDistance(req.body['latitude'], req.body['longitude'], restaurants[i]);
        restaurants[i]['distance'] = distance;  

        if(restaurants[i]['distance'] <= restaurants[i]['delivery_radius']) {
            nearMeRestaurants.push(restaurants[i])
        }
    }
    


    let items = await Restaurant.searchItems(req.body['q'])
    items = items[0].map((res) => res['items']);


    let nearMeItems = [];

    for(var i = 0; i < items.length; i++){
        // if(items[i]['restaurant']['is_active'] == 1 && items[i]['restaurant']['is_accepted'] == 1){
            items[i]['restaurant']['distance'] = getDistance(req.body['latitude'], req.body['longitude'], items[i]['restaurant']);

            if(items[i]['restaurant']['distance'] <= items[i]['restaurant']['delivery_radius']) {
                nearMeItems.push(items[i])
            }
        // }
    }


    res.json({
        restaurants: nearMeRestaurants,
        items: nearMeItems
    })
}


exports.searchRestaurantsSelfPickup = async (req, res, next) => {

    let restaurants = await Restaurant.searchRestaurants(req.body['q'])
    restaurants = restaurants[0].map((res) => res['restaurants']);

    nearMeRestaurants = [];

    for(var i = 0; i < restaurants.length; i++){
        let distance = getDistance(req.body['latitude'], req.body['longitude'], restaurants[i]);
        restaurants[i]['distance'] = distance;  

        if(restaurants[i]['distance'] <= restaurants[i]['delivery_radius']) {
            nearMeRestaurants.push(restaurants[i])
        }
    }
    


    let items = await Restaurant.searchItems(req.body['q'])
    items = items[0].map((res) => res['items'][0]);


    let nearMeItems = [];

    for(var i = 0; i < items.length; i++){
        // if(items[i]['restaurant']['is_active'] == 1 && items[i]['restaurant']['is_accepted'] == 1){
            items[i]['restaurant']['distance'] = getDistance(req.body['latitude'], req.body['longitude'], items[i]['restaurant']);

            if(items[i]['restaurant']['distance'] <= items[i]['restaurant']['delivery_radius']) {
                nearMeItems.push(items[i])
            }
        // }
    }


    res.json({
        restaurants: nearMeRestaurants,
        items: nearMeItems
    })
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
                                type: 'EXPIRED', 
                                message: 'Coupon Expired'
                            }
                        );
                    }
                }
                else {
                    console.log("2");
                    res.status(200).json(
                        {
                            success: false,
                            type: 'NOTFORRESTAURANT', 
                            message: 'Coupon not belongs to the Restaurant'
                        }
                    );
                }
            }
            else {
                console.log("3");
                res.status(200).json(
                    {
                        success: false, 
                        type: 'INACTIVE', 
                        message: 'Inactive Coupon'
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
                type: 'USERNOTEXIST', 
                message: 'User Not Exist'
            }
        );
    }
}



exports.checkCartItemsAvailability = async (req, res, next) => {
    let idsArr = req.body['items'].map((item) => item['id']);

    let cartItems = await Item.cartItems(idsArr);
    cartItems = cartItems[0];

    res.json(cartItems)


}


exports.setDefaultAddress = async (req, res, next) => {
    if(req.body['user_id'] != null){
        let user = await User.updateDefaultAddress(req.body['user_id'],req.body['address_id']);

        let addresses = await Address.getAddressesByUserId(req.body['user_id'])

        res.status(200).json(addresses[0]);

    }
    else {
        res.status(401).json({success: false});
    }
}


exports.deleteAddress = async (req, res, next) => {
    if(req.body['user_id'] != null){
        let address = await Address.deleteAddress(req.body['user_id'], req.body['address_id']);
        if(address[0]['affectedRows'] != 0){
            let addresses = await Address.getAddressesByUserId(req.body['user_id'])
            res.status(200).json(addresses[0]);
        }
        else {
            res.status(401).json({success: false});
        }
    }
    else {
        res.status(401).json({success: false});
    }
}


exports.changeAvatar = async (req, res, next) => {
    let user = await User.updateAvatar(req.body['user_id'],req.body['avatar']);

    if(user[0]['affectedRows'] != 0){
        res.status(201).json({success: true});
    }
    else {
        res.status(401).json({success: false});
    }

}


exports.getPages = async (req, res, next) => {
    let pages = await User.getPages();

    res.status(200).json(pages);

}


exports.getRestaurantInfoAndOperationalStatus = async (req, res, next) => {
    let restaurant = await Restaurant.getRestaurantById(req.body['id']);
    restaurant = restaurant[0][0];
    let settings = await Settings.settingsByIds([522, 523, 524, 525, 526]);
    settings = settings[0];


    restaurant['rainCharge'] = settings[0]['value'];
    restaurant['extraCharge'] = settings[1]['value'];
    restaurant['rainChargeAmount'] = settings[2]['value'];
    restaurant['extraChargeAmount'] = settings[3]['value'];
    restaurant['extraChargeTitle'] = settings[4]['value'];
    // $restaurant->avgRating = storeAvgRating($restaurant->ratings);
    restaurant['distance'] = getDistance(req.body['latitude'], req.body['longitude'], restaurant);
    let is_operational = false;
    if(restaurant['distance'] <= restaurant['delivery_radius']) {
        is_operational = true;
    }
    restaurant['is_operational'] = is_operational;

    res.status(200).json(restaurant);


}


exports.saveAddress = async (req, res, next) => {
    if(req.body['user_id'] != null){
        let address = new Address(req.body['user_id'], req.body['address'], req.body['house'], req.body['landmark'], req.body['tag'], req.body['latitude'], req.body['longitude'])

        address = await address.saveAddress();

        let user = await User.updateDefaultAddress(req.body['user_id'],address[0]['insertId'])

        if(req.body['get_only_default_address'] != null) {
            address = await Address.getAddressId(address[0]['insertId']);
            res.status(200).json(address[0][0]);
        }
        else{
            let addresses = await Address.getAddressesByUserId(req.body['user_id'])
            res.status(200).json(addresses[0][0]);
        }
    }
    else {
        res.status(401).json({success: false});
    }
}


exports.updateUserInfo = async (req, res, next) => {
    let user = await User.findByIdWithBalance(req.body['user_id'])
    user = user[0][0]['users'];

    let default_address;
    if(user['default_address_id'] != 0){
        default_address = await Address.getAddressId(user['default_address_id']);
        default_address = default_address[0][0]
    }
    else {
        default_address = null;
    }
    let running_order;
    if(req.body['unique_order_id'] != null){
        running_order = await Orders.runningOrders(user['id'], req.body['unique_order_id']);
        if(running_order[0].length != 0){
            running_order[0][0];
        }
        else{
            running_order = null;
        }
    }
    else{
        running_order = null;
    }


    let delivery_details = null;
    if(running_order != null){
        if(running_order['orderstatus_id'] == 3 || running_order['orderstatus_id'] == 4){
            let delivery_guy = await AcceptDeliveries.findByOrderID(running_order['id']);
            if(delivery_guy[0].length != 0){
                delivery_guy = delivery_guy[0][0];
                let delivery_user = await User.findByIdWithDelivery(delivery_guy['user_id'])
                delivery_user = delivery_user[0][0];
                delivery_details = delivery_user['delivery_guy_detail'];
                if(delivery_details != null){
                    delivery_details['phone'] = delivery_user['phone'];
                }
                let ratings = await Ratings.getAvgRatingsById(delivery_user['id']);
                delivery_details['rating'] = ratings[0][0]['rating'];
            }
        }
    }
   
    // let delivery_user = await Ratings.getAvgRatingsById(36)

    // res.json(user)
    res.json({
        'success': true,
        'data': {
            'id': user['id'],
            'auth_token': user['auth_token'],
            'name': user['name'],
            'email': user['email'],
            'phone': user['phone'],
            'default_address_id': user['default_address_id'],
            'default_address': default_address,
            'delivery_pin': user['delivery_pin'],
            'wallet_balance': user['wallet_balance'],
            'avatar': user['avatar'],
            'tax_number': user['tax_number']
        },
        'running_order': running_order,
        'delivery_details': delivery_details,
    })
}


exports.getWalletTransactions = async (req, res, next) => {
    let balance = await Wallets.userBalance(req.body['user_id'])
    balance = balance[0][0]['balance'];
    let transactions = await Transactions.getTransactionById(req.body['user_id'])
    transactions = transactions[0];
    res.json({
        'success': true,
        'balance': balance,
        'transactions': transactions
    })
}


exports.getRestaurantItemsSearch = async (req, res, next) => {
    let items = await Item.getItemsForSearch(req.body['id'])
    items = items[0].map((item) => item['items'])
    let array = {};
    for(var i = 0; i < items.length; i++){
        let array1 = [];
        items.map((j) => {
            if(j['category_name'] == items[i]['category_name'])
            array1.push(j);
        })
        array[items[i]['category_name']] = array1;
    }

    res.json({
        "items": array
    })
}


exports.getRestaurantItemsVeg = async (req, res, next) => {
    let items = await Item.getItemsForVeg(req.body['id'])
    items = items[0].map((item) => item['items'])

    let array = {};
    for(var i = 0; i < items.length; i++){
        let array1 = [];
        items.map((j) => {
            if(j['category_name'] == items[i]['category_name'])
            array1.push(j);
        })
        array[items[i]['category_name']] = array1;
    }

    res.json({
        "items": array
    })
}

exports.getRestaurantItems = async (req, res, next) => {
    let items = await Item.getItems(req.body['id'])
    items = items[0].map((item) => item['items'])

    let array = {};
    for(var i = 0; i < items.length; i++){
        let array1 = [];
        items.map((j) => {
            if(j['category_name'] == items[i]['category_name'])
            array1.push(j);
        })
        array[items[i]['category_name']] = array1;
    }

    res.json({
        "items": array
    })
}


exports.getRestaurantInfoWithFavourite = async (req, res, next) => {   ////Not Completed
    let restaurantInfo = await Restaurant.getRestaurantById(req.body['id']);
    restaurantInfo = restaurantInfo[0][0];
    res.json(restaurantInfo)
}



exports.getUserNotifications = async (req, res, next) => {
    let notifications = await Alert.getUserNotifications(req.body['id'])
    notifications = notifications[0];
    res.json(notifications)

}


exports.getOrders = async (req, res, next) => {
    let orders = await Orders.ordersWithPagination(req.body['user_id'], req.body['start'], req.body['limit']);
    orders = orders[0].map((i)=> i['orders'])
    res.json(orders)
}



exports.cancelOrder = async (req, res, next) => {
    let order = await Orders.getOrderByID(req.body['order_id']);
    order = order[0][0];

    let restaurant = await Restaurant.getRestaurantById(order['restaurant_id']);
    restaurant = restaurant[0][0];

    if(order['user_id'] == req.body['user_id']){ // && order['orderstatus_id'] == 1

        let refund = false;


        if(order['payment_mode'] == 'COD'){
            if(order['wallet_amount'] != null) {
                deposit(order['total'] * 100, `{"description": "Partial Refund for order cancellation: ${order['unique_order_id']}"}`, order['unique_order_id'], req.body['user_id'])
                refund = true;
            }
        }
        else {
            deposit(order['total'] * 100, `{"description": "Refund for order cancellation: ${order['unique_order_id']}"}`, order['unique_order_id'], req.body['user_id'])
            refund = true;
        }

        let updateOrder = await Orders.updateOrderStatus(req.body['order_id'], 6);
        

        //throw notification to user


        res.json({
            "success": true,
            "refund": refund
        })
    }
    else {
        res.json({
            "success": false,
            "refund": false
        })
    }
}



exports.placeOrder = async (req, res, next) => {

    let newOrder = {};

    let lastOrder = await Orders.lastOrder();
    lastOrder = lastOrder[0][0]
    const hashids = new Hashids()
    let newId = lastOrder['id'] + 1;
    let uniqueId = hashids.encode(newId).toUpperCase();
    let date = (new Date()).getMonth() + "-" + (new Date()).getDate()
    let randomNumber = Math.random().toString(36).substr(2, 4).toUpperCase();
    
    let balance = await Wallets.userBalance(req.body['user_id'])
    balance = balance[0][0]['balance'];
    
    let unique_order_id = 'OD-' + date + "-" + randomNumber + "-" + uniqueId;
    newOrder['unique_order_id'] = unique_order_id;

    let restaurant_id = req.body['order'][0]['restaurant_id']

    let restaurant = await Restaurant.getRestaurantById(restaurant_id)
    restaurant = restaurant[0][0];

    newOrder['user_id'] = req.body['user_id'];

    if(req.body['pending_payment'] || req.body['PAYTM']) {
        newOrder['orderstatus_id'] = '8';
    } else if (restaurant['auto_acceptable']){
        newOrder['orderstatus_id'] = '2';
        //smsToDelivery
        //sendPushNotification USER
    } else {
        newOrder['orderstatus_id'] = '1';
    }
    newOrder['location'] = JSON.stringify(req.body['location']);
    newOrder['address'] = req.body['user']['data']['default_address']['house'] + ', ' + req.body['user']['data']['default_address']['address'];

    newOrder['restaurant_charge'] = restaurant['restaurant_charges']
    newOrder['transaction_id'] = req.body['payment_token']

    let orderTotal = 0;

    for(var i = 0; i < req.body['order'].length; i++){
        let originalItem = await Item.getItemByID(req.body['order'][i]['id']);
        originalItem = originalItem[0][0];
        orderTotal += (originalItem['price'] * req.body['order'][i]['quantity']);

        if(req.body['order'][i]['selectedaddons'] != null){
            for(var j = 0; j < req.body['order'][i]['selectedaddons'].length; j++){
                let addon = await Addon.getAddonByID(req.body['order'][i]['selectedaddons'][j]['addon_id']);
                if(addon[0] != undefined){
                    addon = addon[0][0];
                    orderTotal += (addon['price'] * req.body['order'][i]['quantity']);
                }
            }
        }
    }
    newOrder['sub_total'] = orderTotal;

    if(req.body['coupon'] != undefined){
        let coupon = await Coupon.getCouponWithCode(req.body['coupon']['code']);
        if(coupon[0] != undefined){
            coupon = coupon[0][0];
            newOrder['coupon_name'] = req.body['coupon']['code'];
            if(coupon['discount_type'] == 'PERCENTAGE') {
                let percentage_discount = ((coupon['discount'] / 100) * orderTotal);
                if(coupon['max_discount'] != null){
                    if(percentage_discount >= coupon['max_discount']){
                        percentage_discount = coupon['max_discount'];
                    }
                }
                newOrder['coupon_amount'] = percentage_discount;
                orderTotal = orderTotal - percentage_discount;

            }
            if(coupon['discount_type'] == 'AMOUNT') {
                newOrder['coupon_amount'] = coupon['discount'];
                orderTotal = orderTotal - coupon['discount'];
            }
            coupon['count'] = coupon['count'] + 1;
            newOrder['coupon_isrestaurant'] = coupon['is_restaurant'];
            let updateCoupon = await Coupon.updateCouponCount(coupon['id'], coupon['count'] + 1)
        }
    }


    if(req.body['delivery_type'] == 1){
        if(restaurant['delivery_charge_type'] == 'DYNAMIC'){
            // let distance = getDistance(req.body['user']['data']['default_address']['latitude'], req.body['user']['data']['default_address']['longitude'], restaurant);
            let distance = req.body['dis'];

            //get metrix distance
            if(distance > restaurant['base_delivery_distance']){
                let extraDistance = distance - restaurant['base_delivery_distance'];
                let extraCharge = extraDistance / restaurant['extra_delivery_distance'] * restaurant['extra_delivery_charge'];
                let dynamicDeliveryCharge = restaurant['base_delivery_charge'] + extraCharge;
                // round all charges
                newOrder['delivery_charge'] = dynamicDeliveryCharge;
                orderTotal = orderTotal + dynamicDeliveryCharge;

            }
            else {
                newOrder['delivery_charge'] = restaurant['base_delivery_charge'];
                orderTotal = orderTotal + restaurant['base_delivery_charge']
            }
        }
        else{
            newOrder['delivery_charge'] = restaurant['delivery_charges'];
            orderTotal = orderTotal + restaurant['delivery_charges']
        }
    }
    else {
        newOrder['delivery_charge'] = 0;
    }

    orderTotal = orderTotal + restaurant['restaurant_charges'];

    let taxAmount = 0;
    // Commen Tax Amount

    newOrder['tax_amount'] = taxAmount;
    newOrder['restaurant_tax'] = req.body['store_tax'];

    orderTotal = orderTotal + taxAmount;

    if(req.body['tipAmount'] != null && req.body['tipAmount'] != undefined){
        orderTotal = orderTotal + req.body['tipAmount'];
    }
    if(req.body['store_tax'] != null && req.body['store_tax'] != undefined){
        orderTotal = orderTotal + req.body['store_tax'];
    }

    let setting = await Settings.settingsByIds([526])

    newOrder['extra_title'] = setting[0][0]['value'];
    newOrder['rain_charge'] = req.body['rain_charge_amount'];
    newOrder['extra_charge'] = req.body['extra_charge_amount'];

    if(req.body['rain_charge_amount'] != null && req.body['rain_charge_amount'] != undefined){
        orderTotal = orderTotal + req.body['rain_charge_amount'];
    }
    if(req.body['extra_charge_amount'] != null && req.body['extra_charge_amount'] != undefined){
        orderTotal = orderTotal + req.body['extra_charge_amount'];
    }

    if(req.body['method'] == 'COD'){
        if(req.body['partial_wallet'] == true) {
            newOrder['payable'] = orderTotal - balance;//user wallet
        }

        if(req.body['partial_wallet'] == false) {
            newOrder['payable'] = orderTotal;
        }
    }

    newOrder['total'] = orderTotal;
    newOrder['order_comment'] = req.body['order_comment'];
    newOrder['payment_mode'] = req.body['method'];
    newOrder['restaurant_id'] = req.body['order'][0]['restaurant_id'];
    newOrder['tip_amount'] = req.body['tipAmount'];

    if(req.body['delivery_type'] = 1) {
        newOrder['delivery_type'] = 1;
    }
    else{
        newOrder['delivery_type'] = 2;
    }


    newOrder['cash_change_amount'] = req.body['cash_change_amount'] ? req.body['cash_change_amount'] : null;

    let delivery_pin = Math.floor(Math.random() * (999999 - 100000) ) + 100000;

    let updateUser = await User.updateDeliveryPin(req.body['id'], delivery_pin);

    if(req.body['method'] == 'PAYTM'){
        //successfuly received payment
        newOrder['online_payment_status'] = "";
        // save newOrder
        if(req.body['partial_wallet'] == true) {
            newOrder['wallet_amount'] = balance;
            let saveOrder = new Orders(newOrder['unique_order_id'], newOrder['orderstatus_id'], newOrder['user_id'], newOrder['coupon_name'], newOrder['location'], newOrder['address'], 
            newOrder['tax_amount'], newOrder['restaurant_charge'], newOrder['delivery_charge'], newOrder['total'], newOrder['payment_mode'], newOrder['order_comment'], newOrder['restaurant_id'], 
            newOrder['transaction_id'], newOrder['delivery_type'], newOrder['payable'], newOrder['wallet_amount'], newOrder['tip_amount'], newOrder['tax_amount'], newOrder['coupon_amount'], 
            newOrder['coupon_isrestaurant'], newOrder['sub_total'], newOrder['cash_change_amount'], newOrder['restaurant_tax'], newOrder['online_payment_status'], newOrder['rain_charge'], 
            newOrder['extra_charge'], newOrder['extra_title']);
            saveOrder.save();

            
            withdrawal(balance * 100, `"description": "Partial payment for order: ${newOrder['unique_order_id']}"`, newOrder['user_id']);
        }
        else{
            newOrder['wallet_amount'] = null;
            let saveOrder = new Orders(newOrder['unique_order_id'], newOrder['orderstatus_id'], newOrder['user_id'], newOrder['coupon_name'], newOrder['location'], newOrder['address'], 
            newOrder['tax_amount'], newOrder['restaurant_charge'], newOrder['delivery_charge'], newOrder['total'], newOrder['payment_mode'], newOrder['order_comment'], newOrder['restaurant_id'], 
            newOrder['transaction_id'], newOrder['delivery_type'], newOrder['payable'], newOrder['wallet_amount'], newOrder['tip_amount'], newOrder['tax_amount'], newOrder['coupon_amount'], 
            newOrder['coupon_isrestaurant'], newOrder['sub_total'], newOrder['cash_change_amount'], newOrder['restaurant_tax'], newOrder['online_payment_status'], newOrder['rain_charge'], 
            newOrder['extra_charge'], newOrder['extra_title']);
            saveOrder.save();
        }
        let orderID = await Orders.getorderByUniqueOrderID(newOrder['unique_order_id'])
        orderID = orderID[0][0];
        newOrder['id'] = orderID['id'];
        for(var i = 0; i < req.body['order'].length; i++){
            let item = {};
            item['order_id'] = orderID['id'];
            item['item_id'] = req.body['order'][i]['id'];
            item['name'] = req.body['order'][i]['name'];
            item['quantity'] = req.body['order'][i]['quantity'];
            item['price'] = req.body['order'][i]['price'];
            let newOrderItem = await OrderItem.save(item);
            newOrderItem = await OrderItem.getOrderItemByID(newOrderItem[0]['insertId']);
            newOrderItem = newOrderItem[0][0];
            for(var j = 0; j < req.body['order'][i]['selectedaddons'].length; j++){
                let addon = {};
                addon['orderitem_id'] = newOrderItem['id'];
                addon['addon_category_name'] = req.body['order'][i]['selectedaddons'][j]['addon_category_name'];
                addon['addon_name'] = req.body['order'][i]['selectedaddons'][j]['addon_name'];
                addon['addon_price'] = req.body['order'][i]['selectedaddons'][j]['addon_price'];
                let newAddon = await Addon.save(item);
            }
        }


        //push-to-restaurant
        //push-to-delivery
        //push-to-delivery-owners

        res.json({
            success: true,
            data: newOrder
        });



    }

    else {
        if(req.body['method'] == 'COD') {
            if(req.body['partial_wallet'] == true) {
                newOrder['wallet_amount'] = balance;
                let saveOrder = new Orders(newOrder['unique_order_id'], newOrder['orderstatus_id'], newOrder['user_id'], newOrder['coupon_name'], newOrder['location'], newOrder['address'], 
                newOrder['tax_amount'], newOrder['restaurant_charge'], newOrder['delivery_charge'], newOrder['total'], newOrder['payment_mode'], newOrder['order_comment'], newOrder['restaurant_id'], 
                newOrder['transaction_id'], newOrder['delivery_type'], newOrder['payable'], newOrder['wallet_amount'], newOrder['tip_amount'], newOrder['tax_amount'], newOrder['coupon_amount'], 
                newOrder['coupon_isrestaurant'], newOrder['sub_total'], newOrder['cash_change_amount'], newOrder['restaurant_tax'], newOrder['online_payment_status'], newOrder['rain_charge'], 
                newOrder['extra_charge'], newOrder['extra_title']);
                saveOrder.save();
    
                
                withdrawal(balance * 100, `"description": "Partial payment for order: ${newOrder['unique_order_id']}"`, newOrder['user_id']);
            }
            else{
                newOrder['wallet_amount'] = null;
                let saveOrder = new Orders(newOrder['unique_order_id'], newOrder['orderstatus_id'], newOrder['user_id'], newOrder['coupon_name'], newOrder['location'], newOrder['address'], 
                newOrder['tax_amount'], newOrder['restaurant_charge'], newOrder['delivery_charge'], newOrder['total'], newOrder['payment_mode'], newOrder['order_comment'], newOrder['restaurant_id'], 
                newOrder['transaction_id'], newOrder['delivery_type'], newOrder['payable'], newOrder['wallet_amount'], newOrder['tip_amount'], newOrder['tax_amount'], newOrder['coupon_amount'], 
                newOrder['coupon_isrestaurant'], newOrder['sub_total'], newOrder['cash_change_amount'], newOrder['restaurant_tax'], newOrder['online_payment_status'], newOrder['rain_charge'], 
                newOrder['extra_charge'], newOrder['extra_title']);
                saveOrder.save();
            }
        }

        if(req.body['method'] == 'WALLET'){
            newOrder['wallet_amount'] = orderTotal;
            let saveOrder = new Orders(newOrder['unique_order_id'], newOrder['orderstatus_id'], newOrder['user_id'], newOrder['coupon_name'], newOrder['location'], newOrder['address'], 
                newOrder['tax_amount'], newOrder['restaurant_charge'], newOrder['delivery_charge'], newOrder['total'], newOrder['payment_mode'], newOrder['order_comment'], newOrder['restaurant_id'], 
                newOrder['transaction_id'], newOrder['delivery_type'], newOrder['payable'], newOrder['wallet_amount'], newOrder['tip_amount'], newOrder['tax_amount'], newOrder['coupon_amount'], 
                newOrder['coupon_isrestaurant'], newOrder['sub_total'], newOrder['cash_change_amount'], newOrder['restaurant_tax'], newOrder['online_payment_status'], newOrder['rain_charge'], 
                newOrder['extra_charge'], newOrder['extra_title']);
                saveOrder.save();
        }

        let orderID = await Orders.getorderByUniqueOrderID(newOrder['unique_order_id'])
        orderID = orderID[0][0];
        newOrder['id'] = orderID['id'];
        for(var i = 0; i < req.body['order'].length; i++){
            let item = {};
            item['order_id'] = orderID['id'];
            item['item_id'] = req.body['order'][i]['id'];
            item['name'] = req.body['order'][i]['name'];
            item['quantity'] = req.body['order'][i]['quantity'];
            item['price'] = req.body['order'][i]['price'];
            let newOrderItem = await OrderItem.save(item);
            newOrderItem = await OrderItem.getOrderItemByID(newOrderItem[0]['insertId']);
            newOrderItem = newOrderItem[0][0];
            for(var j = 0; j < req.body['order'][i]['selectedaddons'].length; j++){
                let addon = {};
                addon['orderitem_id'] = newOrderItem['id'];
                addon['addon_category_name'] = req.body['order'][i]['selectedaddons'][j]['addon_category_name'];
                addon['addon_name'] = req.body['order'][i]['selectedaddons'][j]['addon_name'];
                addon['addon_price'] = req.body['order'][i]['selectedaddons'][j]['addon_price'];
                let newAddon = await Addon.save(item);
            }
        }


        //push-to-restaurant
        //push-to-delivery
        //push-to-delivery-owners

        res.json({
            success: true,
            data: newOrder
        });
    }
}


exports.rateOrder = async (req, res, next) => {
    let order = await Orders.getOrderByID(req.body['order_id'])
    order = order[0][0]

    if(order['orderstatus_id'] == 5){
        let rating = await Ratings.getRatingsByOrderId(order['id'])

        let accept_delivery = await AcceptDeliveries.findByOrderID(order['id'])
        accept_delivery = accept_delivery[0][0]
        if(rating[0].length == 0) {
            let newOrder = new Ratings(req.body['user_id'], order['id'], order['restaurant_id'], accept_delivery['user_id'], req.body['rating_store'], req.body['rating_delivery'], req.body['review_store'], req.body['review_delivery'])
            newOrder = await newOrder.save();
            res.json({
                'success': true
            })
        }
        else{
            res.json({
                'success': false,
                'message': 'ALREADYEXIST'
            })
        }
    }
    else{
        res.json({
            'success': false,
            'message': 'ORDERNOTCOMPLETED'
        })
    }
}


exports.editUser = async (req, res, next) => {
    let updateUser = await User.updateUser(req.body['user_id'], req.body['email'], req.body['name']);
    res.json({
        'success': true
    })
}



exports.register = async (req, res, next) => {
    let checkEmail = await User.checkEmail(req.body['email'])
    let checkPhone = await User.checkPhone(req.body['phone'])
   
    let delivery_pin = Math.floor(Math.random() * (999999 - 100000) ) + 100000;


    if(checkEmail[0].length == 0 && checkPhone[0].length == 0){
        let newUser = new User(req.body['name'], req.body['email'], "", null, null, req.body['phone'], delivery_pin, req.body['avatar'], req.body['user_ip']);
        newUser = await newUser.save();
        console.log(newUser);
        let user = await User.getUserByPhone(req.body['phone']);
        user = user[0][0];
        res.json({
            'success': true,
            'data': user
        });
    }
    else{
        res.json({
            'success': false,
            'message': 'EMAILPHONEEXIST'
        });
    }
}


exports.blockedUser = async (req, res, next) => {
    let user = await User.findById(req.body['id']);

    if($user[0] == undefined){
        res.json({
            is_active: 1
        })
    } 
    else{
        user = user[0][0];
        user['msg'] = "This number is blocked by Admin";
        res.json(user)
    }
}
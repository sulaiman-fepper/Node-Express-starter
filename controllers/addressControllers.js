const Address = require("../models/Address");
const Restaurant = require("../models/Restaurant");
const User = require("../models/User");



function deg2rad(degrees){
  var pi = Math.PI;
  return degrees * (pi/180);
}


function checkOperation(latitudeFrom, longitudeFrom, restaurant){
    let latFrom = deg2rad(latitudeFrom);
    let lonFrom = deg2rad(longitudeFrom);
    let latTo = deg2rad(restaurant['latitude']);
    let lonTo = deg2rad(restaurant['longitude']);

    let latDelta = latTo - latFrom;
    let lonDelta = lonTo - lonFrom;
    let angle = 2 * Math.asin(Math.sqrt(Math.pow(latDelta / 2), 2) + Math.cos(latFrom) * Math.cos(latTo) * Math.pow(Math.sin(lonDelta / 2), 2));


    let distance = angle * 6371;
    if (distance <= restaurant['delivery_radius']) {
        return true;
    } else {
        return false;
    }
}



exports.getAddresses = async (req, res, next) => {


    if(req.body['user_id'] != null){
        let addresses = await Address.getAddressesByUserId(req.body['user_id']);

        if(req.body['restaurant_id'] != null) {
            let restaurant = await Restaurant.getRestaurantById(req.body['restaurant_id']);
            if(restaurant.length != 0){
                let checkedAddress = [];

                addresses[0].forEach(address => {
                    let check = checkOperation(address.latitude, address.longitude, restaurant[0][0]);
                    if (check) {
                        address.is_operational = 1;
                        checkedAddress.push(address);
                    } else {
                        address.is_operational = 0;
                        checkedAddress.push(address);
                    }
                });
                res.status(200).json({checkedAddress});
            }
        }
    }
}


exports.saveAddress = async (req, res, next) => {
    if(req.body['user_id'] != null){
        let address = new Address(req.body['user_id'], req.body['address'], req.body['house'], req.body['landmark'], req.body['tag'], req.body['latitude'], req.body['longitude'])

        address = await address.saveAddress();

        let user = await User.updateDefaultAddress(req.body['user_id'],address[0]['insertId'])

        if(req.body['get_only_default_address'] != null) {
            address = await Address.getAddressId(address[0]['insertId']);
            res.status(200).json(address[0]);
        }
        else{
            let addresses = await Address.getAddressesByUserId(req.body['user_id'])
            res.status(200).json(addresses[0]);
        }
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
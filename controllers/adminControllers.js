const Orders = require("../models/Orders");
const PromoSlider = require("../models/PromoSlider");
const PromoSliders = require("../models/PromoSliders");
const Restaurant = require("../models/Restaurant");
const User = require("../models/User")



exports.dashboard = async (req, res, next) => {
    let displayUsers = await User.count();
    displayUsers = displayUsers[0][0]['count'];

    let displayRestaurants = await Restaurant.count()
    displayRestaurants = displayRestaurants[0][0]['count'];

    let displayTodaysSales = await Orders.displayTodaysSales()
    displayTodaysSales = displayTodaysSales[0];
    let displayEarnings = 0;
    displayTodaysSales.map((index) => {
        displayEarnings = displayEarnings + parseInt(index['total']);
    })

    let orders = await Orders.ordersWith10()
    orders = orders[0];


    let users = await User.find9()
    users = users[0];


    res.status(200).json({
        'displayUsers': displayUsers,
        'displayRestaurants': displayRestaurants,
        'displaySales': displayTodaysSales.length,
        'displayEarnings': displayEarnings,
        'orders': orders,
        'users': users
    })
}




exports.updateSlider = async (req, res, next) => {
    try { 
        let promoslider_Id = req.body['id'];
        let name = req.body['name'];
        let position_id = req.body['position_id']
        let size = req.body['size']
        //let [getbyId] = await PromoSliders.getbyId(promoslider_Id);
        let Slider = await PromoSlider.updatePromoSlider(promoslider_Id, name, position_id, size);
        if (Slider[0]['affectedRows'] > 0) {
            res.json({ success: "true" });
        }
    } catch (error) {
        console.log(error);
    }
};




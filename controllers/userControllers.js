const User = require("../models/User");

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

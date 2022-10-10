const User = require("../models/user");
const Order = require("../models/order");


exports.getUserById = (req,res,next,id) => {
    User.findById(id).exec((err,user) => {
        if(err || !user){
            return res.status(400).json({
                error: "No user was found in DB"
            })
        }
        req.profile = user;
        next();
    })
}

exports.getUser = (req,res) => {
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    return res.json(req.profile)
}

exports.updateUser = (req,res) =>{
    User.findByIdAndUpdate(
        {_id : req.profile._id},
        {$set : req.body},
        {new : true, useFindAndModify: false},
        (err,user) => {
            if(err){
                return res.status(400).json({
                    error : "You are not authorized to update this user"
                })
            }
            user.salt = undefined;
            user.encry_password = undefined;
            user.createdAt = undefined;
            user.updatedAt = undefined;
            res.json(user)
        }
    )
}


exports.userPurchaseList = (req,res) => {
    Order.find({user: req.profile._id})
    .populate("user","_id name")
    .exec((err, order) => {
        if(err){
            return res.status.json({
                error : "No Order in this account"
            })
        }
        return res.json(order);
    })
}

exports.pushOrderInPurcahaseList = (req,res,next) => {
    
    let purchases = []
    //console.log(req.body.order.products);
    req.body.order.products.forEach(prod =>{
        //console.log(prod);
        purchases.push({
            _id: prod._id,
            name: prod.name,
            description: prod.description,
            category: prod.category,
            quantity: prod.quantity,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id
        })
    })

    //console.log(purchases)
    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$push: {purchase: purchases}},
        {new: true,useFindAndModify: false},
        (err,purchases) => {
            if(err){
                console.log(err)
                return res.status(400).json({
                    error:"Unable to save purchase list"
                })
            }
            next();
        }
    )
}
const {Order, ProductCart} = require("../models/order")
var ObjectID = require('mongodb').ObjectID;

// In your request

 // Filter
exports.getOrderById = (req,res,next,id) => {
    Order.findById(id)
    .populate("products.product","name price")
    .exec((err,order)=>{
        if(err){
            return res.status(400).json({
                error: "No order found in DB"
            })
        }
        req.order = order;
        next();
    })
}

exports.createOrder = (req,res) => {
    req.body.order.user = req.profile;
    const order = new Order(req.body.order)
    order.save((err,order) => {
        
        if(err){
            
            return res.status(400).json({
                error: "Failed to save your order in DB"
            })
        }
        res.json(order);
    })
}

exports.getAllOrders = (req,res) => {
    Order.find()
          .populate("user","_id name")
          .exec((err,order) => {
              if(err){
                  return res.status(400).json({
                      error:"No orders found in DB"
                  })
              }
              res.json(order);
          })
}


exports.getOrderStatus = (req,res) => {
    res.json(Order.schema.path("status").enumValues)
}


exports.updateStatus = (req,res) => {

    console.log(req);
 Order.updateOne(
    //  {"_id": req.body.orderId},
    { "_id": req.order._id},
     {$set: {"status": req.body.status}},
     (err,order) => {
        console.log(req.body)
         if(err){
            console.log(err)
             return res.status(400).json({
                 error: "Cannot update order status"
             })
         }
         res.json(order);
     }
 )
}
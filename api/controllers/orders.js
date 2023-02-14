const Order = require("../models/orders");
const Product = require("../models/products");
const mongoose = require("mongoose");

exports.ordersGetAll = (req, res, next) => {
    Order.find().populate('product', "name _id").exec()
        .then(docs => {
            const response = {
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        product: doc.product,
                        quantity: doc.quantity,
                        _id: doc._id,
                        request: {
                            type: "GET",
                            description: "For more info about an order",
                            url: "http://localhost:3000/orders/" + doc._id
                        }
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error : err
            });
        });
};

exports.ordersPost = (req, res, next) => {
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
    });

    order.save()
        .then(doc => {
            console.log(doc);
            res.status(201).json({
                message : "Order Posted Successfully",
                order : {
                    product : doc.product,
                    quantity : doc.quantity,
                    _id : doc._id
                },
                request : {
                    type : "GET",
                    description : "For more info about the order",
                    url : "http://localhost:3000/orders/" + doc._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.ordersGetById = (req, res, next) => {
    const id = req.params.id;
    Order.findById(id)
    .select("product quantity _id")
    .populate('product')
    .then(doc => {
        if(doc){
            res.status(200).json({
                product : doc.product,
                quantity : doc.quantity,
                _id : doc._id,
                request : {
                    type : "GET",
                    description : "For more info about all the products",
                    url : "http://localhost:3000/orders/"
                }
            });
        }
        else{
            res.status(404).json({
                message : "No such Order found"
            });
        }
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error : err
        })
    });
};

exports.orderDelete =  (req, res, next) => {
    const id = req.params.id;
    Order.findByIdAndDelete(id)
    .exec()
    .then(doc => {
        res.status(200).json({
            message : "Order deleted Successfully",
            order: doc
        })
    }
    )
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        })
    })
};

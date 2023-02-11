var express = require("express");
var router = express.Router();
var mongoose = require("mongoose")
var Order = require("../models/orders");

router.get("/", (req, res, next) => {
    Order.find().populate('product', "name _id").exec()
        .then(docs => {
            var response = {
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
});

router.post("/", (req, res, next) => {
    var order = new Order({
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
});

router.get("/:id", (req, res, next) => {
    var id = req.params.id;
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
});

router.delete("/:id", (req, res, next) => {
    var id = req.params.id;
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
});

module.exports = router;



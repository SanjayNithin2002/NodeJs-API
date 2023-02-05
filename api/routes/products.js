var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();
var Product = require("../models/products");

router.get('/', (req, res, next) => {
    Product.find()
    .exec()
    .then(docs => {
        console.log("GET REQUEST\n", docs);
        res.status(200).json(docs);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        })
    });
});


router.post('/', (req, res, next) => {
    var product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price

    });

    product.save()
        .then(result => {
            console.log("New Object Created\n", result);
            res.status(201).json({
                message: "Handling POST request for /products",
                createdProduct: product
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error : err
            });
        });

    
});



router.get("/:id", (req, res, next) => {
    var id = req.params.id;
    Product.findById(id)
        .exec()
        .then(doc => {
            console.log("Fetched from Database\n", doc);
            if(doc){
                res.status(200).json(doc);
            }else{
                res.status(404).json({
                    message : "No record found for the given id"
                })
            }
            
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error : err
            });
        });
});


router.delete("/:id", (req, res, next) => {
    var id = req.params.id;
    Product.findByIdAndDelete(id)
    .exec()
    .then(doc => {
        console.log(doc);
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(404).json({
                error : {
                    message : "No such record found"
                }
            })
        }
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        })
    })

});


router.patch("/:id", (req, res, next) => {
    var id = req.params.id;
    var updateOps = {};
    for(var ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({_id : id}, {$set : updateOps})
    .exec()
    .then(doc => {
        console.log(doc);
        res.status(200).json(doc)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        })
    })
});

module.exports = router;
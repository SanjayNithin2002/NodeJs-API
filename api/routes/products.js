var express = require("express");
var mongoose = require("mongoose");
var multer = require("multer");
var router = express.Router();
var Product = require("../models/products");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)

    }
});

var fileFilter = (req, file, cb) => {
    //accept
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    }
    //reject
    else {
        cb(null, false);
    }
}

var upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilter
});

router.get('/', (req, res, next) => {
    Product.find()
        .select("name price _id productImage")
        .exec()
        .then(docs => {
            var response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        productImage : productImage,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/products/" + doc._id
                        }
                    };
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});


router.post('/', upload.single('productImage'), (req, res, next) => {
    console.log(req.file);
    var product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage : req.file.path
    });

    product.save()
        .then(doc => {
            console.log("New Object Created\n", doc);
            res.status(201).json({
                message: "Created Object Successfully",
                createdProduct: {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/products/" + doc._id
                    }
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
    Product.findById(id)
        .select("name price _id productImage")
        .exec()
        .then(doc => {
            console.log("Fetched from Database\n", doc);
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: "GET",
                        description: "Get all product information",
                        url: "http://localhost:3000/products"
                    }
                });
            } else {
                res.status(404).json({
                    message: "No record found for the given id"
                })
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


router.delete("/:id", (req, res, next) => {
    var id = req.params.id;
    Product.findByIdAndDelete(id)
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    message: "Product Deleted"
                });
            } else {
                res.status(404).json({
                    error: {
                        message: "No such record found"
                    }
                })
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })

});


router.patch("/:id", (req, res, next) => {
    var id = req.params.id;
    var updateOps = {};
    for (var ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json({
                message: "Product updated",
                request: {
                    type: "GET",
                    description: "Get details about the updated product",
                    url: "http://localhost:3000/products/" + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});

module.exports = router;
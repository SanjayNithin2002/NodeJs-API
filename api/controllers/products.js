const Product = require("../models/products");
const mongoose = require("mongoose");

exports.productsGetAll = (req, res, next) => {
    Product.find()
        .select("name price _id productImage")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        productImage : "http://localhost:3000/" + doc.productImage,
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
};

exports.productsGetById = (req, res, next) => {
    const id = req.params.id;
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
};

exports.productDelete = (req, res, next) => {
    const id = req.params.id;
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

};

exports.productPatch = (req, res, next) => {
    const id = req.params.id;
    const updateOps = {};
    for (const ops of req.body) {
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
};

exports.productsPost = (req, res, next) => {
    console.log(req.file);
    const product = new Product({
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


};
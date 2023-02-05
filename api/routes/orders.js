var express = require("express");
var router = express.Router();

router.get("/",(req,res,next)=>{
    res.status(200).json({
        message : "GET request for /orders"
    });
});

router.post("/",(req,res,next)=>{
    var order = {
        productId : req.body.productId,
        quantity : req.body.quantity
    }
    res.status(201).json({
        message : "POST request for /orders",
        receivedOrder : order 
    });
});

router.get("/:id",(req,res,next)=>{
    var id = req.params.id;
    res.status(200).json({
        message : "GET request for ID",
        id : id
    });
});

router.delete("/:id",(req,res,next)=>{
    var id = req.params.id;
    res.status(200).json({
        message : "DELETE request for ID",
        id : id
    });
});

module.exports = router;



var express = require("express");
var router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: "Handling GET request for /products"
    })
});


router.post('/', (req, res, next) => {
    res.status(201).json({
        message: "Handling POST request for /products"
    })
});



router.get("/:id", (req, res, next) => {
    var id = req.params.id;
    if (id === "special") {
        res.status(200).json({
            message: "You discovered a special ID",
            id: id
        });
    } else {
        res.status(200).json({
            message: "You passed an ID",
            id: id
        });
    }
});


router.delete("/:id", (req, res, next) => {
    var id = req.params.id;
    res.status(200).json({
        message: "You have deleted a product",
        id: id
    });

});


router.patch("/:id", (req, res, next) => {
    var id = req.params.id;
    res.status(200).json({
        message: "Updated at ID",
        id: id
    });

});

module.exports = router;
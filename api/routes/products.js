const express = require("express");

const multer = require("multer");
const router = express.Router();
const Product = require("../models/products");
const checkAuth = require("../middleware/checkAuth");
const ProductsController = require("../controllers/products");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)

    }
});

const fileFilter = (req, file, cb) => {
    //accept
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    }
    //reject
    else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilter
});

router.get('/', ProductsController.productsGetAll);
router.get("/:id", ProductsController.productsGetById);
router.delete("/:id", checkAuth, ProductsController.productDelete);
router.patch("/:id", checkAuth, ProductsController.productPatch);
router.post('/', checkAuth, upload.single('productImage'), ProductsController.productsPost);
module.exports = router;
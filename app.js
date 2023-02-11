var express = require("express");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var productRoutes = require("./api/routes/products");
var orderRoutes = require("./api/routes/orders");


var app = express();
mongoose.connect("mongodb+srv://sanjaynithin:" + process.env.MONGO_PASSWORD + "@cluster0.kgz6ota.mongodb.net/?retryWrites=true&w=majority");
app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Accept, Authorization, Content-Type");
    if(req.method === 'OPTIONS'){
        res.header(
            "Access-Control-Allow-Methods", 
            "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});


app.use("/products",productRoutes);
app.use("/orders", orderRoutes);

app.use((req,res,next)=>{
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});
app.use((error, req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error : {
            message : error.message
        }
    });
});

module.exports = app;


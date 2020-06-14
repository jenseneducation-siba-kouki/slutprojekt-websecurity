const express = require("express");
const router = express.Router();
const Product = require("../models/Products");
const User = require("../models/Users");

router.get('/products', async(req,res) => {
    const products = await Product.all();
    res.json(products);
});

// get one product with the id
router.get('/products/:id' , async(req,res) => {
    const product = await Product.getOne(req.params.id);
    if(product){
        res.json(product);
    }else{
        res.json({message: "Product not found"});
    }
});

// create a product
router.post('/products' , User.login, async(req,res) => {
    if(req.user.role === "admin"){
        const product = await Product.create(req.body);
        res.json(product);
    }else{
        res.json({message: "Product not Created"});
    }
});

// update the product
router.patch('/products/:id', User.login, async (req,res) => {
    if(req.user.role === "admin") {
        const product = await Product.update(req.parmas.id, req.body)
        res.json(product);
    }else{
        res.json({message: "Product could not update"});
    }
});

// delete the product
router.delete('/products/:id' , User.login, async(req,res) => {
    if(req.user.role === "admin") {
        const product = await Product.delete(req.parmas.id)
        res.json(product);
    }else{
        res.json({message: "Product could not delete"});
    }
});


module.exports = router;
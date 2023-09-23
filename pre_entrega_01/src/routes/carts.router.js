import {Router} from 'express';
import { cartModel } from '../dao/models/cart.model.js';
import { productModel } from '../dao/models/product.model.js';
import mongoose from "mongoose"
export const router = Router();

router.post('/', async(req, res) => {
    res.setHeader("Content-Type", "application/json");
    let {products} = req.body;

    if (!products)
        return res.status(400).json({status: 'error', msg: 'Error - Missing parameters'})

    try {
        for (const product of products) {
            if (!product.product_id || !product.quantity)
                return res.status(400).json({status: 'error', msg: 'Error - All products must have an id and a quantity'})
            
            if (!mongoose.Types.ObjectId.isValid(product.product_id))
                return res.status(400).json({error:"Error - Invalid product id format"});

            let productExists = await productModel.findById(product.product_id);

            if (!productExists)
                return res.status(400).json({error:"Error - Product id not found"});

            let price = (await productModel.findById(product.product_id)).price;
            product.subtotal = price * product.quantity;
        }

        const cart = {
            products
        }

        let resultado = await cartModel.create(cart);
        res.status(200).json({status: 'ok', msg: `Cart created successfully: ${resultado}`});
    } catch (error) {
        res.status(500).json({error: "Unexpected error", detalle: error.message});
    }
});

router.get('/:cid', async(req, res) => {
    res.setHeader("Content-Type", "application/json");
    let {cid} = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(cid))    
            return res.status(400).json({error:"Error - Invalid cart id format"});

        const products = await cartModel.findById(cid);

        if (!products)
            return res.status(404).json({status: 'error', msg: `Error - Cart ${cid} not found`});

        res.status(200).json({status: 'ok', products});
    } catch (error) {
        res.status(500).json({error: "Unexpected error", detalle: error.message});
    }
});

router.post('/:cid/product/:pid', async(req, res) => {
    res.setHeader("Content-Type", "application/json");
    let {cid, pid} = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(pid))
            return res.status(400).json({error:"Error - Invalid product id format"});

        if (!mongoose.Types.ObjectId.isValid(cid))
            return res.status(400).json({error:"Error - Invalid cart id format"});

        const product = await productModel.findById(pid);
        if (!product)
            return res.status(400).json({error:"Error - Product id not found"});

        const cart = await cartModel.findById(cid);
        if (!cart)
            return res.status(400).json({error:"Error - Cart id not found"});

        // ¿Reducir directamente el stock del product en la coleccion Products?
        let resultado;
        let existingProduct = cart.products.find(product => product.product_id.toString() === pid);
        if (existingProduct) {
            resultado = await cartModel.updateOne(
                {_id: cid, "products.product_id": pid}, 
                {$set: {
                    "products.$.quantity": existingProduct.quantity + 1,
                    "products.$.subtotal": existingProduct.subtotal + product.price
                }}
            );
        } else {
            let newProduct = {
                product_id: pid,
                quantity: 1,
                subtotal: product.price
            }
            resultado = await cartModel.updateOne(
                {_id: cid},
                {$push: {"products": newProduct}}
            );
        }

        

        res.status(200).json({status: 'ok', msg: `Product added to cart successfully: ${resultado}`});
    } catch (error) {
        res.status(500).json({error: "Unexpected error", detalle: error.message});
    }
});




// Ignorar lo que sigue: implementacion vieja con File System
/*
import CartManager from '../models/cartManager.js';
const cartManager = new CartManager();

router.post('/', (req, res) => {
    res.setHeader("Content-Type", "application/json");
    let {products} = req.body;

    if (!products)
        return res.status(400).json({status: 'error', msg: 'Error - Missing parameters'})

    for (const product of products) {
        if (!product.id || !product.quantity)
            return res.status(400).json({status: 'error', msg: 'Error - All products must have an id and a quantity'})
    }

    cartManager.createCart(products);
    res.status(200).json({status: 'ok', msg: 'Cart created successfully'});
});

router.get('/:cid', (req, res) => {
    res.setHeader("Content-Type", "application/json");
    let {cid} = req.params;
    cid = parseInt(cid);

    if (isNaN(cid) || cid <= 0)
        return res.status(400).json({status: 'error', msg: 'Cart Id must be a positive integer'});

    let products = cartManager.getProductsByCartId(cid);

    if (!products)
        return res.status(404).json({status: 'error', msg: 'Error - Cart not found'});

    res.status(200).json({status: 'ok', products});
});

router.post('/:cid/product/:pid', (req, res) => {
    res.setHeader("Content-Type", "application/json");
    let {cid, pid} = req.params;
    cid = parseInt(cid);
    pid = parseInt(pid);

    if (isNaN(cid) || isNaN(pid) || cid <= 0 || pid <= 0)
        return res.status(400).json({status: 'error', msg: 'Cart Id and Product Id must be positive integers'});

    cartManager.addProductToCart(cid, pid);
    res.status(200).json({status: 'ok', msg: 'Product added to cart successfully'});
});
*/
import {Router} from 'express';
import { productModel } from '../dao/models/product.model.js';
import { cartModel } from '../dao/models/cart.model.js';
import mongoose from "mongoose"
export const router = Router();

router.get('/home', async(req,res) => {
    res.setHeader("Content-Type","text/html");
    const products = await productModel.find();
    const productsPlain = products.map(product => product.toObject());
	res.status(200).render("home", {
		title: "Lista de Productos",
        products: productsPlain
	});
});

router.get('/realtimeproducts', async(req,res) => {
    res.setHeader("Content-Type","text/html");
    const products = await productModel.find();
    const productsPlain = products.map(product => product.toObject());

    res.status(200).render("realtimeproducts", {
        title: "Productos en tiempo real",
        products: productsPlain
    });
});

router.get('/products', async (req,res) => {

});

router.get('/carts/:cid', async (req,res) => {
    res.setHeader("Content-Type","text/html");
    let { cid } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(cid))
            return res.status(400).render("notfound", {
                msg: "Error - Invalid cart id format"
            });

        const cart = await cartModel.findOne({_id: cid});
        if (!cart)
            return res.status(404).render("notfound", {
                msg: `Error - Cart ${cid} not found`
            });

        let products = [];
        cart.products.forEach(product => {
            let newProduct = {
                ...product.product.toObject(),
                quantity: product.quantity,
                subtotal: product.subtotal
            }
            products.push(newProduct);
        });

        console.log(products)

        res.status(200).render("carts", {
            title: "Carrito de compras",
            products: products,
            cid
        });
    } catch (error) {
        res.status(500).render("notfound", {msg: error.message});
    }

});


// Ignorar lo que sigue: implementacion vieja con File System
/*
import ProductManager from '../models/productManager.js';
const productManager = new ProductManager();

router.get('/home', (req,res) => {
    res.setHeader("Content-Type","text/html");
	res.status(200).render("home", {
		title: "Lista de Productos",
        products: productManager.getProducts().productsList
	});
});

router.get('/realtimeproducts', (req,res) => {
    res.setHeader("Content-Type","text/html");
    res.status(200).render("realtimeproducts", {
        title: "Productos en tiempo real",
        products: productManager.getProducts().productsList
    });
});
*/
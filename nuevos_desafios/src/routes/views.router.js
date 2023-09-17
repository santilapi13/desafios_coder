import {Router} from 'express';
import { productModel } from '../dao/models/product.model.js';
export const router = Router();

router.get('/home', async(req,res) => {
    res.setHeader("Content-Type","text/html");
	res.status(200).render("home", {
		title: "Lista de Productos",
        products: await productModel.find()
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
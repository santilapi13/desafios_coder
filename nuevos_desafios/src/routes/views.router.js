import {Router} from 'express';
export const router = Router();
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
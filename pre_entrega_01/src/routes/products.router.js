import {Router} from 'express';
import { productModel } from "../dao/models/product.model.js";
import mongoose from "mongoose"
export const router = Router();
import {io} from "../app.js";

let validateProps = (body, ...validator) => {
    let newProductProps = Object.keys(body);
    for (const toValidateProp of validator) {
        if (!newProductProps.includes(toValidateProp))
            return false;
    };
    return true;
}

router.get('/', async(req, res) => {
    res.setHeader("Content-Type", "application/json");
    let resultado = await productModel.find();
    let {limit} = req.query;

    if (!limit)
        return res.status(200).json({status: 'ok', data: resultado});

    limit = parseInt(limit);

    if (isNaN(limit) || limit < 0)
        return res.status(400).json({status: 'error', msg: 'Parameter <limit> must be a non-negative integer'});

    resultado = resultado.slice(0, limit);
    res.status(200).json({status: 'ok', data: resultado});
});

router.get('/:pid', async(req, res) => {
    res.setHeader("Content-Type", "application/json");
    let pid = req.params.pid;

    try {
    if (!mongoose.Types.ObjectId.isValid(pid))    
		return res.status(400).json({error:"Error - Invalid ID format"});

    const resultado = await productModel.findById(pid);

    if (!resultado)
        return res.status(404).json({status: 'error', msg: 'Error - Product not found'});

    res.status(200).json({status: 'ok', data: resultado});
    } catch (err) {
        res.status(500).json({error: "Unexpected error", detalle: err.message});
    }
});


router.post('/', async(req, res) => {
    res.setHeader("Content-Type", "application/json");
    let product = req.body;

    if (!validateProps(product, 'title', 'description', 'code', 'price', 'status', 'stock', 'category'))
        return res.status(400).json({status: 'error', msg: 'Error - Missing parameters (title, description, code, price, status, stock, category are required)'})

    let codeProduct = await productModel.findOne({code: product.code});
    if (codeProduct)
        return res.status(400).json({status: 'error', msg: `Error - Product code ${product.code} already exists`});

    product.price = parseFloat(product.price);
    product.status = !!product.status;
    product.stock = parseInt(product.stock);

    try {
        let newProduct = await productModel.create(product);
        io.emit('list-updated', {products: await productModel.find(), msg: `Product ${product.title} added.`});
        res.status(201).json({status: 'ok', msg: `Product ${newProduct} added successfully`});
    } catch (error) {
        res.status(500).json({error: "Unexpected error", detalle: error.message});
    }
});


router.put('/:pid', async(req, res) => {
    res.setHeader("Content-Type", "application/json");
    let {pid} = req.params;
    let product = req.body;
    let validator = ['title', 'description', 'code', 'price', 'status', 'stock', 'category', 'thumbnails'];

    if (!mongoose.Types.ObjectId.isValid(pid))    
		return res.status(400).json({error:"Error - Invalid id"});

    let updatedProduct = await productModel.findById(pid);
    if (!updatedProduct)
        return res.status(404).json({status: 'error', msg: 'Error - Product not found'});

    for (const toValidateProp of Object.keys(product)) {
        if (!validator.includes(toValidateProp))
            return res.status(400).json({status: 'error', msg: `Error - Invalid property: ${toValidateProp}`});
    }

    let codeProduct = await productModel.findOne({code: product.code});
    if (codeProduct)
        return res.status(400).json({status: 'error', msg: `Error - Product code ${product.code} already exists`});


    if (product.price) {
        product.price = parseFloat(product.price);
        if (isNaN(product.price))
            return res.status(400).json({status: 'error', msg: `Error - Invalid price: ${product.price}`});
    }

    if (product.status)
        product.status = !!product.status;

    if (product.stock) {
        product.stock = parseInt(product.stock);
        if (isNaN(product.stock))
            return res.status(400).json({status: 'error', msg: `Error - Invalid stock: ${product.stock}`});
    }

    Object.entries(product).forEach(([key, value]) => {
        updatedProduct[key] = value;
    });

    let resultado = await productModel.findByIdAndUpdate(pid, updatedProduct);

    io.emit('list-updated', {products: await productModel.find(), msg: `Product with id ${pid} updated.`});
    res.status(200).json({status: 'ok', msg: `Product with id ${pid} updated successfully: ${resultado}`});
});


router.delete('/:pid', async(req, res) => {
    res.setHeader("Content-Type", "application/json");
    let {pid} = req.params;

    try {
    if (!mongoose.Types.ObjectId.isValid(pid))    
		return res.status(400).json({error:"Error - Invalid id"});

    if (!await productModel.findById(pid))
        return res.status(404).json({status: 'error', msg: 'Error - Product not found'});

    let resultado = await productModel.deleteOne({_id: pid});
    io.emit('list-updated', {products: await productModel.find(), msg: `Product with id ${pid} deleted.`});
    res.status(200).json({status: 'ok', msg: `Product with id ${pid} deleted successfully: ${resultado}`});
    } catch (err) {
        res.status(500).json({error: "Unexpected error", detalle: err.message});
    }
});




// Ignorar lo que sigue: implementacion vieja con File System
/*
import ProductManager from '../models/productManager.js';
const productManager = new ProductManager();

let validateProps = (body, ...validator) => {
    let newProductProps = Object.keys(body);
    for (const toValidateProp of validator) {
        if (!newProductProps.includes(toValidateProp))
            return false;
    };
    return true;
}


router.get('/', (req, res) => {
    res.setHeader("Content-Type", "application/json");
    let resultado = productManager.getProducts().productsList;
    let {limit} = req.query;

    if (!limit)
        return res.status(200).json({status: 'ok', data: resultado});

    limit = parseInt(limit);

    if (isNaN(limit) || limit < 0)
        return res.status(400).json({status: 'error', msg: 'Parameter <limit> must be a non-negative integer'});

    resultado = resultado.slice(0, limit);
    res.status(200).json({status: 'ok', data: resultado});
});


router.get('/:pid', (req, res) => {
    res.setHeader("Content-Type", "application/json");
    let pid = req.params.pid;
    pid = parseInt(pid);

    if (isNaN(pid) || pid <= 0)
        return res.status(400).json({status: 'error', msg: 'Product Id must be a positive integer'});

    const resultado = productManager.getProductById(pid);

    if (!resultado)
        return res.status(404).json({status: 'error', msg: 'Error - Product not found'});

    res.status(200).json({status: 'ok', data: resultado});
});


router.post('/', (req, res) => {
    res.setHeader("Content-Type", "application/json");
    let product = req.body;

    if (!validateProps(product, 'title', 'description', 'code', 'price', 'status', 'stock', 'category'))
        return res.status(400).json({status: 'error', msg: 'Error - Missing parameters'})

    let products = productManager.getProducts().productsList;

    product.code += "";
    if (products.find(p => p.code === product.code) !== undefined)
            return res.status(400).json({status: 'error', msg: 'Error - Product code already exists'});

    product.price = parseFloat(product.price);
    product.status = !!product.status;
    product.stock = parseInt(product.stock);

    productManager.addProduct(product);
    io.emit('list-updated', {products: productManager.getProducts().productsList, msg: `Product ${product.title} added.`});
    res.status(201).json({status: 'ok', msg: `Product ${product.title} added successfully`});
});


router.put('/:pid', (req, res) => {
    res.setHeader("Content-Type", "application/json");
    let {pid} = req.params;
    let product = req.body;
    let validator = ['title', 'description', 'code', 'price', 'status', 'stock', 'category'];
    pid = parseInt(pid);

    if (!productManager.getProductById(pid))
        return res.status(404).json({status: 'error', msg: 'Error - Product not found'});

    for (const toValidateProp of Object.keys(product)) {
        if (!validator.includes(toValidateProp))
            return res.status(400).json({status: 'error', msg: `Error - Invalid property: ${toValidateProp}`});
    }

    let products = productManager.getProducts().productsList;
    
    if (product.code) {
        product.code += "";
        if (products.find(currentProduct => currentProduct.code === product.code) !== undefined)
            return res.status(400).json({status: 'error', msg: 'Error - Product code already exists'});
    }

    if (product.price)
        product.price = parseFloat(product.price);

    if (product.status)
        product.status = !!product.status;

    if (product.stock)
        product.stock = parseInt(product.stock);

    productManager.updateProduct(pid, Object.entries(product));
    io.emit('list-updated', {products: productManager.getProducts().productsList, msg: `Product with id ${pid} updated.`});
    res.status(200).json({status: 'ok', msg: `Product with id ${pid} updated successfully`});
});


router.delete('/:pid', (req, res) => {
    res.setHeader("Content-Type", "application/json");
    let {pid} = req.params;

    pid = parseInt(pid);
    if (!productManager.getProductById(pid))
        return res.status(404).json({status: 'error', msg: 'Error - Product not found'});

    productManager.deleteProduct(pid);
    io.emit('list-updated', {products: productManager.getProducts().productsList, msg: `Product with id ${pid} deleted.`});
    res.status(200).json({status: 'ok', msg: `Product with id ${pid} deleted successfully`});
});
*/
import {Router} from 'express';
export const router = Router();
import ProductManager from '../models/productManager.js';

const productManager = new ProductManager();

let validateProps = (body, ...validator) => {
    let keys = Object.keys(body);
    for (prop in validator) {
        if (!keys.includes(validator[prop]))
            return false;
    }
    return true;
}


router.get('/', (req, res) => {
    res.setHeader("Content-Type", "application/json");
    let resultado = productManager.getProducts();
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
        return res.status(400).json({status: 'error', msg: 'Parameter <limit> must be a positive integer'});

    const resultado = productManager.getProductById(pid);

    if (!resultado)
        return res.status(404).json({status: 'error', msg: 'Error - Product not found'});

    res.status(200).json({status: 'ok', data: resultado});
});


router.post('/', (req, res) => {
    let product = req.body;

    if (!validateProps(product, 'title', 'description', 'code', 'price', 'status', 'stock', 'category'))
        res.status(400).json({status: 'error', msg: 'Error - Missing parameters'})

    let products = productManager.getProducts();
    if (products.find(p => p.code === product.code) !== undefined)
            return res.status(400).json({status: 'error', msg: 'Error - Product code already exists'});

    product.price = parseFloat(product.price);
    product.status = !!product.status;
    product.stock = parseInt(product.stock);

    productManager.addProduct(product);
    res.status(201).json({status: 'ok', msg: `Product ${product.title} added successfully`});
});


router.put('/:pid', (req, res) => {
    let {pid} = req.params;
    // TODO: Implementar actualizacion de producto por ID
});


router.delete('/:pid', (req, res) => {
    let {pid} = req.params;

    if (!productManager.getProductById(pid))
        return res.status(404).json({status: 'error', msg: 'Error - Product not found'});

    productManager.deleteProduct(pid);
    res.status(200).json({status: 'ok', msg: `Product with id ${pid} deleted successfully`});
});
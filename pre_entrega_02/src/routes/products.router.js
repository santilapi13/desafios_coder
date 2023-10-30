import Router from './router.js'
import productsController from '../controllers/productsController.js';

export class ProductsRouter extends Router {
    init() {
        this.get('/', ['USER', 'ADMIN'], productsController.getProducts);
        
        this.get('/:pid', ["USER", "ADMIN"], productsController.getProductById);
        
        this.post('/', ["USER", "ADMIN"], productsController.postProduct);
        
        this.put('/:pid', ["USER", "ADMIN"], productsController.putProduct);
        
        this.delete('/:pid', ["USER", "ADMIN"], productsController.deleteProduct);
    }
}


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
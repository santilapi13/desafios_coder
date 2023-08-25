import {Router} from 'express';
export const router = Router();
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
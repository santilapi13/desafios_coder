import Router from './router.js'
import { cartModel } from '../dao/models/cart.model.js';
import { productModel } from '../dao/models/product.model.js';
import mongoose from "mongoose"

const validateIds = async (cid, pid) => {
    if (!mongoose.Types.ObjectId.isValid(pid))
        return {
            error: true,
            msg: "Error - Invalid product id format"
        };

    if (!mongoose.Types.ObjectId.isValid(cid))
        return {
            error: true,
            msg: "Error - Invalid cart id format"
        };

    const product = await productModel.findById(pid);
    if (!product)
        return {
            error: true,
            msg: "Error - Product id not found"
        };

    const cart = await cartModel.findById(cid);
    if (!cart)
        return {
            error: true,
            msg: "Error - Cart id not found"
        };

    return {
        error: false,
        msg: "",
        product,
        cart
    };
};

export class CartsRouter extends Router {
    init() {
        this.post('/', ["USER", "ADMIN"], async(req, res) => {
            res.setHeader("Content-Type", "application/json");
            let { products } = req.body;
        
            if (!products)
                return res.status(400).json({status: 'error', msg: 'Error - Missing parameters'})
        
            try {
                for (const product of products) {
                    if (!product.product || !product.quantity)
                        return res.status(400).json({status: 'error', msg: 'Error - All products must have an id and a quantity'})
                    
                    let product_id = product.product._id;
                    if (!mongoose.Types.ObjectId.isValid(product_id))
                        return res.status(400).json({error:"Error - Invalid product id format"});
        
                    let productExists = await productModel.findById(product_id);
        
                    if (!productExists)
                        return res.status(400).json({error:"Error - Product id not found"});
        
                    let price = (await productModel.findById(product_id)).price;
                    product.subtotal = price * product.quantity;
                }
        
                const cart = {
                    products
                }
        
                let resultado = await cartModel.create(cart);
                res.status(201).json({status: 'success', msg: `Cart created successfully: ${resultado}`});
            } catch (error) {
                res.status(500).json({error: "Unexpected error", detail: error.message});
            }
        });

        this.get('/:cid', ["USER", "ADMIN"], async(req, res) => {
            res.setHeader("Content-Type", "application/json");
            let { cid } = req.params;
        
            try {
                if (!mongoose.Types.ObjectId.isValid(cid))    
                    return res.status(400).json({error:"Error - Invalid cart id format"});
        
                const cart = await cartModel.findOne({_id: cid});
                
                if (!cart)
                    return res.status(404).json({status: 'error', msg: `Error - Cart ${cid} not found`});
        
                res.status(200).json({status: 'success', cart});
            } catch (error) {
                res.status(500).json({error: "Unexpected error", detail: error.message});
            }
        });
        
        this.post('/:cid/product/:pid', ["USER", "ADMIN"], async (req, res) => {
            res.setHeader("Content-Type", "application/json");
            let { cid, pid } = req.params;
        
            try {
                let validation = await validateIds(cid, pid);
                if (validation.error)
                    return res.status(400).json({error: validation.msg})
        
                let { product, cart } = validation;
        
                // ¿Reducir directamente el stock del product en la coleccion Products?
                let resultado;
                let existingProduct = await cartModel.findOne({_id: cid, "products.product": pid}, {"products.$": 1});
        
                if (existingProduct) {
                    existingProduct = existingProduct.products[0]
                    resultado = await cartModel.updateOne(
                        {_id: cid, "products.product": pid}, 
                        {$set: {
                            "products.$.quantity": existingProduct.quantity + 1,
                            "products.$.subtotal": existingProduct.subtotal + product.price
                        }}
                    );
                } else {
                    let newProduct = {
                        product: pid,
                        quantity: 1,
                        subtotal: product.price
                    }
                    resultado = await cartModel.updateOne(
                        {_id: cid},
                        {$push: {"products": newProduct}}
                    );
                }
        
                res.status(201).json({status: 'success', msg: `Product added to cart successfully: ${resultado}`});
            } catch (error) {
                res.status(500).json({error: "Unexpected error", detail: error.message});
            }
        });
        
        this.delete('/:cid/products/:pid', ["USER", "ADMIN"], async (req, res) => {
            res.setHeader("Content-Type", "application/json");
            let { cid, pid } = req.params;
        
            try {
                let validation = await validateIds(cid, pid);
                if (validation.error)
                    return res.status(400).json({error: validation.msg})
        
                let resultado = await cartModel.updateOne({_id: cid}, {$pull: {products: {product: pid}}});
                res.status(200).json({status: 'success', msg: `Product with id ${pid} deleted successfully from cart ${cid}: ${resultado}`});
        
            } catch (error) {
                res.status(500).json({error: "Unexpected error", detail: error.message});
            }
        });
        
        // Actualiza la lista completamente. ¿O sólo debería agregarlos?
        this.put('/:cid', ["USER", "ADMIN"], async (req, res) => {
            res.setHeader("Content-Type", "application/json");
            let { cid } = req.params;
        
            try {
                if (!mongoose.Types.ObjectId.isValid(cid))
                    return res.status(400).json({error:"Error - Invalid cart id format"});
        
                const cart = await cartModel.findById(cid);
                if (!cart)
                    return res.status(404).json({status: 'error', msg: `Error - Cart ${cid} not found`});
        
                let {products} = req.body;
                if (!Array.isArray(products))
                    return res.status(400).json({status: 'error', msg: 'Error - Products should be an array of products'})
        
                for (const product of products) {
                    if (!product.product || !product.quantity)
                        return res.status(400).json({status: 'error', msg: 'Error - All products must have an id and a quantity'})
                    
                    let product_id = product.product._id;
                    if (!mongoose.Types.ObjectId.isValid(product_id))
                        return res.status(400).json({error:"Error - Invalid product id format"});
        
                    let productExists = await productModel.findById(product_id);
        
                    if (!productExists)
                        return res.status(400).json({error:"Error - Product id not found"});
        
                    let price = (await productModel.findById(product_id)).price;
                    product.subtotal = price * product.quantity;
                }
        
                let resultado = await cartModel.updateOne({_id: cid}, {$set: {products}});
                res.status(200).json({status: 'success', msg: `Cart ${cid} updated successfully: ${resultado}`});
            } catch (error) {
                res.status(500).json({error: "Unexpected error", detail: error.message});
            }
        });
        
        this.put('/:cid/products/:pid', ["USER", "ADMIN"], async (req, res) => {
            res.setHeader("Content-Type", "application/json");
            let { cid, pid } = req.params;
        
            try {
                let validation = validateIds(cid, pid);
                if (validation.error)
                    return res.status(400).json({error: validation.msg})
        
                let { quantity } = req.body;
                if (!quantity)
                    return res.status(400).json({status: 'error', msg: 'Error - New quantity must be provided.'})
                quantity = parseInt(quantity);
                if (isNaN(quantity) || quantity <= 0)
                    return res.status(400).json({status: 'error', msg: 'Error - New quantity must be a positive integer.'})
        
        
                let resultado = await cartModel.updateOne({_id: cid, "products.product": pid}, {$set: {"products.$.quantity": quantity}});
                res.status(200).json({status: 'success', msg: `Product with id ${pid} quantity updated successfully to ${quantity}: ${resultado}`});
            } catch (error) {
                res.status(500).json({error: "Unexpected error", detail: error.message});
            }
        });
        
        this.delete('/:cid', ["USER", "ADMIN"], async (req, res) => {
            res.setHeader("Content-Type", "application/json");
            let { cid } = req.params;
        
            try {
                if (!mongoose.Types.ObjectId.isValid(cid))
                    return res.status(400).json({error:"Error - Invalid cart id format"});
        
                const cart = await cartModel.findById(cid);
                if (!cart)
                    return res.status(404).json({status: 'error', msg: `Error - Cart ${cid} not found`});
        
                let resultado = await cartModel.updateOne({_id: cid}, {$set: {products: []}});
                res.status(200).json({status: 'success', msg: `Cart ${cid} deleted successfully: ${resultado}`});
        
            } catch (error) {
                res.status(500).json({error: "Unexpected error", detail: error.message});
            }
        });
    }
}




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
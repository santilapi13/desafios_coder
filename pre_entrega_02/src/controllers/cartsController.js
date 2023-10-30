import { cartsService } from "../../services/carts.service.js";
import { productsService } from "../../services/products.service.js";

async function createCart(req, res) {
    res.setHeader("Content-Type", "application/json");
    let { products } = req.body;

    if (!products)
        return res.sendUserError("Missing parameters");

    try {
        for (const product of products) {
            if (!product.product || !product.quantity)
                return res.sendUserError("All products must have an id and a quantity");
            
            let pid = product.product._id;
            let idValidation = await productsService.validateProductId(pid);
            if (idValidation.error)
                return res.sendUserError(idValidation.msg);

            let price = (await productsService.getProductById(pid)).price;
            product.subtotal = price * product.quantity;
        }

        const cart = {
            products
        }

        let resultado = await cartsService.create(cart);
        res.sendSuccess(`Cart created successfully: ${resultado}`);
    } catch (error) {
        res.sendServerError(error.message);
    }
}

async function getCartById(req, res) {
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
}

async function addProductToCart(req, res) {
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
}

async function deleteProductFromCart(req, res) {
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
}

async function updateCart(req, res) {
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
}

async function updateAmountOfProductInCart(req, res) {
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
}

async function deleteCart(req, res) {
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
}

export default { createCart, getCartById, addProductToCart, deleteProductFromCart, updateCart, updateAmountOfProductInCart, deleteCart };
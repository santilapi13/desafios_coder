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
        let idValidation = await cartsService.validateCartId(cid);
        if (idValidation.error)
            return res.sendUserError(idValidation.msg);

        const cart = idValidation.cart;

        res.sendSuccess(cart);
    } catch (error) {
        res.sendServerError(error.message);
    }
}

async function addProductToCart(req, res) {
    res.setHeader("Content-Type", "application/json");
    let { cid, pid } = req.params;

    try {
        let pidValidation = await productsService.validateProductId(pid);
        if (pidValidation.error)
            return res.sendUserError(pidValidation.msg);

        let cidValidation = await cartsService.validateCartId(cid);
        if (cidValidation.error)
            return res.sendUserError(cidValidation.msg);

        let product = pidValidation.product;
        let cart = cidValidation.cart;

        // ¿Reducir directamente el stock del product en la coleccion Products?
        let resultado;
        let existingProduct = await cartsService.getProductById(cid, pid);

        if (existingProduct) {
            let productInCart = existingProduct.products[0];
            let product = productInCart.product;
            resultado = await cartsService.updateAmountOfProductInCart(cid, pid, productInCart.quantity + 1, productInCart.subtotal + product.price);
        } else {
            let newProduct = {
                product: pid,
                quantity: 1,
                subtotal: product.price
            }
            resultado = await cartsService.createProductInCart(cid, newProduct);
        }

        res.sendSuccess(`Product added to cart ${cart} successfully: ${resultado}`);
    } catch (error) {
        console.log(error.message);
        res.sendServerError(error.message);
    }
}

async function deleteProductFromCart(req, res) {
    res.setHeader("Content-Type", "application/json");
    let { cid, pid } = req.params;

    try {
        let pidValidation = await productsService.validateProductId(pid);
        if (pidValidation.error)
            return res.sendUserError(pidValidation.msg);

        let cidValidation = await cartsService.validateCartId(cid);
        if (cidValidation.error)
            return res.sendUserError(cidValidation.msg);

        let resultado = await cartsService.deleteProductFromCart(cid, pid);
        res.sendSuccess(`Product with id ${pid} deleted successfully from cart ${cid}: ${resultado}`);
    } catch (error) {
        res.sendServerError(error.message);
    }
}

async function updateCart(req, res) {
    res.setHeader("Content-Type", "application/json");
    let { cid } = req.params;

    try {
        let cidValidation = await cartsService.validateCartId(cid);
        if (cidValidation.error)
            return res.sendUserError(cidValidation.msg);

        let { products } = req.body;

        if (!Array.isArray(products))
            return res.sendUserError("Products should be an array of products");

        for (const product of products) {
            if (!product.product || !product.quantity)
                return res.sendUserError("All products must have an id and a quantity");
            
            let pid = product.product._id;
            let pidValidation = await productsService.validateProductId(pid);
            if (pidValidation.error)
                return res.sendUserError(pidValidation.msg);

            let price = (await productsService.getProductById(pid)).price;
            product.subtotal = price * product.quantity;
        }

        let resultado = await cartsService.updateCart(cid, products);
        res.sendSuccess(`Cart ${cid} updated successfully: ${resultado}`);
    } catch (error) {
        res.sendServerError(error.message);
    }
}

async function updateAmountOfProductInCart(req, res) {
    res.setHeader("Content-Type", "application/json");
    let { cid, pid } = req.params;

    try {
        let pidValidation = await productsService.validateProductId(pid);
        if (pidValidation.error)
            return res.sendUserError(pidValidation.msg);

        let product = pidValidation.product;

        let cidValidation = await cartsService.validateCartId(cid);
        if (cidValidation.error)
            return res.sendUserError(cidValidation.msg);

        let { quantity } = req.body;
        if (!quantity)
            return res.sendUserError("New quantity must be provided.");
        quantity = parseInt(quantity);
        if (isNaN(quantity) || quantity <= 0)
            return res.sendUserError("New quantity must be a positive integer.");

        let resultado = await cartsService.updateAmountOfProductInCart(cid, pid, quantity, product.price * quantity);
        return res.sendSuccess(`Product with id ${pid} quantity updated successfully to ${quantity}: ${resultado}`);
    } catch (error) {
        res.sendServerError(error.message);
    }
}

async function deleteCart(req, res) {
    res.setHeader("Content-Type", "application/json");
    let { cid } = req.params;

    try {
        let cidValidation = await cartsService.validateCartId(cid);
        if (cidValidation.error)
            return res.sendUserError(cidValidation.msg);

        let products = [];
        let resultado = await cartsService.updateCart(cid, products);
        return res.sendSuccess(`Cart ${cid} deleted successfully: ${resultado}`);
    } catch (error) {
        res.sendServerError(error.message);
    }
}

export default { createCart, getCartById, addProductToCart, deleteProductFromCart, updateCart, updateAmountOfProductInCart, deleteCart };
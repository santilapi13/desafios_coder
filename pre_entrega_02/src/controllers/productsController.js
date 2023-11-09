import { productsService } from '../../services/products.service.js';
import {io} from "../app.js";
import ProductDTO from '../../DAO/DTOs/product.dto.js';

async function getProducts(req, res) {
    res.setHeader("Content-Type", "application/json");
    let {limit, page, sort, query} = req.query;

    limit = limit ? parseInt(limit) : 10;
    if (isNaN(limit) || limit < 0)
        return res.sendUserError("Parameter <limit> must be a non-negative integer");

    page = page ? parseInt(page) : 1;
    if (isNaN(page) || page <= 0)
        return res.sendUserError("Parameter <page> must be a positive integer");

    if (sort && !['asc', 'desc'].includes(sort))
        return res.sendUserError("Parameter <sort> must be one of the following: asc, desc");
    let sortBy = sort ? {price: sort} : {};

    // query puede ser available o puede ser la categoria por la cual filtrar.
    let queryCondition = {};
    if (query)
        queryCondition = query === 'available' ? {status: true} : {category: query};

    let result;
    try {
        result = await productsService.getFilteredProducts(queryCondition, limit, page, sortBy);
    } catch (error) {
        return res.sendServerError(error.message);
    }

    let {
        totalPages,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage
    } = result;
    
    const baseUrl = req.protocol + '://' + req.get('host') + req.baseUrl; 
    const prevLink = hasPrevPage ? `${baseUrl}?page=${prevPage}&limit=${limit}${sort ?"&sort=" + sort : ""}${query ? "&query=" + query: ""}` : null;
    const nextLink = hasNextPage ? `${baseUrl}?page=${nextPage}&limit=${limit}${sort ?"&sort=" + sort : ""}${query ? "&query=" + query: ""}` : null;

    res.sendSuccess({
        products: result.docs,
        totalPages,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        prevLink,
        nextLink
    });
}

async function getProductById(req, res) {
    res.setHeader("Content-Type", "application/json");
    let pid = req.params.pid;

    try {
        let result = await productsService.validateProductId(pid);

        if (result.error)
            return res.sendUserError(result.msg);

        result.sendSuccess(result.product);
    } catch (error) {
        res.sendServerError(error.message);
    }
}

async function postProduct(req, res) {
    res.setHeader("Content-Type", "application/json");
    let { title, description, code, price, status, stock, category, thumbnails } = req.body;
    let product;

    try {
        product = new ProductDTO({ title, description, code, price, status, stock, category, thumbnails });
    } catch (error) {
        return res.sendUserError(error.message);
    }

    let codeProduct = await productsService.getProductByCode(product.code);
    if (codeProduct)
        return res.sendUserError(`Product code ${product.code} already exists`);

    try {
        let newProduct = await productsService.createProduct(product);
        io.emit('list-updated', {products: await productsService.getProducts(), msg: `Product ${product.title} added.`});
        res.sendSuccess(`Product ${newProduct} added successfully`);
    } catch (error) {
        res.sendServerError(error.message);
    }
}

async function putProduct(req, res) {
    res.setHeader("Content-Type", "application/json");
    let { pid } = req.params;
    let product = req.body;
    let validator = ['title', 'description', 'code', 'price', 'status', 'stock', 'category', 'thumbnails'];

    let idValidation = await productsService.validateProductId(pid);
    if (idValidation.error)
        return res.sendUserError(idValidation.msg);
    let productToUpdate = idValidation.product;

    for (const toValidateProp of Object.keys(product)) {
        if (!validator.includes(toValidateProp))
            return res.sendUserError(`Invalid property: ${toValidateProp}`);
    }

    let codeProduct = await productsService.getProductByCode(product.code);
    if (codeProduct)
        return res.sendUserError(`Product code ${product.code} already exists`);

    if (product.price) {
        product.price = parseFloat(product.price);
        if (isNaN(product.price))
            return res.sendUserError(`Invalid price: ${product.price}`);
    }

    if (product.status)
        product.status = !!product.status;

    if (product.stock) {
        product.stock = parseInt(product.stock);
        if (isNaN(product.stock))
            return res.sendUserError(`Invalid stock: ${product.stock}`);
    }

    Object.entries(product).forEach(([key, value]) => {
        productToUpdate[key] = value;
    });

    try {
        let result = await productsService.updateProduct(pid, productToUpdate);
        io.emit('list-updated', {products: await productsService.getProducts(), msg: `Product with id ${pid} updated.`});
        res.sendSuccess(`Product with id ${pid} updated successfully: ${result}`);
    } catch (error) {
        res.sendServerError(error.message);
    }
}

async function deleteProduct(req, res) {
    res.setHeader("Content-Type", "application/json");
    let {pid} = req.params;
        
    let idValidation = await productsService.validateProductId(pid);
    if (idValidation.error)
        return res.sendUserError(idValidation.msg);

    try {
        let result = await productsService.deleteProduct(pid);
        io.emit('list-updated', {products: await productsService.getProducts(), msg: `Product with id ${pid} deleted.`});
        res.sendSuccess(`Product with id ${pid} deleted successfully: ${result}`);
    } catch (error) {
        res.sendServerError(error.message);
    }
}

export default { getProducts, getProductById, postProduct, putProduct, deleteProduct };
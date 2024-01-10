import { productsService } from '../services/products.service.js';
import { cartsService } from '../services/carts.service.js';
import { usersService } from '../services/users.service.js';

async function getHome(req, res) {
    const logged = req.user ? true : false;
    req.logger.debug("user at home debug: " + req.user);
    res.renderSuccess('home', {logged});
}

async function getProfile(req, res) {
    let { first_name, last_name, email, age } = req.user;
    res.renderSuccess('profile', {
        first_name,
        last_name,
        email,
        age,
        logged: true,
        cart: req.user.cart._id,
        uid: req.user._id
    });
}

async function getProducts(req, res) {
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
        req.logger.error("Products get error: " + error.message);
        return res.sendServerError(error.message);
    }

    let {
        totalPages,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage
    } = result;

    const baseUrl = "/products"; 
    const prevLink = hasPrevPage ? `${baseUrl}?page=${prevPage}&limit=${limit}${sort ?"&sort=" + sort : ""}${query ? "&query=" + query: ""}` : null;
    const nextLink = hasNextPage ? `${baseUrl}?page=${nextPage}&limit=${limit}${sort ?"&sort=" + sort : ""}${query ? "&query=" + query: ""}` : null;
    let lastPageLink = `${baseUrl}?page=${totalPages}&limit=${limit}${sort ?"&sort=" + sort : ""}${query ? "&query=" + query: ""}`; 

    let {first_name, last_name, role, cart} = req.user;
    let payload = {
        title: `Productos`,
        first_name,
        last_name,
        role,
        products: result.docs,
        totalPages,
        hasPrevPage,
        hasNextPage,
        prevPage: prevLink,
        nextPage: nextLink,
        lastPageLink,
        page,
        logged: true,
        isUser: role === 'user',
        cart: cart._id
    };

    res.renderSuccess("products", payload); 
}

async function getProductById(req, res) {
    let { pid } = req.params;
        
    try {
        let pidValidation = await productsService.validateProductId(pid);
        if (pidValidation.error)
            return res.renderUserError("notfound", {msg: pidValidation.msg});

        const product = pidValidation.product;

        let {title, price, description, code, category, stock, owner} = product;
        owner = await usersService.getUserById(owner);
        res.renderSuccess("product", {
            title,
            price,
            description,
            code,
            category,
            stock,
            owner: owner.first_name + " " + owner.last_name,
            id: pid,
            logged: true,
            isUser: req.user.role === 'user',
            cart: req.user.cart._id
        });
    } catch (error) {
        res.renderServerError("notfound", {msg: error.message});
    }
}

async function getCartById(req, res) {
    let { cid } = req.params;

    try {
        let cidValidation = await cartsService.validateCartId(cid);
        if (cidValidation.error)
            return res.renderUserError("notfound", {msg: cidValidation.msg});

        const cart = cidValidation.cart;

        let products = [];
        let total = 0;
        cart.products.forEach(product => {
            let newProduct = {
                ...product.product.toObject(),
                quantity: product.quantity,
                subtotal: product.subtotal
            }
            total += product.subtotal;
            products.push(newProduct);
        });

        res.renderSuccess("carts", {
            title: "Carrito de compras",
            products: products,
            cart: cid,
            logged: true,
            total
        });
    } catch (error) {
        res.renderServerError("notfound", {msg: error.message});
    }
}

function getRegister(req, res) {
    const error = req.query.error;
    let repeatedEmail = false;
    let missingData = false;

    if (error) {
        repeatedEmail = error === "Email already registered";
        missingData = error === "Missing credentials";
    }

    let payload = {
        logged: false,
        repeatedEmail,
        missingData
    };
    res.renderSuccess('register', payload);
}

function getLogin(req, res) {
    const error = req.query.error;
    let invalidCredentials = false;
    let missingData = false;

    if (error) {
        invalidCredentials = error === "Invalid credentials";
        missingData = error === "Missing credentials";
    }

    let payload = {
        logged: false,
        invalidCredentials,
        missingData
    };
    res.renderSuccess("login", payload)
}

async function getNotFound(req, res) {
    res.renderUserError("notfound", {msg: "Page not found"});
}

async function getForgotPassword(req, res) {
    res.renderSuccess("forgotPassword");
}

async function getRestorePassword(req, res) {
    res.renderSuccess("restorePassword");
}

async function getUsers(req, res) {
    let users;
    try {
        users = await usersService.getUsers();
        users = users.filter(user => user.role !== 'admin');
    } catch (error) {
        req.logger.error(`Getting users view: ` + error.message);
        res.renderServerError("notfound", {msg: error.message});
    }

    const sanitizedUsers = users.map(user => ({ _id: user._id, last_name: user.last_name, first_name: user.first_name, email: user.email, role: user.role, last_connection: user.last_connection }));
    res.renderSuccess("users", { users: sanitizedUsers, logged: true });
}

export default { getHome, getProfile, getProducts, getProductById, getCartById, getRegister, getLogin, getNotFound, getRestorePassword, getForgotPassword, getUsers };
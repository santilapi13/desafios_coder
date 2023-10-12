import { Router } from 'express';
import { productModel } from '../dao/models/product.model.js';
import { cartModel } from '../dao/models/cart.model.js';
//import ProductManagerFS from '../dao/productManagerFS.js';
import ProductManagerDB from '../dao/productManagerDB.js';
import mongoose from "mongoose"
export const router = Router();

// Acá se selecciona el método de persistencia (File System o MongoDB)
const productManager = new ProductManagerDB();

const auth = (req, res, next) => {
    if (!req.session.user)
        return res.redirect('/login');

    next();    
}

const auth2 = (req, res, next) => {
    if(req.session.user) {
        return res.redirect('/profile');
    }

    next();
}


/*
router.get('/home', async (req,res) => {
    res.setHeader("Content-Type","text/html");
    const products = await productModel.find();
    const productsPlain = products.map(product => product.toObject());
	res.status(200).render("home", {
		title: "Lista de Productos",
        products: productsPlain
	});
});

router.get('/realtimeproducts', async (req,res) => {
    res.setHeader("Content-Type","text/html");
    const products = await productModel.find();
    const productsPlain = products.map(product => product.toObject());

    res.status(200).render("realtimeproducts", {
        title: "Productos en tiempo real",
        products: productsPlain
    });
});
*/

router.get('/products', auth, async (req,res) => {
    res.setHeader("Content-Type","text/html");
    let {limit, page, sort, query} = req.query;

    limit = limit ? parseInt(limit) : 10;
    if (isNaN(limit) || limit < 0)
        return res.status(400).json({status: 'error', msg: 'Parameter <limit> must be a non-negative integer'});

    page = page ? parseInt(page) : 1;
    if (isNaN(page) || page <= 0)
        return res.status(400).json({status: 'error', msg: 'Parameter <page> must be a positive integer'});

    if (sort && !['asc', 'desc'].includes(sort))
        return res.status(400).json({status: 'error', msg: 'Parameter <sort> must be one of the following: asc, desc'});
    let sortBy = sort ? {price: sort} : {};

    // query puede ser available o puede ser la categoria por la cual filtrar.
    let queryCondition = {};
    if (query)
        queryCondition = query === 'available' ? {status: true} : {category: query};

    let resultado;
    try {
        resultado = await productManager.getProducts(queryCondition, limit, page, sortBy);
    } catch (error) {
        return res.status(500).json({status: "error", msg: error.message});
    }

    let {
        totalPages,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage
    } = resultado;

    const baseUrl = "/products"; 
    const prevLink = hasPrevPage ? `${baseUrl}?page=${prevPage}&limit=${limit}${sort ?"&sort=" + sort : ""}${query ? "&query=" + query: ""}` : null;
    const nextLink = hasNextPage ? `${baseUrl}?page=${nextPage}&limit=${limit}${sort ?"&sort=" + sort : ""}${query ? "&query=" + query: ""}` : null;
    let lastPageLink = `${baseUrl}?page=${totalPages}&limit=${limit}${sort ?"&sort=" + sort : ""}${query ? "&query=" + query: ""}`; 

    let {first_name, last_name, role} = req.session.user;
    res.status(200).render("products", {
        title: `Productos`,
        first_name,
        last_name,
        role,
        products: resultado.docs,
        totalPages,
        hasPrevPage,
        hasNextPage,
        prevPage: prevLink,
        nextPage: nextLink,
        lastPageLink,
        page,
        logged: true
    }); 

});

router.get('/products/:pid', auth, async (req,res) => {
    res.setHeader("Content-Type","text/html");
    let { pid } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(pid))
            return res.status(400).render("notfound", {
                msg: "Error - Invalid product id format"
            });

        const product = await productModel.findOne({_id: pid});
        if (!product)
            return res.status(404).render("notfound", {
                msg: `Error - Product ${pid} not found`
            });

        let {title, price, description, code, category, stock} = product.toObject();

        res.status(200).render("product", {
            title,
            price,
            description,
            code,
            category,
            stock,
            id: pid,
            logged: true
        });
    } catch (error) {
        res.status(500).render("notfound", {msg: error.message});
    }
});

router.get('/carts/:cid', auth,  async (req,res) => {
    res.setHeader("Content-Type","text/html");
    let { cid } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(cid))
            return res.status(400).render("notfound", {
                msg: "Error - Invalid cart id format"
            });

        const cart = await cartModel.findOne({_id: cid});
        if (!cart)
            return res.status(404).render("notfound", {
                msg: `Error - Cart ${cid} not found`
            });

        let products = [];
        cart.products.forEach(product => {
            let newProduct = {
                ...product.product.toObject(),
                quantity: product.quantity,
                subtotal: product.subtotal
            }
            products.push(newProduct);
        });


        res.status(200).render("carts", {
            title: "Carrito de compras",
            products: products,
            cid,
            logged: true
        });
    } catch (error) {
        res.status(500).render("notfound", {msg: error.message});
    }

});

router.get('/', (req,res) => {
    const logged = req.session.user ? true : false;
    res.status(200).render('home', {
        logged
    });
});

router.get('/register', auth2, (req,res) => {
    res.status(200).render('register', {
        logged: false
    });
});

router.get('/login', auth2, (req,res) => {
    res.status(200).render('login', {
        logged: false
    });
});

router.get('/profile', auth, (req,res) => {
    let {first_name, last_name, email, age} = req.session.user;
    res.status(200).render('profile', {
        first_name,
        last_name,
        email,
        age,
        logged: true
    });
});




// Ignorar lo que sigue: implementacion vieja con File System
/*
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
*/
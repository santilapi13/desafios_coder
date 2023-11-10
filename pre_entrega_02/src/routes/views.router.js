import Router from './router.js';
import viewsController from '../controllers/viewsController.js';

const alreadyAuthenticated = (req, res, next) => {
    if(req.cookies.coderCookie) {
        return res.redirect('/profile');
    }

    next();
}

const nonAuthenticated = (req, res, next) => {
    if(!req.cookies.coderCookie) {
        return res.redirect('/login');
    }

    next();
}

export class ViewsRouter extends Router {
    init() {
        this.get('/', ["PUBLIC"], viewsController.getHome);

        this.get('/profile', ["USER", "ADMIN"], nonAuthenticated, viewsController.getProfile);

        this.get('/products', ["USER", "ADMIN"], nonAuthenticated, viewsController.getProducts);

        this.get('/products/:pid', ["USER", "ADMIN"], nonAuthenticated, viewsController.getProductById);

        this.get('/carts/:cid', ["USER", "ADMIN"],  nonAuthenticated, viewsController.getCartById);

        this.get('/register', ["PUBLIC"], alreadyAuthenticated, viewsController.getRegister);
        
        this.get('/login', ["PUBLIC"], alreadyAuthenticated, viewsController.getLogin);

        this.get('*', ["PUBLIC"], viewsController.getNotFound)
    }
}

/*
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
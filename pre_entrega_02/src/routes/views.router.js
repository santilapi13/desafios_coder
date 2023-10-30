import Router from './router.js';
import viewsController from '../controllers/viewsController.js';

export class ViewsRouter extends Router {
    init() {
        this.get('/', ["PUBLIC"], viewsController.getHome);

        this.get('/profile', ["USER", "ADMIN"], viewsController.getProfile);

        this.get('/products', ["USER", "ADMIN"], viewsController.getProducts);

        this.get('/products/:pid', ["USER", "ADMIN"], viewsController.getProductById);

        this.get('/carts/:cid', ["USER", "ADMIN"],  viewsController.getCartById);

        this.get('/register', ["PUBLIC"], alreadyAuthenticated, viewsController.getRegister);
        
        this.get('/login', ["PUBLIC"], alreadyAuthenticated, viewsController.getLogin);
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
import Router from './router.js'
import cartsController from '../controllers/cartsController.js';

export class CartsRouter extends Router {
    init() {
        this.post('/', ["USER", "PREMIUM"], cartsController.createCart);

        this.get('/:cid', ["USER", "ADMIN", "PREMIUM"], cartsController.getCartById);
        
        this.post('/:cid/product/:pid', ["USER", "PREMIUM"], cartsController.addProductToCart);
        
        this.delete('/:cid/products/:pid', ["USER", "PREMIUM"], cartsController.deleteProductFromCart);
        
        //this.put('/:cid', ["USER", "ADMIN"], cartsController.updateCart);
        
        this.put('/:cid/products/:pid', ["USER", "PREMIUM"], cartsController.updateAmountOfProductInCart);
        
        //this.delete('/:cid', ["USER", "ADMIN"], cartsController.deleteCart);

        this.post('/:cid/purchase', ["USER", "PREMIUM"], cartsController.purchaseCart);
    }
}
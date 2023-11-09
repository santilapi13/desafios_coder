import Router from './router.js'
import cartsController from '../controllers/cartsController.js';

export class CartsRouter extends Router {
    init() {
        this.post('/', ["USER"], cartsController.createCart);

        this.get('/:cid', ["USER", "ADMIN"], cartsController.getCartById);
        
        this.post('/:cid/product/:pid', ["USER"], cartsController.addProductToCart);
        
        this.delete('/:cid/products/:pid', ["USER"], cartsController.deleteProductFromCart);
        
        //this.put('/:cid', ["USER", "ADMIN"], cartsController.updateCart);
        
        this.put('/:cid/products/:pid', ["USER"], cartsController.updateAmountOfProductInCart);
        
        //this.delete('/:cid', ["USER", "ADMIN"], cartsController.deleteCart);
    }
}
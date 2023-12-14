import Router from './router.js'
import productsController from '../controllers/productsController.js';

export class ProductsRouter extends Router {
    init() {
        this.get('/', ["USER", "ADMIN", "PREMIUM"], productsController.getProducts);
        
        this.get('/:pid', ["USER", "ADMIN", "PREMIUM"], productsController.getProductById);
        
        this.post('/', ["ADMIN", "PREMIUM"], productsController.postProduct);
        
        this.put('/:pid', ["ADMIN", "PREMIUM"], productsController.putProduct);
        
        this.delete('/:pid', ["ADMIN", "PREMIUM"], productsController.deleteProduct);
    }
}
import Router from './router.js'
import productsController from '../controllers/productsController.js';

export class ProductsRouter extends Router {
    init() {
        this.get('/', ["USER", "ADMIN"], productsController.getProducts);
        
        this.get('/:pid', ["USER", "ADMIN"], productsController.getProductById);
        
        this.post('/', ["ADMIN"], productsController.postProduct);
        
        this.put('/:pid', ["ADMIN"], productsController.putProduct);
        
        this.delete('/:pid', ["ADMIN"], productsController.deleteProduct);
    }
}
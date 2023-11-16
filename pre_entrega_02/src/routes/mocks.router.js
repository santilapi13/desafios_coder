import Router from './router.js'
import { generateProduct } from '../util.js';

export class MocksRouter extends Router {
    init() {
        this.get('/', ["PUBLIC"], (req, res) => {
            let products = [];

            for (let i = 0; i < 100; i++) {
                products.push(generateProduct());
            }
            
            res.sendSuccess(products);
        });
    }
}
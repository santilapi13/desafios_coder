import { CartsMongoDAO as DAO } from "../DAO/cartsMongoDAO";

class CartsService {
    constructor(dao) {
        this.dao = new dao();
    }

    async getCarts() {
        return await this.dao.get();
    }

    async getCartById(id) {
        return await this.dao.get({_id:id});
    }

    async createCart(cart) {
        return await this.dao.create(cart)
    }

    async updateCart(id, cart) {
        return await this.dao.update(id, cart);
    }

    async deleteCart(id) {
        return await this.dao.delete({_id:id});
    }

    async validateCartId(cid) {
        return await this.dao.validateCartId(cid);
    }

    async getProductById(cid, pid) {
        return await this.dao.getProductById(cid, pid);
    }

    async updateAmountOfProductInCart(cid, pid, quantity) {
        return await this.dao.updateAmountOfProductInCart(cid, pid, quantity, subtotal);
    }

    async createProductInCart(cid, product) {
        return await this.dao.createProductInCart(cid, product);
    }

    async deleteProductFromCart(cid, pid) {
        return await this.dao.deleteProductFromCart(cid, pid);
    }

    async updateCart(cid, products) {
        return await this.dao.updateCart(cid, products);
    }
}

export const cartsService = new CartsService(DAO);
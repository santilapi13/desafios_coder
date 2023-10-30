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
}

export const cartsService = new CartsService(DAO);
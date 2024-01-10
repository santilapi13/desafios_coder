import { Users as DAO } from "../DAO/factory.js";
import { cartsService } from "./carts.service.js";

class UsersService {
    constructor(dao) {
        this.dao = new dao();
    }

    async getUsers() {
        return await this.dao.get()
    }

    async getUserById(id) {
        const user = await this.dao.get({_id:id})
        return user ? user[0] : null;
    }

    async getUserByEmail(email) {
        const user = await this.dao.get({email});
        return user ? user[0] : null;
    }

    async checkUserCredentials(email, password) {
        const user = await this.dao.get({email, password});
        return user ? user[0] : null;
    }

    async createUser(user) {
        const cart = await cartsService.createCart({products:[]});
        user.cart = cart._id;
        return await this.dao.create(user);
    }

    async updateUser(id, changes) {
        return await this.dao.update(id, changes);
    }

    async deleteUser(id) {
        return await this.dao.delete(id);
    }
}

export const usersService = new UsersService(DAO);
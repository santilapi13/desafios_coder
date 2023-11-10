import { Users as DAO } from "../DAO/factory.js"; 

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

    async createUser(user) {
        return await this.dao.create(user)
    }
}

export const usersService = new UsersService(DAO);
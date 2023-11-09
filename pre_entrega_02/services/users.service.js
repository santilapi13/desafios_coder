import { Users as DAO } from "../DAO/factory.js"; 

class UsersService {
    constructor(dao) {
        this.dao = new dao();
    }

    async getUsers() {
        return await this.dao.get()
    }

    async getUserById(id) {
        return await this.dao.get({_id:id})
    }

    async getUserByEmail(email) {
        return await this.dao.get({email})
    }

    async createUser(name, email) {
        return await this.dao.create({name, email})
    }
}

export const usersService = new UsersService(DAO);
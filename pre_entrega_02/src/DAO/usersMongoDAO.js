import mongoose from "mongoose";
import { usersModel } from "./model/user.model.js";

export class UsersMongoDAO {
    constructor() {
    }

    async get(filter = {}) {
        if(filter["_id"] && !mongoose.Types.ObjectId.isValid(filter["_id"]))
            throw new Error('Invalid user ID.');

        let result = await usersModel.find(filter);
        return result.length === 0 ? null : result;
    }

    async create(user) {
        return await usersModel.create(user);
    }

}
import mongoose from "mongoose";
import { usersModel } from "./model/user.model.js";

try {
    await mongoose.connect('mongodb+srv://santilapiana02:aHGwx1LOTFj9kMur@e-commerce.un2yreb.mongodb.net/?retryWrites=true&w=majority');
    console.log("MongoDB Online");
} catch (error) {
    console.log(error.message);
}

export class UsersMongoDAO {
    constructor() {
    }

    async get(filter = {}) {
        if(filter["_id"] && !mongoose.Types.ObjectId.isValid(filter["_id"]))
            throw new Error('Invalid user ID.');

        return await usersModel.find(filter);
    }

    async create(user) {
        return await usersModel.create(user);
    }

}
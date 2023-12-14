export class UsersFsDAO {
    constructor() {
    }

    async get(filter = {}) {
        /*
        if(filter["_id"] && !mongoose.Types.ObjectId.isValid(filter["_id"]))
            throw new Error('Invalid user ID.');

        return await usersModel.find(filter);
        */
    }

    async create(user) {
        //return await usersModel.create(user);
    }

}
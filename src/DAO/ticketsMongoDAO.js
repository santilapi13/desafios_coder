import mongoose from "mongoose";
import { ticketsModel } from './model/ticket.model.js';

export class TicketsMongoDAO {
    constructor() {
    }

    async get(filter = {}) {
        if (filter['_id'] && !mongoose.Types.ObjectId.isValid(filter['_id']))
            throw new Error("Invalid id");

        let result = await ticketsModel.find(filter);

        return result;
    }

    async create(ticket) {
        return await ticketsModel.create(ticket);
    }

}
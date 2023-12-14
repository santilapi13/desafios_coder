import mongoose from 'mongoose';

const ticketCollection = "ticket";

const ticketSchema = new mongoose.Schema({
    code: { type: String, unique: true},
    purchase_datetime: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true },
});

ticketSchema.pre('save', async function(next) {
    try {
        const count = await ticketsModel.countDocuments({});
        this.code = (count + 1).toString();
        next();
    } catch (error) {
        next(error);
    }
});

export const ticketsModel = mongoose.model(ticketCollection, ticketSchema);
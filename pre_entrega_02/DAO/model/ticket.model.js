import mongoose from 'mongoose';

const ticketCollection = "ticket";

const ticketSchema = new mongoose.Schema({
    code: { type: String, unique: true},
    purchase_datetime: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true },
});

ticketSchema.pre('create', function(next) {
    ticketsModel.countDocuments({}, (err, count) => {
        if (err) return next(err);

        doc.code = (count + 1).toString();
    })
    next();
})

export const ticketsModel = mongoose.model(ticketCollection, ticketSchema);
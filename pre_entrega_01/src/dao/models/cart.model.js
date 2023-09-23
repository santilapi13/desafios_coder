import mongoose from "mongoose";

const cartCollection = "cart";
const cartSchema = new mongoose.Schema({
    products: [{
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: "product", unique: true },
        quantity: Number,
        subtotal: Number
    }],
});

export const cartModel = mongoose.model(cartCollection, cartSchema);
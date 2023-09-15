import mongoose from "mongoose";

const cartCollection = "cart";
const cartSchema = new mongoose.Schema({
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
        quantity: Number,
        subtotal: Number
    }],
});

export const cartModel = mongoose.model(cartCollection, cartSchema);
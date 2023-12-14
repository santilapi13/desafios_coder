import mongoose from "mongoose";

const cartCollection = "cart";
const cartSchema = new mongoose.Schema({
    products: [
        {
            product: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: "product",
            },
            quantity: Number,
            subtotal: Number
        }
    ],
});

cartSchema.pre('find',function() {
    this.populate({
        path:'products.product'
    })
})

cartSchema.pre('findOne',function() {
    this.populate({
        path:'products.product'
    })
})

export const cartModel = mongoose.model(cartCollection, cartSchema);
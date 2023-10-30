import mongoose from "mongoose";
import { cartModel } from './model/cart.model.js';

export class CartsMongoDAO {
    constructor() {
    }

    async validateCartId(pid) {
        if (!mongoose.Types.ObjectId.isValid(cid))
            return {
                error: true,
                msg: "Invalid cart id format"
            };
        
        const cart = await cartModel.findById(cid);
        if (!cart)
            return {
                error: true,
                msg: "Cart id not found"
            };
        
        return {
            error: false,
            msg: "",
            cart
        }
    }

    async getProductById(cid, pid) {
        return await cartModel.findOne({_id: cid, "products.product": pid}, {"products.$": 1});
    }

    async updateAmountOfProductInCart(cid, pid, quantity, subtotal) {
        return await cartModel.updateOne(
            {_id: cid, "products.product": pid}, 
            {$set: {
                "products.$.quantity": quantity,
                "products.$.subtotal": subtotal
            }}
        );
    }

    async createProductInCart(cid, product) {
        return await cartModel.updateOne(
            {_id: cid},
            {$push: {"products": product}}
        );
    }

    async deleteProductFromCart(cid, pid) {
        return await cartModel.updateOne({_id: cid}, {$pull: {products: {product: pid}}});
    }

    async updateCart(cid, products) {
        return await cartModel.updateOne({_id: cid}, {$set: {products}});
    }
}
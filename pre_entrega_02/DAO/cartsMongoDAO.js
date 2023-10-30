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
}
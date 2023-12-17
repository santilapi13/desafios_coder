import mongoose from "mongoose";
import { productModel } from './model/product.model.js';

export class ProductsMongoDAO {
    constructor() {
    }

    async validateProductId(pid) {
        if (!mongoose.Types.ObjectId.isValid(pid))
            return {
                error: true,
                msg: "Invalid product id format"
            };
        
        const product = await productModel.findById(pid);
        if (!product)
            return {
                error: true,
                msg: "Product id not found"
            };
        
        return {
            error: false,
            msg: "",
            product
        }
    }

    async get(query = {}, filter = {}) {
        if (query['_id'] && !mongoose.Types.ObjectId.isValid(query['_id']))
            throw new Error("Invalid id");

        filter.lean = true;

        let result = await productModel.paginate(query, filter);
        
        if (filter['page']) {
            const maxPages = result.totalPages;
            if (filter.page > maxPages) {
                filter.page = maxPages;
                result = await productModel.paginate(query, filter);
            }
        }
        return result.length === 0 ? null : result;
    }

    async create(product) {
        return await productModel.create(product);
    }

    async update(id, product) {
        if (!mongoose.Types.ObjectId.isValid(id))
            throw new Error("Invalid id");

        return await productModel.findByIdAndUpdate({ _id: id }, product, { new: true });
    }

    async delete(filter) {
        if (filter['_id'] && !mongoose.Types.ObjectId.isValid(filter['_id']))
            throw new Error("Invalid id");

        return await productModel.deleteOne(filter);
    }
}

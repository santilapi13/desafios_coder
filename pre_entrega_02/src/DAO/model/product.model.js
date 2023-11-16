import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = "product";
const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    code: {
        type: String,
        unique: true,
    },
    price: Number,
    status: Boolean,
    stock: Number,
    category: String, // Se podria agregar otro atributo enum con el array de las categorias posibles
    thumbnail: [{
        type: String
    }]
});

productSchema.plugin(mongoosePaginate);

export const productModel = mongoose.model(productCollection, productSchema);
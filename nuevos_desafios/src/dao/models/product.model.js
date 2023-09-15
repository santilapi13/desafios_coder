import mongoose from "mongoose";

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

export const productModel = mongoose.model(productCollection, productSchema);
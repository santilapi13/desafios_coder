import mongoose from 'mongoose'

const userCollection = "user";

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    },
    age: Number,
    password: String,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "cart"
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    }
});

export const usersModel = mongoose.model(userCollection, userSchema);
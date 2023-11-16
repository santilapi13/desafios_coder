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

userSchema.pre('find',function() {
    this.populate({
        path:'cart'
    })
})

userSchema.pre('findOne',function() {
    this.populate({
        path:'cart'
    })
})


export const usersModel = mongoose.model(userCollection, userSchema);
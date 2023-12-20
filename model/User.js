const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email:{
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    phoneNumber: {
        type: String
    },
    passResetToken:{
        type: String,
        default: null
    }
}, {timestamps: true});

const User = mongoose.model("user", userSchema);

module.exports = User;
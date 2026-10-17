const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,  // if agar error send krna h [ture,"email already exist"], = syntax of send error 
        lowercase:true
    },

    password: {
        type: String,
        required: true
    },

//
//          ,{timestamps:true}
//     
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
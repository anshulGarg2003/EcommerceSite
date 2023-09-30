const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstname:{ type: String, required: true},
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    wishlist:{type:Array},
    order:{
      type:Array
    },
    pendingcartId:{type:String},
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);

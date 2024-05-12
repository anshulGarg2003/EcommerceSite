const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    isAdmin: { type: Boolean, required: true },
    password: { type: String, required: true },
    wishlist: { type: Array },
    order: {
      type: Array,
    },
    pendingcartId: { type: String },
    image: { type: String },
    address: { type: Array },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);

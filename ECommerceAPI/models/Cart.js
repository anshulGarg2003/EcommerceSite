const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    products: [
      {
        product: { type: Object },
        quantity: {
          type: Number,
          default: 1,
        },
        colour: {
          type: String,
          required: true,
        },
        size: {
          type: String,
          required: true,
        },
      },
    ],
    totalAmount: { type: Number },
    address: { type: String },
    mode: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);

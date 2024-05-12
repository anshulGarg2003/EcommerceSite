const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    about: { type: String, required: true },
    desc: { type: String, required: true },
    img: { type: String, required: true },
    categories: { type: Array },
    size: { type: Array },
    colour: { type: Array },
    price: { type: Number, required: true },
    inStock: { type: Number, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);

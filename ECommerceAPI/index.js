const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const orderRoute = require("./routes/order");
const cartRoute = require("./routes/cart");
const stripeRoute = require("./routes/stripe");
const slider = require("./routes/slider");
const cat = require("./routes/category");
const announce = require("./routes/announce");
const bodyParser = require("body-parser");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DBConnection Succesfull"))
  .catch((err) => console.log(`DBConnection Error:${err}`));

app.use(express.json());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/users", userRoute);
app.use("/api/orders", orderRoute);
app.use("/api/carts", cartRoute);
app.use("/api/checkout", stripeRoute);
app.use("/api/sliderdata", slider);
app.use("/api/categorydata", cat);
app.use("/api/announcement", announce);

app.listen(process.env.PORT || 5000, () => {
  console.log("Backend server is running");
});

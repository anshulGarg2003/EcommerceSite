const Cart = require("../models/Cart");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyToken,
} = require("./verifyToken");

const router = require("express").Router();

// Create

router.post("/", verifyToken, async (req, res) => {
  // res.status(200).json(req.body);
  // console.log(req.body);
  const { myCartProducts, myCartAmount } = req.body;

  const products = myCartProducts.map((product) => ({
    product: product.product,
    quantity: product.quantity,
    colour: product.colour,
    size: product.size,
  }));

  const newCart = new Cart({
    products,
    totalAmount: myCartAmount,
  });
  // console.log(newCart)

  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete Cart

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been delete...");
  } catch (err) {
    res.status(500), json(err);
  }
});

// Get User Cart

router.get("/find/", async (req, res) => {
  const user = req.query.user;
  // console.log(user);
  try {
    const cart = await Cart.findOne({_id:user});
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get All cart

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

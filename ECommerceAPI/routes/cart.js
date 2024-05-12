const Cart = require("../models/Cart");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyToken,
} = require("./verifyToken");

const router = require("express").Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
// Create

router.post(
  "/",
  upload.single("image"),
  verifyToken,
  async (req, res, next) => {
    // res.status(200).json(req.body);
    // console.log(req.body,"15");
    const { myCartProducts, myCartAmount, myaddress, mymode } = req.body;

    const products = myCartProducts?.map((product) => ({
      product: product.product,
      quantity: product.quantity,
      colour: product.colour,
      size: product.size,
    }));

    const newCart = new Cart({
      products,
      totalAmount: myCartAmount,
      address: myaddress,
      mode: mymode,
    });
    // console.log(newCart)

    try {
      const savedCart = await newCart.save();
      res.status(200).json(savedCart);
    } catch (err) {
      next(err);
    }
  }
);

// Update
router.post(
  "/update/:id",
  upload.single("image"),
  verifyToken,
  async (req, res, next) => {
    const { id } = req.params;
    const { myCartProducts, myCartAmount, myaddress, mymode } = req.body;

    const products = myCartProducts?.map((product) => ({
      product: product.product,
      quantity: product.quantity,
      colour: product.colour,
      size: product.size,
    }));

    try {
      // Find the cart by ID and update its contents
      const updatedCart = await Cart.findByIdAndUpdate(
        id,
        {
          products,
          totalAmount: myCartAmount,
          address: myaddress,
          mode: mymode,
        },
        { new: true }
      );

      if (!updatedCart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      res.status(200).json(updatedCart);
    } catch (err) {
      next(err);
    }
  }
);

// Delete Cart

router.delete(
  "/delete/:id",
  upload.single("image"),
  verifyToken,
  async (req, res) => {
    try {
      await Cart.findByIdAndDelete(req.params.id);
      res.status(200).json(true);
    } catch (err) {
      res.status(500), json(err);
    }
  }
);

// Get User Cart

router.get("/find/:id", upload.single("image"), async (req, res) => {
  const id = req.params.id;
  // console.log(id);
  try {
    const cart = await Cart.findOne({ _id: id });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get All cart

router.get(
  "/",
  upload.single("image"),
  verifyTokenAndAdmin,
  async (req, res) => {
    try {
      const carts = await Cart.find();
      res.status(200).json(carts);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

module.exports = router;

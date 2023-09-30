const User = require("../models/User");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.CRYPTO_SEC
    ).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DeleteUser

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been delete...");
  } catch (err) {
    res.status(500), json(err);
  }
});

// Get User

router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500), json(err);
  }
});
router.post("/toorder", async (req, res) => {
  const { myUserId, OrderId } = req.body.user
  try {
    const user = await User.findById(myUserId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.order.push(OrderId);
    await user.save();
    res.status(200).json(user);
  } catch (error) { 
    res.status(500).json({ message: "Server error" });
  }
});



router.post("/tocart", async (req, res) => {
  const { CartId,userId } = req.body.user
  // console.log(CartId,userId)

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.pendingcartId =CartId;
    await user.save();
    res.status(200).json(user);
  } catch (error) { 
    res.status(500).json({ message: "Server error" });
  }
});

// Adding into Wishlist
router.post("/add-to-wishlist", async (req, res) => {
  const { userId, product } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // console.log(user);
    user.wishlist.push(product);
    await user.save();
    res.status(200).json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete From WishList

router.post("/remove-from-wishlist", async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const updatedItems = user.wishlist.filter((item) => item._id !== productId);

    user.wishlist = updatedItems;
    await user.save();
    res.status(200).json(updatedItems);
  } catch (err) {}
});

// Get All User

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(1)
      : await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500), json(err);
  }
});

// Get User Stats

router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;

const User = require("../models/User");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const CryptoJS = require("crypto-js");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const router = require("express").Router();

router.put(
  "/:id",
  upload.single("image"),
  verifyTokenAndAuthorization,
  async (req, res) => {
    const { firstname, username, email, password, isAdmin } = req.body;

    if (!firstname || !username || !email || !password) {
      return res.status(401).json("Missing required fields");
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const imageUrl = req?.file?.path || updatedUser.image;
      updatedUser.firstname = firstname;
      updatedUser.username = username;
      updatedUser.email = email;
      updatedUser.password = CryptoJS.AES.encrypt(
        password,
        process.env.CRYPTO_SEC
      ).toString();
      updatedUser.isAdmin = isAdmin;
      updatedUser.image = imageUrl;

      await updatedUser.save();

      res
        .status(200)
        .json({ user: updatedUser, message: "Added Successfully" });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

// DeleteUser

router.delete(
  "/delete/:id",
  upload.single("image"),
  verifyTokenAndAuthorization,
  async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "User has been delete..." });
    } catch (err) {
      res.status(500), json(err);
    }
  }
);

// Get User

router.get("/find/:id", upload.single("image"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const hashedPassword = CryptoJS.AES.decrypt(
      user?.password,
      process.env.CRYPTO_SEC
    );

    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    // console.log(originalPassword)
    const { password, ...others } = user._doc;
    const ans = { ...others, originalPassword };
    console.log("All Done");
    res.status(200).json(ans);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/addaddress/:id", upload.single("image"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json("User Not found");
    }
    const { newAddress } = req.body;
    user.address.push(newAddress);
    await user.save();
    res.status(200).json({ message: "Address added successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/getaddress/:id", upload.single("image"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json("User Not found");
    }

    res.status(200).json(user.address);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/deleteaddress/:id", upload.single("image"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json("User Not found");
    }

    const index = req.body.index;
    const addressIndex = parseInt(index);

    if (
      isNaN(addressIndex) ||
      addressIndex < 0 ||
      addressIndex >= user.address.length
    ) {
      return res.status(400).json("Invalid index");
    }

    // Remove the address at the specified index using splice
    user.address.splice(addressIndex, 1);

    await user.save();

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/toorder", upload.single("image"), async (req, res) => {
  // console.log(req.body.user, "86");
  const { myUserId, OrderId } = req.body.user;
  try {
    const user = await User.findById(myUserId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.order.push(OrderId);
    user.pendingcartId = "";
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/tocart", upload.single("image"), async (req, res) => {
  const { CartId, userId } = req.body.user;
  // console.log(CartId,userId)

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.pendingcartId = CartId;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Adding into Wishlist
router.post("/add-to-wishlist", upload.single("image"), async (req, res) => {
  const { userId, product } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const productExists = user.wishlist.some((item) => item.equals(product));

    if (productExists) {
      return res.status(200).json({
        wishlist: user.wishlist,
        message: "Product already exists in wishlist",
      });
    }

    user.wishlist.push(product);
    await user.save();
    const response = {
      wishlist: user.wishlist,
      message: "Product has been added to your Wishlist",
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete From WishList

router.post(
  "/remove-from-wishlist",
  upload.single("image"),
  async (req, res) => {
    const { userId, productId } = req.body;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const updatedItems = user.wishlist.filter(
        (item) => item._id !== productId
      );

      user.wishlist = updatedItems;
      await user.save();
      res.status(200).json(updatedItems);
    } catch (err) {}
  }
);

// Get All User

router.get(
  "/",
  upload.single("image"),
  verifyTokenAndAdmin,
  async (req, res) => {
    const query = req.query.new;
    try {
      const users = query
        ? await User.find().sort({ _id: -1 }).limit(1)
        : await User.find();
      res.status(200).json(users);
    } catch (err) {
      res.status(500), json(err);
    }
  }
);

router.get(
  "/admin",
  upload.single("image"),
  verifyTokenAndAdmin,
  async (req, res) => {
    try {
      // Find users with isAdmin set to true
      const users = await User.find({ isAdmin: true });
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err); // Fix typo: change "," to "."
    }
  }
);

router.get("/getorders/:id", upload.single("image"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // console.log(user.order, "211");
    res.status(200).json(user.order);
  } catch (err) {
    res.status(500).json(err);
  }
});
// Get User Stats

router.get(
  "/stats",
  upload.single("image"),
  verifyTokenAndAdmin,
  async (req, res) => {
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
  }
);
module.exports = router;

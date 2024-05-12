const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/register", upload.single("image"), async (req, res) => {
  console.log("Hello", req.body);
  const { firstname, username, email, password, isAdmin } = req.body;
  const imageUrl = req?.file?.path;

  if (!firstname || !username || !email || !password) {
    return res.status(401).json("Missing required fields");
  }

  const existingUsername = await User.findOne({ $or: [{ username }] });
  const existingUseremail = await User.findOne({ $or: [{ email }] });

  if (existingUsername) {
    return res.status(401).json("Username already exists");
  }
  if (existingUseremail) {
    return res.status(401).json("Email already exists");
  }

  const newUser = new User({
    firstname,
    username,
    email,
    password: CryptoJS.AES.encrypt(password, process.env.CRYPTO_SEC).toString(),
    isAdmin: isAdmin || false, // Set default isAdmin to false if not provided
    wishlist: [], // Set default empty array for wishlist
    order: [], // Set default empty array for order
    pendingcartId: "", // Set default empty string for pendingcartId
    image: imageUrl || "", // Set default empty string for image
  });
  try {
    const savedUser = await newUser.save();
    res.status(200).json({ message: "Added successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});
// login

router.post("/login", upload.single("image"), async (req, res) => {
  // console.log(req.body);
  const { username, passi, isAdmin } = req.body;
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(401).json("Username not found!");
    }

    const isAdminBoolean = isAdmin === "true";
    // console.log(user.isAdmin, isAdminBoolean, "checking");

    if (user.isAdmin !== isAdminBoolean) {
      return res.status(401).json("Wrong Credentials");
    }
    console.log("done");

    const hashedPassword = CryptoJS.AES.decrypt(
      user?.password,
      process.env.CRYPTO_SEC
    );

    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    if (originalPassword !== passi) {
      return res.status(401).json("Wrong Password!");
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );
    const { password, ...others } = user._doc;
    // console.log(user)
    res.status(200).json({ ...others, originalPassword, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const { firstname, username, email, password } = req.body;

  // Check if all required fields are provided
  if (!firstname || !username || !email || !password) {
    return res.status(401).json("Missing required fields");
  }

  const existingUsername = await User.findOne({ $or: [{ username }] });
  const existingUseremail = await User.findOne({ $or: [{ email }] });

  if (existingUsername) {
    return res.status(401).json("Username already exists" );
  }
  if (existingUseremail) {
    return res.status(401).json("Email already exists" );
  }

  const newUser = new User({
    firstname,
    username,
    email,
    password: CryptoJS.AES.encrypt(
      password,
      process.env.CRYPTO_SEC
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// login

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(401).json("Username not found!");
    }

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.CRYPTO_SEC
    );

    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    if (originalPassword !== req.body.password) {
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
    // console.log(user._doc._id.newObjectId);

    res.status(200).json({...others,accessToken});
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

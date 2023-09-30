const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const newUser = new User({
    firstname:req.body.firstname,
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
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

    !user && res.status(401).json("Wrong Credentials!");

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.CRYPTO_SEC
    );

    const Originalpassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    // Originalpassword=user.password;

    Originalpassword != req.body.password &&
      res.status(401).json("Wrong Password!");

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );
    const { password, ...others } = user._doc;
    console.log(user._doc._id.newObjectId);

    res.status(200).json({...others,accessToken});
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

const Announcement = require("../models/Announcement");
const { verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get("/", async (req, res) => {
  try {
    let data;
    data = await Announcement.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.post(
  "/add",
  upload.single("image"),
  verifyTokenAndAdmin,
  async (req, res) => {
    const { user, announce } = req.body;
    // console.log(user)
    const newOrder = new Announcement({
      desc: announce,
    });
    try {
      await Announcement.deleteMany({});
      const data = await newOrder.save();
      res.status(200).json({ message: "Added Successfully" });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

module.exports = router;

const SliderData = require("../models/sliderdata.js");
const { verifyTokenAndAdmin } = require("./verifyToken.js");
const router = require("express").Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get("/", upload.single("image"), async (req, res) => {
  try {
    let data;
    data = await SliderData.find();
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
    console.log(req.body);
    const { title, desc } = req.body;
    const imageUrl = req.file.path;

    try {
      const newCat = new SliderData({
        title: title,
        desc: desc,
        img: imageUrl,
      });
      await newCat.save();

      res.status(200).json({ message: "Added Successfully" });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

router.delete(
  "/delete/:id",
  upload.single("image"),
  verifyTokenAndAdmin,
  async (req, res) => {
    // console.log(req.body);
    const { id } = req.params;
    console.log(id);

    try {
      const deletedSliderData = await SliderData.findByIdAndDelete(id);

      if (!deletedSliderData) {
        return res.status(404).json({ message: "Slider data not found" });
      }

      res.status(200).json({ message: "Slider data deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.put(
  "/edit",
  upload.single("image"),
  verifyTokenAndAdmin,
  async (req, res) => {
    // console.log(req.body);
    const { id, title, desc } = req.body;

    try {
      let sliderData = await SliderData.findById(id);

      if (!sliderData) {
        return res.status(404).json({ message: "Slider data not found" });
      }
      const imageUrl = req?.file?.path || sliderData.img;
      sliderData.title = title;
      sliderData.desc = desc;
      sliderData.img = imageUrl;

      await sliderData.save();

      res.status(200).json({ message: "Slider data Edited successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;

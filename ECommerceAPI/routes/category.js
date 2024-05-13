const { default: mongoose } = require("mongoose");
const CategoryData = require("../models/category");
const { verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get("/", async (req, res) => {
  try {
    let data;
    data = await CategoryData.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/add", upload.single("image"), async (req, res) => {
  try {
    console.log(req.body);
    const { title, cat } = req.body;
    const imageUrl = req.file.path;

    const newCat = new CategoryData({
      title: title,
      cat: cat,
      img: imageUrl,
    });
    await newCat.save();

    return res.status(200).json({ message: "Added Successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.delete(
  "/delete/:id",
  upload.single("image"),
  verifyTokenAndAdmin,
  async (req, res) => {
    const { id } = req.params;

    try {
      const deletedCategoryData = await CategoryData.findByIdAndDelete(id);
      // console.log(deletedCategoryData);

      if (!deletedCategoryData) {
        return res.status(404).json({ message: "Category data not found" });
      }

      res.status(200).json({ message: "Category data deleted successfully" });
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
    try {
      const { id, title, cat } = req.body;
      console.log(id);
      let categorydata = await CategoryData.findById(id);
      // console.log(categorydata)

      if (!categorydata) {
        return res.status(404).json({ message: "Category not found" });
      }
      const imageUrl = req?.file?.path || categorydata.img;

      categorydata.title = title;
      categorydata.cat = cat;
      categorydata.img = imageUrl;

      await categorydata.save();

      res.status(200).json({ message: "Category data edited successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;

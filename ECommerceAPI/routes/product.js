const Product = require("../models/Product");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = require("express").Router();

// Create

router.post(
  "/add",
  upload.single("image"),
  verifyTokenAndAdmin,
  async (req, res) => {
    // console.log(req.body);
    const { title, about, desc, categories, colors, size, price, inStock } =
      req.body;
    const imageUrl = req.file.path;
    // console.log(imageUrl)
    const newProduct = new Product({
      title,
      about,
      desc,
      categories,
      colors,
      size,
      price: Number(price),
      instock: Number(inStock),
      img: imageUrl,
    });

    try {
      const savedProduct = await newProduct.save();
      res.status(200).json(savedProduct);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

// Update
router.put(
  "/edit",
  upload.single("image"),
  verifyTokenAndAdmin,
  async (req, res) => {
    // console.log(req.body);
    const { id, title, about, desc, categories, colors, size, price, inStock } =
      req.body;
    try {
      let ProductData = await Product.findById(id);

      if (!ProductData) {
        return res.status(404).json({ message: "Product does not found" });
      }
      const imageUrl = req?.file?.path || ProductData.img;
      ProductData.title = title;
      ProductData.desc = desc;
      ProductData.img = imageUrl;
      ProductData.about = about;
      ProductData.categories = categories;
      ProductData.colour = colors;
      ProductData.size = size;
      ProductData.price = price;
      ProductData.inStock = inStock;

      await ProductData.save();

      res.status(200).json({ message: "Product data Edited successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// // Delete Products

router.delete("/delete/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product has been delete..." });
  } catch (err) {
    res.status(500), json(err);
  }
});

// // Get Product

router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500), json(err);
  }
});
router.put("/updatestock", upload.single("image"), async (req, res) => {
  try {
    const { myCartProducts } = req.body;
    // Iterate over each product in myCartProducts array
    await Promise.all(
      myCartProducts &&
        myCartProducts.map(async (cartProduct) => {
          const { product, quantity } = cartProduct;
          // console.log(quantity, product);

          // Find the product by productId
          const productData = await Product.findById(product._id);

          // Update the stock of the product
          if (productData) {
            productData.inStock -= quantity; // Reduce the stock by the quantity
            await productData.save(); // Save the updated product
          }
        })
    );

    res.status(200).json({ message: "Stock updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// // Get All Product

router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;
    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

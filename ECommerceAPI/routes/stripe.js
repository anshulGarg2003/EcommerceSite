const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_SEC);

router.post("/payment", (req, res) => {
  try {
    const stripeRes = stripe.charges.create({
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    });
    res.status(200).json(stripeRes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;

// routes/stripe.js
const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);

router.post("/payment", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "usd",
      metadata: { 
        cart: JSON.stringify(req.body.cartItems) // Sauvegarde les articles du panier
      }
    });
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
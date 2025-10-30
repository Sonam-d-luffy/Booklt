import express from "express";
import PromoCode from "../models/promo.js";

const router = express.Router();

// ✅ Apply promo code
router.post("/apply", async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: "Promo code is required" });

    const promo = await PromoCode.findOne({ code: code.toUpperCase() });
    if (!promo) return res.status(404).json({ message: "Invalid promo code" });
    if (!promo.isActive) return res.status(400).json({ message: "Promo code is inactive" });
    if (promo.expiryDate < new Date()) return res.status(400).json({ message: "Promo code expired" });
    if (promo.usedCount >= promo.usageLimit) return res.status(400).json({ message: "Usage limit reached" });

    // Increase used count
    promo.usedCount += 1;
    await promo.save();

    res.json({ discountPercent: promo.discountPercent, message: "Promo applied successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get('/promos' , async(req, res) => {
  try {
    const promos = await PromoCode.find()
    if(!promos) return res.status(404).json({message: 'Sorry , no promocodes are availabe'})
      return res.status(200).json({message: 'Apply Promo code' , promos:promos})
  } catch (error) {
      console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
})

// ✅ Admin route (optional): add new promo code
router.post("/create", async (req, res) => {
  try {
    const { code, discountPercent, expiryDate } = req.body;
    const promo = new PromoCode({ code, discountPercent, expiryDate });
    await promo.save();
    res.json({ message: "Promo code created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create promo code" });
  }
});

export default router;

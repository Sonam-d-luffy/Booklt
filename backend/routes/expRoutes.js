import express from 'express';
import Experience from '../models/exp.js';
import upload from '../utils/multer.js';
import mongoose from 'mongoose';

const router = express.Router();
router.post("/post", upload.single("image"), async (req, res) => {
  try {
    const { title, description, price } = req.body;
    let { slots } = req.body;

    // Parse stringified slots
    if (typeof slots === "string") {
      try {
        slots = JSON.parse(slots);
      } catch (err) {
        return res.status(400).json({ message: "Invalid slots JSON format" });
      }
    }

    if (!title || !description || !price || !Array.isArray(slots)) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exp = new Experience({
      title,
      description,
      price,
      image: req.file?.path || "",
      slots, // directly save array of { date, timings[] }
    });

    await exp.save();

    res.status(200).json({
      message: "Experience posted successfully ✅",
      exp,
    });
  } catch (error) {
    console.error("❌ Error in POST /post:", error);
    res.status(500).json({ message: "Server error", error });
  }
});


router.get('/all' , async(req , res) => {
    try {
        const exps = await Experience.find()
        if(!exps) {
            return res.status(400).json({message: 'No experience'})
        }
        return res.status(200).json({message: 'Experiences found' , experiences: exps})
    } catch (error) {
        
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
    }
})

router.get('/:expId/details' , async(req , res) => {
  try {
    const {expId} = req.params
       if (!expId) {
      return res.status(400).json({ message: 'Experience ID missing in request' });
    }
        // 🧩 Validate ObjectId to prevent CastError
    if (!mongoose.isValidObjectId(expId)) {
      return res.status(400).json({ message: 'Invalid Experience ID' });
    }

    const exp = await Experience.findById(expId)
    if(!exp) return res.status(404).json({message: 'Exp not found'})
      return res.status(200).json({message: 'Exp found' , exp:exp})
  } catch (error) {
    
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
})

export default router;

import mongoose from "mongoose";

const timingSchema = new mongoose.Schema({
  startTime: String,
  endTime: String,
  available: { type: Boolean, default: true },
});

const slotSchema = new mongoose.Schema({
  date: String,
  timings: [timingSchema],
});

const experienceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    slots: [slotSchema],
  },
  { timestamps: true }
);

const Experience = mongoose.model("Experience", experienceSchema);
export default Experience;

const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, 
      trim: true, // Remove leading/trailing whitespace
      maxlength: 100 
    },
    description: {
      type: String,
      required: true, 
      maxlength: 500 
    },
    price: {
      type: Number,
      required: true, 
      min: 0 // Ensure price is not negative
    },
    duration: {
      type: String,
      required: true, 
      enum: ["1week", "2weeks", "1month", "2months"], // Allowed categories
    },
    skillLevel: {
        type: String,
        required: true, 
        enum: ["beginner", "intermediate", "advanced"], 
    },
  },
  {
    timestamps: true, 
  }
);


const modelName = "Course";

module.exports = mongoose.model(modelName, courseSchema);

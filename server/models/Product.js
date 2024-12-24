const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
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
    category: {
      type: String,
      required: true, 
      enum: ["textiles", "pottery", "jewelry", "other"], // Allowed categories
    },
    image: {
      type: String, 
      default: null
    },
  },
  {
    timestamps: true, 
  }
);


const modelName = "Product";

module.exports = mongoose.model(modelName, productSchema);

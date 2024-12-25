const express = require('express');
const multer = require("multer");
const Product = require('../models/Product');
const router = express.Router();
const path = require("path");

// const upload = multer(); // Multer middleware to handle FormData

// Set up multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Store files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  }
});

const upload = multer({ storage });


// Create a new product (POST)
router.post("/", upload.single('image'), async (req, res) => {
  console.log("This API got hit Products wali");

  try {
    console.log("Request Body: ", req.body);
    const { name, description, price, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null; 

    console.log("Received Product Data:", req.body);

    const product = new Product({
      name,
      description,
      price,
      category,
      image
    });

    await product.save();

    res.status(201).json({ message: 'Product saved successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error saving product', error });
  }
});


// Fetch all products (GET)
router.get("/", async (req, res) => {
  console.log("This API got hit Products GET wali");

  try {
    const products = await Product.find(); // Fetch all products from MongoDB
    res.status(200).json({ message: 'Products fetched successfully', products });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

module.exports = router;

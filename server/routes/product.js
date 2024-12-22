const express = require('express');
const multer = require("multer");
const Product = require('../models/Product');
const router = express.Router();

const upload = multer(); // Multer middleware to handle FormData


// Create a new product (POST)
router.post("/", upload.none(), async (req, res) => {
  console.log("This API got hit Products wali");

  try {
    console.log("Request Body: ", req.body);
    const { name, description, price, category } = req.body;
    const image = req.body.image === '' ? null : req.body.image;

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

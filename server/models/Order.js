const mongoose = require('mongoose');

// Define the order schema
const orderSchema = new mongoose.Schema({
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account', // Assuming there is a User model
    required: true,
  },
  items: [
    {
      id: { type: String, required: true }, // Item ID
      name: { type: String, required: true }, // Item name
      price: { type: Number, required: true }, // Item price
      quantity: { type: Number, required: true }, // Quantity of the item
      image: { type: String, required: false }, // Image URL or path (optional)
    },
  ],
  date: {
    type: String, // Storing date as a string to match `toLocaleString` format
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});


const modelName = "Order";

module.exports = mongoose.model(modelName, orderSchema);

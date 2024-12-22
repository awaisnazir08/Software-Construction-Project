const express = require("express");
const router = express.Router();
const Account = require("../models/Account"); // Adjust path as per your project structure

// PUT route to update user profile
router.put("/", async (req, res) => {
  try {
    const {
      id,
      username, // Unique identifier for the account
      password,
      gender,
      age,
      location,
      description,
      skills,
      mentorAvailable,
    } = req.body;
    console.log(req.body);
    // Validate that the username is provided
    if (!id) {
      return res.status(400).json({ message: "Username is required to update profile" });
    }

    // Find and update the account
    const updatedAccount = await Account.findOneAndUpdate(
      { id }, // Find the document by username
      {
        $set: {
          username,
          gender,
          age,
          location,
          description,
          skills,
          mentorAvailable,
        },
      },
      { new: true, runValidators: true } // Return the updated document and run validators
    );

    if (!updatedAccount) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Send success response
    res.status(200).json({ message: "Profile updated successfully", data: updatedAccount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
});

module.exports = router;

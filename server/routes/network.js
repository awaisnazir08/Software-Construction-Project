const Account = require("../models/Account"); // Use your existing Account model
const express = require('express')
const router = express.Router();
router.get("/get", async (req, res) => {
  try {
    // Fetch the current user's ID from `req.user`
    const currentUserId = req.query.id; // Ensure your middleware sets `req.user`

    // Log for debugging
    console.log("This API got hit: network wali");

    // Fetch all users except the current user
    const accounts = await Account.find({ _id: { $ne: currentUserId } }); // Exclude current user

    // Transform data to match the required networkData structure
    const networkData = accounts.map((account) => ({
      id: account._id, // Assuming `Account` schema has an `_id` field
      name: account.username || "Anonymous", // Replace with your schema's field names
      role: account.description || "Role Not Defined",
      location: account.location || "Unknown",
      expertise: account.expertise || [], // Ensure expertise is an array
      mentorAvailable: account.mentorAvailable || false,
      connections: account.connections || 0,
      verifiedSkills: account.skills || [],
    }));

    res.status(200).json(networkData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch network data" });
  }
});




module.exports = router
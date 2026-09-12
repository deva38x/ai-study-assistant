const express = require("express");
const { 
    generateSummary,
    generateAssignment,

 } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Both routes require authentication
router.post("/summarize/:id", protect, generateSummary);
router.post("/assignment/:id", protect, generateAssignment);

module.exports = router;

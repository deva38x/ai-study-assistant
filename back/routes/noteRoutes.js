const express = require("express");

const {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  upload.single("pdf"),
  createNote
);

router.get("/", protect, getNotes);

router.put("/:id", protect, updateNote);

router.delete("/:id", protect, deleteNote);

module.exports = router;
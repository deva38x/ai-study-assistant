const Note = require("../models/Note");
const fs = require("fs");
const path = require("path");

const createNote = async (req, res) => {
  try {
    const { title, subject } = req.body;

    // Check text fields
    if (!title || !subject) {
      return res.status(400).json({
        message: "Title and subject are required",
      });
    }

    // Check PDF
    if (!req.file) {
      return res.status(400).json({
        message: "PDF file is required",
      });
    }

    // URL/path where the uploaded PDF can be accessed
    const pdfUrl = `/uploads/${req.file.filename}`;

    const note = await Note.create({
      title,
      subject,
      pdfUrl,
      user: req.user._id,
    });

    res.status(201).json(note);

  } catch (error) {
    console.error("Create note error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      user: req.user._id,
    });

    res.json(notes);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    // Make sure the user owns this note
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json(updatedNote);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    // Make sure the user owns this note
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    // Delete the physical PDF file
    if (note.pdfUrl) {
      const fileName = path.basename(note.pdfUrl);
      const filePath = path.join(
        __dirname,
        "../uploads",
        fileName
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Note.findByIdAndDelete(req.params.id);

    res.json({
      message: "Note deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
};
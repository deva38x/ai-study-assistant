const Note = require("../models/Note");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// ==========================================
// CREATE STUDY MATERIAL
// ==========================================

const createNote = async (req, res) => {
  try {
    const { title, subject } = req.body;

    if (!title || !subject) {
      return res.status(400).json({
        message: "Title and subject are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "PDF file is required",
      });
    }

    console.log("Uploading PDF to Cloudinary...");

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "ai-study-assistant/pdfs",
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      streamifier
        .createReadStream(req.file.buffer)
        .pipe(uploadStream);
    });

    console.log(
      "PDF uploaded to Cloudinary:",
      uploadResult.secure_url
    );

    const note = await Note.create({
      title,
      subject,
      pdfUrl: uploadResult.secure_url,
      user: req.user._id,
    });

    console.log("Study material saved to MongoDB");

    res.status(201).json(note);

  } catch (error) {
    console.error("Create note error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
// ==========================================
// GET ALL STUDY MATERIALS
// ==========================================
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(notes);

  } catch (error) {
    console.error("Get notes error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// UPDATE STUDY MATERIAL
// ==========================================
const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    // Make sure the user owns this note
    if (
      note.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        subject: req.body.subject,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.json(updatedNote);

  } catch (error) {
    console.error("Update note error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// DELETE STUDY MATERIAL
// ==========================================
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    // Make sure the user owns this note
    if (
      note.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    // Delete note from MongoDB
    // PDF remains in Cloudinary for now
    await Note.findByIdAndDelete(req.params.id);

    res.json({
      message: "Note deleted successfully",
    });

  } catch (error) {
    console.error("Delete note error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// EXPORT CONTROLLERS
// ==========================================
module.exports = {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
};
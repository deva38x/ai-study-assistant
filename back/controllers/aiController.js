const {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} = require("@google/genai");

const fs = require("fs");
const path = require("path");
const os = require("os");
const Note = require("../models/Note");


// ==========================================
// GEMINI AI CLIENT
// ==========================================
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_AI_KEY,
});


// ==========================================
// GET NOTE AND DOWNLOAD PDF FROM CLOUDINARY
// ==========================================
const getNoteAndPdf = async (req) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    const error = new Error("Study material not found");
    error.statusCode = 404;
    throw error;
  }

  // Make sure the logged-in user owns this note
  if (
    note.user.toString() !==
    req.user._id.toString()
  ) {
    const error = new Error(
      "Not authorized to access this study material"
    );
    error.statusCode = 403;
    throw error;
  }

  // Check PDF URL
  if (!note.pdfUrl) {
    const error = new Error(
      "This study material does not have a PDF"
    );
    error.statusCode = 400;
    throw error;
  }

  console.log("Cloudinary PDF URL:");
  console.log(note.pdfUrl);

  // ==========================================
  // CREATE TEMPORARY PDF PATH
  // ==========================================
  const tempFileName =
    `study-${note._id}-${Date.now()}.pdf`;

  const tempPdfPath = path.join(
    os.tmpdir(),
    tempFileName
  );

  console.log("Downloading PDF from Cloudinary...");

  // ==========================================
  // DOWNLOAD PDF
  // ==========================================
  const response = await fetch(note.pdfUrl);

  if (!response.ok) {
    throw new Error(
      `Failed to download PDF from Cloudinary. Status: ${response.status}`
    );
  }

  const arrayBuffer =
    await response.arrayBuffer();

  const pdfBuffer =
    Buffer.from(arrayBuffer);

  // ==========================================
  // SAVE TEMPORARY PDF
  // ==========================================
  fs.writeFileSync(
    tempPdfPath,
    pdfBuffer
  );

  console.log(
    "PDF downloaded successfully:"
  );

  console.log(tempPdfPath);

  return {
    note,
    pdfPath: tempPdfPath,
  };
};


// ==========================================
// GENERATE SUMMARY
// ==========================================
const generateSummary = async (req, res) => {
  let uploadedFile = null;
  let pdfPath = null;

  try {
    // Get note and download PDF
    const result =
      await getNoteAndPdf(req);

    const note = result.note;
    pdfPath = result.pdfPath;

    console.log(
      "Generating summary for:",
      note.title
    );

    console.log(
      "Temporary PDF:",
      pdfPath
    );

    // ==========================================
    // UPLOAD PDF TO GEMINI
    // ==========================================
    uploadedFile =
      await ai.files.upload({
        file: pdfPath,
        config: {
          mimeType: "application/pdf",
        },
      });

    console.log(
      "PDF uploaded to Gemini:",
      uploadedFile.name
    );

    // ==========================================
    // SUMMARY PROMPT
    // ==========================================
    const prompt = `
Read the PDF document carefully.

Create a clear and easy-to-understand study summary based ONLY
on the contents of this PDF.

Topic: "${note.title}"
Subject: "${note.subject}"

The main purpose of this application is to help students
understand difficult study material easily.

The summary should:

- Explain all important concepts from the PDF
- Use simple language
- Explain difficult concepts step-by-step
- Include important definitions
- Include important formulas when present
- Include important examples from the PDF
- Include the main points and key ideas
- Organize the information with useful headings
- Be comprehensive but easy to read
- Do not invent information that is not in the PDF
- Do not use outside information
- Make the explanation suitable for a student who is learning
  the topic for the first time

Base the summary entirely on the uploaded PDF.
`;

    // ==========================================
    // GENERATE SUMMARY USING GEMINI
    // ==========================================
    const response =
      await ai.models.generateContent({
        model: "gemini-3.6-flash",

        contents: createUserContent([
          createPartFromUri(
            uploadedFile.uri,
            uploadedFile.mimeType
          ),
          prompt,
        ]),
      });

    const summary =
      response.text;

    // ==========================================
    // DELETE TEMPORARY PDF
    // ==========================================
    if (
      pdfPath &&
      fs.existsSync(pdfPath)
    ) {
      fs.unlinkSync(pdfPath);
    }

    res.json({
      success: true,
      summary,
      title: note.title,
      subject: note.subject,
    });

  } catch (error) {
    console.error(
      "Summary generation error:",
      error
    );

    // Delete temporary PDF if something failed
    if (
      pdfPath &&
      fs.existsSync(pdfPath)
    ) {
      fs.unlinkSync(pdfPath);
    }

    res.status(
      error.statusCode || 500
    ).json({
      message:
        error.message ||
        "Failed to generate summary",
    });
  }
};


// ==========================================
// GENERATE ASSIGNMENT
// ==========================================
const generateAssignment = async (req, res) => {
  let uploadedFile = null;
  let pdfPath = null;

  try {
    // Get note and download PDF
    const result =
      await getNoteAndPdf(req);

    const note = result.note;
    pdfPath = result.pdfPath;

    console.log(
      "Generating assignment for:",
      note.title
    );

    console.log(
      "Temporary PDF:",
      pdfPath
    );

    // ==========================================
    // UPLOAD PDF TO GEMINI
    // ==========================================
    uploadedFile =
      await ai.files.upload({
        file: pdfPath,
        config: {
          mimeType: "application/pdf",
        },
      });

    console.log(
      "PDF uploaded to Gemini:",
      uploadedFile.name
    );

    // ==========================================
    // ASSIGNMENT PROMPT
    // ==========================================
    const prompt = `
Read the uploaded PDF carefully.

Create an educational assignment based ONLY on the
information and concepts contained in this PDF.

Topic: "${note.title}"
Subject: "${note.subject}"

Create 8 questions.

The questions should be based on the ACTUAL CONTENT
of the PDF.

Include a mixture of:

1. Basic understanding questions
2. Definition questions
3. Conceptual questions
4. Application questions
5. Analytical questions
6. Challenging questions

Requirements:

- Every question must be based on something actually
  explained in the PDF.
- Do NOT create questions from the title alone.
- Do NOT introduce topics that are not present in the PDF.
- Questions should test whether the student understood
  the PDF.
- Use easy, medium and difficult questions.
- Number the questions from 1 to 8.
- Do not provide answers.
- Make the assignment suitable for students studying
  this material.

Base the entire assignment on the uploaded PDF.
`;

    // ==========================================
    // GENERATE ASSIGNMENT USING GEMINI
    // ==========================================
    const response =
      await ai.models.generateContent({
        model: "gemini-3.6-flash",

        contents: createUserContent([
          createPartFromUri(
            uploadedFile.uri,
            uploadedFile.mimeType
          ),
          prompt,
        ]),
      });

    const assignment =
      response.text;

    // ==========================================
    // DELETE TEMPORARY PDF
    // ==========================================
    if (
      pdfPath &&
      fs.existsSync(pdfPath)
    ) {
      fs.unlinkSync(pdfPath);
    }

    res.json({
      success: true,
      assignment,
      title: note.title,
      subject: note.subject,
    });

  } catch (error) {
    console.error(
      "Assignment generation error:",
      error
    );

    // Delete temporary PDF if something failed
    if (
      pdfPath &&
      fs.existsSync(pdfPath)
    ) {
      fs.unlinkSync(pdfPath);
    }

    res.status(
      error.statusCode || 500
    ).json({
      message:
        error.message ||
        "Failed to generate assignment",
    });
  }
};


// ==========================================
// EXPORT
// ==========================================
module.exports = {
  generateSummary,
  generateAssignment,
};
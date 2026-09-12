const { GoogleGenAI, createUserContent, createPartFromUri } = require("@google/genai");
const fs = require("fs");
const path = require("path");
const Note = require("../models/Note");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_AI_KEY,
});


// ==========================================
// Get PDF from the selected study material
// ==========================================
const getNoteAndPdf = async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error("Study material not found");
  }

  // Make sure the logged-in user owns this note
  if (note.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to access this study material");
  }

  if (!note.pdfUrl) {
    res.status(400);
    throw new Error("This study material does not have a PDF");
  }

  const fileName = path.basename(note.pdfUrl);

  const pdfPath = path.join(
    __dirname,
    "../uploads",
    fileName
  );

  if (!fs.existsSync(pdfPath)) {
    res.status(404);
    throw new Error("PDF file not found on server");
  }

  return {
    note,
    pdfPath,
  };
};


// ==========================================
// GENERATE SUMMARY
// ==========================================
const generateSummary = async (req, res) => {
  let uploadedFile = null;

  try {
    const { note, pdfPath } = await getNoteAndPdf(req, res);

    console.log("Generating summary for:", note.title);
    console.log("PDF:", pdfPath);

    // Upload the actual PDF to Gemini
    uploadedFile = await ai.files.upload({
      file: pdfPath,
      config: {
        mimeType: "application/pdf",
      },
    });

    console.log("PDF uploaded to Gemini:", uploadedFile.name);

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

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: createUserContent([
        createPartFromUri(
          uploadedFile.uri,
          uploadedFile.mimeType
        ),
        prompt,
      ]),
    });

    const summary = response.text;

    res.json({
      success: true,
      summary,
      title: note.title,
      subject: note.subject,
    });

  } catch (error) {
    console.error("Summary generation error:", error);

    res.status(500).json({
      message: "Failed to generate summary",
      error: error.message,
    });
  }
};


// ==========================================
// GENERATE ASSIGNMENT
// ==========================================
const generateAssignment = async (req, res) => {
  let uploadedFile = null;

  try {
    const { note, pdfPath } = await getNoteAndPdf(req, res);

    console.log("Generating assignment for:", note.title);
    console.log("PDF:", pdfPath);

    // Upload the SAME PDF to Gemini
    uploadedFile = await ai.files.upload({
      file: pdfPath,
      config: {
        mimeType: "application/pdf",
      },
    });

    console.log("PDF uploaded to Gemini:", uploadedFile.name);

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

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: createUserContent([
        createPartFromUri(
          uploadedFile.uri,
          uploadedFile.mimeType
        ),
        prompt,
      ]),
    });

    const assignment = response.text;

    res.json({
      success: true,
      assignment,
      title: note.title,
      subject: note.subject,
    });

  } catch (error) {
    console.error("Assignment generation error:", error);

    res.status(500).json({
      message: "Failed to generate assignment",
      error: error.message,
    });
  }
};


module.exports = {
  generateSummary,
  generateAssignment,
};
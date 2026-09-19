const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

console.log("Cloudinary cloud name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log(
  "Cloudinary API key loaded:",
  process.env.CLOUDINARY_API_KEY ? "YES" : "NO"
);
console.log(
  "Cloudinary API secret loaded:",
  process.env.CLOUDINARY_API_SECRET ? "YES" : "NO"
);
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const noteRoutes = require("./routes/noteRoutes");
const aiRoutes = require("./routes/aiRoutes");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("AI Study Assistant Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
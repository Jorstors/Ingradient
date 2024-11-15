const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const admin = require("firebase-admin");
const fs = require("fs");

// Load environment variables
dotenv.config();

// Initialize Firebase Admin SDK
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://your-project-id.firebaseio.com",
});

const db = admin.firestore();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Handle requests for the Edamam API
app.get("/api/edamam", async (req, res) => {
  try {
    const apiKey = process.env.EDAMAM_API_KEY;
    const apiID = process.env.EDAMAM_API_ID;
    res.json({ apiKey, apiID });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Catch all handler for all other requests, which sends the index.html file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

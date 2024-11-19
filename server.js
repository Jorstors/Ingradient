const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const admin = require("firebase-admin");

// Load environment variables
dotenv.config();

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ingradient-1808d.firebaseio.com",
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

// Example Firestore read operation
app.get("/api/firestore/read", async (req, res) => {
  try {
    const doc = await db.collection("your-collection").doc("your-doc-id").get();
    if (!doc.exists) {
      res.status(404).json({ error: "Document not found" });
    } else {
      res.json(doc.data());
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to read data" });
  }
});

// Example Firestore write operation
app.post("/api/firestore/write", async (req, res) => {
  try {
    await db.collection("your-collection").doc("your-doc-id").set({
      field: "value",
    });
    res.json({ message: "Document written successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to write data" });
  }
});

// Catch all handler for all other requests, which sends the index.html file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const userModel = require("./models/user");
require("dotenv").config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const viewsPath = path.join(__dirname, "views");

// Serve static HTML files
app.get("/", (req, res) => {
  res.sendFile(path.join(viewsPath, "index.html"));
});

app.get("/read", async (req, res) => {
  res.sendFile(path.join(viewsPath, "read.html"));
});

app.get("/edit/:userid", async (req, res) => {
  res.sendFile(path.join(viewsPath, "edit.html"));
});

// API endpoints for CRUD operations
app.get("/delete/:id", async (req, res) => {
  await userModel.findByIdAndDelete(req.params.id);
  res.redirect("/read");
});

app.post("/update/:userid", async (req, res) => {
  let { name, email, image } = req.body;
  await userModel.findByIdAndUpdate(req.params.userid, { name, email, image });
  res.redirect("/read");
});

app.post("/create", async (req, res) => {
  let { name, email, image } = req.body;
  await userModel.create({ name, email, image });
  res.redirect("/read");
});

// Optional: API endpoint to get all users as JSON (for AJAX)
app.get("/api/users", async (req, res) => {
  const users = await userModel.find();
  res.json(users);
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

module.exports = app;

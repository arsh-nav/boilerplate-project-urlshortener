require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory database
let urlDb = [];
let nextId = 1;

// POST /api/shorturl → create a short URL
app.post("/api/shorturl", (req, res) => {
  const inputUrl = req.body.url;

  try {
    // Validate URL
    const urlObj = new URL(inputUrl);
    if (urlObj.protocol !== "http:" && urlObj.protocol !== "https:") {
      throw new Error("Invalid protocol");
    }

    // Assign short_url ID
    const shortUrl = nextId++;
    urlDb.push({ original_url: inputUrl, short_url: shortUrl });

    // Respond with JSON
    res.json({ original_url: inputUrl, short_url: shortUrl });
  } catch (err) {
    res.json({ error: "invalid url" });
  }
});

// GET /api/shorturl/:short_url → redirect to original URL
app.get("/api/shorturl/:short_url", (req, res) => {
  const shortUrlId = parseInt(req.params.short_url);
  const record = urlDb.find(r => r.short_url === shortUrlId);

  if (record) {
    res.redirect(record.original_url); // 302 redirect
  } else {
    res.json({ error: "No short URL found for the given input" });
  }
});


app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

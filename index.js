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
let urlDb = [];
let nextId = 1;

app.post("/api/shorturl", (req, res) => {
  try {
    let urlObj = new URL(req.body.url); // for validation
    if (urlObj.protocol !== "http:" && urlObj.protocol !== "https:") {
      throw new Error("Invalid protocol");
    }

    const shortUrl = nextId++;
    urlDb.push({ original_url: req.body.url, short_url: shortUrl });

    res.json({ original_url: req.body.url, short_url: shortUrl });
  } catch (err) {
    res.json({ error: "invalid url" });
  }
});
app.get("/api/shorturl/:short_url", (req, res) => {
  // :short_url is a URL parameter, e.g., /api/shorturl/1
  const shortUrlId = parseInt(req.params.short_url);
  const record = urlDb.find(r => r.short_url === shortUrlId);
  if (record) {
    res.redirect(record.original_url); // HTTP 302 redirect
  } else {
    res.json({ error: "No short URL found for the given input" });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

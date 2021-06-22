require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const crypto = require("crypto");

const UrlModel = require("./database").UrlModel;

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

// Body parser equivalent
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", (req, res) => {
  let short_url = randomShortUrl();

  let url = new UrlModel({ original_url: req.body.url, short_url });
  res.json({ original_url: req.body.url, short_url });
});

app.use(function (err, req, res, next) {
  if (err) {
    res
      .status(err.status || 500)
      .type("txt")
      .send(err.message || "SERVER ERROR");
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

function randomShortUrl(length = 4) {
  let short_url = crypto.randomInt(Math.pow(36, length)).toString(36);

  let uppercasePatch = crypto.randomInt(Math.pow(2, length)).toString(2).split("");
  short_url = short_url.split("");
  for (let x = 0; x < short_url.length; x++) {
    if (uppercasePatch[x] == "1") short_url[x] = short_url[x].toUpperCase();
  }

  short_url = short_url.join("");
  if (short_url.length < length) short_url = randomShortUrl();
  return short_url;
}

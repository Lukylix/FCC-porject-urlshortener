require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const crypto = require("crypto");

const { createOneUrl, findUrlByShort } = require("./database");

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

app.post("/api/shorturl", async (req, res, next) => {
  if (
    !req.body.url.match(
      /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
    )
  )
    return res.json({ error: "Invalid URL" });

  let short_url = await randomUniqShortUrl();

  createOneUrl({ original_url: req.body.url, short_url }, (err, data) => {
    if (err) return next(err);
    if (!data) return next({ message: "Missing callback argument" });
    res.json({ original_url: data.original_url, short_url: data.short_url });
  });
});

app.get("/api/shorturl/:shorturl", async (req, res, next) => {
  try {
    let data = await findUrlByShort(req.params.shorturl);
    res.redirect(data.original_url);
  } catch (err) {
    next(err);
  }
});

//Error handler
app.use(function (err, req, res, next) {
  if (err) {
    console.log(err);
    res
      .status(err.status || 500)
      .type("txt")
      .send(err.message || "SERVER ERROR");
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

async function randomUniqShortUrl() {
  let short_url = randomShortUrl();
  const data = await findUrlByShort(short_url);
  return data ? randomUniqShortUrl() : short_url;
}

function randomShortUrl(length = 4) {
  let short_url = crypto.randomInt(Math.pow(36, length)).toString(36);

  let uppercaseMask = crypto.randomInt(Math.pow(2, length)).toString(2).split("");
  short_url = short_url.split("");
  for (let x = 0; x < short_url.length; x++) if (uppercaseMask[x] == "1") short_url[x] = short_url[x].toUpperCase();
  short_url = short_url.join("");

  if (short_url.length < length) short_url = randomShortUrl();
  return short_url;
}

require("dotenv").config();
let mongoose = require("mongoose");
let { Schema, model } = mongoose;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const UrlSchema = new Schema({
  original_url: { type: String, required: true },
  short_url: { type: String, required: true, unique: true },
});

const Url = model("Url", UrlSchema);

const createOneUrl = (urlData, done) => {
  let entry = new Url(urlData);
  entry.save((err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

const findUrlByShort = (short_url) => {
  return Url.findOne({ short_url: short_url })
    .then((data) => {
      return data;
    })
    .catch((e) => {throw e});
};

exports.UrlSchema = UrlSchema;
exports.UrlModel = Url;
exports.findUrlByShort = findUrlByShort;
exports.createOneUrl = createOneUrl;

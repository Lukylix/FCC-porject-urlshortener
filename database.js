require("dotenv").config();
let mongoose = require("mongoose");
let { Schema, model } = mongoose;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const UrlSchema = new Schema({
  original_url: { type: String, required: true, unique: true },
  short_url: { type: String, required: true },
});

exports.UrlSchema = UrlSchema;
exports.UrlModel = model("UrlModel", UrlSchema);

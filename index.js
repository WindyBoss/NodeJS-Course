const express = require("express");
const multer = require("multer");
const path = require("path");

/**
 Multer Stages:

 1. storage initiation (configuration of destination and filename)
 2. add storage to multer
 3. add express.static middleware
 4. add middleware "upload.single"
 */

const storage = multer.diskStorage({
  destination: "static",
  filename: function (req, file, cb) {
    console.log("file", file);
    const ext = path.parse(file.originalname).ext;
    // The name of saved file will be equal to current date + extension
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage }); // - storage using

const PORT = 3000;
const app = express();

app.use(express.static("static")); // - set express to use files from static library

/**
 * upload single - multer middleware
 */
app.post("/form-data", upload.single("file_example"), (req, res, next) => {
  console.log("req.file", req.file);
  console.log("req.body", req.body);

  res.status(200).send();
});

app.listen(PORT, () => {
  console.log("listening on port", PORT);
});

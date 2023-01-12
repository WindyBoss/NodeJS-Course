import path from "path";
import multer from "multer";
import express from "express";
import { promises as fsPromises } from "fs";

import imagemin from "imagemin";
/**
 * The next imports are plugins for parsing jpeg & png picture format
 */
import imageminJpegtran from "imagemin-jpegtran";
import imageminPngquant from "imagemin-pngquant";

const storage = multer.diskStorage({
  destination: "draft",
  filename: function (req, file, cb) {
    console.log("file", file);
    const ext = path.parse(file.originalname).ext;
    // The name of saved file will be equal to current date + extension
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

const PORT = 3000;
const app = express();

app.use(express.static("static"));

app.post(
  "/form-data",
  upload.single("file_example"),
  minifyImage,
  (req, res, next) => {
    console.log("req.file", req.file);
    console.log("req.body", req.body);

    return res.status(200).send();
  }
);

app.listen(PORT, () => {
  console.log("listening on port", PORT);
});

/**
 * minifyImage - resize pictures and save them in destination directory
 * 
    imageminJpegtran & imageminPngquant - plugin
 */

async function minifyImage(req, res, next) {
  try {
    const MINIFIED_DIR = "static";

    await imagemin([req.file.path], {
      // must be async
      destination: MINIFIED_DIR,
      plugins: [
        imageminJpegtran(),
        imageminPngquant({
          quality: [0.6, 0.8], // - quality of the image after process
        }),
      ],
    });

    const { filename, path: draftPath } = req.file;

    // It is good practice to delete raw picture saved by multer, and leave only minimized
    await fsPromises.unlink(draftPath);

    // set req.file
    req.file = {
      ...req.file,
      path: path.join(MINIFIED_DIR, filename),
      destination: MINIFIED_DIR,
    };
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Generally code will do the next steps:
 1. serve text fields and file post fetch
 2. save picture in 'draft' folder by using multer
 3. get image from 'draft' folder
 4. use plugin to decrease size of picture 
 5. save picture in 'static' folder
 6. delete from 'draft'
 */

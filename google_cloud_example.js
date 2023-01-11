import path from "path";
import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
import { Storage } from "@google-cloud/storage";

import dotenv from "dotenv";
dotenv.config();
const { Key_Json_Name, Project_ID } = process.env;

async function main(
  bucketName = "first_storage_bucket_by_viti",
  filePath = path.join("./static/1673469229049.png"),
  destFileName = `${Date.now()}.png`,

  generationMatchPrecondition = 0
) {
  const storage = new Storage({
    projectId: Project_ID,
    keyFilename: `${__dirname}${Key_Json_Name}`,
  });

  async function uploadFile() {
    const options = {
      destination: destFileName,

      preconditionOpts: { ifGenerationMatch: generationMatchPrecondition },
    };
    await storage.bucket(bucketName).upload(filePath, options);
  }

  uploadFile().catch(console.error);
}

main(...process.argv.slice(2));

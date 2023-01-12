import path from "path";
import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
import { Storage } from "@google-cloud/storage";

import dotenv from "dotenv";
dotenv.config();
// don't add json key number or projectID here
const { Key_Json_Name, Project_ID } = process.env;

/**
 *
 * @param {String} bucketName - name of the bucket in google cloud storage
 * @param {String or Function} filePath - the path  to the file on current computer
 * @param {String} destFileName - name of the destination file
 * @param {Number} generationMatchPrecondition
 */
async function main(
  bucketName = "first_storage_bucket_by_viti",
  filePath = "./static/1673469229049.png",
  destFileName = `${Date.now()}.png`,
  generationMatchPrecondition = 0
) {
  /**
   * storage - class, where all connection configurations are set
   * @param {String} keyFilename - the path  to the json key file (like API key) on current computer
   * @param {String} Project_ID - project id in google cloud storage
   
   * It is necessary to register on google storage before, set project and bucket and generate json key
   */
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

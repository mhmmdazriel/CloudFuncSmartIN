/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require("firebase-functions");
const path = require("path");
const {Storage} = require("@google-cloud/storage");


// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

exports.movephoto = functions.database.ref("/status/appbutton")
    .onWrite(async (change) => {
      const storage = new Storage();
      const rtdbValue = change.after.val();
      if (rtdbValue === 2) {
        const bucketName = "gs://smartin-375413.appspot.com";
        const filePath = "/photo";
        const destinationFolder = "History";
        const bucket = storage.bucket(bucketName);
        const file = bucket.file(filePath);
        try {
          await file.move(path.join(destinationFolder));
          console.log("File ${file.name} berhasil ${destinationFolder}");
        } catch (error) {
          console.error("Terjadi kesalahan saat memindahkan file: ${error}");
        }
      }
    });
exports.testrtdb = functions.database.ref("/status/appbutton")
    .onWrite((change, context) => {
      const oldvalue = change.before.val();
      const newvalue = change.after.val();
      const statusID = context.params.statusID;
      console.log(statusID + "change" + oldvalue + "to" + newvalue);
    });

// backend/firebaseAdmin.js
const admin = require("firebase-admin");
const serviceAccount = require("./firebaseServiceKey.json"); // make sure this path is correct

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;

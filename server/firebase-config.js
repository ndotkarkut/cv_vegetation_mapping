const { initializeApp } = require("firebase-admin/app");
const serviceAccount = require("./comp-vision-project.json");
const admin = require("firebase-admin");

const app = initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = app;

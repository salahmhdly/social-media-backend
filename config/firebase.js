const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json'); // تأكد من وجود هذا الملف في جذر المشروع

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = { admin, db };


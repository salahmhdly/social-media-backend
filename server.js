const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const dotenv = require("dotenv");

dotenv.config();

// تهيئة Firebase Admin SDK
// تأكد من أن لديك ملف serviceAccountKey.json في جذر المشروع
// أو قم بتعيين متغيرات البيئة المناسبة لـ Google Cloud Credentials
if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
  const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  // تهيئة Firebase Admin SDK من ملف serviceAccountKey.json المحلي (للتطوير)
  // تأكد من أن لديك ملف serviceAccountKey.json في جذر المشروع
  const serviceAccount = require("./serviceAccountKey.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json()); // لتحليل طلبات JSON
app.use(cors()); // تمكين CORS للوصول من أي نطاق

const postRoutes = require("./routes/postRoutes");

// تعريف المسارات
app.use("/api", postRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.send("Social Media Backend API is running!");
});

// معالج الأخطاء العام (يجب أن يكون في النهاية)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { db, admin };


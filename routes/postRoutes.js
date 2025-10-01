const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");

// إعداد Multer لرفع الملفات
// ملاحظة: هذا الإعداد يقوم بتخزين الملفات مؤقتًا في الذاكرة أو على القرص المحلي.
// في بيئة إنتاج حقيقية، ستحتاج إلى رفع هذه الملفات إلى خدمة تخزين سحابية مثل Firebase Storage.
const upload = multer({ storage: multer.memoryStorage() });

// إنشاء منشور جديد (مع دعم رفع الملفات)
router.post("/posts", authMiddleware, upload.single("media"), postController.createPost);

// جلب المنشورات لصفحة "آخر الأخبار"
router.get("/feed", authMiddleware, postController.getFeedPosts);

// الإعجاب بمنشور
router.post("/posts/:postId/like", authMiddleware, postController.likePost);

// إضافة تعليق على منشور
router.post("/posts/:postId/comments", authMiddleware, postController.addComment);

// إضافة رد على تعليق
router.post("/comments/:commentId/replies", authMiddleware, postController.addReply);

module.exports = router;


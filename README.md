# مشروع خادم تطبيق تواصل اجتماعي

هذا المشروع يهدف إلى بناء خادم (Backend) لتطبيق تواصل اجتماعي يركز على الوظائف والإعلانات المبوبة، باستخدام Node.js، Express.js، Firestore، و Firebase Authentication.

## بنية المجلدات المقترحة:

```
. 
├── controllers/         # تحتوي على منطق الأعمال لكل نقطة نهاية (API endpoint)
│   ├── authController.js
│   ├── userController.js
│   ├── postController.js
│   └── notificationController.js
├── routes/              # تحدد مسارات API وتوجه الطلبات إلى وحدات التحكم المناسبة
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── postRoutes.js
│   └── notificationRoutes.js
├── models/              # (اختياري) تعريف نماذج البيانات أو واجهات Firestore (إن وجدت)
│   └── index.js
├── middleware/          # وظائف وسيطة للمصادقة، التحقق من الصحة، معالجة الأخطاء
│   ├── authMiddleware.js
│   └── errorHandler.js
├── config/              # ملفات الإعدادات مثل مفاتيح API وتهيئة Firebase
│   └── firebase.js
├── utils/               # وظائف مساعدة عامة (مثل رفع الملفات، تنسيق البيانات)
│   └── uploader.js
├── cloud-functions/     # وظائف Firebase السحابية
│   └── index.js
├── server.js            # نقطة الدخول الرئيسية للخادم
├── package.json         # تعريف المشروع والتبعيات
└── .env                 # متغيرات البيئة (مثل مفاتيح API)
```

## المكونات الرئيسية:

-   **Node.js & Express.js:** بيئة التشغيل وإطار العمل لبناء الخادم.
-   **Firestore:** قاعدة بيانات NoSQL لتخزين البيانات.
-   **Firebase Authentication:** لإدارة مصادقة المستخدمين.
-   **Firebase Cloud Functions:** لتنفيذ المهام الخلفية مثل إنشاء الإشعارات.
-   **Multer (أو مشابه):** لرفع الملفات (الصور والفيديوهات).

## نقاط النهاية (API Endpoints) المخطط لها:

-   **المصادقة:** (تتم إدارتها عبر Firebase SDK)
-   **المستخدمون:**
    -   `GET /api/users/:userId`
    -   `POST /api/users/:userId/follow`
-   **المنشورات والإعلانات:**
    -   `POST /api/posts`
    -   `GET /api/feed`
    -   `POST /api/posts/:postId/like`
-   **التعليقات والردود:**
    -   `POST /api/posts/:postId/comments`
    -   `POST /api/comments/:commentId/replies`
-   **الإشعارات:**
    -   `GET /api/notifications`
    -   `POST /api/notifications/mark-read`



## إعداد وتشغيل المشروع:

1.  **استنساخ المستودع (Clone the repository):**
    ```bash
    git clone <your-repo-url>
    cd <your-project-folder>
    ```

2.  **تثبيت التبعيات (Install dependencies):**
    ```bash
    npm install
    cd cloud-functions
    npm install
    cd ..
    ```

3.  **إعداد Firebase:**
    *   أنشئ مشروعًا جديدًا في [Firebase Console](https://console.firebase.google.com/).
    *   انتقل إلى `Project settings` -> `Service accounts`.
    *   انقر على `Generate new private key` لتنزيل ملف `serviceAccountKey.json`.
    *   ضع هذا الملف في جذر مشروعك (نفس مستوى `server.js`).
    *   تأكد من تمكين Firestore في مشروع Firebase الخاص بك.

4.  **متغيرات البيئة (Environment Variables):**
    *   أنشئ ملف `.env` في جذر المشروع.
    *   أضف متغيرات البيئة اللازمة (على سبيل المثال، `PORT=3000`).

5.  **تشغيل الخادم (Run the server):**
    ```bash
    npm start
    ```
    أو
    ```bash
    node server.js
    ```

6.  **نشر وظائف Firebase السحابية (Deploy Firebase Cloud Functions):**
    *   تأكد من تثبيت [Firebase CLI](https://firebase.google.com/docs/cli) على جهازك.
    *   سجل الدخول إلى Firebase:
        ```bash
        firebase login
        ```
    *   قم بتهيئة مشروع Firebase الخاص بك (إذا لم تكن قد فعلت ذلك):
        ```bash
        firebase init functions
        ```
        (اختر `Use an existing project` وقم بتحديد مشروعك، ثم اختر JavaScript كلغة).
    *   انتقل إلى مجلد `cloud-functions` وقم بتثبيت التبعيات (تم القيام بذلك في الخطوة 2).
    *   انشر الوظائف:
        ```bash
        firebase deploy --only functions
        ```

## ملاحظات هامة:

*   **رفع الملفات:** في هذا المثال، يتم استخدام `multer` لتخزين الملفات مؤقتًا في الذاكرة. في بيئة إنتاج حقيقية، يجب استخدام خدمة تخزين سحابية مثل [Firebase Storage](https://firebase.google.com/docs/storage) لرفع وتخزين الصور والفيديوهات بشكل دائم.
*   **المصادقة:** يتم استخدام `Firebase Authentication` للتحقق من الرموز المميزة (ID Tokens). يجب على تطبيق الواجهة الأمامية (Frontend) الحصول على هذه الرموز المميزة من Firebase SDK وإرسالها في رأس `Authorization` كـ `Bearer Token`.
*   **التعليقات والردود:** تم تبسيط منطق إضافة الردود في `postController.js` لغرض العرض. في تطبيق حقيقي، قد تحتاج إلى مسار API أكثر تحديدًا للردود (مثل `/api/posts/:postId/comments/:commentId/replies`) لضمان سهولة الوصول إلى التعليق الأب.
*   **نظام المستخدمين والإشعارات:** تم توفير الهيكل الأساسي لـ `notifications` وبعض المنطق في Cloud Function. ستحتاج إلى توسيع `userController.js` و `notificationController.js` و `userRoutes.js` لتغطية جميع المتطلبات المذكورة في ملف `pasted_content.txt`.

---

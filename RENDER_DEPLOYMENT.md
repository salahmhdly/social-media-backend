# إرشادات نشر خادم تطبيق التواصل الاجتماعي على Render.com

لقد تم رفع الكود الخاص بخادم تطبيق التواصل الاجتماعي إلى مستودع GitHub التالي:
[https://github.com/salahmhdly/social-media-backend](https://github.com/salahmhdly/social-media-backend)

للقيام بنشر هذا الخادم على Render.com، يرجى اتباع الخطوات التالية:

1.  **إنشاء حساب Render.com وتسجيل الدخول:**
    *   إذا لم يكن لديك حساب، قم بإنشاء حساب جديد على [Render.com](https://render.com/).
    *   سجل الدخول إلى لوحة التحكم الخاصة بك.

2.  **إنشاء خدمة ويب جديدة (New Web Service):**
    *   في لوحة تحكم Render، انقر على زر `New` ثم اختر `Web Service`.

3.  **ربط مستودع GitHub الخاص بك:**
    *   سيطلب منك Render ربط حساب GitHub الخاص بك. قم بالموافقة على الأذونات المطلوبة.
    *   بعد الربط، ابحث عن المستودع الذي أنشأته للتو: `salahmhdly/social-media-backend`.
    *   انقر على `Connect` بجانب اسم المستودع.

4.  **تكوين خدمة الويب (Configure your Web Service):**
    *   **Name:** أدخل اسمًا لخدمتك (مثال: `social-media-backend-api`).
    *   **Region:** اختر أقرب منطقة جغرافية لك أو لمستخدميك.
    *   **Branch:** `master` (أو الفرع الذي يحتوي على الكود الخاص بك).
    *   **Root Directory:** اتركها فارغة إذا كان `server.js` في جذر المستودع، أو حدد `social-media-backend-project` إذا كان هذا هو الدليل الذي يحتوي على ملفات المشروع.
    *   **Runtime:** `Node`.
    *   **Build Command:** `npm install`.
    *   **Start Command:** `npm start` (أو `node server.js`).
    *   **Instance Type:** اختر النوع المناسب لاحتياجاتك (يمكنك البدء بـ `Free` للتجربة).

5.  **إضافة متغيرات البيئة (Environment Variables):**
    *   انتقل إلى قسم `Environment` في إعدادات خدمة الويب.
    *   أضف متغيرات البيئة الضرورية، مثل `PORT` (يمكن تعيينه إلى `3000` أو أي منفذ آخر، Render سيوفر المنفذ الخاص به تلقائيًا). الأهم هو إضافة مفتاح حساب الخدمة الخاص بـ Firebase.
    *   **ملاحظة هامة لـ `serviceAccountKey.json`:** لا يجب رفع ملف `serviceAccountKey.json` مباشرة إلى GitHub لأسباب أمنية. بدلاً من ذلك، يجب عليك نسخ محتويات هذا الملف (JSON) كمتغير بيئة واحد في Render.com.
        *   افتح ملف `serviceAccountKey.json` الذي قمت بتنزيله من Firebase.
        *   انسخ محتوياته بالكامل.
        *   في Render، أضف متغير بيئة جديد:
            *   **Key:** `GOOGLE_APPLICATION_CREDENTIALS_JSON` (أو أي اسم تفضله، ولكن يجب أن يتطابق مع كيفية قراءة الكود له).
            *   **Value:** الصق محتويات ملف `serviceAccountKey.json` هنا.
        *   **تعديل `server.js`:** ستحتاج إلى تعديل `server.js` لقراءة هذا المتغير البيئي بدلاً من قراءة الملف مباشرة. مثال:
            ```javascript
            // ... في بداية server.js
            if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
              const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
              admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
              });
            } else {
              // محاولة التهيئة التلقائية أو من ملف محلي في بيئة التطوير
              admin.initializeApp({
                credential: admin.credential.applicationDefault(),
              });
            }
            // ... بقية الكود
            ```
            **ملاحظة:** في الكود الحالي الذي قدمته، يتم استخدام `admin.credential.applicationDefault()` أولاً، والذي سيبحث عن متغير `GOOGLE_APPLICATION_CREDENTIALS` الذي يشير إلى مسار ملف JSON، أو `GOOGLE_APPLICATION_CREDENTIALS_JSON` مباشرة إذا كان يحتوي على JSON. لذا، فإن إضافة `GOOGLE_APPLICATION_CREDENTIALS_JSON` كمتغير بيئة في Render يجب أن يعمل بشكل جيد مع الكود الحالي.

6.  **النشر (Deploy):**
    *   انقر على `Create Web Service`.
    *   سيقوم Render تلقائيًا بسحب الكود، تثبيت التبعيات، وبناء ونشر تطبيقك.

7.  **مراقبة السجلات (Monitor Logs):**
    *   بعد النشر، يمكنك مراقبة سجلات التطبيق في لوحة تحكم Render للتأكد من أن الخادم يعمل بشكل صحيح.

بعد اكتمال النشر بنجاح، سيوفر لك Render عنوان URL عامًا لخدمة الويب الخاصة بك، والذي يمكنك استخدامه للوصول إلى واجهة برمجة التطبيقات (API) الخاصة بك.

const functions = require("firebase-functions");
const admin = require("firebase-admin");

// تأكد من تهيئة Firebase Admin SDK هنا أيضًا لوظائف السحابة
// إذا كنت تستخدم Firebase CLI لنشر الوظائف، فسيتم تهيئتها تلقائيًا
// ولكن للتوضيح، يمكن تهيئتها يدوياً إذا لزم الأمر
// admin.initializeApp(); // إذا لم تكن مهيأة بالفعل

// وظيفة سحابية يتم تفعيلها عند إضافة إعجاب جديد على منشور
exports.onNewLikeCreateNotification = functions.firestore
  .document("likes/{likeId}")
  .onCreate(async (snapshot, context) => {
    const likeData = snapshot.data();
    const { userId, postId } = likeData;

    try {
      // جلب معلومات المنشور
      const postRef = admin.firestore().collection("posts").doc(postId);
      const postDoc = await postRef.get();

      if (!postDoc.exists) {
        console.log("Post does not exist, skipping notification.");
        return null;
      }

      const postData = postDoc.data();
      const postOwnerId = postData.userId;

      // لا ترسل إشعارًا إذا كان المستخدم قد أعجب بمنشوره الخاص
      if (userId === postOwnerId) {
        console.log("User liked their own post, skipping notification.");
        return null;
      }

      // جلب معلومات المستخدم الذي قام بالإعجاب
      const likerUserRef = admin.firestore().collection("users").doc(userId);
      const likerUserDoc = await likerUserRef.get();
      const likerUserData = likerUserDoc.data();
      const likerDisplayName = likerUserData?.displayName || "مستخدم مجهول";

      // إنشاء الإشعار
      const notification = {
        recipientId: postOwnerId,
        senderId: userId,
        type: "like",
        entityId: postId,
        message: `${likerDisplayName} أعجب بمنشورك.`, // رسالة الإشعار
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await admin.firestore().collection("notifications").add(notification);
      console.log("Notification created successfully for new like.");
      return null;
    } catch (error) {
      console.error("Error creating notification for new like:", error);
      return null;
    }
  });


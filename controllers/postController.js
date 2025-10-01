const { db, admin } = require("../server");

// إنشاء منشور جديد
exports.createPost = async (req, res) => {
  try {
    const { type, content, mediaURL } = req.body;
    const userId = req.user.uid; // تم الحصول عليه من authMiddleware

    if (!type || !content) {
      return res.status(400).send("Type and content are required.");
    }

    const newPost = {
      userId,
      type,
      content,
      mediaURL: mediaURL || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      likesCount: 0,
      commentsCount: 0,
    };

    const docRef = await db.collection("posts").add(newPost);
    res.status(201).json({ id: docRef.id, ...newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).send("Error creating post.");
  }
};

// جلب المنشورات لصفحة "آخر الأخبار"
exports.getFeedPosts = async (req, res) => {
  try {
    const postsSnapshot = await db.collection("posts").orderBy("createdAt", "desc").limit(20).get();
    const posts = postsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching feed posts:", error);
    res.status(500).send("Error fetching feed posts.");
  }
};

// الإعجاب بمنشور
exports.likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.uid;

    const postRef = db.collection("posts").doc(postId);
    const likeRef = db.collection("likes").doc(`${userId}_${postId}`);

    const [postDoc, likeDoc] = await Promise.all([
      postRef.get(),
      likeRef.get()
    ]);

    if (!postDoc.exists) {
      return res.status(404).send("Post not found.");
    }

    if (likeDoc.exists) {
      // المستخدم أعجب بالمنشور بالفعل، لذا سنقوم بإلغاء الإعجاب
      await likeRef.delete();
      await postRef.update({ likesCount: admin.firestore.FieldValue.increment(-1) });
      return res.status(200).send("Post unliked.");
    } else {
      // المستخدم لم يعجب بالمنشور بعد، لذا سنقوم بالإعجاب
      await likeRef.set({
        userId,
        postId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      await postRef.update({ likesCount: admin.firestore.FieldValue.increment(1) });
      return res.status(200).send("Post liked.");
    }
  } catch (error) {
    console.error("Error liking/unliking post:", error);
    res.status(500).send("Error liking/unliking post.");
  }
};

// إضافة تعليق على منشور
exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.uid;

    if (!content) {
      return res.status(400).send("Comment content is required.");
    }

    const postRef = db.collection("posts").doc(postId);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return res.status(404).send("Post not found.");
    }

    const newComment = {
      userId,
      postId,
      content,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const commentRef = await postRef.collection("comments").add(newComment);
    await postRef.update({ commentsCount: admin.firestore.FieldValue.increment(1) });

    res.status(201).json({ id: commentRef.id, ...newComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).send("Error adding comment.");
  }
};

// إضافة رد على تعليق
exports.addReply = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.uid;

    if (!content) {
      return res.status(400).send("Reply content is required.");
    }

    // يجب أن نجد المنشور الأصلي للتعليق أولاً
    // هذا يتطلب بنية مختلفة إذا كانت الردود sub-collection تحت التعليقات مباشرة
    // هنا نفترض أن commentId هو معرف فريد للتعليق ويمكننا البحث عنه
    // ولكن وفقًا لبنية قاعدة البيانات المطلوبة، التعليقات هي sub-collection تحت المنشورات
    // لذا يجب أن نعرف postId أيضًا
    // لتسهيل الأمر حاليًا، سنفترض أن commentId يمكن استخدامه للوصول للتعليق مباشرة
    // في تطبيق حقيقي، قد تحتاج إلى مسار مثل /api/posts/:postId/comments/:commentId/replies

    // افتراض مبسط: البحث عن التعليق في جميع المنشورات (غير فعال في الإنتاج)
    // حل أفضل: تمرير postId في المسار أو تخزينه في مستند التعليق
    const commentSnapshot = await db.collectionGroup("comments").where(admin.firestore.FieldPath.documentId(), "==", commentId).limit(1).get();

    if (commentSnapshot.empty) {
      return res.status(404).send("Comment not found.");
    }

    const commentDoc = commentSnapshot.docs[0];
    const postId = commentDoc.ref.parent.parent.id; // الحصول على postId من مسار التعليق

    const newReply = {
      userId,
      commentId,
      content,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const replyRef = await commentDoc.ref.collection("replies").add(newReply);

    // يمكن تحديث عداد الردود في التعليق أو المنشور إذا لزم الأمر

    res.status(201).json({ id: replyRef.id, ...newReply });
  } catch (error) {
    console.error("Error adding reply:", error);
    res.status(500).send("Error adding reply.");
  }
};


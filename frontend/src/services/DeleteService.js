import { storage, auth } from "../firebase/firebase";
import { ref, deleteObject } from "firebase/storage";

export const deleteUpload = async (docId, storagePath) => {
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const token = await auth.currentUser.getIdToken();

  console.log("Deleting:", { docId, storagePath });

  // 1️⃣ Delete from Firebase Storage
  try {
    const fileRef = ref(storage, storagePath);
    await deleteObject(fileRef);
    console.log("Storage delete successful");
  } catch (storageErr) {
    console.error("Storage delete failed:", storageErr.message);
    throw new Error("Storage delete failed: " + storageErr.message);
  }

  // 2️⃣ Delete Firestore document (REST API)
  const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/image-upload/documents/uploads/${docId}`;
  console.log("Firestore URL:", firestoreUrl);

  const response = await fetch(firestoreUrl, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("Firestore delete failed:", err);
    throw new Error("Firestore delete failed: " + err);
  }

  console.log("Firestore delete successful");
};

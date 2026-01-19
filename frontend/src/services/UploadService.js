import { storage, auth } from "../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadOriginalFile = async (file, userId) => {
  const storageRef = ref(
    storage,
    `uploads/${userId}/${Date.now()}_${file.name}`,
  );

  await uploadBytes(storageRef, file);
  const fileUrl = await getDownloadURL(storageRef);

  
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const token = await auth.currentUser.getIdToken();
  
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/image-upload/documents/uploads`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fields: {
        userId: { stringValue: userId },
        filename: { stringValue: file.name },
        originalUrl: { stringValue: fileUrl },
        status: { stringValue: "uploaded" },
        createdAt: { timestampValue: new Date().toISOString() },
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Firestore REST Error: ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  const docId = data.name.split("/").pop(); // Extract ID from path

  return docId;
};

import { useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import { deleteUpload } from "../services/DeleteService";
import { Trash2 } from "lucide-react";

const Gallary = ({ refresh }) => {
  const [loading, setLoading] = useState(true);
  const [uploads, setUploads] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUploads = async () => {
      try {
        if (!auth.currentUser) {
          console.log("No authenticated user found");
          setLoading(false);
          return;
        }
        const userId = auth.currentUser.uid;
        const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
        const token = await auth.currentUser.getIdToken();

        const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/image-upload/documents/uploads`;

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        // Check for API errors
        if (!res.ok) {
          console.error("Firestore API error:", data);
          setError(`API Error: ${data.error?.message || res.status}`);
          return;
        }

        const docs = (data.documents || [])
          .map((doc) => ({
            id: doc.name.split("/").pop(),
            originalUrl: doc.fields?.originalUrl?.stringValue,
            storagePath: doc.fields?.storagePath?.stringValue,
            userId: doc.fields?.userId?.stringValue,
          }))
          .filter((d) => d.userId === userId && d.originalUrl);

        setUploads(docs);
      } catch (err) {
        console.error("Gallery error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUploads();
  }, [refresh]);

  if (loading) {
    return <p>Loading gallery...</p>;
  }

  return (
    <div className="py-5">
      <h2 className="text-lg font-bold mb-3">Your Uploads</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {uploads.length === 0 && !error && <p>No uploads yet</p>}

      <div className="flex gap-4 flex-wrap">
        {uploads.map((item, index) => (
          <div key={index} className="relative bg-gray-800">
            <img
              src={item.originalUrl}
              alt="uploaded"
              className="border h-60 w-48 rounded shadow-md"
            />
            <div
              onClick={async () => {
                try {
                  await deleteUpload(item.id, item.storagePath);
                  setUploads((prev) => prev.filter((u) => u.id !== item.id));
                } catch (err) {
                  alert("Delete failed");
                  console.error(err);
                }
              }}
              className="absolute top-2 right-2 bg-red-500 text-white px-1 py-1 rounded-full h-6 w-6 flex items-center justify-center"
            >
              <Trash2 />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallary;

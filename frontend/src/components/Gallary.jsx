import { useEffect, useState } from "react";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { storage } from "../firebase/firebase";
import { auth } from "../firebase/firebase";

const Gallary = ({refresh}) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const userId = auth.currentUser.uid;

        // 👇 SAME PATH YOU USED DURING UPLOAD
        const folderRef = ref(storage, `uploads/${userId}`);

        const res = await listAll(folderRef);

        const urls = await Promise.all(
          res.items.map((item) => getDownloadURL(item))
        );

        setImages(urls);
      } catch (err) {
        console.error("Gallery error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [refresh]);

  if (loading) {
    return <p>Loading gallery...</p>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold mb-3">Your Uploads</h2>

      {images.length === 0 && <p>No uploads yet</p>}

      <div className="flex gap-4 ">
        {images.map((url, index) => (
          <img
            key={index}
            src={url}
            alt="uploaded"
            className="border h-60 w-48 rounded shadow-md"
          />
        ))}
      </div>
    </div>
  );
};

export default Gallary;

import { useState } from "react";
import { uploadOriginalFile } from "../../services/UploadService";
import { auth } from "../../firebase/firebase";
import { convertPdfFirstPageToImage } from "../../utils/pdfToImg";

const UploadFile = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setSuccess("");

    try {
      const userId = auth.currentUser.uid;
      let fileToUpload = file;

      if (file.type === "application/pdf") {
        fileToUpload = await convertPdfFirstPageToImage(file);
      }

      await uploadOriginalFile(fileToUpload, userId);

      setSuccess("File uploaded successfully");
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Only JPG, PNG, or PDF files are allowed");
      setFile(null);
      return;
    }

    setError("");
    setFile(selectedFile);

    if (selectedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);
    } else {
      setPreview(null);
    }
    
  };

  return (
    <div className="border-2 shadow-gray-400 p-5 shadow-md mb-10 border-gray-300 flex flex-col justify-center items-center gap-4">
      <h2 className="text-lg font-bold">Upload Document</h2>

      <input
        className="bg-gray-200 border rounded border-gray-300 p-2"
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={handleFileChange}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      {file && (
        <p>
          Selected file: <span className="font-bold">{file.name}</span>
        </p>
      )}

      {preview && (
        <div className="border-2 rounded-md border-gray-300 bg-gray-200 flex flex-col gap-4 p-5">
          <p>Image Preview:</p>
          <img
            src={preview}
            alt="preview"
            style={{ maxWidth: "300px", border: "1px solid #ccc" }}
          />
        </div>
      )}

      {file && file.type === "application/pdf" && (
        <p>PDF selected (preview will be added later)</p>
      )}
      {file && (
        <button
          className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-md"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      )}

      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
};

export default UploadFile;

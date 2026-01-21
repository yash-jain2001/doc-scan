import { useState } from "react";
import { uploadOriginalFile } from "../../services/UploadService";
import { auth } from "../../firebase/firebase";
import { convertPdfFirstPageToImage } from "../../utils/pdfToImg";
import autoCropImage from "../../utils/autoCrop";

const UploadFile = ({ onUploadSuccess }) => {
  const [originalFile, setOriginalFile] = useState(null);
  const [croppedFile, setCroppedFile] = useState(null);

  const [beforePreview, setBeforePreview] = useState(null);
  const [afterPreview, setAfterPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Only JPG, PNG, or PDF files are allowed");
      return;
    }

    setError("");
    setSuccess("");
    setCroppedFile(null);
    setAfterPreview(null);

    if (selectedFile.type.startsWith("image/")) {
      setOriginalFile(selectedFile);
      setBeforePreview(URL.createObjectURL(selectedFile));

      const cropped = await autoCropImage(selectedFile);
      setCroppedFile(cropped);
      setAfterPreview(URL.createObjectURL(cropped));
    }

    if (selectedFile.type === "application/pdf") {
      const imageFromPdf = await convertPdfFirstPageToImage(selectedFile);

      setOriginalFile(imageFromPdf);
      setBeforePreview(URL.createObjectURL(imageFromPdf));

      const cropped = await autoCropImage(imageFromPdf);
      setCroppedFile(cropped);
      setAfterPreview(URL.createObjectURL(cropped));
    }
  };

  const handleUpload = async () => {
    if (!croppedFile) return;

    setLoading(true);
    setError("");

    try {
      const userId = auth.currentUser.uid;
      await uploadOriginalFile(croppedFile, userId);
      onUploadSuccess();

      setSuccess("Document uploaded successfully");
      setOriginalFile(null);
      setCroppedFile(null);
      setBeforePreview(null);
      setAfterPreview(null);
    } catch (err) {
      console.error(err);
      setError("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border w-[80%] p-5 rounded shadow-md flex items-center flex-col gap-4">
      <h2 className="text-lg font-bold">Upload Document</h2>

      <input
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={handleFileChange}
        className="bg-gray-200 rounded-md p-2"
      />

      {error && <p className="text-red-500">{error}</p>}

      {beforePreview && (
        <div className="flex gap-5">
          <div>
            <p className="font-semibold text-2xl mb-2">Before</p>
            <img
              src={beforePreview}
              alt="before"
              className="h-96 border rounded"
            />
          </div>

          {afterPreview && (
            <div>
              <p className="font-semibold text-2xl mb-2">
                After (Auto-cropped)
              </p>
              <img
                src={afterPreview}
                alt="after"
                className="h-96 border rounded"
              />
            </div>
          )}
        </div>
      )}

      {croppedFile && (
        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      )}

      {success && <p className="text-green-600">{success}</p>}
    </div>
  );
};

export default UploadFile;

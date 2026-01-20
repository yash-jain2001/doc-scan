const {onRequest} = require("firebase-functions/v2/https");
const cors = require("cors")({origin: true});

exports.healthCheck = onRequest((req, res) => {
  cors(req, res, () => {
    res.status(200).json({
      success: true,
      message: "Backend is running successfully",
    });
  });
});
exports.dummyCrop = onRequest(async (req, res) => {
  try {
    const {imageUrl} = req.body; // frontend will send URL
    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        error: "No imageUrl provided",
      });
    }

    // Dummy: just return the same URL for now
    res.json({success: true, croppedUrl: imageUrl});
  } catch (err) {
    console.error(err);
    res.status(500).json({success: false, error: err.message});
  }
});

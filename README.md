# DocScan

A document scanning app made using React and Firebase. You can upload images or PDFs and it will crop them automatically.

I made this project to learn web development. Its not perfect but it works!

---

## How the App Works (Architecture)

The app has 2 main parts:

**Frontend (what user sees)**
- Made with React.js
- Styled using Tailwind CSS  
- Uses Vite for running the app

**Backend (Firebase)**
- Firebase Auth - for login/signup
- Firebase Storage - to store uploaded files
- Firestore - to save file information
- Cloud Functions - for backend API

### Data Flow

```
User uploads file
      ↓
If PDF → convert to image
      ↓
Auto-crop the image (removes 10% from edges)
      ↓
Upload to Firebase Storage
      ↓
Save file info in Firestore
      ↓
Show in gallery
```

---

## How Auto-Crop Works

The cropping is simple. It just removes 10% from all sides of the image.

**Steps:**
1. Load image
2. Calculate 10% of width and height
3. Remove that much from all 4 sides
4. Create new cropped image
5. Return the cropped file

```
Original Image:
+------------------+
|    10% removed   |
|  +------------+  |
|  |            |  |
|  |  This part |  |
|  |  is kept   |  |
|  |            |  |
|  +------------+  |
|    10% removed   |
+------------------+

After Crop:
+------------+
|            |
|  Cropped   |
|  Image     |
|            |
+------------+
```

Note: This is basic cropping only. It does not detect document edges automatically.

---

## Setup Instructions

### What you need
- Node.js installed
- A Firebase project

### Steps to run

1. Clone the repo
```bash
git clone <repo-url>
cd docScan
```

2. Install frontend packages
```bash
cd frontend
npm install
```

3. Create `.env` file in frontend folder
```
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Run the app
```bash
npm run dev
```

5. Open `http://localhost:5173` in browser

---

## Libraries Used

All are open source (free to use).

**Frontend:**
| Library | What it does | License |
|---------|--------------|---------|
| React | UI components | MIT |
| Vite | Dev server & build | MIT |
| Tailwind CSS | Styling | MIT |
| Firebase | Backend services | Apache-2.0 |
| pdfjs-dist | Convert PDF to image | Apache-2.0 |
| lucide-react | Icons | ISC |
| react-toastify | Show notifications | MIT |

**Backend (Cloud Functions):**
| Library | What it does | License |
|---------|--------------|---------|
| firebase-functions | Cloud functions | Apache-2.0 |
| firebase-admin | Admin SDK | Apache-2.0 |
| cors | Handle CORS | MIT |

---

## Trade-offs

| Decision | Why I did it | Problem |
|----------|--------------|---------|
| Fixed 10% crop | Easy to code | Doesnt detect actual document |
| Crop on frontend | No backend needed | Big files still uploaded |
| Only 1st page of PDF | Simpler | Cant process full PDF |

---

## What I Would Add Next

- **Better cropping** - use OpenCV to find document edges
- **Multi-page PDF** - process all pages not just first
- **Drag and drop** - easier file upload
- **Image filters** - make documents clearer
- **Mobile support** - make it work better on phones

---

## Folder Structure

```
docScan/
├── frontend/
│   ├── src/
│   │   ├── components/    (UI parts)
│   │   ├── firebase/      (firebase config)
│   │   ├── services/      (upload/delete)
│   │   ├── utils/         (autocrop, pdf convert)
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── functions/             (cloud functions)
├── firebase.json
└── README.md
```

---

Made as a learning project. Still improving it!

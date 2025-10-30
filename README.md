# 🌍 Booklt — Travel Experience Booking Platform

Booklt is a full-stack web application that lets users explore and book unique travel experiences.  
It supports **user login/signup**, **admin management**, **promo code discounts**, and **MongoDB-powered bookings** — all with a beautiful React (Vite + TypeScript) frontend and a Node.js backend.

---

## 🚀 Tech Stack

### 🖥️ Frontend
- React (with TypeScript)
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React Icons

### ⚙️ Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- dotenv
- CORS
- Cloudinary (optional for image uploads)

---

## 🛠️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
🌐 Frontend Setup (React + Vite)
bash
Copy code
cd client
npm install
⚙️ Create .env file in /client
ini
Copy code
VITE_API_URL=https://booklt-jkqo.onrender.com
▶️ Start Frontend
bash
Copy code
npm run dev
Your frontend will run at 👉 http://localhost:5173

🧠 Backend Setup (Node.js + Express)
bash
Copy code
cd server
npm install
⚙️ Create .env file in /server
ini
Copy code
MONGO_URI=your_mongodb_connection_string
PORT=5000
FRONTEND_URL=http://localhost:5173
▶️ Start Backend
bash
Copy code
npm run start
or (for development)

bash
Copy code
npm run dev
Your backend will run at 👉 http://localhost:5000

🔗 CORS Setup (Backend)
In your server/index.js:

js
Copy code
import cors from "cors";

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
✅ This allows safe communication between frontend and backend (Vercel + Render).

🌍 Deployment Guide
🟢 Frontend (Vercel)
Push your project to GitHub.

Go to https://vercel.com.

Import your repo.

Build settings:

Framework: Vite

Output directory: dist

Add Environment Variable:

ini
Copy code
VITE_API_URL=https://booklt-jkqo.onrender.com
Add a vercel.json file in the root:

json
Copy code
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
🟣 Backend (Render)
Go to https://render.com.

Create a Web Service → connect your GitHub repo.

Set:

Build Command: npm install

Start Command: npm run start

Add Environment Variables:

ini
Copy code
MONGO_URI=your_mongodb_connection_string
FRONTEND_URL=https://booklt-phi.vercel.app
PORT=10000
📱 Features
✅ User Signup & Login
✅ Admin Login & Experience Posting
✅ Book Experiences with Date & Time
✅ Apply Promo Codes for Discounts
✅ View Your Bookings
✅ MongoDB Cloud Storage
✅ Fully Responsive Animated UI

📂 Project Structure
pgsql
Copy code
booklt/
│
├── client/              # Frontend (React + Vite + TypeScript)
│   ├── src/
│   │   ├── Components/
│   │   ├── Pages/
│   │   ├── Context/
│   │   └── assets/
│   ├── vite.config.ts
│   └── package.json
│
└── server/              # Backend (Node.js + Express)
    ├── routes/
    ├── models/
    ├── index.js
    ├── .env
    └── package.json
🧩 Scripts
Frontend
Command	Description
npm run dev	Run Vite development server
npm run build	Build for production
npm run preview	Preview production build

Backend
Command	Description
npm run start	Start server
npm run dev	Start server with nodemon


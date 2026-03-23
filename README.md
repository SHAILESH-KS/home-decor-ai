# 🏠 AI Home Interior Designer

An AI-powered web application that allows users to upload a room image and automatically generate redesigned interiors using modern AI models.

---

## 🚀 Features

* 📸 Upload room images
* 🎨 AI-based interior redesign
* 🪑 Supports multiple design styles (modern, minimal, etc.)
* ⚡ FastAPI backend for processing
* 💻 Clean and responsive React frontend

---

## 🛠 Tech Stack

**Frontend:**

* React.js
* CSS

**Backend:**

* FastAPI (Python)

**AI / ML:**

* Google Gemini API / Diffusers
* rembg (background removal)

---

## 📂 Project Structure

home-decor-ai/
│
├── backend/        # FastAPI backend
├── src/            # React source code
├── public/         # Static files
├── package.json
├── README.md
└── .gitignore

---

## ⚙️ Setup Instructions

### 🔹 1. Clone the repository

git clone https://github.com/YOUR_USERNAME/home-decor-ai.git
cd home-decor-ai

---

### 🔹 2. Setup Backend

cd backend

# Create virtual environment

py -m venv venv
venv\Scripts\activate

# Install dependencies

py -m pip install fastapi uvicorn pillow rembg

# Run server

py -m uvicorn main:app --reload

---

### 🔹 3. Setup Frontend

# Go back to root folder

cd ..

# Install dependencies

npm install

# Start frontend

npm start

---

## 🔑 Environment Variables

Create a `.env` file inside the backend folder:

GEMINI_API_KEY=your_api_key_here

---

## ▶️ Usage

1. Start backend server
2. Start frontend
3. Upload a room image
4. Get AI-generated interior design

---

## 📸 Output

* Upload → Processing → Redesigned Room Output

---

## ⚠️ Notes

* Make sure backend is running before using frontend
* Ensure API key is valid
* Do not upload `.env` to GitHub

---

## 👨‍💻 Author

**Shailesh**

---

## ⭐ Future Improvements

* 3D room visualization
* Real-time furniture placement
* Drag-and-drop customization
* Style selection UI

---

# README.md

## EnglishVocab: Full Stack English Vocabulary Learning Application Documentation

EnglishVocab is a full-stack English vocabulary learning application developed using **React Native (Expo)** for the mobile app, **React + Vite** for the admin panel, and **NestJS with MongoDB** for the backend. It provides a personalized learning experience for English learners with adaptive level assessment, lesson-based vocabulary practice, quizzes, level-up tests, and an AI-powered chat assistant.

## Features

### 1. User Management (Mobile App)
- Account creation and login with JWT authentication.
- Adaptive level assessment (15-question entrance test) to classify users into **Beginner / Intermediate / Advanced**.
- Lesson-based vocabulary learning with pronunciation (Text-to-Speech).
- Per-lesson **Quiz** with retake support and full attempt history (score, time, date).
- **Level-Up Test** to upgrade proficiency level when ready.
- **Word of the Day** — a new word suggested every day.
- **Chat AI** powered by Google Gemini for explanations in Vietnamese, with local conversation history.
- Detailed progress tracking: daily streak, total words learned, lessons completed, quizzes done.
- Profile view and account sign-out.

### 2. Admin Panel
- **Lesson management**: create, view, and bulk-import lessons (JSON).
- **Word management**: add words to any lesson with auto-generated word numbers.
- **Quiz management**: create quizzes per lesson and level, manage questions.
- **Level-Up Test questions**: add and manage questions used for level upgrade tests.
- **Assessment questions**: manage the entrance assessment question bank.
- **User management** dashboard.
- All forms support both single-entry and JSON bulk import.

## Technology Stack

### Frontend Libraries (Mobile — React Native + Expo)
- React Native 0.81 + Expo 54
- React 19 + Redux Toolkit
- React Navigation (Bottom Tabs + Stack)
- Axios
- Expo Speech (Text-to-Speech for pronunciation)
- Expo Linear Gradient
- Expo Vector Icons (Ionicons + Material Icons)
- Lottie React Native (celebration animations)
- TailwindCSS / NativeWind styling

### Admin Panel Libraries (Web — React + Vite)
- React 18 + Vite 4
- React Router DOM 6
- TailwindCSS 3
- Axios
- React Icons

### Backend Libraries
- NestJS 10
- MongoDB + Mongoose 10
- Passport JWT (authentication)
- bcrypt (password hashing)
- class-validator + class-transformer (DTO validation)
- Swagger (`@nestjs/swagger`) — API docs at `/docs`
- Google Generative AI SDK (Gemini integration)

## Testing Instructions

### 1. For Android Users
- Download **Expo Go** on your Android smartphone, **OR**
- Start an **Android Emulator** via Android Studio (recommended for development).
- Run the frontend with `npm start` in the `frontend/` directory and scan the QR code in Expo Go, or press `a` to launch on the emulator.

### 2. For iOS Users
- Download **Expo Go** on your Apple smartphone.
- Run the frontend with `npm start` in the `frontend/` directory and scan the QR code in Expo Go.

**Note:** When testing on a real device through Expo Go, you must replace the API base URL with your machine's LAN IPv4 address in `frontend/src/constants/baseUrl.js`. On an Android Emulator, the special address `10.0.2.2` maps to the host machine's `localhost`.

## Backend Setup

### Environment Variables (`backend/.env`)
Ensure the following environment variables are set for the backend:

- `MONGO_URI` — MongoDB connection string (local or MongoDB Atlas)
- `JWT_SECRET` — secret key used to sign JWT tokens
- `JWT_EXPIRATION_TIME` — JWT expiration (e.g. `1d`)

### Environment Variables (`admin-panel/.env`)
- `VITE_API_BASE_URL` — backend URL (e.g. `http://127.0.0.1:4000`)

### Environment Variables (`frontend/.env`)
- `GEMINI_API_KEY` — Google Gemini API key (used by the in-app Chat AI)

**Note:**
- If the backend is running locally and you test on a **real device**, use your machine's IPv4 address instead of `localhost`. You can find the IPv4 address by typing `ipconfig` in the command prompt.
- On an **Android Emulator**, use `http://10.0.2.2:4000` as the API base URL.
- Modify the API base URL in `frontend/src/constants/baseUrl.js` to match your environment.

### Starting the Frontend (Mobile App)
1. Navigate to the `frontend/` directory.
2. Run `npm install` to install dependencies.
3. Initiate the application with `npm start`.

### Starting the Admin Panel
1. Navigate to the `admin-panel/` directory.
2. Run `npm install` to install dependencies.
3. Start the dev server with `npm run dev`. The admin panel runs on `http://localhost:5173` by default.

### Starting the Backend
1. Navigate to the `backend/` directory.
2. Run `npm install` to install dependencies.
3. Start the backend server using `npm start`. The API runs on `http://localhost:4000`.

**Important:** Ensure that the backend environment variables are properly set before running the backend server. Also make sure MongoDB is running locally (or your Atlas cluster is reachable and your IP is whitelisted).

## Swagger API Documentation

Explore the backend API documentation through Swagger UI:

- After starting the backend, open `http://localhost:4000/docs` in your browser.

## User Manual

1. **Backend**
   - Set up MongoDB (local or MongoDB Atlas).
   - Configure `backend/.env` with `MONGO_URI`, `JWT_SECRET`, and `JWT_EXPIRATION_TIME`.
   - Run `npm install` and `npm start` in the `backend/` directory.

2. **Admin Panel**
   - Configure `admin-panel/.env` with `VITE_API_BASE_URL` pointing to the backend.
   - Run `npm install` and `npm run dev` in the `admin-panel/` directory.
   - Use the dashboard to create lessons, add words, configure quizzes, and manage level-up / assessment questions.

3. **Frontend (Mobile App)**
   - Configure `frontend/.env` with your `GEMINI_API_KEY` to enable Chat AI.
   - Update the API base URL in `frontend/src/constants/baseUrl.js` according to your test environment (emulator vs. real device).
   - Run `npm install` and `npm start` in the `frontend/` directory.
   - Open the app in Expo Go or an emulator, register an account, complete the entrance test, and start learning.

This documentation provides an overview of the EnglishVocab application, its features, technology stack, and setup instructions for the backend, admin panel, and mobile app. For further development or testing, refer to this guide and ensure the necessary dependencies and configurations are in place.

import React from "react";
import ReactDOM from "react-dom/client";
import AdminHome from "./pages/AdminHome.jsx";
import AllAssessmentQuestions from "./pages/AllAssessmentQuestions.jsx";
import AddAssessmentQuestion from "./pages/AddAssessmentQuestion.jsx";
import AddAssessmentQuestionJson from "./pages/AddAssessmentQuestionJson.jsx";
import Lessons from "./pages/Lessons.jsx";
import AddWordsJson from "./pages/AddWordsJson.jsx";
import CreateQuiz from "./pages/CreateQuiz.jsx";
import AddQuizQuestionJson from "./pages/AddQuizQuestionJson.jsx";
import AddLevelUpTestQuestionJson from "./pages/AddLevelUpTestQuestionJson.jsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserManagement from "./pages/UserManagement.jsx";
import CreateLessonsJson from "./pages/CreateLessonsJson.jsx";
import CreatedLessons from "./pages/CreatedLessons.jsx";
import LessonWords from "./pages/LessonWords.jsx";
import CreatedQuizzes from "./pages/CreatedQuizzes.jsx";
import QuizDetails from "./pages/QuizDetails.jsx";
import LevelUpQuestions from "./pages/LevelUpQuestions.jsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminHome />,
  },
  {
    path: "/questions",
    element: <AllAssessmentQuestions />,
  },
  {
    path: "/add-question",
    element: <AddAssessmentQuestion />,
  },
  {
    path: "/users",
    element: <UserManagement />,
  },
  {
    path: "/add-question-json",
    element: <AddAssessmentQuestionJson />,
  },
  {
    path: "/lessons",
    element: <Lessons />,
  },
  {
    path: "/create-lessons",
    element: <CreateLessonsJson />,
  },
  {
    path: "/add-words",
    element: <AddWordsJson />,
  },
  {
    path: "/create-quiz",
    element: <CreateQuiz />,
  },
  {
    path: "/add-quiz-questions",
    element: <AddQuizQuestionJson />,
  },
  {
    path: "/add-level-up-test-questions",
    element: <AddLevelUpTestQuestionJson />,
  },
  {
    path: "/created-lessons",
    element: <CreatedLessons />,
  },
  {
    path: "/lesson-words/:lessonTitle",
    element: <LessonWords />,
  },
  {
    path: "/created-quizzes",
    element: <CreatedQuizzes />,
  },
  {
    path: "/quiz-details/:id",
    element: <QuizDetails />,
  },
  {
    path: "/level-up-questions",
    element: <LevelUpQuestions />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

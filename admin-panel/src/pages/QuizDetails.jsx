import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header.jsx";
import { Link, useParams } from "react-router-dom";

const LEVEL_COLORS = {
  Beginner: "bg-green-100 text-green-700",
  Intermediate: "bg-yellow-100 text-yellow-700",
  Advanced: "bg-red-100 text-red-700",
};

const QuizDetails = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { id } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit modal state
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editForm, setEditForm] = useState({
    question: "",
    answer: "",
    distractor1: "",
    distractor2: "",
    distractor3: "",
  });
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState(null);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${BASE_URL}/quiz/${id}/details`);
      setQuiz(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      await axios.delete(`${BASE_URL}/quiz/question/${questionId}`);
      await fetchQuiz();
    } catch (err) {
      alert(
        "Failed to delete: " + (err.response?.data?.message || err.message)
      );
    }
  };

  const openEditQuestion = (q) => {
    setEditingQuestion(q);
    setEditForm({
      question: q.question || "",
      answer: q.answer || "",
      distractor1: q.distractor1 || "",
      distractor2: q.distractor2 || "",
      distractor3: q.distractor3 || "",
    });
    setModalError(null);
  };

  const closeEditModal = () => {
    setEditingQuestion(null);
    setModalError(null);
  };

  const handleSaveEdit = async () => {
    try {
      setSaving(true);
      setModalError(null);
      await axios.patch(
        `${BASE_URL}/quiz/question/${editingQuestion._id}`,
        {
          question: editForm.question.trim(),
          answer: editForm.answer.trim(),
          distractor1: editForm.distractor1.trim(),
          distractor2: editForm.distractor2.trim(),
          distractor3: editForm.distractor3.trim(),
        }
      );
      closeEditModal();
      await fetchQuiz();
    } catch (err) {
      setModalError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="container mx-auto p-4">
          <p className="text-gray-500">Loading quiz details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <div className="container mx-auto p-4">
          <Link to="/created-quizzes" className="text-blue-500 text-sm">
            ← Back to Created Quizzes
          </Link>
          <p className="text-red-500 mt-4">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4">
        <Link to="/created-quizzes" className="text-blue-500 text-sm">
          ← Back to Created Quizzes
        </Link>

        {/* Quiz Header */}
        <div className="bg-white rounded-lg shadow p-6 mt-2 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            {quiz.title}
          </h2>
          <div className="flex flex-wrap gap-4 text-sm text-gray-700">
            <div>
              <span className="font-semibold">Lesson:</span>{" "}
              {quiz.lessonTitle}
            </div>
            <div>
              <span className="font-semibold">Level:</span>{" "}
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  LEVEL_COLORS[quiz.level] || "bg-gray-100 text-gray-600"
                }`}
              >
                {quiz.level}
              </span>
            </div>
            <div>
              <span className="font-semibold">Questions:</span>{" "}
              {quiz.questions?.length || 0}
            </div>
            <div>
              <span className="font-semibold">Time Limit:</span>{" "}
              {quiz.timeLimit} min
            </div>
          </div>
        </div>

        {/* Questions */}
        <h3 className="text-xl font-semibold mb-4">
          Questions{" "}
          <span className="text-gray-500 text-base font-normal">
            ({quiz.questions?.length || 0})
          </span>
        </h3>

        {(!quiz.questions || quiz.questions.length === 0) && (
          <p className="text-gray-500 italic">
            No questions linked to this quiz.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quiz.questions?.map((q) => {
            const allOptions = [
              { text: q.answer, isCorrect: true },
              { text: q.distractor1, isCorrect: false },
              { text: q.distractor2, isCorrect: false },
              { text: q.distractor3, isCorrect: false },
            ];
            return (
              <div
                key={q._id}
                className="relative bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                {/* Edit + Delete icons top-right */}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => openEditQuestion(q)}
                    className="text-yellow-500 hover:text-yellow-700"
                    title="Edit question"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(q._id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete question"
                  >
                    🗑
                  </button>
                </div>

                {/* Question */}
                <h4 className="text-base font-semibold text-gray-900 mb-3 pr-6">
                  {q.question}
                </h4>

                {/* Options */}
                <div className="space-y-2">
                  {allOptions.map((opt, i) => (
                    <div
                      key={i}
                      className={`px-3 py-2 rounded text-sm ${
                        opt.isCorrect
                          ? "bg-green-100 text-gray-900"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {opt.text}
                    </div>
                  ))}
                </div>

                {/* Level footer */}
                <p className="text-xs text-gray-400 mt-3">Level: {q.level}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Edit Question</h3>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question
              </label>
              <textarea
                value={editForm.question}
                onChange={(e) =>
                  setEditForm({ ...editForm, question: e.target.value })
                }
                rows="2"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Answer (correct)
              </label>
              <input
                type="text"
                value={editForm.answer}
                onChange={(e) =>
                  setEditForm({ ...editForm, answer: e.target.value })
                }
                className="w-full p-2 border-2 border-green-300 bg-green-50 rounded focus:outline-none focus:border-green-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Distractor 1
                </label>
                <input
                  type="text"
                  value={editForm.distractor1}
                  onChange={(e) =>
                    setEditForm({ ...editForm, distractor1: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Distractor 2
                </label>
                <input
                  type="text"
                  value={editForm.distractor2}
                  onChange={(e) =>
                    setEditForm({ ...editForm, distractor2: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Distractor 3
                </label>
                <input
                  type="text"
                  value={editForm.distractor3}
                  onChange={(e) =>
                    setEditForm({ ...editForm, distractor3: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>

            {modalError && (
              <p className="text-red-500 text-sm mb-3">{modalError}</p>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={closeEditModal}
                disabled={saving}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                className={`${
                  saving
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white px-4 py-2 rounded`}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizDetails;

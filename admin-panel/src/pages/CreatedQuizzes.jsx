import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header.jsx";
import { Link, useNavigate } from "react-router-dom";

const LEVEL_COLORS = {
  Beginner: "bg-green-100 text-green-700",
  Intermediate: "bg-yellow-100 text-yellow-700",
  Advanced: "bg-red-100 text-red-700",
};

const CreatedQuizzes = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  // Edit modal state
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", timeLimit: 10 });
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState(null);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${BASE_URL}/quiz/get-all`);
      setQuizzes(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const openEditModal = (quiz) => {
    setEditingQuiz(quiz);
    setEditForm({
      title: quiz.title || "",
      timeLimit: quiz.timeLimit || 10,
    });
    setModalError(null);
  };

  const closeEditModal = () => {
    setEditingQuiz(null);
    setModalError(null);
  };

  const handleSaveEdit = async () => {
    try {
      setSaving(true);
      setModalError(null);
      await axios.patch(`${BASE_URL}/quiz/${editingQuiz._id}`, {
        title: editForm.title.trim(),
        timeLimit: Number(editForm.timeLimit),
      });
      closeEditModal();
      await fetchQuizzes();
    } catch (err) {
      setModalError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (quiz) => {
    if (!window.confirm(`Delete quiz "${quiz.title}"?`)) return;
    try {
      await axios.delete(`${BASE_URL}/quiz/${quiz._id}`);
      await fetchQuizzes();
    } catch (err) {
      alert(
        "Failed to delete: " + (err.response?.data?.message || err.message)
      );
    }
  };

  const filteredQuizzes = quizzes.filter((q) =>
    [q.title, q.lessonTitle, q.level]
      .filter(Boolean)
      .some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Link to="/lessons" className="text-blue-500 text-sm">
              ← Back to Lesson Management
            </Link>
            <h2 className="text-2xl font-semibold mt-1">
              Created Quizzes{" "}
              <span className="text-gray-500 text-base font-normal">
                ({quizzes.length})
              </span>
            </h2>
          </div>
          <button
            onClick={fetchQuizzes}
            className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-300 text-sm"
          >
            ↻ Refresh
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by title, lesson, or level..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:border-blue-500"
        />

        {loading && <p className="text-gray-500">Loading quizzes...</p>}
        {error && (
          <p className="text-red-500">Error fetching quizzes: {error}</p>
        )}
        {!loading && !error && quizzes.length === 0 && (
          <p className="text-gray-500 italic">
            No quizzes created yet. Go back and click "Create Quiz" to add some.
          </p>
        )}

        {!loading && filteredQuizzes.length > 0 && (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Lesson
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    Level
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    Questions
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    Time (min)
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredQuizzes.map((q) => (
                  <tr
                    key={q._id}
                    className="border-t hover:bg-blue-50 cursor-pointer"
                    onClick={() => navigate(`/quiz-details/${q._id}`)}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-blue-600 hover:underline">
                      {q.title}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {q.lessonTitle}
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          LEVEL_COLORS[q.level] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {q.level}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-700">
                      {q.numberOfQuestions}
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-700">
                      {q.timeLimit}
                    </td>
                    <td
                      className="px-4 py-3 text-sm text-center whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => openEditModal(q)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-2 py-1 rounded mr-1"
                      >
                        ✎ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(q)}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded"
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && quizzes.length > 0 && filteredQuizzes.length === 0 && (
          <p className="text-gray-500 italic">
            No quizzes match "{search}".
          </p>
        )}
      </div>

      {/* Edit Modal */}
      {editingQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-2">Edit Quiz</h3>
            <p className="text-xs text-gray-500 mb-4">
              Lesson:{" "}
              <span className="font-semibold">{editingQuiz.lessonTitle}</span>{" "}
              · Level:{" "}
              <span className="font-semibold">{editingQuiz.level}</span>
              <br />
              <span className="italic">
                Lesson, level, and number of questions cannot be changed
                (questions are linked). Delete and recreate if needed.
              </span>
            </p>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Limit (minutes)
              </label>
              <input
                type="number"
                min="1"
                value={editForm.timeLimit}
                onChange={(e) =>
                  setEditForm({ ...editForm, timeLimit: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
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

export default CreatedQuizzes;

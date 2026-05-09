import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header.jsx";
import { Link } from "react-router-dom";

const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const LEVEL_COLORS = {
  Beginner: "bg-green-100 text-green-700",
  Intermediate: "bg-yellow-100 text-yellow-700",
  Advanced: "bg-red-100 text-red-700",
};

const LevelUpQuestions = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeLevel, setActiveLevel] = useState("Beginner");
  const [search, setSearch] = useState("");

  // Edit modal state
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editForm, setEditForm] = useState({
    questionText: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correctAnswer: 1,
  });
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState(null);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${BASE_URL}/level-up-test/all-questions`);
      setQuestions(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const openEdit = (q) => {
    const opts = q.options || [];
    setEditingQuestion(q);
    setEditForm({
      questionText: q.questionText || "",
      option1: opts.find((o) => o.id === 1)?.optionText || "",
      option2: opts.find((o) => o.id === 2)?.optionText || "",
      option3: opts.find((o) => o.id === 3)?.optionText || "",
      option4: opts.find((o) => o.id === 4)?.optionText || "",
      correctAnswer: q.correctAnswer || 1,
    });
    setModalError(null);
  };

  const closeEdit = () => {
    setEditingQuestion(null);
    setModalError(null);
  };

  const handleSaveEdit = async () => {
    try {
      setSaving(true);
      setModalError(null);
      await axios.patch(
        `${BASE_URL}/level-up-test/question/${editingQuestion._id}`,
        {
          questionText: editForm.questionText.trim(),
          options: [
            { id: 1, optionText: editForm.option1.trim() },
            { id: 2, optionText: editForm.option2.trim() },
            { id: 3, optionText: editForm.option3.trim() },
            { id: 4, optionText: editForm.option4.trim() },
          ],
          correctAnswer: Number(editForm.correctAnswer),
        }
      );
      closeEdit();
      await fetchQuestions();
    } catch (err) {
      setModalError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (q) => {
    if (!window.confirm(`Delete this question?`)) return;
    try {
      await axios.delete(`${BASE_URL}/level-up-test/delete-question/${q._id}`);
      await fetchQuestions();
    } catch (err) {
      alert(
        "Failed to delete: " + (err.response?.data?.message || err.message)
      );
    }
  };

  const questionsByLevel = LEVELS.reduce((acc, lvl) => {
    acc[lvl] = questions.filter((q) => q.level === lvl);
    return acc;
  }, {});

  const filtered = (questionsByLevel[activeLevel] || []).filter((q) =>
    [q.questionText, q.lessonTitle]
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
              Level-Up Test Questions{" "}
              <span className="text-gray-500 text-base font-normal">
                ({questions.length})
              </span>
            </h2>
          </div>
          <button
            onClick={fetchQuestions}
            className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-300 text-sm"
          >
            ↻ Refresh
          </button>
        </div>

        {/* Level tabs */}
        <div className="flex gap-2 mb-4 border-b border-gray-200">
          {LEVELS.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setActiveLevel(lvl)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeLevel === lvl
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {lvl}{" "}
              <span className="text-xs text-gray-400">
                ({questionsByLevel[lvl]?.length || 0})
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by question text or lesson title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:border-blue-500"
        />

        {loading && <p className="text-gray-500">Loading questions...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {!loading && filtered.length === 0 && (
          <p className="text-gray-500 italic">
            {questions.length === 0
              ? "No questions added yet. Use 'Add Level Up Test Questions' to add some."
              : `No ${activeLevel} questions match the search.`}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((q) => (
            <div
              key={q._id}
              className="relative bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              {/* Edit + Delete icons */}
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() => openEdit(q)}
                  className="text-yellow-500 hover:text-yellow-700"
                  title="Edit"
                >
                  ✎
                </button>
                <button
                  onClick={() => handleDelete(q)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete"
                >
                  🗑
                </button>
              </div>

              {/* Question */}
              <h4 className="text-base font-semibold text-gray-900 mb-3 pr-12">
                {q.questionText}
              </h4>

              {/* Options */}
              <div className="space-y-2">
                {q.options?.map((opt) => (
                  <div
                    key={opt.id}
                    className={`px-3 py-2 rounded text-sm ${
                      opt.id === q.correctAnswer
                        ? "bg-green-100 text-gray-900"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {opt.optionText}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex flex-wrap gap-2 mt-3 text-xs text-gray-500">
                <span>📚 {q.lessonTitle}</span>
                <span
                  className={`px-2 py-0.5 rounded-full font-semibold ${
                    LEVEL_COLORS[q.level] || "bg-gray-100 text-gray-600"
                  }`}
                >
                  {q.level}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-2">Edit Question</h3>
            <p className="text-xs text-gray-500 mb-4">
              Lesson: {editingQuestion.lessonTitle} · Level:{" "}
              {editingQuestion.level}
            </p>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question Text
              </label>
              <textarea
                value={editForm.questionText}
                onChange={(e) =>
                  setEditForm({ ...editForm, questionText: e.target.value })
                }
                rows="2"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <p className="text-sm font-medium text-gray-700 mb-2">
              Options{" "}
              <span className="text-xs text-gray-500 font-normal">
                (Tick the correct one)
              </span>
            </p>
            <div className="space-y-2 mb-4">
              {[1, 2, 3, 4].map((num) => {
                const fieldName = `option${num}`;
                const isCorrect = Number(editForm.correctAnswer) === num;
                return (
                  <div
                    key={num}
                    className={`flex items-center gap-2 p-2 rounded border ${
                      isCorrect
                        ? "bg-green-50 border-green-300"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="correctAnswer"
                      value={num}
                      checked={isCorrect}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          correctAnswer: Number(e.target.value),
                        })
                      }
                      className="w-4 h-4 text-green-600"
                    />
                    <span className="text-sm font-medium text-gray-600 w-6">
                      {num}.
                    </span>
                    <input
                      type="text"
                      value={editForm[fieldName]}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          [fieldName]: e.target.value,
                        })
                      }
                      placeholder={`Option ${num}`}
                      className="flex-1 p-2 border border-gray-300 rounded"
                    />
                  </div>
                );
              })}
            </div>

            {modalError && (
              <p className="text-red-500 text-sm mb-3">{modalError}</p>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={closeEdit}
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

export default LevelUpQuestions;

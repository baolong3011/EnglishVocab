import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header.jsx";
import { Link } from "react-router-dom";

const CreatedLessons = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit modal state
  const [editingLesson, setEditingLesson] = useState(null);
  const [editForm, setEditForm] = useState({
    lessonNumber: "",
    title: "",
    description: "",
    icon: "",
  });
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState(null);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${BASE_URL}/learn/all-lessons`);
      setLessons(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const openEditModal = (lesson) => {
    setEditingLesson(lesson);
    setEditForm({
      lessonNumber: lesson.lessonNumber,
      title: lesson.title,
      description: lesson.description,
      icon: lesson.icon,
    });
    setModalError(null);
  };

  const closeEditModal = () => {
    setEditingLesson(null);
    setModalError(null);
  };

  const handleSaveEdit = async () => {
    try {
      setSaving(true);
      setModalError(null);
      await axios.patch(`${BASE_URL}/learn/lesson/${editingLesson._id}`, {
        lessonNumber: Number(editForm.lessonNumber),
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        icon: editForm.icon.trim(),
      });
      closeEditModal();
      await fetchLessons();
    } catch (err) {
      setModalError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (lesson) => {
    if (
      !window.confirm(
        `Delete lesson "${lesson.title}"?\n\nNote: words of this lesson will NOT be deleted automatically.`
      )
    ) {
      return;
    }
    try {
      await axios.delete(`${BASE_URL}/learn/lesson/${lesson._id}`);
      await fetchLessons();
    } catch (err) {
      alert("Failed to delete: " + (err.response?.data?.message || err.message));
    }
  };

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
              Created Lessons{" "}
              <span className="text-gray-500 text-base font-normal">
                ({lessons.length})
              </span>
            </h2>
          </div>
          <button
            onClick={fetchLessons}
            className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-300 text-sm"
          >
            ↻ Refresh
          </button>
        </div>

        {loading && <p className="text-gray-500">Loading lessons...</p>}
        {error && (
          <p className="text-red-500">Error fetching lessons: {error}</p>
        )}
        {!loading && !error && lessons.length === 0 && (
          <p className="text-gray-500 italic">
            No lessons created yet. Go back and click "Create Lessons" to add some.
          </p>
        )}

        {!loading && lessons.length > 0 && (
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
            {lessons.map((lesson) => (
              <div
                key={lesson._id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-400 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                      #{lesson.lessonNumber}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {lesson.title}
                    </h3>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      lesson.wordCount > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {lesson.wordCount} words
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {lesson.description}
                </p>
                <div className="flex gap-2">
                  <Link
                    to={`/lesson-words/${encodeURIComponent(lesson.title)}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1.5 rounded"
                  >
                    View Words →
                  </Link>
                  <button
                    onClick={() => openEditModal(lesson)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-1.5 rounded"
                  >
                    ✎ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(lesson)}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1.5 rounded"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingLesson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">Edit Lesson</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lesson Number
                </label>
                <input
                  type="number"
                  value={editForm.lessonNumber}
                  onChange={(e) =>
                    setEditForm({ ...editForm, lessonNumber: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon
                </label>
                <input
                  type="text"
                  value={editForm.icon}
                  onChange={(e) =>
                    setEditForm({ ...editForm, icon: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>

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
              <p className="text-xs text-gray-500 mt-1">
                ⚠ Title must be one of the 10 predefined categories.
              </p>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                rows="3"
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

export default CreatedLessons;

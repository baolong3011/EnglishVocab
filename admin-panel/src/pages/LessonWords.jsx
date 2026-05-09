import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header.jsx";
import { Link, useParams } from "react-router-dom";

const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const PARTS_OF_SPEECH = [
  "Noun",
  "Verb",
  "Adjective",
  "Adverb",
  "Pronoun",
  "Preposition",
  "Conjunction",
  "Interjection",
];

const LessonWords = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { lessonTitle } = useParams();
  const decodedTitle = decodeURIComponent(lessonTitle);

  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeLevel, setActiveLevel] = useState("Beginner");

  // Edit modal state
  const [editingWord, setEditingWord] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState(null);

  const fetchWords = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(
        `${BASE_URL}/learn/words-by-title/${encodeURIComponent(decodedTitle)}`
      );
      setWords(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWords();
  }, [decodedTitle]);

  const openEditModal = (word) => {
    setEditingWord(word);
    setEditForm({
      word: word.word || "",
      partOfSpeech: word.partOfSpeech || "Noun",
      synonym: word.synonym || "",
      meaning: word.meaning || "",
      example: word.example || "",
      level: word.level || "Beginner",
      wordNumber: word.wordNumber || 1,
    });
    setModalError(null);
  };

  const closeEditModal = () => {
    setEditingWord(null);
    setModalError(null);
  };

  const handleSaveEdit = async () => {
    try {
      setSaving(true);
      setModalError(null);
      await axios.patch(`${BASE_URL}/learn/word/${editingWord._id}`, {
        word: editForm.word.trim(),
        partOfSpeech: editForm.partOfSpeech,
        synonym: editForm.synonym.trim(),
        meaning: editForm.meaning.trim(),
        example: editForm.example.trim(),
        level: editForm.level,
        wordNumber: Number(editForm.wordNumber),
      });
      closeEditModal();
      await fetchWords();
    } catch (err) {
      setModalError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (word) => {
    if (!window.confirm(`Delete word "${word.word}"?`)) return;
    try {
      await axios.delete(`${BASE_URL}/learn/word/${word._id}`);
      await fetchWords();
    } catch (err) {
      alert("Failed to delete: " + (err.response?.data?.message || err.message));
    }
  };

  const wordsByLevel = LEVELS.reduce((acc, lvl) => {
    acc[lvl] = words
      .filter((w) => w.level === lvl)
      .sort((a, b) =>
        (a.word || "").localeCompare(b.word || "", "en", { sensitivity: "base" })
      );
    return acc;
  }, {});

  const filteredWords = wordsByLevel[activeLevel] || [];

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4">
        <Link to="/created-lessons" className="text-blue-500 text-sm">
          ← Back to Created Lessons
        </Link>
        <h2 className="text-2xl font-semibold mt-1 mb-4">
          {decodedTitle}{" "}
          <span className="text-gray-500 text-base font-normal">
            ({words.length} words)
          </span>
        </h2>

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
                ({wordsByLevel[lvl]?.length || 0})
              </span>
            </button>
          ))}
        </div>

        {loading && <p className="text-gray-500">Loading words...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!loading && !error && words.length === 0 && (
          <p className="text-gray-500 italic">
            No words found for this lesson. Add some via "Add Words".
          </p>
        )}

        {!loading && filteredWords.length > 0 && (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-12">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Word
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Part of Speech
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Synonym
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Meaning
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Example
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredWords.map((w, idx) => (
                  <tr key={w._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      {w.word}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 italic">
                      {w.partOfSpeech}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {w.synonym}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 max-w-xs">
                      {w.meaning}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 italic max-w-xs">
                      {w.example}
                    </td>
                    <td className="px-4 py-3 text-sm text-center whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(w)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-2 py-1 rounded mr-1"
                      >
                        ✎ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(w)}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded"
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && words.length > 0 && filteredWords.length === 0 && (
          <p className="text-gray-500 italic">
            No {activeLevel} words for this lesson.
          </p>
        )}
      </div>

      {/* Edit Modal */}
      {editingWord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Edit Word</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Word #
                </label>
                <input
                  type="number"
                  value={editForm.wordNumber}
                  onChange={(e) =>
                    setEditForm({ ...editForm, wordNumber: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                  min="1"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Word
                </label>
                <input
                  type="text"
                  value={editForm.word}
                  onChange={(e) =>
                    setEditForm({ ...editForm, word: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Part of Speech
                </label>
                <select
                  value={editForm.partOfSpeech}
                  onChange={(e) =>
                    setEditForm({ ...editForm, partOfSpeech: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  {PARTS_OF_SPEECH.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Level
                </label>
                <select
                  value={editForm.level}
                  onChange={(e) =>
                    setEditForm({ ...editForm, level: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  {LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Synonym
              </label>
              <input
                type="text"
                value={editForm.synonym}
                onChange={(e) =>
                  setEditForm({ ...editForm, synonym: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meaning
              </label>
              <textarea
                value={editForm.meaning}
                onChange={(e) =>
                  setEditForm({ ...editForm, meaning: e.target.value })
                }
                rows="2"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Example
              </label>
              <textarea
                value={editForm.example}
                onChange={(e) =>
                  setEditForm({ ...editForm, example: e.target.value })
                }
                rows="2"
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

export default LessonWords;

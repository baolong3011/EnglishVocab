import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header.jsx";
import { Link } from "react-router-dom";

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

const AddWordsJson = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // JSON mode state
  const [jsonContent, setJsonContent] = useState("");
  const [addingLoading, setAddingLoading] = useState(false);
  const [deletingLoading, setDeletingLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form mode state
  const [lessons, setLessons] = useState([]);
  const [formData, setFormData] = useState({
    word: "",
    partOfSpeech: "Noun",
    synonym: "",
    meaning: "",
    example: "",
    level: "Beginner",
    lessonTitle: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/learn/all-lessons`);
        setLessons(res.data);
        if (res.data.length > 0) {
          setFormData((prev) => ({ ...prev, lessonTitle: res.data[0].title }));
        }
      } catch (err) {
        console.error("Failed to load lessons", err);
      }
    };
    fetchLessons();
  }, []);

  const handleJsonChange = (event) => {
    setJsonContent(event.target.value);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddWords = async () => {
    try {
      setAddingLoading(true);
      setError(null);
      setSuccess(false);

      await axios.post(`${BASE_URL}/learn/add-words`, JSON.parse(jsonContent));
      setAddingLoading(false);
      setJsonContent("");
      setError(null);
      setSuccess("Words added successfully!");
    } catch (error) {
      setError(error.message);
      setAddingLoading(false);
    }
  };

  const handleAddWordForm = async (e) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      setFormError(null);
      setFormSuccess(false);

      if (
        !formData.word ||
        !formData.meaning ||
        !formData.lessonTitle ||
        !formData.level
      ) {
        setFormError("Word, meaning, lesson title and level are required.");
        setFormLoading(false);
        return;
      }

      const word = {
        word: formData.word.trim(),
        partOfSpeech: formData.partOfSpeech,
        synonym: formData.synonym.trim(),
        meaning: formData.meaning.trim(),
        example: formData.example.trim(),
        level: formData.level,
        lessonTitle: formData.lessonTitle,
      };

      await axios.post(`${BASE_URL}/learn/add-words`, [word]);
      setFormSuccess(`Word "${word.word}" added!`);
      setFormData({
        ...formData,
        word: "",
        synonym: "",
        meaning: "",
        example: "",
      });
    } catch (err) {
      setFormError(err.response?.data?.message || err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteWords = async () => {
    try {
      setDeletingLoading(true);
      setError(null);
      setSuccess(false);

      await axios.delete(`${BASE_URL}/learn/delete-words`);
      setDeletingLoading(false);
      setError(null);
      setSuccess("Words deleted successfully!");
    } catch (error) {
      setError(error.message);
      setDeletingLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4">
        {/* Form Mode */}
        <h2 className="text-xl font-semibold mb-4">Add Word (Form)</h2>
        <form
          onSubmit={handleAddWordForm}
          className="bg-white border border-gray-200 rounded-lg p-4 mb-8 max-w-3xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Word <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="word"
                value={formData.word}
                onChange={handleFormChange}
                placeholder="e.g. Resilience"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Part of Speech
              </label>
              <select
                name="partOfSpeech"
                value={formData.partOfSpeech}
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              >
                {PARTS_OF_SPEECH.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lesson Title <span className="text-red-500">*</span>
              </label>
              <select
                name="lessonTitle"
                value={formData.lessonTitle}
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              >
                {lessons.length === 0 ? (
                  <option value="">-- No lessons available --</option>
                ) : (
                  lessons.map((l) => (
                    <option key={l._id} value={l.title}>
                      {l.title}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level <span className="text-red-500">*</span>
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Synonym
            </label>
            <input
              type="text"
              name="synonym"
              value={formData.synonym}
              onChange={handleFormChange}
              placeholder="e.g. Toughness"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meaning <span className="text-red-500">*</span>
            </label>
            <textarea
              name="meaning"
              value={formData.meaning}
              onChange={handleFormChange}
              placeholder="The capacity to recover quickly from difficulties."
              rows="2"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Example
            </label>
            <textarea
              name="example"
              value={formData.example}
              onChange={handleFormChange}
              placeholder="Her resilience helped her overcome many challenges."
              rows="2"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>

          {formError && (
            <p className="text-red-500 mb-3 text-sm">{formError}</p>
          )}
          {formSuccess && (
            <p className="text-green-600 mb-3 text-sm">{formSuccess}</p>
          )}

          <button
            type="submit"
            disabled={formLoading}
            className={`${
              formLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white px-4 py-2 rounded-md`}
          >
            {formLoading ? "Adding..." : "Add Word"}
          </button>
        </form>

        <div className="border-t border-gray-200 my-6"></div>

        {/* JSON Mode */}
        <h2 className="text-xl font-semibold mb-4">Bulk Import (JSON)</h2>
        <textarea
          className="w-full h-40 p-2 border rounded-md mb-4"
          placeholder="Enter JSON array of words here..."
          value={jsonContent}
          onChange={handleJsonChange}
        />
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <button
          className={`${
            addingLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"
          } text-white px-4 py-2 rounded-md`}
          onClick={handleAddWords}
          disabled={addingLoading}
        >
          {addingLoading ? "Adding..." : "Add Words"}
        </button>
        <button
          className={`${
            deletingLoading ? "bg-gray-400 cursor-not-allowed" : "bg-red-500"
          }
          text-white px-4 py-2 rounded-md ml-4`}
          onClick={handleDeleteWords}
          disabled={deletingLoading}
        >
          {deletingLoading ? "Deleting..." : "Delete Words"}
        </button>

        <Link to="/" className="ml-4 text-blue-500">
          Go back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default AddWordsJson;

import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header.jsx";
import { Link } from "react-router-dom";

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

const AddQuizQuestionJson = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // JSON mode state
  const [jsonContent, setJsonContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form mode state
  const [lessons, setLessons] = useState([]);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    distractor1: "",
    distractor2: "",
    distractor3: "",
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

  const handleAddQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      await axios.post(
        `${BASE_URL}/quiz/add-questions`,
        JSON.parse(jsonContent)
      );
      setLoading(false);
      setJsonContent("");
      setError(null);
      setSuccess("Questions added successfully!");
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleAddQuestionForm = async (e) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      setFormError(null);
      setFormSuccess(false);

      if (
        !formData.question ||
        !formData.answer ||
        !formData.distractor1 ||
        !formData.distractor2 ||
        !formData.distractor3 ||
        !formData.lessonTitle ||
        !formData.level
      ) {
        setFormError("All fields are required.");
        setFormLoading(false);
        return;
      }

      const question = {
        question: formData.question.trim(),
        answer: formData.answer.trim(),
        distractor1: formData.distractor1.trim(),
        distractor2: formData.distractor2.trim(),
        distractor3: formData.distractor3.trim(),
        level: formData.level,
        lessonTitle: formData.lessonTitle,
      };

      await axios.post(`${BASE_URL}/quiz/add-questions`, [question]);
      setFormSuccess("Quiz question added successfully!");
      setFormData({
        ...formData,
        question: "",
        answer: "",
        distractor1: "",
        distractor2: "",
        distractor3: "",
      });
    } catch (err) {
      setFormError(err.response?.data?.message || err.message);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4">
        {/* Form Mode */}
        <h2 className="text-xl font-semibold mb-4">
          Add Quiz Question (Form)
        </h2>
        <form
          onSubmit={handleAddQuestionForm}
          className="bg-white border border-gray-200 rounded-lg p-4 mb-8 max-w-3xl"
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question <span className="text-red-500">*</span>
            </label>
            <textarea
              name="question"
              value={formData.question}
              onChange={handleFormChange}
              placeholder="What word means 'a strong feeling of joy'?"
              rows="2"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Answer (correct) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="answer"
              value={formData.answer}
              onChange={handleFormChange}
              placeholder="e.g. Joyful"
              className="w-full p-2 border-2 border-green-300 rounded focus:outline-none focus:border-green-500 bg-green-50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Distractor 1 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="distractor1"
                value={formData.distractor1}
                onChange={handleFormChange}
                placeholder="Wrong answer 1"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Distractor 2 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="distractor2"
                value={formData.distractor2}
                onChange={handleFormChange}
                placeholder="Wrong answer 2"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Distractor 3 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="distractor3"
                value={formData.distractor3}
                onChange={handleFormChange}
                placeholder="Wrong answer 3"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
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
            {formLoading ? "Adding..." : "Add Question"}
          </button>
        </form>

        <div className="border-t border-gray-200 my-6"></div>

        {/* JSON Mode */}
        <h2 className="text-xl font-semibold mb-4">Bulk Import (JSON)</h2>
        <textarea
          className="w-full h-40 p-2 border rounded-md mb-4"
          placeholder="Enter JSON array of questions here..."
          value={jsonContent}
          onChange={handleJsonChange}
        />
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <button
          className={`${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"
          } text-white px-4 py-2 rounded-md`}
          onClick={handleAddQuestions}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Questions"}
        </button>

        <Link to="/" className="ml-4 text-blue-500">
          Go back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default AddQuizQuestionJson;

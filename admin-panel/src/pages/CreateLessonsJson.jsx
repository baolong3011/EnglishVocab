import React, { useState } from "react";
import axios from "axios";
import Header from "../components/Header.jsx";
import { Link } from "react-router-dom";

const CreateLessonsJson = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // JSON mode state
  const [jsonContent, setJsonContent] = useState("");
  const [creatingLoading, setCreatingLoading] = useState(false);
  const [deletingLoading, setDeletingLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form mode state
  const [formData, setFormData] = useState({
    lessonNumber: "",
    title: "",
    description: "",
    icon: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(false);

  const handleJsonChange = (event) => {
    setJsonContent(event.target.value);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateLessons = async () => {
    try {
      setCreatingLoading(true);
      setError(null);
      setSuccess(false);

      await axios.post(
        `${BASE_URL}/learn/create-lessons`,
        JSON.parse(jsonContent)
      );
      setCreatingLoading(false);
      setJsonContent("");
      setError(null);
      setSuccess("Lessons added successfully!");
    } catch (error) {
      setError(error.message);
      setCreatingLoading(false);
    }
  };

  const handleCreateLessonForm = async (e) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      setFormError(null);
      setFormSuccess(false);

      if (!formData.lessonNumber || !formData.title || !formData.description) {
        setFormError("Lesson number, title and description are required.");
        setFormLoading(false);
        return;
      }

      const lesson = {
        lessonNumber: Number(formData.lessonNumber),
        title: formData.title.trim(),
        description: formData.description.trim(),
        icon: formData.icon.trim() || "book",
      };

      await axios.post(`${BASE_URL}/learn/create-lessons`, [lesson]);
      setFormSuccess(`Lesson "${lesson.title}" created!`);
      setFormData({ lessonNumber: "", title: "", description: "", icon: "" });
    } catch (err) {
      setFormError(err.response?.data?.message || err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteLessons = async () => {
    try {
      setDeletingLoading(true);
      setError(null);
      setSuccess(false);

      await axios.delete(`${BASE_URL}/learn/delete-lessons`);
      setDeletingLoading(false);
      setError(null);
      setSuccess("Lessons deleted successfully!");
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
        <h2 className="text-xl font-semibold mb-4">Create Lesson (Form)</h2>
        <form
          onSubmit={handleCreateLessonForm}
          className="bg-white border border-gray-200 rounded-lg p-4 mb-8 max-w-2xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lesson Number <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="lessonNumber"
                value={formData.lessonNumber}
                onChange={handleFormChange}
                placeholder="e.g. 11"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon
              </label>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleFormChange}
                placeholder="e.g. chat, home, school (Material Icons)"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              placeholder="e.g. Sports and Hobbies"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              placeholder="A short description of this lesson topic."
              rows="3"
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
            {formLoading ? "Creating..." : "Create Lesson"}
          </button>
        </form>

        <div className="border-t border-gray-200 my-6"></div>

        {/* JSON Mode */}
        <h2 className="text-xl font-semibold mb-4">Bulk Import (JSON)</h2>
        <textarea
          className="w-full h-40 p-2 border rounded-md mb-4"
          placeholder="Enter JSON array of lessons here..."
          value={jsonContent}
          onChange={handleJsonChange}
        />
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <button
          className={`${
            creatingLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"
          } text-white px-4 py-2 rounded-md mx-2`}
          onClick={handleCreateLessons}
          disabled={creatingLoading}
        >
          {creatingLoading ? "Creating..." : "Create Lessons"}
        </button>

        <button
          className={`${
            deletingLoading ? "bg-gray-400 cursor-not-allowed" : "bg-red-500"
          }
          text-white px-4 py-2 rounded-md`}
          onClick={handleDeleteLessons}
          disabled={deletingLoading}
        >
          {deletingLoading ? "Deleting..." : "Delete Lessons"}
        </button>

        <Link to="/" className="ml-4 text-blue-500">
          Go back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default CreateLessonsJson;

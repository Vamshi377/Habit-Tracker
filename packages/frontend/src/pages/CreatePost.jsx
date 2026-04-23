import React from 'react';

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaTimes, FaPlus, FaCamera } from 'react-icons/fa';
import axios from 'axios';
import { useSelector } from 'react-redux'; // Add this import

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth); // Get user (with token) from Redux
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [],
    imageUrl: ''
  });
  const [tag, setTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleAddTag = () => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
      setTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove)
    }));
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    
    if (!formData.content.trim()) {
      toast.error('Content is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let postData = { ...formData };
      
      // Upload image if exists
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        
        const uploadResponse = await axios.post('/api/upload/image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user.token}` // Add token here too
          }
        });
        
        postData.imageUrl = uploadResponse.data.imageUrl;
      }
      
      // Add authorization header with token
      const response = await axios.post(`${API_URL}/api/community/posts`, postData, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      
      toast.success('Post created successfully');
      navigate(`/community/post/${response.data._id}`);
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error(error.response?.data?.message || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      {/* Page header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link 
            to="/community" 
            className="mr-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <FaArrowLeft />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Create Post</h1>
        </div>
      </div>
      
      {/* Post form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a title for your post"
              maxLength={100}
              required
            />
          </div>
          
          {/* Content */}
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Content *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="8"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Share your thoughts, achievements, or questions..."
              required
            />
          </div>
          
          {/* Tags */}
          <div className="mb-6">
            <label htmlFor="tag" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags
            </label>
            <div className="flex">
              <input
                type="text"
                id="tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add tags (press Enter or click Add)"
                onKeyPress={(e) => e.key === 'Enter' && e.preventDefault()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.tags.map((tag, index) => (
                  <div 
                    key={index} 
                    className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md text-sm flex items-center"
                  >
                    <span>{tag}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-blue-500 hover:text-blue-700"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Image upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Image (Optional)
            </label>
            <div className="flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-6 relative">
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-h-64 rounded-md" 
                  />
                  <button 
                    type="button" 
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-600 rounded-full p-1 text-white hover:bg-red-700"
                    title="Remove image"
                  >
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <FaCamera className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <label htmlFor="file-upload" className="cursor-pointer text-blue-600 dark:text-blue-400 hover:underline">
                      Upload an image
                    </label>
                    <input id="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Submit buttons */}
          <div className="flex justify-end space-x-4">
            <Link
              to="/community"
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Posting...
                </>
              ) : (
                <>
                  <FaPlus className="mr-2" />
                  Create Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { 
  FaArrowLeft, 
  FaHeart, 
  FaRegHeart, 
  FaComment, 
  FaShare, 
  FaEllipsisV,
  FaTrash,
  FaBookmark,
  FaRegBookmark
} from 'react-icons/fa';
import Loader from '../components/Loader';

const Post = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  
  useEffect(() => {
    fetchPost();
  }, [id]);
  
  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/community/posts/${id}`);
      setPost(response.data);
      
      // Check if user already liked this post
      if (user && response.data.likes && response.data.likes.includes(user._id)) {
        setIsLiked(true);
      }
      
      // Check if post is saved
      // This would require backend support for saved posts
      // setIsSaved(...);
      
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Failed to load post');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLike = async () => {
    if (!user) {
      toast.info('Please sign in to like posts');
      return;
    }
    
    try {
      const response = await axios.post(`/api/community/posts/${post._id}/like`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      setPost(prev => ({
        ...prev,
        likes: response.data.likes
      }));
      
      setIsLiked(response.data.isLiked);
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to like post');
    }
  };
  
  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.info('Please sign in to comment');
      return;
    }
    
    if (!comment.trim()) {
      return;
    }
    
    setSubmittingComment(true);
    
    try {
      const response = await axios.post(`/api/community/posts/${post._id}/comments`, {
        text: comment
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      setPost(prev => ({
        ...prev,
        comments: [response.data, ...prev.comments]
      }));
      
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };
  
  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`/api/community/posts/${post._id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        
        toast.success('Post deleted successfully');
        navigate('/community');
      } catch (error) {
        console.error('Error deleting post:', error);
        toast.error('Failed to delete post');
      }
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (loading) return <Loader />;
  
  if (!post) return <div className="text-center py-8">Post not found</div>;
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-blue-600 hover:underline"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        {/* Post header */}
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center">
            {/* Use optional chaining here */}
            <Link to={`/profile/${post?.user?._id}`} className="flex items-center">
              <img 
                src={post?.user?.avatar || '/default-avatar.png'} 
                alt={post?.user?.username || 'User'} 
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200">
                  {post?.user?.username || 'Anonymous'}
                </h3>
                <p className="text-sm text-gray-500">
                  {post?.createdAt ? formatDate(post.createdAt) : 'Unknown date'}
                </p>
              </div>
            </Link>
          </div>
          
          {/* Post options */}
          <div className="relative">
            <button 
              onClick={() => setShowOptions(!showOptions)} 
              className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full"
            >
              <FaEllipsisV />
            </button>
            
            {showOptions && (
              <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
                {user && post?.user?._id === user._id && (
                  <button
                    onClick={handleDeletePost}
                    className="flex w-full items-center px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FaTrash className="mr-2" /> Delete post
                  </button>
                )}
                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className="flex w-full items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {isSaved ? (
                    <>
                      <FaBookmark className="mr-2" /> Saved
                    </>
                  ) : (
                    <>
                      <FaRegBookmark className="mr-2" /> Save post
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Post content */}
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">{post.title}</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-line">{post.content}</p>
          
          {post.image && (
            <img 
              src={post.image} 
              alt="Post content" 
              className="w-full h-auto rounded-lg mb-4 object-cover"
            />
          )}
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Post actions */}
          <div className="flex items-center mt-4 pt-4 border-t dark:border-gray-700">
            <button 
              onClick={handleLike}
              className={`flex items-center mr-6 ${
                isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              {isLiked ? <FaHeart className="mr-1" /> : <FaRegHeart className="mr-1" />}
              <span>{post.likes?.length || 0}</span>
            </button>
            
            <button 
              onClick={() => document.getElementById('comment-input').focus()}
              className="flex items-center mr-6 text-gray-500 hover:text-blue-500"
            >
              <FaComment className="mr-1" />
              <span>{post.comments?.length || 0}</span>
            </button>
            
            <button 
              className="flex items-center text-gray-500 hover:text-green-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard');
              }}
            >
              <FaShare className="mr-1" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Comment section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Comments ({post.comments?.length || 0})
          </h3>
          
          {/* Comment form */}
          <form onSubmit={handleAddComment} className="mb-6">
            <div className="flex items-start">
              <img 
                src={user?.avatar || '/default-avatar.png'} 
                alt="Your avatar" 
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <div className="flex-1">
                <textarea
                  id="comment-input"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={user ? "Write a comment..." : "Sign in to comment"}
                  disabled={!user || submittingComment}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                ></textarea>
                <button 
                  type="submit"
                  disabled={!user || !comment.trim() || submittingComment}
                  className={`mt-2 px-4 py-2 rounded-lg font-medium ${
                    !user || !comment.trim() || submittingComment
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {submittingComment ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </form>
          
          {/* Comments list */}
          <div className="space-y-4">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment._id} className="flex">
                  <img 
                    src={comment.user?.avatar || '/default-avatar.png'} 
                    alt={comment.user?.username || 'User'} 
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                  <div className="flex-1">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">
                          {comment.user?.username || 'Anonymous'}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {comment.createdAt ? formatDate(comment.createdAt) : 'Unknown date'}
                        </p>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mt-1">{comment.text}</p>
                    </div>
                    
                    {/* Comment actions */}
                    <div className="mt-1 ml-1 flex text-xs">
                      <button className="text-gray-500 hover:text-blue-500 mr-4">Reply</button>
                      {user && comment.user?._id === user._id && (
                        <button 
                          className="text-gray-500 hover:text-red-500"
                          onClick={async () => {
                            if (window.confirm('Are you sure you want to delete this comment?')) {
                              try {
                                await axios.delete(`/api/community/posts/${post._id}/comments/${comment._id}`, {
                                  headers: { Authorization: `Bearer ${user.token}` }
                                });
                                
                                setPost(prev => ({
                                  ...prev,
                                  comments: prev.comments.filter(c => c._id !== comment._id)
                                }));
                                
                                toast.success('Comment deleted');
                              } catch (error) {
                                console.error('Error deleting comment:', error);
                                toast.error('Failed to delete comment');
                              }
                            }
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
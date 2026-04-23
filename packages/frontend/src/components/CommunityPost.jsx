import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaHeart, FaRegHeart, FaComment, FaEllipsisH, FaTrash, FaFlag } from 'react-icons/fa';
import { likePost, unlikePost, deletePost, reportPost } from '../features/community/communitySlice';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';

const CommunityPost = ({ post }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showMenu, setShowMenu] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  
  const isLiked = post.likes?.includes(user?._id);
  const isOwnPost = post.user._id === user?._id;
  
  const handleLikeToggle = () => {
    if (isLiked) {
      dispatch(unlikePost(post._id));
    } else {
      dispatch(likePost(post._id));
    }
  };
  
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    dispatch(addComment({ postId: post._id, text: commentText }))
      .unwrap()
      .then(() => {
        setCommentText('');
      })
      .catch((error) => {
        toast.error(error || 'Failed to add comment');
      });
  };
  
  const handleDeletePost = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      dispatch(deletePost(post._id))
        .unwrap()
        .then(() => {
          toast.success('Post deleted successfully');
        })
        .catch((error) => {
          toast.error(error || 'Failed to delete post');
        });
    }
    setShowMenu(false);
  };
  
  const handleReportPost = () => {
    dispatch(reportPost(post._id))
      .unwrap()
      .then(() => {
        toast.success('Post reported');
      })
      .catch((error) => {
        toast.error(error || 'Failed to report post');
      });
    setShowMenu(false);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-4 overflow-hidden">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
            {post.user.avatar ? (
              <img src={post.user.avatar} alt={post.user.username} className="h-full w-full object-cover" />
            ) : (
              <span className="text-gray-600 dark:text-gray-300 text-lg font-bold">
                {post.user.username.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-800 dark:text-white">
              {post.user.username}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </div>
          </div>
        </div>
        
        {/* Post menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full"
          >
            <FaEllipsisH />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-700 shadow-lg rounded-md py-1 z-10">
              {isOwnPost ? (
                <button
                  onClick={handleDeletePost}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <FaTrash className="mr-2" />
                  Delete Post
                </button>
              ) : (
                <button
                  onClick={handleReportPost}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <FaFlag className="mr-2" />
                  Report Post
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Post Content */}
      <div className="p-4">
        <p className="text-gray-800 dark:text-white whitespace-pre-line">
          {post.content}
        </p>
        
        {post.image && (
          <div className="mt-3 rounded-lg overflow-hidden">
            <img src={post.image} alt="Post" className="w-full h-auto" />
          </div>
        )}
        
        {/* Achievement or Habit shared */}
        {(post.achievement || post.habit) && (
          <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            {post.achievement && (
              <div className="flex items-center">
                <div className="p-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mr-2">
                  <FaTrophy className="text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-800 dark:text-white">
                    Unlocked Achievement: {post.achievement.title}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">
                    {post.achievement.description}
                  </div>
                </div>
              </div>
            )}
            
            {post.habit && (
              <div className="flex items-center">
                <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/30 mr-2">
                  <FaCheck className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-800 dark:text-white">
                    Completed Habit: {post.habit.title}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">
                    {post.habit.streak} day streak 🔥
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Post Actions */}
      <div className="px-4 pb-2 flex items-center space-x-4">
        <button
          onClick={handleLikeToggle}
          className={`flex items-center text-sm ${
            isLiked 
              ? 'text-red-500 dark:text-red-400' 
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {isLiked ? <FaHeart className="mr-1" /> : <FaRegHeart className="mr-1" />}
          {post.likes?.length || 0}
        </button>
        
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center text-sm text-gray-500 dark:text-gray-400"
        >
          <FaComment className="mr-1" />
          {post.comments?.length || 0}
        </button>
      </div>
      
      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          {/* Comment List */}
          <div className="px-4 py-2 max-h-60 overflow-y-auto">
            {post.comments?.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment._id} className="py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <div className="flex">
                    <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {comment.user.avatar ? (
                        <img src={comment.user.avatar} alt={comment.user.username} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-gray-600 dark:text-gray-300 text-sm font-bold">
                          {comment.user.username.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="ml-2 flex-1">
                      <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                        <div className="text-xs font-medium text-gray-800 dark:text-white">
                          {comment.user.username}
                        </div>
                        <p className="text-sm text-gray-800 dark:text-gray-200">
                          {comment.text}
                        </p>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                No comments yet. Be the first to comment!
              </div>
            )}
          </div>
          
          {/* Comment Form */}
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-750">
            <form onSubmit={handleAddComment} className="flex">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-l-md py-2 px-3 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-r-md text-sm disabled:opacity-50"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPost;
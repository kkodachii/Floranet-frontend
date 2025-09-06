import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";

import CommunityPost from "../../../components/CommunityPost";
import CreatePostModal from "../../../components/CreatePostModal";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";
import apiService from "../../../services/api";

function ProjectHub() {
  const theme = useTheme();
  const [posts, setPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [editingPost, setEditingPost] = React.useState(null);
  const [deletingPost, setDeletingPost] = React.useState(null);
  const [openCommentsPostId, setOpenCommentsPostId] = React.useState(null);

  const fetchPosts = React.useCallback(async (pageNum = 1, append = false) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await apiService.getCommunityPosts(pageNum, '', { category: 'project' });
      console.log('API Response:', response); // Debug log
      
      const newPosts = response.data;
      console.log('Posts data:', newPosts); // Debug log
      
      if (append) {
        setPosts(prev => [...prev, ...newPosts]);
      } else {
        setPosts(newPosts);
      }
      
      setHasMore(response.current_page < response.last_page);
      setPage(response.current_page);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setError('Failed to load community posts');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchPosts(1, false);
  }, [fetchPosts]);

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
    setShowCreateModal(false);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setShowCreateModal(true);
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(prev => prev.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
    setEditingPost(null);
    setShowCreateModal(false);
  };

  const handleDeletePost = async (postId) => {
    try {
      await apiService.deleteCommunityPost(postId);
      // Remove the deleted post from the list
      setPosts(prev => prev.filter(post => post.id !== postId));
      setDeletingPost(null); // Close confirmation modal
    } catch (error) {
      console.error('Failed to delete post:', error);
      setDeletingPost(null); // Close confirmation modal
    }
  };

  // Show delete confirmation
  const showDeleteConfirmation = (post) => {
    setDeletingPost(post);
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeletingPost(null);
  };

  // Handle comment toggle
  const handleCommentToggle = (postId) => {
    if (openCommentsPostId === postId) {
      // Close comments for this post
      setOpenCommentsPostId(null);
    } else {
      // Open comments for this post (closes any other open comments)
      setOpenCommentsPostId(postId);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      await apiService.likeCommunityPost(postId);
      // Refresh posts to get updated like count
      fetchPosts(1);
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleAddComment = async (postId, commentContent) => {
    try {
      const response = await apiService.addCommentToPost(postId, {
        content: commentContent
      });
      
      // Update the post's comment count
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments_count: post.comments_count + 1
          };
        }
        return post;
      }));
      
      // Return the response so the CommunityPost component can update its local state
      return response;
    } catch (error) {
      console.error('Failed to add comment:', error);
      throw error;
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchPosts(page + 1, true);
    }
  };

  // Transform API data to match component props
  const transformPostData = (apiPost) => ({
    id: apiPost.id,
    avatarSrc: apiPost.user?.profile_picture || null,
    userName: apiPost.user?.name || "Unknown User",
    timestamp: new Date(apiPost.created_at).toLocaleString(),
    content: apiPost.content && apiPost.content !== 'null' ? apiPost.content : null,
    images: apiPost.images || [],
    category: apiPost.category,
    visibility: apiPost.visibility,
    likes_count: apiPost.likes_count || 0,
    comments_count: apiPost.comments_count || 0,
    is_liked: apiPost.is_liked || false,
    user_reaction: apiPost.user_reaction || null
  });

  if (loading && posts.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && posts.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
        <Button onClick={() => fetchPosts()} variant="outlined">
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" color="text.primary">
          Project Hub
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => setShowCreateModal(true)}
          sx={{ minWidth: 120 }}
        >
          Create Post
        </Button>
      </Box>

      {/* Posts */}
      {posts.map((post) => (
        <CommunityPost
          key={post.id}
          id={post.id}
          avatarSrc={post.user?.profile_picture}
          userName={post.user?.name || 'Unknown User'}
          timestamp={post.created_at}
          content={post.content}
          category={post.category}
          visibility={post.visibility}
          images={post.images}
          likes_count={post.likes_count}
          comments_count={post.comments_count}
          is_liked={post.is_liked}
          user_reaction={post.user_reaction}
          onDeletePost={() => showDeleteConfirmation(post)}
          onLikePost={() => handleLikePost(post.id)}
          onAddComment={(commentText) => handleAddComment(post.id, commentText)}
          onEditPost={() => handleEditPost(post)}
          onCommentToggle={handleCommentToggle}
          isCommentsOpen={openCommentsPostId === post.id}
        />
      ))}

      {/* Load More Button */}
      {hasMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <Button 
            onClick={handleLoadMore} 
            variant="outlined"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More Posts'}
          </Button>
        </Box>
      )}

      {/* Create Post Modal */}
      <CreatePostModal
        open={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingPost(null);
        }}
        onPostCreated={handlePostCreated}
        onPostUpdated={handlePostUpdated}
        editPost={editingPost}
        defaultCategory="project"
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={!!deletingPost}
        onClose={cancelDelete}
        onConfirm={() => handleDeletePost(deletingPost?.id)}
        postTitle={deletingPost?.content && deletingPost.content !== 'null' ? deletingPost.content : 'this post'}
      />
    </Box>
  );
}

export default ProjectHub; 
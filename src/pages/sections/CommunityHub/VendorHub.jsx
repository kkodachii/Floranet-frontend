import * as React from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import CommunityPost from "../../../components/CommunityPost";
import CreatePostModal from "../../../components/CreatePostModal";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";
import apiService from "../../../services/api";

function VendorHub() {
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
      
      const response = await apiService.getCommunityPosts(pageNum, '', { category: 'business' });
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
    setPosts(prev => prev.map(post => post.id === updatedPost.id ? updatedPost : post));
    setEditingPost(null);
    setShowCreateModal(false);
  };

  const handleDeletePost = async (postId) => {
    try {
      await apiService.deleteCommunityPost(postId);
      setPosts(prev => prev.filter(post => post.id !== postId));
      setDeletingPost(null);
    } catch (error) {
      console.error('Failed to delete post:', error);
      setDeletingPost(null);
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

  if (loading && posts.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && posts.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
        <Button onClick={() => fetchPosts()} variant="outlined">
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>


      {/* Posts */}
      {posts.map((post) => (
        <CommunityPost
          key={post.id}
          id={post.id}
          avatarSrc={post.user?.profile_picture}
          userName={post.user?.name || 'Unknown User'}
          timestamp={post.created_at}
          content={post.content && post.content !== 'null' ? post.content : null}
          category={post.category}
          visibility={post.visibility}
          images={post.images}
          likes_count={post.likes_count}
          comments_count={post.comments_count}
          is_liked={post.is_liked}
          user_reaction={post.user_reaction}
          onDeletePost={() => {
            showDeleteConfirmation(post);
          }}
          onEditPost={() => handleEditPost(post)}
          onLikePost={() => handleLikePost(post.id)}
          onAddComment={(commentText) => handleAddComment(post.id, commentText)}
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

      <CreatePostModal
        open={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingPost(null);
        }}
        onPostCreated={handlePostCreated}
        onPostUpdated={handlePostUpdated}
        editPost={editingPost}
        defaultCategory="business"
      />

      <DeleteConfirmationModal
        open={!!deletingPost}
        onClose={cancelDelete}
        onConfirm={() => handleDeletePost(deletingPost?.id)}
        postTitle={deletingPost?.content && deletingPost.content !== 'null' ? deletingPost.content : 'this post'}
      />


    </Box>
  );
}

export default VendorHub; 
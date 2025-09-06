import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import CreatePostModal from "../../../../src/components/CreatePostModal";
import CommunityPost from "../../../../src/components/CommunityPost";
import apiService from "../../../../src/services/api";
import DeleteConfirmationModal from "../../../../src/components/DeleteConfirmationModal";

function AdminHub() {
  const theme = useTheme();
  const [openModal, setOpenModal] = React.useState(false);
  const [posts, setPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [editingPost, setEditingPost] = React.useState(null);
  const [deletingPost, setDeletingPost] = React.useState(null);
  const [openCommentsPostId, setOpenCommentsPostId] = React.useState(null);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingPost(null);
  };

  // Handle edit post
  const handleEditPost = (post) => {
    setEditingPost(post);
    setOpenModal(true);
  };

  // Handle post update
  const handlePostUpdated = (updatedPost) => {
    setPosts(prev => prev.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
  };

  // Fetch community posts from API
  const fetchPosts = React.useCallback(async (pageNum = 1, append = false) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await apiService.getCommunityPosts(pageNum, '', { admin_only: 'true' });
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

  // Load posts on component mount
  React.useEffect(() => {
    fetchPosts(1, false);
  }, [fetchPosts]);

  // Handle post creation
  const handlePostCreated = (newPost) => {
    // Add the new post to the beginning of the list
    setPosts(prev => [newPost, ...prev]);
  };

  // Handle post deletion
  const handleDeletePost = async (postId) => {
    try {
      await apiService.deleteCommunityPost(postId);
      // Remove the deleted post from the list
      setPosts(prev => prev.filter(post => post.id !== postId));
      setDeletingPost(null); // Close confirmation modal
    } catch (error) {
      console.error('Failed to delete post:', error);
      setError('Failed to delete post');
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

  // Handle post like
  const handleLikePost = async (postId, reaction = 'like') => {
    try {
      const response = await apiService.likeCommunityPost(postId, reaction);
      // Update the post's like count and user reaction
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes_count: response.likes_count,
            is_liked: response.is_liked,
            user_reaction: response.user_reaction
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  // Handle comment addition
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

  // Transform API data to match component props
  const transformPostData = (apiPost) => ({
    id: apiPost.id,
    avatarSrc: apiPost.user?.profile_picture || null, // Let the component handle default avatar
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenModal}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            px: 2,
            py: 1,
            borderRadius: 1,
            boxShadow: 2,
            '&:hover': {
              boxShadow: 3,
            },
            '&:focus': {
              outline: 'none',
              boxShadow: 2,
            },
            '&:focus-visible': {
              outline: 'none',
              boxShadow: 2,
            }
          }}
        >
          Create Community Post
        </Button>
      </Box>

      {posts.length === 0 && !loading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No community posts yet. Be the first to create one!
          </Typography>
        </Box>
      ) : (
        posts.map((post) => (
          <CommunityPost 
            key={post.id} 
            {...transformPostData(post)}
            onDeletePost={() => showDeleteConfirmation(post)}
            onLikePost={() => handleLikePost(post.id)}
            onAddComment={(content) => handleAddComment(post.id, content)}
            onEditPost={() => handleEditPost(post)}
            onCommentToggle={handleCommentToggle}
            isCommentsOpen={openCommentsPostId === post.id}
          />
        ))
      )}

      {hasMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            variant="outlined"
            onClick={() => fetchPosts(page + 1, true)}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Load More Posts'}
          </Button>
        </Box>
      )}

      <CreatePostModal 
        open={openModal} 
        onClose={handleCloseModal}
        onPostCreated={handlePostCreated}
        editPost={editingPost}
        onPostUpdated={handlePostUpdated}
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

export default AdminHub; 
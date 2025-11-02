import * as React from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import CommunityPost from "../../../components/CommunityPost";
import CreatePostModal from "../../../components/CreatePostModal";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";
import apiService from "../../../services/api";

function ResidentsHub() {
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

  const fetchPosts = async (pageNum = 1) => {
    try {
      setLoading(true);
      // Fetch posts by residents (non-admin users)
      const response = await apiService.getCommunityPosts(pageNum, '', { resident_only: 'true' });
      
      if (pageNum === 1) {
        setPosts(response.data.data || []);
      } else {
        setPosts(prev => [...prev, ...(response.data.data || [])]);
      }
      
      setHasMore(response.data.next_page_url !== null);
      setPage(pageNum);
    } catch (error) {
      setError('Failed to fetch resident posts');
      console.error('Error fetching resident posts:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPosts();
  }, []);

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

  // Handle post archiving (admin side - archive instead of delete)
  const handleArchivePost = async (postId) => {
    try {
      await apiService.archiveCommunityPost(postId);
      // Remove the archived post from the list
      setPosts(prev => prev.filter(post => post.id !== postId));
      setDeletingPost(null); // Close confirmation modal
    } catch (error) {
      console.error('Failed to archive post:', error);
      setDeletingPost(null); // Close confirmation modal
    }
  };

  // Show archive confirmation
  const showArchiveConfirmation = (post) => {
    setDeletingPost(post);
  };

  // Cancel archive
  const cancelArchive = () => {
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
      
      if (response.success) {
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
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
      throw error;
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchPosts(page + 1);
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
          onDeletePost={() => showArchiveConfirmation(post)}
          onLikePost={() => handleLikePost(post.id)}
          onAddComment={(commentText) => handleAddComment(post.id, commentText)}
          onEditPost={() => handleEditPost(post)}
          onCommentToggle={handleCommentToggle}
          isCommentsOpen={openCommentsPostId === post.id}
          isAdminView={true}
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
        defaultCategory="general"
      />

      {/* Archive Confirmation Modal */}
      <DeleteConfirmationModal
        open={!!deletingPost}
        onClose={cancelArchive}
        onConfirm={() => handleArchivePost(deletingPost?.id)}
        postTitle={deletingPost?.content && deletingPost.content !== 'null' ? deletingPost.content : 'this post'}
        actionLabel="Archive"
      />


    </Box>
  );
}

export default ResidentsHub; 
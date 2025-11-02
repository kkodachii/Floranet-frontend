import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import ArchiveIcon from "@mui/icons-material/Archive";
import CommunityPost from "../../../components/CommunityPost";
import apiService from "../../../services/api";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";

function ArchivedPosts() {
  const theme = useTheme();
  const [posts, setPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [unarchivingPost, setUnarchivingPost] = React.useState(null);
  const [openCommentsPostId, setOpenCommentsPostId] = React.useState(null);

  // Fetch archived posts from API
  const fetchPosts = React.useCallback(async (pageNum = 1, append = false) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await apiService.getArchivedCommunityPosts(pageNum, '');
      console.log('Archived Posts API Response:', response);
      
      if (response.success) {
        const newPosts = response.data.data;
        console.log('Archived Posts data:', newPosts);
        
        if (append) {
          setPosts(prev => [...prev, ...newPosts]);
        } else {
          setPosts(newPosts);
        }
        
        setHasMore(response.data.current_page < response.data.last_page);
        setPage(response.data.current_page);
      }
    } catch (error) {
      console.error('Failed to fetch archived posts:', error);
      setError('Failed to load archived posts');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load posts on component mount
  React.useEffect(() => {
    fetchPosts(1, false);
  }, [fetchPosts]);

  // Handle post unarchiving
  const handleUnarchivePost = async (postId) => {
    try {
      await apiService.unarchiveCommunityPost(postId);
      // Remove the unarchived post from the list
      setPosts(prev => prev.filter(post => post.id !== postId));
      setUnarchivingPost(null); // Close confirmation modal
    } catch (error) {
      console.error('Failed to unarchive post:', error);
      setError('Failed to unarchive post');
      setUnarchivingPost(null); // Close confirmation modal
    }
  };

  // Show unarchive confirmation
  const showUnarchiveConfirmation = (post) => {
    setUnarchivingPost(post);
  };

  // Cancel unarchive
  const cancelUnarchive = () => {
    setUnarchivingPost(null);
  };

  // Handle comment toggle
  const handleCommentToggle = (postId) => {
    if (openCommentsPostId === postId) {
      setOpenCommentsPostId(null);
    } else {
      setOpenCommentsPostId(postId);
    }
  };

  // Handle post like
  const handleLikePost = async (postId, reaction = 'like') => {
    try {
      const response = await apiService.likeCommunityPost(postId, reaction);
      if (response.success) {
        setPosts(prev => prev.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              likes_count: response.data.likes_count,
              is_liked: response.data.is_liked,
              user_reaction: response.data.user_reaction
            };
          }
          return post;
        }));
      }
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
      
      if (response.success) {
        setPosts(prev => prev.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments_count: post.comments_count + 1
            };
          }
          return post;
        }));
        
        return response;
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
      throw error;
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <ArchiveIcon color="warning" />
        <Typography variant="h5" fontWeight="600">
          Archived Posts
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {posts.length === 0 && !loading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <ArchiveIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No archived posts
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Posts that are archived will appear here.
          </Typography>
        </Box>
      ) : (
        posts.map((post) => (
          <Box key={post.id} sx={{ position: 'relative' }}>
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 10,
                backgroundColor: 'warning.main',
                color: 'white',
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <ArchiveIcon sx={{ fontSize: 16 }} />
              Archived
            </Box>
            <CommunityPost 
              {...transformPostData(post)}
              onDeletePost={() => showUnarchiveConfirmation(post)}
              onLikePost={() => handleLikePost(post.id)}
              onAddComment={(content) => handleAddComment(post.id, content)}
              onCommentToggle={handleCommentToggle}
              isCommentsOpen={openCommentsPostId === post.id}
              isAdminView={true}
              isArchived={true}
            />
          </Box>
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

      <DeleteConfirmationModal
        open={!!unarchivingPost}
        onClose={cancelUnarchive}
        onConfirm={() => handleUnarchivePost(unarchivingPost?.id)}
        postTitle={unarchivingPost?.content && unarchivingPost.content !== 'null' ? unarchivingPost.content : 'this post'}
        actionLabel="Unarchive"
        title="Confirm Unarchive"
        confirmText="Unarchive"
      />
    </Box>
  );
}

export default ArchivedPosts;


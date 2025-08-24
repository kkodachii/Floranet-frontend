import * as React from 'react';
import { Modal, Box, Typography, TextField, Button, IconButton, FormControl, InputLabel, Select, MenuItem, Chip, Alert, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import PollIcon from '@mui/icons-material/Poll';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useTheme } from '@mui/material/styles';
import apiService from '../services/api';
import config from '../config/env';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 700 },
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  maxHeight: '90vh',
  overflow: 'auto',
};

function CreatePostModal({ open, onClose, onPostCreated, onPostUpdated, editPost = null, defaultCategory = 'general' }) {
  const theme = useTheme();
  const [formData, setFormData] = React.useState({
    content: '',
    category: defaultCategory,
    visibility: 'public',
    type: 'text',
    images: []
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  // Initialize form data when editing
  React.useEffect(() => {
    if (editPost) {
      setFormData({
        content: editPost.content || '',
        category: editPost.category || 'general',
        visibility: editPost.visibility || 'public',
        type: editPost.type || 'text',
        images: [],
        existingImages: editPost.images || []
      });
    } else {
      setFormData({
        content: '',
        category: defaultCategory,
        visibility: 'public',
        type: 'text',
        images: [],
        existingImages: []
      });
    }
  }, [editPost, defaultCategory]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const removeExistingImage = (index) => {
    // Prevent removing all images - at least one must remain
    if (formData.existingImages.length <= 1 && formData.images.length === 0) {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    // Check if either content or images are present
    if (!formData.content.trim() && getTotalImageCount() === 0) {
      setError('Please enter some content or upload images for your post');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Determine the correct type based on content and images
      let postType = 'text';
      const hasNewImages = formData.images && formData.images.length > 0;
      const hasExistingImages = formData.existingImages && formData.existingImages.length > 0;
      const hasContent = formData.content.trim();
      
      if (hasNewImages || hasExistingImages) {
        if (hasContent) {
          postType = 'mixed';
        } else {
          postType = 'image';
        }
      } else if (hasContent) {
        postType = 'text';
      }

      // Prepare the data to send
      const postData = {
        ...formData,
        type: postType,
        content: formData.content.trim() || null // Send null if no content
      };

      console.log('Sending post data:', postData); // Debug log
      console.log('Edit mode:', !!editPost); // Debug log
      console.log('Existing images count:', formData.existingImages ? formData.existingImages.length : 0); // Debug log
      console.log('New images count:', formData.images ? formData.images.length : 0); // Debug log
      console.log('FormData content:', formData.content); // Debug log
      console.log('FormData existingImages:', formData.existingImages); // Debug log
      console.log('FormData images:', formData.images); // Debug log

      let response;
      
      if (editPost) {
        // Update existing post
        console.log('Updating post with data:', postData);
        response = await apiService.updateCommunityPost(editPost.id, postData);
        console.log('Update response:', response);
        setSuccess('Post updated successfully!');
        
        // Notify parent component with the updated post data
        if (onPostUpdated) {
          // Handle both possible response structures
          const updatedPost = response.data || response;
          console.log('Calling onPostUpdated with:', updatedPost);
          onPostUpdated(updatedPost);
        }
      } else {
        // Create new post
        response = await apiService.createCommunityPost(postData);
        setSuccess('Post created successfully!');
        
        // Notify parent component with the new post data
        if (onPostCreated) {
          // Handle both possible response structures
          const newPost = response.data || response;
          onPostCreated(newPost);
        }
      }

      // Reset form
      setFormData({
        content: '',
        category: 'general',
        visibility: 'public',
        type: 'text',
        images: [],
        existingImages: []
      });

      // Close modal after a short delay
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 1500);

    } catch (error) {
      setError(error.message || `Failed to ${editPost ? 'update' : 'create'} post`);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setFormData({
      content: '',
      category: 'general',
      visibility: 'public',
      type: 'text',
      images: [],
      existingImages: []
    });
    setError('');
    setSuccess('');
    onClose();
  };

  const isEditMode = !!editPost;

  // Helper function to get total image count
  const getTotalImageCount = () => {
    const existingCount = formData.existingImages ? formData.existingImages.length : 0;
    const newCount = formData.images ? formData.images.length : 0;
    return existingCount + newCount;
  };

  return (
    <Modal
      open={open}
      onClose={handleCloseModal}
      aria-labelledby="create-post-modal-title"
      aria-describedby="create-post-modal-description"
    >
      <Box sx={style}>
        <IconButton
          aria-label="close"
          onClick={handleCloseModal}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        
        <Typography id="create-post-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
          {isEditMode ? 'Edit Post' : "What's on your mind?"}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <TextField
          id="create-post-modal-description"
          multiline
          rows={4}
          placeholder="Share your thoughts..."
          variant="outlined"
          fullWidth
          value={formData.content}
          onChange={(e) => handleInputChange('content', e.target.value)}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category}
              label="Category"
              onChange={(e) => handleInputChange('category', e.target.value)}
            >
              <MenuItem value="general">General</MenuItem>
              <MenuItem value="announcement">Announcement</MenuItem>
              <MenuItem value="events">Events</MenuItem>
              <MenuItem value="business">Business</MenuItem>
              <MenuItem value="project">Project</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Visibility</InputLabel>
            <Select
              value={formData.visibility}
              label="Visibility"
              onChange={(e) => handleInputChange('visibility', e.target.value)}
            >
              <MenuItem value="public">Public</MenuItem>
              <MenuItem value="residents_only">Residents Only</MenuItem>
              <MenuItem value="admin_only">Admin Only</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Image upload section */}
        <Box sx={{ mb: 2 }}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="image-upload"
            multiple
            type="file"
            onChange={handleImageUpload}
          />
          <label htmlFor="image-upload">
            <IconButton color="primary" component="span">
              <AddPhotoAlternateIcon />
            </IconButton>
          </label>
          
          {/* Display existing images */}
          {formData.existingImages && formData.existingImages.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Current Images:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.existingImages.map((image, index) => {
                  // Construct proper image URL
                  let imageUrl;
                  if (typeof image === 'string') {
                    if (image.startsWith('http')) {
                      imageUrl = image;
                    } else {
                      // Assume it's a relative path from the API
                      imageUrl = `${config.API_BASE_URL}/storage/${image}`;
                    }
                  } else {
                    imageUrl = URL.createObjectURL(image);
                  }
                  
                  return (
                    <Box key={`existing-${index}`} sx={{ position: 'relative' }}>
                      <img
                        src={imageUrl}
                        alt={`Existing image ${index + 1}`}
                        style={{
                          width: 80,
                          height: 80,
                          objectFit: 'cover',
                          borderRadius: 8,
                          border: '1px solid #ddd'
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => removeExistingImage(index)}
                        disabled={formData.existingImages.length <= 1 && formData.images.length === 0}
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          backgroundColor: formData.existingImages.length <= 1 && formData.images.length === 0 ? 'grey.400' : 'error.main',
                          color: 'white',
                          width: 20,
                          height: 20,
                          '&:hover': {
                            backgroundColor: formData.existingImages.length <= 1 && formData.images.length === 0 ? 'grey.400' : 'error.dark',
                          },
                          '&.Mui-disabled': {
                            backgroundColor: 'grey.400',
                            color: 'white'
                          }
                        }}
                      >
                        ×
                      </IconButton>
                    </Box>
                  );
                })}
              </Box>
              {formData.existingImages.length === 1 && formData.images.length === 0 && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  At least one image must remain. Add new images first if you want to replace this one.
                </Typography>
              )}
            </Box>
          )}
          
          {/* Display new uploaded images */}
          {formData.images.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                New Images:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.images.map((image, index) => (
                  <Box key={`new-${index}`} sx={{ position: 'relative' }}>
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`New image ${index + 1}`}
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: 'cover',
                        borderRadius: 8,
                        border: '1px solid #ddd'
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeImage(index)}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        backgroundColor: 'error.main',
                        color: 'white',
                        width: 20,
                        height: 20,
                        '&:hover': {
                          backgroundColor: 'error.dark',
                        }
                      }}
                    >
                      ×
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={loading || (!formData.content.trim() && getTotalImageCount() === 0)}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? (isEditMode ? 'Updating...' : 'Posting...') : (isEditMode ? 'Update' : 'Post')}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default CreatePostModal; 
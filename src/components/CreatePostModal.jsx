import * as React from 'react';
import { Modal, Box, Typography, TextField, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import PollIcon from '@mui/icons-material/Poll';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useTheme } from '@mui/material/styles';

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
};

function CreatePostModal({ open, handleClose }) {
  const theme = useTheme();

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="create-post-modal-title"
      aria-describedby="create-post-modal-description"
    >
      <Box sx={style}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
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
          What's on your mind?
        </Typography>
        <TextField
          id="create-post-modal-description"
          multiline
          rows={4}
          placeholder="Share your thoughts..."
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <IconButton color="primary">
              <PollIcon />
            </IconButton>
            <IconButton color="primary">
              <AddPhotoAlternateIcon />
            </IconButton>
            <IconButton color="primary">
              <InsertDriveFileIcon />
            </IconButton>
          </Box>
          <Button variant="contained" onClick={handleClose}>
            Post
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default CreatePostModal; 
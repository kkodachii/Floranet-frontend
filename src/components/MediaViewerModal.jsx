import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ImageIcon from '@mui/icons-material/Image';
import config from '../config/env';

const MediaViewerModal = ({ open, onClose, mediaFile }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!mediaFile) return null;

  const isVideoFile = (filename) => {
    const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.mkv'];
    return videoExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  };

  const isImageFile = (filename) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
    return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  };

  const mediaUrl = `${config.API_BASE_URL}/storage/${mediaFile.cctv_footage}`;
  const isVideo = isVideoFile(mediaFile.cctv_footage);
  const isImage = isImageFile(mediaFile.cctv_footage);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      fullScreen={true}
      PaperProps={{
        sx: {
          bgcolor: 'rgba(0, 0, 0, 0.95)',
          color: 'white',
          margin: 0,
          borderRadius: 0,
          '& .MuiDialogContent-root': {
            p: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            width: '100vw',
          }
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          p: 1.5,
          minHeight: '60px'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isVideo ? (
            <PlayArrowIcon color="primary" />
          ) : isImage ? (
            <ImageIcon color="primary" />
          ) : null}
          <Typography variant="h6" sx={{ color: 'white' }}>
            {mediaFile.file_name || 'CCTV Footage'}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'white',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            p: 0.5
          }}
        >
          {isVideo ? (
            <video
              controls
              autoPlay
              style={{
                width: '100%',
                height: 'calc(100vh - 80px)',
                maxWidth: '100%',
                maxHeight: 'calc(100vh - 80px)',
                borderRadius: '4px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                objectFit: 'contain'
              }}
            >
              <source src={mediaUrl} type={mediaFile.file_type || 'video/mp4'} />
              Your browser does not support the video tag.
            </video>
          ) : isImage ? (
            <img
              src={mediaUrl}
              alt={mediaFile.file_name || 'CCTV Image'}
              style={{
                width: '100%',
                height: 'calc(100vh - 80px)',
                maxWidth: '100%',
                maxHeight: 'calc(100vh - 80px)',
                borderRadius: '4px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                objectFit: 'contain'
              }}
            />
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
                textAlign: 'center'
              }}
            >
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                Unsupported File Type
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                This file type cannot be previewed in the modal.
              </Typography>
            </Box>
          )}

          {mediaFile.description && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 1, maxWidth: '100%' }}>
              <Typography variant="body2" sx={{ color: 'white', textAlign: 'center' }}>
                {mediaFile.description}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default MediaViewerModal; 
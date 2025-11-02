import * as React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';

function DeleteConfirmationModal({ 
  open, 
  onClose, 
  onConfirm, 
  title = 'Confirm Delete',
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  itemName = 'item',
  postTitle,
  actionLabel
}) {
  // If actionLabel is provided, use it for archive/unarchive actions
  const finalConfirmText = actionLabel || confirmText;
  const finalTitle = actionLabel ? `Confirm ${actionLabel}` : title;
  const isArchiveAction = actionLabel && actionLabel.toLowerCase().includes('archive');
  const finalMessage = message || (actionLabel 
    ? `Are you sure you want to ${actionLabel.toLowerCase()} this post?`
    : `Are you sure you want to delete ${postTitle || itemName}?`);
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        color: actionLabel 
          ? (actionLabel.toLowerCase().includes('unarchive') ? 'success.main' : 'warning.main')
          : 'error.main',
        pb: 1
      }}>
        <WarningIcon color={
          actionLabel 
            ? (actionLabel.toLowerCase().includes('unarchive') ? "success" : "warning")
            : "error"
        } />
        {finalTitle}
      </DialogTitle>
      
      <DialogContent sx={{ pt: 1 }}>
        <Typography variant="body1" color="text.primary">
          {finalMessage}
        </Typography>
        {!actionLabel && (
          <Box sx={{ 
            mt: 2, 
            p: 2, 
            backgroundColor: 'error.light', 
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'error.main'
          }}>
            <Typography variant="body2" color="error.dark">
              <strong>Warning:</strong> This action cannot be undone. The {itemName} will be permanently deleted.
            </Typography>
          </Box>
        )}
        {actionLabel && isArchiveAction && (
          <Box sx={{ 
            mt: 2, 
            p: 2, 
            backgroundColor: actionLabel.toLowerCase().includes('unarchive') ? 'success.light' : 'warning.light', 
            borderRadius: 1,
            border: '1px solid',
            borderColor: actionLabel.toLowerCase().includes('unarchive') ? 'success.main' : 'warning.main'
          }}>
            <Typography variant="body2" color={actionLabel.toLowerCase().includes('unarchive') ? 'success.dark' : 'warning.dark'}>
              <strong>Note:</strong> {actionLabel.toLowerCase().includes('unarchive') 
                ? 'The post will be restored and made visible to users again.'
                : 'The post will be archived and can be restored later.'}
            </Typography>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          color="inherit"
        >
          {cancelText}
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color={
            actionLabel 
              ? (actionLabel.toLowerCase().includes('unarchive') ? "success" : "warning")
              : "error"
          }
          startIcon={<DeleteIcon />}
          sx={{ 
            minWidth: 100,
            '&:hover': {
              backgroundColor: actionLabel 
                ? (actionLabel.toLowerCase().includes('unarchive') ? 'success.dark' : 'warning.dark')
                : 'error.dark'
            }
          }}
        >
          {finalConfirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteConfirmationModal; 
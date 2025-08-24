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
  message = 'Are you sure you want to delete this item?',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  itemName = 'item'
}) {
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
        color: 'error.main',
        pb: 1
      }}>
        <WarningIcon color="error" />
        {title}
      </DialogTitle>
      
      <DialogContent sx={{ pt: 1 }}>
        <Typography variant="body1" color="text.primary">
          {message}
        </Typography>
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
          color="error"
          startIcon={<DeleteIcon />}
          sx={{ 
            minWidth: 100,
            '&:hover': {
              backgroundColor: 'error.dark'
            }
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteConfirmationModal; 
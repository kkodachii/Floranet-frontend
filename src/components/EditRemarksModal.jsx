import * as React from 'react';
import { Modal, Box, Typography, TextField, Button, IconButton, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 500 },
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

function EditRemarksModal({ open, handleClose, complaint, onSave, loading = false }) {
  const theme = useTheme();
  const [remarks, setRemarks] = React.useState('');
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (complaint) {
      setRemarks(complaint.remarks || '');
      setError('');
    }
  }, [complaint]);

  const handleSave = async () => {
    if (!complaint) return;
    
    try {
      setError('');
      await onSave(complaint.id, remarks);
      handleClose();
    } catch (err) {
      setError(err.message || 'Failed to update remarks');
    }
  };

  const handleCancel = () => {
    setRemarks(complaint?.remarks || '');
    setError('');
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      aria-labelledby="edit-remarks-modal-title"
      aria-describedby="edit-remarks-modal-description"
    >
      <Box sx={style}>
        <IconButton
          aria-label="close"
          onClick={handleCancel}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        
        <Typography id="edit-remarks-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
          Edit Remarks
        </Typography>
        
        {complaint && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Complaint: {complaint.complained_title}
          </Typography>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <TextField
          id="edit-remarks-modal-description"
          multiline
          rows={4}
          placeholder="Enter remarks..."
          variant="outlined"
          fullWidth
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button 
            variant="outlined" 
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default EditRemarksModal; 
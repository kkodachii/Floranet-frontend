import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Chip,
  Stack,
  Alert
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SendIcon from '@mui/icons-material/Send';

const ComplaintAccordion = ({ complaint, onUpdateRemarks, onUpdateFollowups, loading }) => {
  const [newFollowup, setNewFollowup] = useState('');

  const handleAddFollowup = async () => {
    if (!newFollowup.trim()) return;
    
    try {
      await onUpdateFollowups(complaint.id, newFollowup);
      setNewFollowup(''); // Clear input after successful addition
    } catch (error) {
      console.error('Error adding followup:', error);
    }
  };

  const parseFollowups = (followups) => {
    if (!followups) return [];
    
    const followupList = followups.split('\n\n');
    return followupList.map((followup, index) => {
      const userMatch = followup.match(/^\[(.*?)\]\s*(.*)/);
      if (userMatch) {
        return {
          index,
          user: userMatch[1],
          text: userMatch[2],
          fullText: followup
        };
      }
      // If no user info found, try to extract just the text
      return {
        index,
        user: 'Unknown',
        text: followup,
        fullText: followup
      };
    });
  };

  const followups = parseFollowups(complaint.followups);

  return (
    <Accordion sx={{ 
      boxShadow: 'none',
      '&:before': {
        display: 'none',
      },
    }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Description & Followups
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {/* Description Section */}
        <Box sx={{ 
          p: 2, 
          mb: 2, 
          borderRadius: 1, 
          backgroundColor: 'background.paper',
          boxShadow: 1,
          border: '1px solid',
          borderColor: 'divider'
        }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
            Description:
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
            {complaint.description || 'No description provided'}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Followups Section - Chat-like Interface */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
            Followups:
          </Typography>
          
          {/* Followups Display */}
          <Box sx={{ 
            maxHeight: '300px', 
            overflowY: 'auto', 
            mb: 3,
            p: 2,
            backgroundColor: 'grey.50',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider'
          }}>
            {followups.length > 0 ? (
              followups.map((followup, index) => (
                <Box key={index} sx={{ 
                  mb: 2, 
                  p: 2, 
                  backgroundColor: 'white',
                  borderRadius: 1,
                  boxShadow: 1,
                  border: '1px solid',
                  borderColor: 'grey.200'
                }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Chip 
                      label={followup.user} 
                      size="small"
                      sx={{ 
                        backgroundColor: followup.user === 'Administrator' ? 'primary.light' : 'secondary.light',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.75rem'
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {new Date().toLocaleString()}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                    {followup.text}
                  </Typography>
                </Box>
              ))
            ) : (
              <Alert severity="info" sx={{ textAlign: 'center' }}>
                No followups yet. Start the conversation by adding a followup note below.
              </Alert>
            )}
          </Box>

          {/* Add Followup Section - Chat Input */}
          <Box sx={{ 
            p: 3, 
            backgroundColor: 'background.paper',
            borderRadius: 2,
            border: '2px solid',
            borderColor: 'primary.light',
            boxShadow: 2,
            position: 'relative'
          }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 'bold', 
              mb: 2, 
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Box component="span" sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                backgroundColor: 'primary.main' 
              }} />
              Reply to the complaint
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              alignItems: 'flex-end',
              backgroundColor: 'grey.50',
              p: 2,
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'grey.200'
            }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                size="medium"
                placeholder="Type your followup message here..."
                value={newFollowup}
                onChange={(e) => setNewFollowup(e.target.value)}
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    borderRadius: 2,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                      borderWidth: '2px'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                      borderWidth: '2px'
                    },
                    '& .MuiInputBase-input': {
                      fontSize: '0.95rem',
                      lineHeight: 1.5
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: 'text.secondary'
                  }
                }}
                InputProps={{
                  style: { 
                    padding: '12px 16px',
                    minHeight: '80px'
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={handleAddFollowup}
                disabled={!newFollowup.trim() || loading}
                startIcon={<SendIcon />}
                sx={{
                  minWidth: '120px',
                  px: 3,
                  py: 1.5,
                  height: '48px',
                  backgroundColor: 'primary.main',
                  borderRadius: 2,
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                    transform: 'translateY(-1px)',
                    transition: 'all 0.2s ease-in-out'
                  },
                  '&:disabled': {
                    backgroundColor: 'grey.400',
                    boxShadow: 'none',
                    transform: 'none'
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }
                }}
              >
                {loading ? 'Sending...' : 'Send'}
              </Button>
            </Box>
            
            {newFollowup.trim() && (
              <Typography variant="caption" sx={{ 
                mt: 1, 
                display: 'block',
                color: 'text.secondary',
                fontStyle: 'italic'
              }}>
                Character count: {newFollowup.length}
              </Typography>
            )}
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default ComplaintAccordion; 
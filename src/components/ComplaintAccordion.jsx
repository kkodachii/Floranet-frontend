import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Stack,
  Alert,
  useTheme,
  CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';

const ComplaintAccordion = ({ complaint, onUpdateRemarks, onUpdateFollowups, loading }) => {
  const [newFollowup, setNewFollowup] = useState('');
  const [addingFollowup, setAddingFollowup] = useState(false);
  
  const theme = useTheme();

  const handleAddFollowup = async () => {
    if (!newFollowup.trim()) return;
    
    try {
      setAddingFollowup(true);
      await onUpdateFollowups(complaint.id, newFollowup);
      setNewFollowup(''); // Clear input after successful addition
    } catch (error) {
      console.error('Error adding followup:', error);
    } finally {
      setAddingFollowup(false);
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
    <Box sx={{ width: '100%' }}>
      {/* Description Accordion - FIRST */}
      <Accordion defaultExpanded sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Description
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            {/* Complaint Details Summary */}

            {/* Description Content */}
            <Box sx={{ 
              p: 2, 
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
              backgroundColor: theme.palette.background.default
            }}>
              <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                {complaint.description || 'No description provided'}
              </Typography>
            </Box>
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Followups Accordion - SECOND */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Followups ({followups.length})
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            {/* Existing followups */}
            {followups.length > 0 ? (
              <Stack spacing={1}>
                {followups.map((followup, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                      backgroundColor: theme.palette.background.default,
                      position: 'relative'
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Chip 
                        label={followup.user} 
                        size="small"
                        color={followup.user === 'Administrator' ? 'primary' : 'secondary'}
                        variant="outlined"
                      />
                      <Typography variant="body2" color="text.secondary">
                        {new Date().toLocaleString()}
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ lineHeight: 1.5 }}>
                      {followup.text}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center' }}>
                No followups yet. Add the first one below.
              </Typography>
            )}

            {/* Add new followup - moved to bottom */}
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Add a new followup..."
                value={newFollowup}
                onChange={(e) => setNewFollowup(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddFollowup()}
                disabled={loading || addingFollowup}
              />
              <Button
                variant="contained"
                startIcon={addingFollowup ? <CircularProgress size={16} /> : <AddIcon />}
                onClick={handleAddFollowup}
                disabled={!newFollowup.trim() || loading || addingFollowup}
                sx={{ minWidth: 'auto', px: 2 }}
              >
                {addingFollowup ? 'Adding...' : 'Add'}
              </Button>
            </Box>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ComplaintAccordion; 
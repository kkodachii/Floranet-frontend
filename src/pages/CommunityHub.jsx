import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function CommunityHub() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Community Hub
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Community hub content will be displayed here.
        </Typography>
      </Paper>
    </Box>
  );
}

export default CommunityHub; 
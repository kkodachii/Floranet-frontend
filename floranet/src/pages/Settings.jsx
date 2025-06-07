import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function Settings() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Settings content will be displayed here.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Settings; 
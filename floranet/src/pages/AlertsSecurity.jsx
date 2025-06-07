import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function AlertsSecurity() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Alerts and Security
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Alerts and security content will be displayed here.
        </Typography>
      </Paper>
    </Box>
  );
}

export default AlertsSecurity; 
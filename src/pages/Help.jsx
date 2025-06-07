import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function Help() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Help
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Help content will be displayed here.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Help; 
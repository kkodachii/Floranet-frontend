import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function Complaints() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Complaints
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Complaints content will be displayed here.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Complaints; 
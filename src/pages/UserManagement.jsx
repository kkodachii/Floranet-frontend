import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function UserManagement() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          User management content will be displayed here.
        </Typography>
      </Paper>
    </Box>
  );
}

export default UserManagement; 
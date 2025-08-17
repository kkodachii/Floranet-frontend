import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import CORSTest from '../components/CORSTest';

const CORSTestPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          CORS Test Page
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          This page allows you to test the CORS configuration between the frontend and backend.
          Use this to verify that cross-origin requests are working properly.
        </Typography>
      </Box>
      
      <Paper sx={{ p: 3 }} elevation={2}>
        <CORSTest />
      </Paper>
    </Container>
  );
};

export default CORSTestPage; 
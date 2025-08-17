import React, { useState } from 'react';
import { Box, Button, Typography, Alert } from '@mui/material';
import config from '../config/env';

const CORSTest = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testCORS = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${config.API_BASE_URL}/api/cors-test`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setResult({
          success: true,
          data,
          status: response.status,
          headers: Object.fromEntries(response.headers.entries())
        });
      } else {
        setResult({
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status
        });
      }
    } catch (error) {
      setResult({
        success: false,
        error: error.message,
        type: error.name
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        CORS Test
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={testCORS} 
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {loading ? 'Testing...' : 'Test CORS'}
      </Button>

      {result && (
        <Box sx={{ mt: 2 }}>
          {result.success ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              CORS is working! Status: {result.status}
            </Alert>
          ) : (
            <Alert severity="error" sx={{ mb: 2 }}>
              CORS failed: {result.error}
            </Alert>
          )}
          
          <Typography variant="body2" component="pre" sx={{ 
            backgroundColor: 'grey.100', 
            p: 1, 
            borderRadius: 1,
            overflow: 'auto',
            fontSize: '0.75rem'
          }}>
            {JSON.stringify(result, null, 2)}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CORSTest; 
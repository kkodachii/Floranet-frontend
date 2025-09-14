import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  CircularProgress,
  useTheme,
  Stack
} from '@mui/material';
import { PictureAsPdf as PdfIcon } from '@mui/icons-material';
import apiService from '../../../services/api';

export default function CCTVRequest() {
  const theme = useTheme();
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [dateRange, setDateRange] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [streetFilter, setStreetFilter] = useState('all');

  const handleGeneratePDF = async () => {
    try {
      setGenerating(true);
      setError(null);
      
      const response = await apiService.generateCCTVRequestPDF({
        dateRange,
        status: statusFilter !== 'all' ? statusFilter : null,
        street: streetFilter !== 'all' ? streetFilter : null
      });
      
      if (response.success) {
        // Create download link
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `cctv-requests-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        setError('Failed to generate PDF');
      }
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError(err.message || 'Failed to generate PDF');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 0.5, sm: 1 } }}>
      <Box maxWidth="xl" mx="auto">
        <Paper elevation={3} sx={{ borderRadius: 1, overflow: 'hidden', p: { xs: 2, sm: 3 }, boxShadow: 3 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}
          >
            Generate CCTV Request Report
          </Typography>
          <Typography
            variant="body2"
            sx={{ mb: 3, color: 'text.secondary' }}
          >
            List of CCTV requests
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center" sx={{ mb: 3 }}>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Date Range</InputLabel>
              <Select
                value={dateRange}
                label="Date Range"
                onChange={(e) => setDateRange(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
                <MenuItem value="year">This Year</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Street</InputLabel>
              <Select
                value={streetFilter}
                label="Street"
                onChange={(e) => setStreetFilter(e.target.value)}
              >
                <MenuItem value="all">All Streets</MenuItem>
                <MenuItem value="street1">Street 1</MenuItem>
                <MenuItem value="street2">Street 2</MenuItem>
                <MenuItem value="street3">Street 3</MenuItem>
                <MenuItem value="street4">Street 4</MenuItem>
                <MenuItem value="street5">Street 5</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              startIcon={generating ? <CircularProgress size={16} /> : <PdfIcon />}
              onClick={handleGeneratePDF}
              disabled={generating}
              sx={{ minWidth: 150, height: 56 }}
            >
              {generating ? 'Generating...' : 'Generate Report'}
            </Button>
          </Stack>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
        </Paper>
      </Box>
    </Box>
  );
}

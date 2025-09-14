import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  useTheme,
  Stack
} from '@mui/material';
import { PictureAsPdf as PdfIcon } from '@mui/icons-material';
import apiService from '../../../services/api';

export default function AlertReports() {
  const theme = useTheme();
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [dateRange, setDateRange] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [streetFilter, setStreetFilter] = useState('all');
  const streets = ['Adelfa','Bougainvillea','Champaca','Dahlia','Gumamela','Ilang-ilang','Jasmin','Kalachuchi','Lilac','Rosal','Sampaguita','Santan','Waling-waling'];

  const handleGeneratePDF = async () => {
    try {
      setGenerating(true);
      setError(null);
      
      const response = await apiService.generateAlertReportsPDF({
        dateRange,
        status: statusFilter !== 'all' ? statusFilter : null,
        type: typeFilter !== 'all' ? typeFilter : null,
        street: streetFilter !== 'all' ? streetFilter : null
      });
      
      if (response.success) {
        // Create download link
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `alert-reports-${new Date().toISOString().split('T')[0]}.pdf`;
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
            Generate Alert Reports
          </Typography>
          <Typography
            variant="body2"
            sx={{ mb: 3, color: 'text.secondary' }}
          >
            List of emergency alerts and notifications
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
                <MenuItem value="ongoing">Ongoing</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
                <MenuItem value="called">Called</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Alert Type</InputLabel>
              <Select
                value={typeFilter}
                label="Alert Type"
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
                <MenuItem value="incident">Incident</MenuItem>
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
                {streets.map((street) => (
                  <MenuItem key={street} value={street}>
                    {street}
                  </MenuItem>
                ))}
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

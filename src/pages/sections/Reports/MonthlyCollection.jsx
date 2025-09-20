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

export default function MonthlyCollection() {
  const theme = useTheme();
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [selectedYear, setSelectedYear] = useState('all');
  const [yearOptions, setYearOptions] = useState([]);
  const [streetFilter, setStreetFilter] = useState('all');
  const streets = ['Adelfa','Bougainvillea','Champaca','Dahlia','Gumamela','Ilang-ilang','Jasmin','Kalachuchi','Lilac','Rosal','Sampaguita','Santan','Waling-waling'];

  // Load year options
  const loadYearOptions = async () => {
    try {
      const response = await apiService.getCollectionReportYears();
      if (response.success && response.data && response.data.length > 0) {
        const years = response.data.map((y) => Number(y)).sort((a, b) => b - a);
        setYearOptions(years);
        // Keep "all" as default, don't change to first year
      } else {
        // If no years available, keep "all" selected
        setYearOptions([]);
      }
    } catch (err) {
      console.error('Error loading year options:', err);
      // On error, keep "all" selected
      setYearOptions([]);
    }
  };

  useEffect(() => {
    loadYearOptions();
  }, []);

  const handleGeneratePDF = async () => {
    try {
      setGenerating(true);
      setError(null);
      
      const response = await apiService.generateMonthlyCollectionPDF(selectedYear !== 'all' ? selectedYear : null, streetFilter !== 'all' ? streetFilter : null);
      
      if (response.success) {
        // Create download link
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `monthly-collection-${selectedYear === 'all' ? 'all-years' : selectedYear}-${new Date().toISOString().split('T')[0]}.pdf`;
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
            Generate Monthly Collection Report
          </Typography>
          <Typography
            variant="body2"
            sx={{ mb: 3, color: 'text.secondary' }}
          >
            List of monthly collection data
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center" sx={{ mb: 3 }}>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Select Year</InputLabel>
              <Select
                value={selectedYear}
                label="Select Year"
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <MenuItem value="all">
                  <em>All Years</em>
                </MenuItem>
                {yearOptions.map((year) => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
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

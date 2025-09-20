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
  Stack,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { PictureAsPdf as PdfIcon, Clear as ClearIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import apiService from '../../../services/api';

export default function OtherPaymentReport() {
  const theme = useTheme();
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [paymentCategory, setPaymentCategory] = useState('all');
  const [yearOptions, setYearOptions] = useState([]);

  // Payment categories
  const paymentCategories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Parking', label: 'Parking' },
    { value: 'Basketball Rental', label: 'Basketball Rental' },
    { value: 'Swimming Pool Rental', label: 'Swimming Pool Rental' },
    { value: 'Clubhouse', label: 'Clubhouse' },
    { value: 'Gazebo', label: 'Gazebo' },
    { value: 'Other', label: 'Other' },
  ];

  // Months array for dropdown
  const months = [
    { value: 'all', label: 'All Months' },
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  // Years array for dropdown
  const years = [
    { value: 'all', label: 'All Years' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' },
    { value: '2020', label: '2020' },
  ];

  // Load year options
  const loadYearOptions = async () => {
    try {
      // Get current year and previous 5 years
      const currentYear = new Date().getFullYear();
      const yearList = [];
      for (let i = 0; i < 6; i++) {
        yearList.push(currentYear - i);
      }
      setYearOptions(yearList);
    } catch (err) {
      console.error('Error loading year options:', err);
    }
  };

  useEffect(() => {
    loadYearOptions();
  }, []);

  const handleGeneratePDF = async () => {
    try {
      setGenerating(true);
      setError(null);
      
      // Prepare report parameters - send empty strings for "All" selections
      const reportParams = {
        year: selectedYear !== 'all' ? selectedYear : '',
        month: selectedMonth !== 'all' ? selectedMonth : '',
        paymentCategory: paymentCategory !== 'all' ? paymentCategory : 'all'
      };
      
      if (startDate) {
        reportParams.startDate = startDate.toISOString().split('T')[0];
      }
      
      if (endDate) {
        reportParams.endDate = endDate.toISOString().split('T')[0];
      }

      // Call the backend API to generate PDF
      const response = await apiService.generateOtherPaymentReportPDF(reportParams);
      
      if (response.success) {
        // Create download link for PDF
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `other-payment-report-${new Date().toISOString().split('T')[0]}.pdf`;
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


  const clearFilters = () => {
    setSelectedYear('all');
    setSelectedMonth('all');
    setStartDate(null);
    setEndDate(null);
    setPaymentCategory('all');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: { xs: 0.5, sm: 1 } }}>
        <Box maxWidth="xl" mx="auto">
          <Paper elevation={3} sx={{ borderRadius: 1, overflow: 'hidden', p: { xs: 2, sm: 3 }, boxShadow: 3 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}
            >
              Generate Other Payment Report
            </Typography>
            <Typography
              variant="body2"
              sx={{ mb: 3, color: 'text.secondary' }}
            >
              Generate detailed reports for other payments with various filtering options
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ mb: 3 }}>
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
                    <MenuItem key={year} value={year.toString()}>{year}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Select Month</InputLabel>
                <Select
                  value={selectedMonth}
                  label="Select Month"
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  {months.map((month) => (
                    <MenuItem key={month.value} value={month.value}>
                      {month.value === 'all' ? <em>{month.label}</em> : month.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Payment Category</InputLabel>
                <Select
                  value={paymentCategory}
                  label="Payment Category"
                  onChange={(e) => setPaymentCategory(e.target.value)}
                >
                  {paymentCategories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <DatePicker
                label="Start Date (Optional)"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{
                  textField: {
                    size: "small",
                    InputProps: {
                      endAdornment: startDate && (
                        <InputAdornment position="end">
                          <IconButton 
                            size="small" 
                            onClick={() => setStartDate(null)}
                          >
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                    sx: { minWidth: 200 }
                  }
                }}
              />

              <DatePicker
                label="End Date (Optional)"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                slotProps={{
                  textField: {
                    size: "small",
                    InputProps: {
                      endAdornment: endDate && (
                        <InputAdornment position="end">
                          <IconButton 
                            size="small" 
                            onClick={() => setEndDate(null)}
                          >
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                    sx: { minWidth: 200 }
                  }
                }}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
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
              <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            )}


          </Paper>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}

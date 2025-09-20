import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  useMediaQuery,
  useTheme,
  Alert,
  Snackbar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from 'react-router-dom';
import FloraTable from '../../../components/FloraTable';
import apiService from '../../../services/api';

const steps = [
  'Collection Details',
  'Amount & Period',
  'Reason & Submit'
];

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

// Generate years (current year + next 5 years)
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 6 }, (_, i) => currentYear + i);

// Default streets to always include
const defaultStreets = [
  'Adelfa',
  'Bougainvillea',
  'Camia',
  'Champaca',
  'Dahlia',
  'Gumamela',
  'Ilang-ilang',
  'Jasmin',
  'Kalachuchi',
  'Lilac',
  'Rosal',
  'Sampaguita',
  'Santan',
  'Waling-waling'
];

function AddCollection() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    streets: [],
    needToCollect: '',
    month: '',
    year: currentYear.toString(),
    reason: ''
  });
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  const [streets, setStreets] = useState([]);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const fetchStreets = async () => {
    try {
      const response = await apiService.getCollectionStreets();
      const apiStreets = response && response.success ? (response.data || []) : [];
      // Merge API streets with defaults, preserving default order first
      const merged = [...defaultStreets, ...apiStreets.filter(s => !defaultStreets.includes(s))];
      setStreets(merged);
    } catch (error) {
      console.error('Error fetching streets:', error);
      // Fallback to defaults if API fails
      setStreets(defaultStreets);
    }
  };

  useEffect(() => {
    fetchStreets();
  }, []);

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleStreetChange = (event) => {
    const value = event.target.value;
    if (value.includes('all')) {
      // If "Select All" is selected, select all streets
      setFormData(prev => ({ ...prev, streets: streets }));
    } else {
      setFormData(prev => ({ ...prev, streets: value }));
    }
    if (errors.streets) {
      setErrors(prev => ({ ...prev, streets: '' }));
    }
  };

  const validateStep = () => {
    const newErrors = {};

    switch (activeStep) {
      case 0: // Collection Details
        if (!formData.streets || formData.streets.length === 0) {
          newErrors.streets = 'At least one street is required';
        }
        break;

      case 1: // Amount & Period
        if (!formData.needToCollect || parseFloat(formData.needToCollect) <= 0) {
          newErrors.needToCollect = 'Please enter a valid amount greater than 0';
        }
        if (!formData.month) {
          newErrors.month = 'Month is required';
        }
        if (!formData.year) {
          newErrors.year = 'Year is required';
        }
        break;

      case 2: // Reason & Submit
        if (!formData.reason.trim()) {
          newErrors.reason = 'Reason for collection is required';
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const collectionData = {
        streets: formData.streets,
        amount_per_resident: parseFloat(formData.needToCollect),
        month: formData.month,
        year: parseInt(formData.year),
        reason: formData.reason.trim()
      };

      const response = await apiService.createCollection(collectionData);
      
      if (response.success) {
        setSnackbar({
          open: true,
          message: 'Collection added successfully!',
          severity: 'success'
        });
        
        setTimeout(() => {
          navigate('/billing-payment/collection');
        }, 1200);
      } else {
        setSnackbar({
          open: true,
          message: response.message || 'Failed to add collection. Please try again.',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error creating collection:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to add collection. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.streets} required sx={{ minWidth: 350, maxWidth: 500 }}>
                <InputLabel>Streets</InputLabel>
                <Select
                  multiple
                  value={formData.streets}
                  label="Streets"
                  onChange={handleStreetChange}
                  renderValue={(selected) => {
                    if (selected.length === 0) {
                      return <em style={{ color: '#888' }}>Select Streets</em>;
                    }
                    if (selected.length === streets.length) {
                      return 'All Streets Selected';
                    }
                    return `${selected.length} street(s) selected`;
                  }}
                  sx={{
                    '& .MuiChip-root': {
                      backgroundColor: 'primary.main !important',
                      color: 'white !important',
                      fontWeight: 'bold',
                      '& .MuiChip-deleteIcon': {
                        color: 'white !important',
                        '&:hover': {
                          color: 'primary.light !important',
                        },
                      },
                    },
                    '& .MuiChip-filled': {
                      backgroundColor: 'primary.main !important',
                      color: 'white !important',
                    },
                    '& .MuiChip-deletable': {
                      backgroundColor: 'primary.main !important',
                      color: 'white !important',
                    },
                  }}
                >
                  <MenuItem value="all">
                    <em>Select All Streets</em>
                  </MenuItem>
                  {streets.map((street) => (
                    <MenuItem key={street} value={street}>
                      {street}
                    </MenuItem>
                  ))}
                </Select>
                {errors.streets && <FormHelperText>{errors.streets}</FormHelperText>}
              </FormControl>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount to Collect (per resident)"
                type="number"
                value={formData.needToCollect}
                onChange={(e) => handleInputChange('needToCollect', e.target.value)}
                error={!!errors.needToCollect}
                helperText={errors.needToCollect || 'Enter amount per resident'}
                required
                placeholder="25.00"
                inputProps={{ 
                  min: "0.01", 
                  step: "0.01",
                  maxLength: 10 
                }}
                InputProps={{
                  startAdornment: <span style={{ marginRight: 8 }}>₱</span>,
                }}
                sx={{ minWidth: 200, maxWidth: 300 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.month} required sx={{ minWidth: 200, maxWidth: 300 }}>
                <InputLabel>Month</InputLabel>
                <Select
                  value={formData.month}
                  label="Month"
                  onChange={(e) => handleInputChange('month', e.target.value)}
                  renderValue={selected => selected ? selected : <em style={{ color: '#888' }}>Select Month</em>}
                >
                  <MenuItem value="" disabled>
                    <em>Select Month</em>
                  </MenuItem>
                  {months.map((month) => (
                    <MenuItem key={month} value={month}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
                {errors.month && <FormHelperText>{errors.month}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.year} required sx={{ minWidth: 200, maxWidth: 300 }}>
                <InputLabel>Year</InputLabel>
                <Select
                  value={formData.year}
                  label="Year"
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  renderValue={selected => selected ? selected : <em style={{ color: '#888' }}>Select Year</em>}
                >
                  <MenuItem value="" disabled>
                    <em>Select Year</em>
                  </MenuItem>
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
                {errors.year && <FormHelperText>{errors.year}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reason for Collection"
                value={formData.reason}
                onChange={(e) => handleInputChange('reason', e.target.value)}
                error={!!errors.reason}
                helperText={errors.reason || 'Enter the reason for this collection (e.g., Monthly maintenance, Security fee, etc.)'}
                required
                placeholder="Monthly maintenance fee for street lighting and security"
                multiline
                rows={3}
                inputProps={{ maxLength: 200 }}
                sx={{ minWidth: 350, maxWidth: 600 }}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Collection Information
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <FloraTable
                columns={[
                  { id: 'street', label: 'Street' },
                  { id: 'needToCollect', label: 'Amount to Collect' },
                  { id: 'period', label: 'Period' },
                  { id: 'reason', label: 'Reason for Collection' },
                ]}
                rows={formData.streets.map(street => ({
                  street: street,
                  needToCollect: `₱${formData.needToCollect}`,
                  period: `${formData.month} ${formData.year}`,
                  reason: formData.reason,
                }))}
                actions={[]}
                page={1}
                rowsPerPage={formData.streets.length}
                zebra={false}
                maxHeight={'none'}
                emptyMessage="No data to review."
                loading={false}
              />
            </Paper>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2 }, width: '100%', minHeight: '100vh' }}>
      <Box maxWidth="lg" mx="auto" sx={{ width: '100%' }}>
        <Paper elevation={3} sx={{ borderRadius: 1, overflow: 'visible', p: { xs: 1, sm: 2 }, boxShadow: 3, width: '100%', minHeight: 'fit-content', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Add New Collection
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Set up a new collection for residents
            </Typography>
          </Box>

          <Stepper 
            activeStep={activeStep} 
            sx={{ 
              mb: 4,
              '& .MuiStepLabel-root .Mui-completed': {
                color: 'success.main',
              },
              '& .MuiStepLabel-root .Mui-active': {
                color: 'primary.main',
              },
            }}
            orientation={isMobile ? 'vertical' : 'horizontal'}
          >
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ mb: 3, flex: 1 }}>
            {renderStepContent(activeStep)}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              startIcon={<ArrowBackIcon />}
              sx={{ minWidth: 100, backgroundColor: activeStep === 0 ? '#e0e0e0' : undefined, color: activeStep === 0 ? '#888' : undefined, '&.Mui-disabled': { backgroundColor: '#e0e0e0', color: '#888' } }}
            >
              Back
            </Button>
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  endIcon={<CheckIcon />}
                  disabled={loading}
                  sx={{ minWidth: 120 }}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  endIcon={<ArrowForwardIcon />}
                  disabled={loading}
                  sx={{ minWidth: 100 }}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AddCollection; 
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
  Snackbar,
  Autocomplete
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from 'react-router-dom';
import FloraTable from '../../../components/FloraTable';

const steps = [
  'Resident Information',
  'Payment & Contact Details',
  'Review & Submit'
];

const paymentMethods = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'GCash',
  'PayMaya',
  'Other'
];

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Mock API fetch for existing residents
const fetchExistingResidents = () =>
  Promise.resolve([
    {
      residentId: 'MHH0001',
      residentName: 'Carlos Dela Cruz',
      homeownerName: 'Juan Dela Cruz',
      houseNumber: 'B3A - L23',
      street: 'Camia',
      contactNumber: '09171234567',
    },
    {
      residentId: 'MHH0002',
      residentName: 'Anna Santos',
      homeownerName: 'Maria Santos',
      houseNumber: 'B1B - L17',
      street: 'Bouganvilla',
      contactNumber: '09281234567',
    },
    {
      residentId: 'MHH0003',
      residentName: 'Emilio Rizal',
      homeownerName: 'Jose Rizal',
      houseNumber: 'B4C - L09',
      street: 'Dahlia',
      contactNumber: '+639171234568',
    },
    {
      residentId: 'MHH0004',
      residentName: 'Patricia Mendoza',
      homeownerName: 'Ana Mendoza',
      houseNumber: 'B2A - L12',
      street: 'Champaca',
      contactNumber: '09351234567',
    },
    {
      residentId: 'MHH0005',
      residentName: 'Michael Garcia',
      homeownerName: 'Lito Garcia',
      houseNumber: 'B5D - L02',
      street: 'Sampaguita',
      contactNumber: '+639291234567',
    },
  ]);

function PersonalPayment() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    houseNumber: '',
    homeownerName: '',
    paymentMethod: '',
    amount: '',
    contactNumber: '',
    email: '',
    paymentMonth: '',
    residentId: ''
  });
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);
  const [existingResidents, setExistingResidents] = useState([]);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  useEffect(() => {
    const loadExistingResidents = async () => {
      try {
        const residents = await fetchExistingResidents();
        setExistingResidents(residents);
        setLoading(false);
      } catch (error) {
        console.error('Error loading existing residents:', error);
        setLoading(false);
      }
    };
    
    loadExistingResidents();
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

  const handleResidentSelect = (residentId) => {
    const selectedResident = existingResidents.find(resident => resident.residentId === residentId);
    if (selectedResident) {
      setFormData(prev => ({
        ...prev,
        residentId: selectedResident.residentId,
        homeownerName: selectedResident.homeownerName,
        houseNumber: selectedResident.houseNumber,
        contactNumber: selectedResident.contactNumber,
        email: selectedResident.email || ''
      }));
    }
  };

  const validateStep = () => {
    const newErrors = {};

    switch (activeStep) {
      case 0: // Resident Information
        if (!formData.houseNumber.trim()) {
          newErrors.houseNumber = 'House number is required';
        }
        if (!formData.homeownerName.trim()) {
          newErrors.homeownerName = 'Homeowner name is required';
        }
        break;

      case 1: // Payment & Contact Details
        if (!formData.paymentMethod) {
          newErrors.paymentMethod = 'Payment method is required';
        }
        if (!formData.amount.trim()) {
          newErrors.amount = 'Amount is required';
        } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
          newErrors.amount = 'Please enter a valid amount';
        }
        if (!formData.paymentMonth) {
          newErrors.paymentMonth = 'Payment month is required';
        }
        if (formData.contactNumber && !/^(\+63|0)?9\d{9}$/.test(formData.contactNumber.replace(/\s/g, ''))) {
          newErrors.contactNumber = 'Please enter a valid Philippine mobile number';
        }
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSnackbar({
        open: true,
        message: 'Payment submitted successfully!',
        severity: 'success'
      });
      
      // Reset form and stay on the same page
      setTimeout(() => {
        setFormData({
          houseNumber: '',
          homeownerName: '',
          paymentMethod: '',
          amount: '',
          contactNumber: '',
          email: '',
          paymentMonth: '',
          residentId: ''
        });
        setActiveStep(0);
        setErrors({});
      }, 1500);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to submit payment. Please try again.',
        severity: 'error'
      });
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
              <Autocomplete
                options={existingResidents}
                getOptionLabel={(option) => `${option.residentId} - ${option.residentName} (${option.houseNumber})`}
                value={existingResidents.find(resident => resident.residentId === formData.residentId) || null}
                onChange={(event, newValue) => {
                  if (newValue) {
                    handleResidentSelect(newValue.residentId);
                  } else {
                    // Clear form data when no resident is selected
                    setFormData(prev => ({
                      ...prev,
                      residentId: '',
                      homeownerName: '',
                      houseNumber: '',
                      contactNumber: '',
                      email: ''
                    }));
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search and Select Resident (Optional)"
                    placeholder="Type to search residents..."
                    helperText="Search by resident ID, name, or house number to auto-fill the form"
                    error={!!errors.residentId}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box>
                      <Typography variant="body1" fontWeight="bold">
                        {option.residentId} - {option.residentName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {option.houseNumber} • {option.homeownerName}
                      </Typography>
                    </Box>
                  </Box>
                )}
                isOptionEqualToValue={(option, value) => option.residentId === value.residentId}
                sx={{ mb: 3 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="House Number"
                value={formData.houseNumber}
                onChange={(e) => handleInputChange('houseNumber', e.target.value)}
                error={!!errors.houseNumber}
                helperText={errors.houseNumber || 'Format: B#A - L## (e.g., B3A - L23)'}
                required
                placeholder="B3A - L23"
                inputProps={{ maxLength: 20 }}
                sx={{ minWidth: 300 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Homeowner Name"
                value={formData.homeownerName}
                onChange={(e) => handleInputChange('homeownerName', e.target.value)}
                error={!!errors.homeownerName}
                helperText={errors.homeownerName}
                required
                placeholder="Enter homeowner name"
                inputProps={{ maxLength: 50 }}
                sx={{ minWidth: 300 }}
                InputLabelProps={{
                  shrink: Boolean(formData.homeownerName) || formData.homeownerName === '',
                }}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Box>
            {/* Payment Details Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                Payment Details
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!errors.paymentMethod} required sx={{ minWidth: 300 }}>
                    <InputLabel shrink={Boolean(formData.paymentMethod) || formData.paymentMethod === ''}>Payment Method</InputLabel>
                    <Select
                      value={formData.paymentMethod}
                      label="Payment Method"
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      displayEmpty
                      renderValue={selected => selected ? selected : <em style={{ color: '#888' }}>Select payment method</em>}
                    >
                      <MenuItem value="" disabled>
                        <em>Select payment method</em>
                      </MenuItem>
                      {paymentMethods.map((method) => (
                        <MenuItem key={method} value={method}>
                          {method}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.paymentMethod && <FormHelperText>{errors.paymentMethod}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Amount"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    error={!!errors.amount}
                    helperText={errors.amount || 'Enter payment amount'}
                    required
                    placeholder="0.00"
                    type="number"
                    inputProps={{ 
                      min: 0,
                      step: 0.01,
                      maxLength: 10
                    }}
                    sx={{ minWidth: 300 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.paymentMonth} required sx={{ minWidth: 300 }}>
                    <InputLabel shrink={Boolean(formData.paymentMonth) || formData.paymentMonth === ''}>Payment Month</InputLabel>
                    <Select
                      value={formData.paymentMonth}
                      label="Payment Month"
                      onChange={(e) => handleInputChange('paymentMonth', e.target.value)}
                      displayEmpty
                      renderValue={selected => selected ? selected : <em style={{ color: '#888' }}>Select payment month</em>}
                    >
                      <MenuItem value="" disabled>
                        <em>Select payment month</em>
                      </MenuItem>
                      {months.map((month) => (
                        <MenuItem key={month} value={month}>
                          {month}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.paymentMonth && <FormHelperText>{errors.paymentMonth}</FormHelperText>}
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            {/* Contact Information Section */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                Contact Information (Optional)
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Contact Number"
                    value={formData.contactNumber}
                    onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                    error={!!errors.contactNumber}
                    helperText={errors.contactNumber || 'Optional: Philippine mobile number'}
                    placeholder="09171234567"
                    inputProps={{ maxLength: 15 }}
                    sx={{ minWidth: 300 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email || 'Optional: Valid email address'}
                    placeholder="user@email.com"
                    inputProps={{ maxLength: 50 }}
                    sx={{ minWidth: 300 }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        );



              case 2:
          return (
            <Box>
              <Typography variant="h6" gutterBottom>
                Review Payment Information
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <FloraTable
                  columns={[
                    { id: 'houseNumber', label: 'House Number' },
                    { id: 'homeownerName', label: 'Homeowner Name' },
                    { id: 'paymentMethod', label: 'Payment Method' },
                    { id: 'amount', label: 'Amount' },
                    { id: 'paymentMonth', label: 'Payment Month' },
                    { id: 'contactNumber', label: 'Contact Number' },
                    { id: 'email', label: 'Email Address' },
                  ]}
                  rows={[
                    {
                      houseNumber: formData.houseNumber,
                      homeownerName: formData.homeownerName,
                      paymentMethod: formData.paymentMethod,
                      amount: `₱${parseFloat(formData.amount || 0).toFixed(2)}`,
                      paymentMonth: formData.paymentMonth,
                      contactNumber: formData.contactNumber || 'Not provided',
                      email: formData.email || 'Not provided',
                    },
                  ]}
                  actions={[]}
                  page={1}
                  rowsPerPage={1}
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

  if (loading) {
    return (
      <Box sx={{ p: { xs: 0.5, sm: 1 } }}>
        <Box maxWidth="md" mx="auto">
          <Paper elevation={3} sx={{ borderRadius: 1, overflow: 'hidden', p: { xs: 1, sm: 2 }, boxShadow: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
              <Typography>Loading...</Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 0.5, sm: 1 }, width: '100%', height: '100%' }}>
      <Box maxWidth="100%" mx="auto">
        <Paper elevation={3} sx={{ borderRadius: 1, overflow: 'hidden', p: { xs: 1, sm: 2 }, boxShadow: 3, width: '100%', maxHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Walk-in Payment
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Process walk-in payments for residents
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

          <Box sx={{ mb: 3 }}>
            {renderStepContent(activeStep)}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
                  sx={{ minWidth: 120 }}
                >
                  Submit Payment
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  endIcon={<ArrowForwardIcon />}
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

export default PersonalPayment; 
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
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from 'react-router-dom';
import FloraTable from '../../../components/FloraTable';
import apiService from '../../../services/api';

const steps = [
  'Resident Information',
  'Payment Details',
  'Review & Submit'
];

const paymentMethods = [
  'Cash',
  'Bank Transfer',
  'Credit Card',
  'Debit Card',
  'Check',
  'Online Payment',
];

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

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
  const [availableMonthlyDues, setAvailableMonthlyDues] = useState([]);
  const [selectedMonthlyDue, setSelectedMonthlyDue] = useState(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  useEffect(() => {
    const loadExistingResidents = async () => {
      try {
        setLoading(true);
        
        // Use a large page size to get all residents in one call
        // This is more efficient than paginating through multiple pages
        const response = await apiService.getResidents(1, '', { per_page: 1000 });
        const residents = response.data || [];
        
        setExistingResidents(residents);
        setLoading(false);
      } catch (error) {
        console.error('Error loading existing residents:', error);
        setLoading(false);
      }
    };
    
    loadExistingResidents();
  }, []);

  useEffect(() => {
    const loadAvailableMonthlyDues = async () => {
      if (formData.residentId) {
        try {
          const monthlyDues = await apiService.getAvailableMonthlyDuesForPayment(
            formData.residentId,
            new Date().getFullYear()
          );
          setAvailableMonthlyDues(monthlyDues.data || []);
        } catch (error) {
          console.error('Error loading available monthly dues:', error);
        }
      } else {
        setAvailableMonthlyDues([]);
      }
    };

    loadAvailableMonthlyDues();
  }, [formData.residentId]);

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
    const selectedResident = existingResidents.find(resident => resident.resident_id === residentId);
    if (selectedResident) {
      setFormData(prev => ({
        ...prev,
        residentId: selectedResident.resident_id,
        homeownerName: selectedResident.house_owner_name || selectedResident.name,
        houseNumber: selectedResident.house?.house_number || 'N/A',
        contactNumber: selectedResident.contact_no || '',
        email: selectedResident.email || ''
      }));
      // Clear month and amount when resident changes
      setFormData(prev => ({
        ...prev,
        paymentMonth: '',
        amount: ''
      }));
      setSelectedMonthlyDue(null);
    }
  };

  const handleMonthlyDueSelect = (monthlyDue) => {
    if (monthlyDue) {
      setSelectedMonthlyDue(monthlyDue);
      setFormData(prev => ({
        ...prev,
        amount: monthlyDue.amount.toString(),
        paymentMonth: months[monthlyDue.month - 1]
      }));
    }
  };

  const handlePaymentMonthChange = (monthName) => {
    // Find the monthly due for the selected month
    const selectedDue = availableMonthlyDues.find(due => 
      months[due.month - 1] === monthName
    );
    
    if (selectedDue) {
      setFormData(prev => ({
        ...prev,
        paymentMonth: monthName,
        amount: selectedDue.amount.toString()
      }));
      setSelectedMonthlyDue(selectedDue);
    } else {
      setFormData(prev => ({
        ...prev,
        paymentMonth: monthName,
        amount: ''
      }));
      setSelectedMonthlyDue(null);
    }
    
    // Clear error when user selects
    if (errors.paymentMonth) {
      setErrors(prev => ({ ...prev, paymentMonth: '' }));
    }
  };

  const validateStep = () => {
    const newErrors = {};

    switch (activeStep) {
      case 0: // Resident Information
        // No validation needed for read-only fields that are auto-filled
        break;

      case 1: // Payment & Contact Details
        if (!formData.paymentMethod) {
          newErrors.paymentMethod = 'Payment method is required';
        }
        if (!formData.paymentMonth) {
          newErrors.paymentMonth = 'Payment month is required';
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

      // Find the selected monthly due
      const selectedDue = availableMonthlyDues.find(due => 
        due.month === months.indexOf(formData.paymentMonth) + 1
      );

      if (!selectedDue) {
        throw new Error('Selected month not found in available monthly dues');
      }

      // Create payment data
      const paymentData = {
        resident_id: formData.residentId,
        method_of_payment: formData.paymentMethod,
        amount: parseFloat(formData.amount),
        paid_at: new Date().toISOString(),
        monthly_due_id: selectedDue.id,
      };

      // Submit payment to API
      await apiService.createPayment(paymentData);
      
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
        setSelectedMonthlyDue(null);
        setActiveStep(0);
        setErrors({});
      }, 1500);
    } catch (error) {
      console.error('Payment submission error:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to submit payment. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Get available months for dropdown (only months that have unpaid dues)
  const availableMonths = availableMonthlyDues.map(due => months[due.month - 1]);

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Autocomplete
                options={existingResidents}
                getOptionLabel={(option) => `${option.resident_id} - ${option.name} (${option.house?.house_number || 'N/A'})`}
                value={existingResidents.find(resident => resident.resident_id === formData.residentId) || null}
                onChange={(event, newValue) => {
                  if (newValue) {
                    handleResidentSelect(newValue.resident_id);
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
                    label="Search and Select Resident (Required)"
                    placeholder="Type to search residents..."
                    helperText="Search by resident ID, name, or house number to auto-fill the form"
                    error={!!errors.residentId}
                    required
              />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box>
                      <Typography variant="body1" fontWeight="bold">
                        {option.resident_id} - {option.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {option.house?.house_number || 'N/A'} • {option.house_owner_name || option.name}
                      </Typography>
                    </Box>
                  </Box>
                )}
                isOptionEqualToValue={(option, value) => option.resident_id === value.resident_id}
                sx={{ mb: 3 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="House Number"
                value={formData.houseNumber}
                disabled
                helperText="Auto-filled from resident selection"
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
                disabled
                helperText="Auto-filled from resident selection"
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
                    disabled
                    helperText="Auto-filled from selected monthly due"
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
                      onChange={(e) => handlePaymentMonthChange(e.target.value)}
                      displayEmpty
                      renderValue={selected => selected ? selected : <em style={{ color: '#888' }}>Select payment month</em>}
                    >
                      <MenuItem value="" disabled>
                        <em>Select payment month</em>
                      </MenuItem>
                      {availableMonths.map((month) => (
                        <MenuItem key={month} value={month}>
                          {month}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.paymentMonth && <FormHelperText>{errors.paymentMonth}</FormHelperText>}
                    {availableMonths.length === 0 && (
                      <FormHelperText>
                        No available months for payment. Please select a resident with unpaid dues.
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            {/* Contact Information Section */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                Resident Contact Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Contact Number"
                    value={formData.contactNumber}
                    disabled
                    helperText="Auto-filled from resident selection"
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
                    disabled
                    helperText="Auto-filled from resident selection"
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
              <CircularProgress color="primary" />
            </Box>
          </Paper>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 0.5, sm: 1 }, width: '100%', height: '100%' }}>
      <Box maxWidth="100%" mx="auto">
        <Paper elevation={3} sx={{ borderRadius: 1, p: { xs: 1, sm: 2 }, boxShadow: 3, width: '100%', display: 'flex', flexDirection: 'column' }}>
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
                  disabled={loading || availableMonths.length === 0}
                >
                  {loading ? <CircularProgress size={20} /> : 'Submit Payment'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  endIcon={<ArrowForwardIcon />}
                  sx={{ minWidth: 100 }}
                  disabled={!formData.residentId}
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
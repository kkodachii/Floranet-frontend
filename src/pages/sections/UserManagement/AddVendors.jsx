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
import apiService from '../../../services/api';

const steps = [
  'Select Resident',
  'Residence Details (Read-only)',
  'Business Information',
  'Review & Submit'
];

const streets = [
  'Camia',
  'Bouganvilla',
  'Dahlia',
  'Champaca',
  'Sampaguita',
  'Adelfa',
  'Gumamela',
  'Santan',
  'Jasmine',
  'Ilang-ilang',
  'Rosal',
  'Kalachuchi'
];

function AddVendors() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    residentName: '',
    residentId: '',
    houseNumber: '',
    street: '',
    businessName: '',
    contactNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  const [residents, setResidents] = useState([]);
  const [selectedResident, setSelectedResident] = useState(null);
  const [residentsLoading, setResidentsLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  // Fetch all residents for dropdown
  useEffect(() => {
    const fetchResidents = async () => {
      try {
        setResidentsLoading(true);
        const response = await apiService.getResidents(1, '', {});
        if (response.data) {
          setResidents(response.data);
        }
      } catch (error) {
        console.error('Error fetching residents:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load residents. Please try again.',
          severity: 'error'
        });
      } finally {
        setResidentsLoading(false);
      }
    };
    fetchResidents();
  }, []);

  // Handle resident selection
  const handleResidentSelect = (resident) => {
    if (resident) {
      setSelectedResident(resident);
      setFormData({
        residentName: resident.name || '',
        residentId: resident.resident_id || '',
        houseNumber: resident.house?.house_number || '',
        street: resident.house?.street || '',
        businessName: '',
        contactNumber: resident.contact_no || ''
      });
      // Clear errors when resident is selected
      setErrors({});
    }
  };

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
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = () => {
    const newErrors = {};
    switch (activeStep) {
      case 0: // Select Resident
        if (!selectedResident) {
          newErrors.resident = 'Please select a resident';
        }
        break;
      case 1: // Residence Details - no validation needed (read-only)
        break;
      case 2: // Business Information
        if (!formData.businessName.trim()) {
          newErrors.businessName = 'Business name is required';
        }
        if (formData.contactNumber && !/^(\+63|0)?9\d{9}$/.test(formData.contactNumber.replace(/\s/g, ''))) {
          newErrors.contactNumber = 'Please enter a valid Philippine mobile number';
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

      // Create the vendor using existing resident
      const vendorPayload = {
        resident_id: formData.residentId,
        business_name: formData.businessName,
        isArchived: false,
        isAccepted: true
      };

      await apiService.createVendor(vendorPayload);
      
      setSnackbar({
        open: true,
        message: 'Vendor added successfully!',
        severity: 'success'
      });
      
      setTimeout(() => {
        navigate('/user-management/vendors');
      }, 1500);
    } catch (error) {
      console.error('Error adding vendor:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to add vendor. Please try again.',
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
              <FormControl fullWidth error={!!errors.resident} required>
                <Autocomplete
                  options={residents}
                  getOptionLabel={(resident) => `${resident.name} - ${resident.house?.street || 'No street'}`}
                  value={selectedResident}
                  onChange={(event, newValue) => handleResidentSelect(newValue)}
                  loading={residentsLoading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Resident"
                      placeholder="Search for resident by name or street"
                      helperText={errors.resident || "Select an existing resident to add as vendor"}
                      required
                    />
                  )}
                  renderOption={(props, resident) => (
                    <li {...props}>
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {resident.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {resident.house?.street} - {resident.house?.house_number}
                        </Typography>
                      </Box>
                    </li>
                  )}
                  sx={{ minWidth: 400 }}
                />
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
                label="Resident Name"
                value={formData.residentName}
                InputProps={{ readOnly: true }}
                helperText="Resident name (auto-filled)"
                required
                sx={{
                  minWidth: 300,
                  '& .MuiInputBase-root': {
                    backgroundColor: 'action.hover',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Resident ID"
                value={formData.residentId}
                InputProps={{ readOnly: true }}
                helperText="Resident ID (auto-filled)"
                required
                sx={{
                  minWidth: 300,
                  '& .MuiInputBase-root': {
                    backgroundColor: 'action.hover',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="House Number"
                value={formData.houseNumber}
                InputProps={{ readOnly: true }}
                helperText="House number (auto-filled)"
                required
                sx={{
                  minWidth: 350,
                  maxWidth: 500,
                  '& .MuiInputBase-root': {
                    backgroundColor: 'action.hover',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Street"
                value={formData.street}
                InputProps={{ readOnly: true }}
                helperText="Street (auto-filled)"
                required
                sx={{
                  minWidth: 350,
                  maxWidth: 500,
                  '& .MuiInputBase-root': {
                    backgroundColor: 'action.hover',
                  },
                }}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Business Name"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                error={!!errors.businessName}
                helperText={errors.businessName}
                required
                inputProps={{ maxLength: 50 }}
                sx={{ minWidth: 350, maxWidth: 500 }}
              />
            </Grid>
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
                sx={{ minWidth: 350, maxWidth: 500 }}
              />
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Information
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <FloraTable
                columns={[
                  { id: 'residentName', label: 'Resident Name' },
                  { id: 'residentId', label: 'Resident ID' },
                  { id: 'houseNumber', label: 'House Number' },
                  { id: 'street', label: 'Street' },
                  { id: 'businessName', label: 'Business Name' },
                  { id: 'contactNumber', label: 'Contact Number' },
                ]}
                rows={[
                  {
                    residentName: formData.residentName,
                    residentId: formData.residentId,
                    houseNumber: formData.houseNumber,
                    street: formData.street,
                    businessName: formData.businessName,
                    contactNumber: formData.contactNumber || 'Not provided',
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

  return (
    <Box sx={{ p: { xs: 0.5, sm: 1 }, width: '100%', height: '100%' }}>
      <Box maxWidth="100%" mx="auto">
        <Paper elevation={3} sx={{ borderRadius: 1, overflow: 'hidden', p: { xs: 1, sm: 2 }, boxShadow: 3, width: '100%', minHeight: '60vh', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Add New Vendor
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Select an existing resident and add business information to register as vendor
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
                  disabled={activeStep === 0 && !selectedResident}
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

export default AddVendors; 
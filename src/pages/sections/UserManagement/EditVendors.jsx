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
import SaveIcon from '@mui/icons-material/Save';
import { useParams, useNavigate } from 'react-router-dom';
import FloraTable from '../../../components/FloraTable';

const steps = [
  'Basic Information',
  'Residence Details',
  'Business Information',
  'Review & Save'
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

function EditVendors() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    homeownerName: '',
    residentName: '',
    residentId: '',
    houseNumber: '',
    street: '',
    businessName: '',
    contactNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock API fetch for vendor data
  const fetchVendorData = (residentId) =>
    Promise.resolve({
      homeownerName: 'Juan Dela Cruz',
      residentName: 'Andrea Dela Cruz',
      residentId: residentId || 'MHH0001',
      houseNumber: 'B3A - L23',
      street: 'Camia',
      businessName: 'Cruz Sari-Sari Store',
      contactNumber: '09171234567',
    });

  useEffect(() => {
    const loadVendorData = async () => {
      try {
        const vendorData = await fetchVendorData(id);
        setFormData(vendorData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading vendor data:', error);
        setLoading(false);
      }
    };
    
    loadVendorData();
  }, [id]);

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

  const validateStep = () => {
    const newErrors = {};

    switch (activeStep) {
      case 0: // Basic Information
        if (!formData.homeownerName.trim()) {
          newErrors.homeownerName = 'Homeowner name is required';
        }
        if (!formData.residentName.trim()) {
          newErrors.residentName = 'Resident name is required';
        }
        break;

      case 1: // Residence Details
        if (!formData.houseNumber.trim()) {
          newErrors.houseNumber = 'House number is required';
        }
        if (!formData.street) {
          newErrors.street = 'Street is required';
        }
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

  const handleSave = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSnackbar({
        open: true,
        message: 'Vendor updated successfully!',
        severity: 'success'
      });
      
      // Navigate back to vendors page after a short delay
      setTimeout(() => {
        navigate('/user-management/vendors');
      }, 1500);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update vendor. Please try again.',
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Homeowner Name"
                value={formData.homeownerName}
                onChange={(e) => handleInputChange('homeownerName', e.target.value)}
                error={!!errors.homeownerName}
                helperText={errors.homeownerName}
                required
                inputProps={{ maxLength: 50 }}
                sx={{ minWidth: 300 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Resident Name"
                value={formData.residentName}
                onChange={(e) => handleInputChange('residentName', e.target.value)}
                error={!!errors.residentName}
                helperText={errors.residentName}
                required
                inputProps={{ maxLength: 50 }}
                sx={{ minWidth: 300 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Resident ID"
                value={formData.residentId}
                InputProps={{
                  readOnly: true,
                }}
                helperText="Resident ID cannot be changed"
                required
                sx={{
                  minWidth: 300,
                  '& .MuiInputBase-root': {
                    backgroundColor: 'action.hover',
                  },
                }}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
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
                sx={{ minWidth: 350, maxWidth: 500 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.street} required sx={{ minWidth: 350, maxWidth: 500 }}>
                <InputLabel shrink={Boolean(formData.street) || formData.street === ''}>Street</InputLabel>
                <Select
                  value={formData.street}
                  label="Street"
                  onChange={(e) => handleInputChange('street', e.target.value)}
                  displayEmpty
                  renderValue={selected => selected ? selected : <em style={{ color: '#888' }}>Select Street</em>}
                >
                  <MenuItem value="" disabled>
                    <em>Select Street</em>
                  </MenuItem>
                  {streets.map((street) => (
                    <MenuItem key={street} value={street}>
                      {street}
                    </MenuItem>
                  ))}
                </Select>
                {errors.street && <FormHelperText>{errors.street}</FormHelperText>}
              </FormControl>
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
                  { id: 'homeownerName', label: 'Homeowner Name' },
                  { id: 'residentName', label: 'Resident Name' },
                  { id: 'residentId', label: 'Resident ID' },
                  { id: 'houseNumber', label: 'House Number' },
                  { id: 'street', label: 'Street' },
                  { id: 'businessName', label: 'Business Name' },
                  { id: 'contactNumber', label: 'Contact Number' },
                ]}
                rows={[
                  {
                    homeownerName: formData.homeownerName,
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
              Edit Vendor
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Update vendor information step by step
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
                  onClick={handleSave}
                  endIcon={<SaveIcon />}
                  sx={{ minWidth: 120 }}
                >
                  Save Changes
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

export default EditVendors; 
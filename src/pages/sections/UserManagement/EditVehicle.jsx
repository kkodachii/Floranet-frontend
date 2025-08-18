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
import apiService from '../../../services/api';

const steps = [
  'Basic Information (Read-only)',
  'Residence Details (Read-only)',
  'Vehicle Information',
  'Review & Save'
];

const vehicleTypes = [
  'Car',
  'Motorcycle',
  'SUV',
  'Truck',
  'Bus',
  'Tricycle'
];


function EditVehicle() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    homeownerName: '',
    residentName: '',
    residentId: '',
    houseNumber: '',
    street: '',
    vehicleType: '',
    vehiclePassId: '',
    plateNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch vehicle data from API
  const fetchVehicleData = async (vehicleId) => {
    try {
      const response = await apiService.getVehicleById(vehicleId);
      const vehicle = response.data || response;
      
      return {
        homeownerName: vehicle.resident?.house_owner_name || 'John Doe',
        residentName: vehicle.resident?.name || '',
        residentId: vehicle.resident?.resident_id || '',
        houseNumber: vehicle.resident?.house?.house_number || '',
        street: vehicle.resident?.house?.street || '',
        vehicleType: vehicle.vehicle_type || '',
        vehiclePassId: vehicle.vehicle_pass_id || '',
        plateNumber: vehicle.plate_number || ''
      };
    } catch (error) {
      console.error('Error fetching vehicle data:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadVehicleData = async () => {
      try {
        setLoading(true);
        const vehicleData = await fetchVehicleData(id);
        setFormData(vehicleData);
      } catch (error) {
        console.error('Error loading vehicle data:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load vehicle data. Please try again.',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      loadVehicleData();
    }
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
      case 0: // Basic Information - no validation needed (read-only)
      case 1: // Residence Details - no validation needed (read-only)
        break;

      case 2: // Vehicle Information
        if (!formData.vehicleType.trim()) {
          newErrors.vehicleType = 'Vehicle type is required';
        }
        if (!formData.vehiclePassId.trim()) {
          newErrors.vehiclePassId = 'Vehicle Pass ID is required';
        }
        if (!formData.plateNumber.trim()) {
          newErrors.plateNumber = 'Plate number is required';
        }
        if (formData.plateNumber && !/^[A-Z]{3}[0-9]{4}$/.test(formData.plateNumber.replace(/\s/g, ''))) {
          newErrors.plateNumber = 'Please enter a valid plate number (e.g., ABC1234)';
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
      setLoading(true);
      
      // Only update vehicle-related information
      const updateData = {
        vehicle_type: formData.vehicleType,
        vehicle_pass_id: formData.vehiclePassId,
        plate_number: formData.plateNumber
      };

      await apiService.updateVehicle(id, updateData);
      
      setSnackbar({
        open: true,
        message: 'Vehicle updated successfully!',
        severity: 'success'
      });
      
      // Navigate back to vehicles page after a short delay
      setTimeout(() => {
        navigate('/user-management/vehicle');
      }, 1500);
    } catch (error) {
      console.error('Error updating vehicle:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to update vehicle. Please try again.',
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Homeowner Name"
                value={formData.homeownerName}
                InputProps={{ readOnly: true }}
                helperText="Homeowner name cannot be changed"
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
                label="Resident Name"
                value={formData.residentName}
                InputProps={{ readOnly: true }}
                helperText="Resident name cannot be changed"
                required
                sx={{
                  minWidth: 300,
                  '& .MuiInputBase-root': {
                    backgroundColor: 'action.hover',
                  },
                }}
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
                InputProps={{ readOnly: true }}
                helperText="House number cannot be changed"
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
                helperText="Street cannot be changed"
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
              <FormControl fullWidth error={!!errors.vehicleType} required>
                <InputLabel id="vehicle-type-label" shrink>Vehicle Type</InputLabel>
                <Select
                  labelId="vehicle-type-label"
                  value={formData.vehicleType || ''}
                  label="Vehicle Type"
                  onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                  displayEmpty
                  renderValue={(selected) => selected || <span style={{ color: '#9e9e9e' }}>Select vehicle type</span>}
                >
                  <MenuItem value="" disabled>
                    <em>Select vehicle type</em>
                  </MenuItem>
                  {vehicleTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                {errors.vehicleType && (
                  <FormHelperText>{errors.vehicleType}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Vehicle Pass ID"
                value={formData.vehiclePassId}
                onChange={(e) => handleInputChange('vehiclePassId', e.target.value)}
                error={!!errors.vehiclePassId}
                helperText={errors.vehiclePassId || 'Enter the vehicle pass ID'}
                required
                inputProps={{ maxLength: 20 }}
                sx={{ minWidth: 350, maxWidth: 500 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Plate Number"
                value={formData.plateNumber}
                onChange={(e) => handleInputChange('plateNumber', e.target.value.toUpperCase())}
                error={!!errors.plateNumber}
                helperText={errors.plateNumber || 'Enter the vehicle plate number'}
                required
                placeholder="ABC1234"
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
                  { id: 'vehicleType', label: 'Vehicle Type' },
                  { id: 'vehiclePassId', label: 'Vehicle Pass ID' },
                  { id: 'plateNumber', label: 'Plate Number' },
                ]}
                rows={[
                  {
                    homeownerName: formData.homeownerName,
                    residentName: formData.residentName,
                    residentId: formData.residentId,
                    houseNumber: formData.houseNumber,
                    street: formData.street,
                    vehicleType: formData.vehicleType,
                    vehiclePassId: formData.vehiclePassId,
                    plateNumber: formData.plateNumber,
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
              Edit Vehicle Information
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Update vehicle details. Personal and residence information cannot be modified.
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
              disabled={activeStep === 0 || loading}
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
                  disabled={loading}
                  sx={{ minWidth: 120 }}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
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

export default EditVehicle; 
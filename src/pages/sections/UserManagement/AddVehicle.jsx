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
  'Vehicle Information',
  'Review & Submit'
];

const vehicleTypes = [
  'Car',
  'Motorcycle',
  'SUV',
  'Truck',
  'Bus',
  'Tricycle'
];


function AddVehicle() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
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
  const [loading, setLoading] = useState(false);
  const [residents, setResidents] = useState([]);
  const [selectedResident, setSelectedResident] = useState(null);
  const [residentsLoading, setResidentsLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  // Fetch all residents for dropdown and prefetch next Vehicle Pass ID
  useEffect(() => {
    const fetchResidents = async () => {
      try {
        setResidentsLoading(true);
        const response = await apiService.getResidents(1, '', {});
        const items = response.data || response;
        setResidents(items?.data || items || []);
      } catch (error) {
        console.error('Error fetching residents:', error);
        setResidents([]);
        setSnackbar({
          open: true,
          message: 'Failed to load residents.',
          severity: 'error'
        });
      } finally {
        setResidentsLoading(false);
      }
    };

    const fetchNextVehiclePassId = async () => {
      try {
        const resp = await apiService.getNextVehiclePassId();
        const nextId = resp?.next_id || resp?.nextId || '';
        if (nextId) {
          setFormData(prev => ({ ...prev, vehiclePassId: nextId }));
        }
      } catch (e) {
        console.error('Failed to fetch next Vehicle Pass ID:', e);
      }
    };

    fetchResidents();
    fetchNextVehiclePassId();
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
        vehicleType: formData.vehicleType || '',
        vehiclePassId: formData.vehiclePassId || '',
        plateNumber: formData.plateNumber || ''
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
      case 2: // Vehicle Information
        if (!formData.vehicleType.trim()) {
          newErrors.vehicleType = 'Vehicle type is required';
        }
        // vehiclePassId is auto-generated; ensure it exists
        if (!formData.vehiclePassId.trim()) {
          newErrors.vehiclePassId = 'Vehicle Pass ID will be generated automatically';
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

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Create the vehicle using existing resident
      const vehiclePayload = {
        resident_id: formData.residentId,
        vehicle_type: formData.vehicleType,
        vehicle_pass_id: formData.vehiclePassId, // backend will generate if empty
        plate_number: formData.plateNumber,
        isArchived: false,
        isAccepted: true
      };

      await apiService.createVehicle(vehiclePayload);
      
      setSnackbar({
        open: true,
        message: 'Vehicle added successfully!',
        severity: 'success'
      });
      
      setTimeout(() => {
        navigate('/user-management/vehicle');
      }, 1500);
    } catch (error) {
      console.error('Error adding vehicle:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to add vehicle. Please try again.',
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
                      helperText={errors.resident || "Select an existing resident to add vehicle"}
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
                helperText={errors.vehiclePassId || 'Auto-generated (e.g., VP0001)'}
                required
                inputProps={{ maxLength: 20, readOnly: true }}
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

  return (
    <Box sx={{ p: { xs: 0.5, sm: 1 }, width: '100%', height: '100%' }}>
      <Box maxWidth="100%" mx="auto">
        <Paper elevation={3} sx={{ borderRadius: 1, overflow: 'hidden', p: { xs: 1, sm: 2 }, boxShadow: 3, width: '100%', minHeight: '60vh', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Add New Vehicle
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Select an existing resident and add vehicle information to register a vehicle
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

export default AddVehicle; 
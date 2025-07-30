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

const steps = [
  'Basic Information',
  'Residence Details',
  'Contact Information',
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

// Mock API fetch for existing users
const fetchExistingUsers = () =>
  Promise.resolve([
    {
      homeownerName: 'Juan Dela Cruz',
      residentName: 'Carlos Dela Cruz',
      residentId: 'MHH0001',
      houseNumber: 'B3A - L23',
      street: 'Camia',
      contactNumber: '09171234567',
      email: 'juan.cruz@email.com',
    },
    {
      homeownerName: 'Maria Santos',
      residentName: 'Anna Santos',
      residentId: 'MHH0002',
      houseNumber: 'B1B - L17',
      street: 'Bouganvilla',
      contactNumber: '09281234567',
      email: 'maria.santos@email.com',
    },
    {
      homeownerName: 'Jose Rizal',
      residentName: 'Emilio Rizal',
      residentId: 'MHH0003',
      houseNumber: 'B4C - L09',
      street: 'Dahlia',
      contactNumber: '+639171234568',
      email: 'jose.rizal@email.com',
    },
    {
      homeownerName: 'Ana Mendoza',
      residentName: 'Patricia Mendoza',
      residentId: 'MHH0004',
      houseNumber: 'B2A - L12',
      street: 'Champaca',
      contactNumber: '09351234567',
      email: 'ana.mendoza@email.com',
    },
    {
      homeownerName: 'Lito Garcia',
      residentName: 'Michael Garcia',
      residentId: 'MHH0005',
      houseNumber: 'B5D - L02',
      street: 'Sampaguita',
      contactNumber: '+639291234567',
      email: 'lito.garcia@email.com',
    },
    {
      homeownerName: 'Elena Reyes',
      residentName: 'Jessica Reyes',
      residentId: 'MHH0006',
      houseNumber: 'B4C - L08',
      street: 'Adelfa',
      contactNumber: '09181234567',
      email: 'elena.reyes@email.com',
    },
    {
      homeownerName: 'Mario Aquino',
      residentName: 'Leo Aquino',
      residentId: 'MHH0007',
      houseNumber: 'B3B - L33',
      street: 'Dahlia',
      contactNumber: '09081234567',
      email: 'mario.aquino@email.com',
    },
    {
      homeownerName: 'Cristina Lopez',
      residentName: 'Daniel Lopez',
      residentId: 'MHH0008',
      houseNumber: 'B2D - L16',
      street: 'Gumamela',
      contactNumber: '+639061234567',
      email: 'cristina.lopez@email.com',
    },
    {
      homeownerName: 'Andres Bonifacio',
      residentName: 'Teresa Bonifacio',
      residentId: 'MHH0009',
      houseNumber: 'B4C - L01',
      street: 'Santan',
      contactNumber: '09191234567',
      email: 'andres.bonifacio@email.com',
    },
    {
      homeownerName: 'Jenny Lim',
      residentName: 'Allan Lim',
      residentId: 'MHH0010',
      houseNumber: 'B5B - L05',
      street: 'Jasmine',
      contactNumber: '09209234567',
      email: 'jenny.lim@email.com',
    },
    {
      homeownerName: 'Ramon Torres',
      residentName: 'Edwin Torres',
      residentId: 'MHH0011',
      houseNumber: 'B1A - L11',
      street: 'Ilang-ilang',
      contactNumber: '09300234567',
      email: 'ramon.torres@email.com',
    },
    {
      homeownerName: 'Grace David',
      residentName: 'Melanie David',
      residentId: 'MHH0012',
      houseNumber: 'B2C - L19',
      street: 'Rosal',
      contactNumber: '+639331234567',
      email: 'grace.david@email.com',
    },
    {
      homeownerName: 'Fernando Cruz',
      residentName: 'Robyn Cruz',
      residentId: 'MHH0013',
      houseNumber: 'B3B - L29',
      street: 'Kalachuchi',
      contactNumber: '09101122334',
      email: 'fernando.cruz@email.com',
    },
    {
      homeownerName: 'Isabel Navarro',
      residentName: 'Francis Navarro',
      residentId: 'MHH0014',
      houseNumber: 'B4B - L13',
      street: 'Camia',
      contactNumber: '09221122334',
      email: 'isabel.navarro@email.com',
    },
    {
      homeownerName: 'Roberto Ramos',
      residentName: 'Vincent Ramos',
      residentId: 'MHH0015',
      houseNumber: 'B5C - L07',
      street: 'Bouganvilla',
      contactNumber: '09351122334',
      email: 'roberto.ramos@email.com',
    },
  ]);

function AddResidents() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    homeownerName: '',
    residentName: '',
    residentId: '',
    houseNumber: '',
    street: '',
    contactNumber: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  // Generate next available Resident ID
  const generateNextResidentId = (existingUsers) => {
    if (!existingUsers || existingUsers.length === 0) {
      return 'MHH0001';
    }
    
    const maxId = Math.max(...existingUsers.map(user => {
      const idNumber = parseInt(user.residentId.replace('MHH', ''));
      return idNumber;
    }));
    
    const nextId = maxId + 1;
    return `MHH${nextId.toString().padStart(4, '0')}`;
  };

  useEffect(() => {
    const loadExistingUsers = async () => {
      try {
        const existingUsers = await fetchExistingUsers();
        const nextResidentId = generateNextResidentId(existingUsers);
        setFormData(prev => ({ ...prev, residentId: nextResidentId }));
        setLoading(false);
      } catch (error) {
        console.error('Error loading existing users:', error);
        setFormData(prev => ({ ...prev, residentId: 'MHH0001' }));
        setLoading(false);
      }
    };
    
    loadExistingUsers();
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
        // Resident ID is auto-generated, no validation needed
        break;

      case 1: // Residence Details
        if (!formData.houseNumber.trim()) {
          newErrors.houseNumber = 'House number is required';
        }
        if (!formData.street) {
          newErrors.street = 'Street is required';
        }
        break;

      case 2: // Contact Information (optional)
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
        message: 'User added successfully!',
        severity: 'success'
      });
      
      // Navigate back to residents page after a short delay
      setTimeout(() => {
        navigate('/user-management/residents');
      }, 1500);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to add user. Please try again.',
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
                helperText="Auto-generated Resident ID"
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
                  { id: 'contactNumber', label: 'Contact Number' },
                  { id: 'email', label: 'Email Address' },
                ]}
                rows={[
                  {
                    homeownerName: formData.homeownerName,
                    residentName: formData.residentName,
                    residentId: formData.residentId,
                    houseNumber: formData.houseNumber,
                    street: formData.street,
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
              Add New Resident
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fill in the required information to register a new resident
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
                  Submit
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

export default AddResidents; 
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
  'Basic Information',
  'Residence Details',
  'Contact Information',
  'Review & Submit'
];

const streets = [
  'Adelfa',
  'Bougainvillea',
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

// Deprecated mock. Fetch next ID from API instead.
const fetchExistingUsers = () =>
  Promise.resolve([
    {
      homeownerName: 'Juan Dela Cruz',
      residentFirstName: 'Carlos',
      residentLastName: 'Dela Cruz',
      residentId: 'MHH0001',
      block: 'B3A',
      lot: 'L23',
      street: 'Lilac',
      contactNumber: '09171234567',
      email: 'carlos@gmail.com',
    },
    {
      homeownerName: 'Maria Santos',
      residentFirstName: 'Anna',
      residentLastName: 'Santos',
      residentId: 'MHH0002',
      block: 'B1B',
      lot: 'L17',
      street: 'Bougainvillea',
      contactNumber: '09281234567',
      email: 'anna@gmail.com',
    },
    {
      homeownerName: 'Jose Rizal',
      residentFirstName: 'Emilio',
      residentLastName: 'Rizal',
      residentId: 'MHH0003',
      block: 'B4C',
      lot: 'L09',
      street: 'Dahlia',
      contactNumber: '+639171234568',
      email: 'emilio@gmail.com',
    },
    {
      homeownerName: 'Ana Mendoza',
      residentFirstName: 'Patricia',
      residentLastName: 'Mendoza',
      residentId: 'MHH0004',
      block: 'B2A',
      lot: 'L12',
      street: 'Champaca',
      contactNumber: '09351234567',
      email: 'patricia@gmail.com',
    },
    {
      homeownerName: 'Lito Garcia',
      residentFirstName: 'Michael',
      residentLastName: 'Garcia',
      residentId: 'MHH0005',
      block: 'B5D',
      lot: 'L02',
      street: 'Sampaguita',
      contactNumber: '+639291234567',
      email: 'michael@gmail.com',
    },
    {
      homeownerName: 'Elena Reyes',
      residentFirstName: 'Jessica',
      residentLastName: 'Reyes',
      residentId: 'MHH0006',
      block: 'B4C',
      lot: 'L08',
      street: 'Adelfa',
      contactNumber: '09181234567',
      email: 'jessica@gmail.com',
    },
    {
      homeownerName: 'Mario Aquino',
      residentFirstName: 'Leo',
      residentLastName: 'Aquino',
      residentId: 'MHH0007',
      block: 'B3B',
      lot: 'L33',
      street: 'Dahlia',
      contactNumber: '09081234567',
      email: 'leo@gmail.com',
    },
    {
      homeownerName: 'Cristina Lopez',
      residentFirstName: 'Daniel',
      residentLastName: 'Lopez',
      residentId: 'MHH0008',
      block: 'B2D',
      lot: 'L16',
      street: 'Gumamela',
      contactNumber: '+639061234567',
      email: 'daniel@gmail.com',
    },
    {
      homeownerName: 'Andres Bonifacio',
      residentFirstName: 'Teresa',
      residentLastName: 'Bonifacio',
      residentId: 'MHH0009',
      block: 'B4C',
      lot: 'L01',
      street: 'Santan',
      contactNumber: '09191234567',
      email: 'teresa@gmail.com',
    },
    {
      homeownerName: 'Jenny Lim',
      residentFirstName: 'Allan',
      residentLastName: 'Lim',
      residentId: 'MHH0010',
      block: 'B5B',
      lot: 'L05',
      street: 'Jasmin',
      contactNumber: '09209234567',
      email: 'allan@gmail.com',
    },
    {
      homeownerName: 'Ramon Torres',
      residentFirstName: 'Edwin',
      residentLastName: 'Torres',
      residentId: 'MHH0011',
      block: 'B1A',
      lot: 'L11',
      street: 'Ilang-ilang',
      contactNumber: '09300234567',
      email: 'edwin@gmail.com',
    },
    {
      homeownerName: 'Grace David',
      residentFirstName: 'Melanie',
      residentLastName: 'David',
      residentId: 'MHH0012',
      block: 'B2C',
      lot: 'L19',
      street: 'Rosal',
      contactNumber: '+639331234567',
      email: 'melanie@gmail.com',
    },
    {
      homeownerName: 'Fernando Cruz',
      residentFirstName: 'Robyn',
      residentLastName: 'Cruz',
      residentId: 'MHH0013',
      block: 'B3B',
      lot: 'L29',
      street: 'Kalachuchi',
      contactNumber: '09101122334',
      email: 'robyn@gmail.com',
    },
    {
      homeownerName: 'Isabel Navarro',
      residentFirstName: 'Francis',
      residentLastName: 'Navarro',
      residentId: 'MHH0014',
      block: 'B4B',
      lot: 'L13',
      street: 'Waling-waling',
      contactNumber: '09221122334',
      email: 'francis@gmail.com',
    },
    {
      homeownerName: 'Roberto Ramos',
      residentFirstName: 'Vincent',
      residentLastName: 'Ramos',
      residentId: 'MHH0015',
      block: 'B5C',
      lot: 'L07',
      street: 'Bougainvillea',
      contactNumber: '09351122334',
      email: 'vincent@gmail.com',
    },
  ]);

function AddResidents() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    homeownerName: '',
    residentFirstName: '',
    residentLastName: '',
    residentId: '',
    block: '',
    lot: '',
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

  // Auto-generate email when firstname changes
  useEffect(() => {
    if (formData.residentFirstName.trim()) {
      const email = `${formData.residentFirstName.toLowerCase().replace(/\s+/g, '')}@gmail.com`;
      setFormData(prev => ({ ...prev, email }));
    }
  }, [formData.residentFirstName]);

  useEffect(() => {
    const loadNextId = async () => {
      try {
        const res = await apiService.getNextResidentId();
        const nextResidentId = res.next_resident_id || 'MHH0001';
        setFormData(prev => ({ ...prev, residentId: nextResidentId }));
      } catch (error) {
        console.error('Error fetching next resident ID:', error);
        setFormData(prev => ({ ...prev, residentId: 'MHH0001' }));
      } finally {
        setLoading(false);
      }
    };
    loadNextId();
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
        if (!formData.residentFirstName.trim()) {
          newErrors.residentFirstName = 'Resident first name is required';
        }
        if (!formData.residentLastName.trim()) {
          newErrors.residentLastName = 'Resident last name is required';
        }
        // Resident ID is auto-generated, no validation needed
        break;

      case 1: // Residence Details
        if (!formData.block.trim()) {
          newErrors.block = 'Block is required';
        }
        if (!formData.lot.trim()) {
          newErrors.lot = 'Lot is required';
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
      setLoading(true);

      const payload = {
        resident_id: formData.residentId,
        house_owner_name: formData.homeownerName,
        first_name: formData.residentFirstName,
        last_name: formData.residentLastName,
        email: formData.email || null,
        contact_no: formData.contactNumber || null,
        block: formData.block,
        lot: formData.lot,
        street: formData.street,
      };

      await apiService.createResident(payload);
      
      setSnackbar({
        open: true,
        message: 'Resident added successfully!',
        severity: 'success'
      });
      
      setTimeout(() => {
        navigate('/user-management/residents');
      }, 1200);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to add resident. Please try again.',
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
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <TextField
                fullWidth
                label="Resident First Name"
                value={formData.residentFirstName}
                onChange={(e) => handleInputChange('residentFirstName', e.target.value)}
                error={!!errors.residentFirstName}
                helperText={errors.residentFirstName}
                required
                inputProps={{ maxLength: 25 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <TextField
                fullWidth
                label="Resident Last Name"
                value={formData.residentLastName}
                onChange={(e) => handleInputChange('residentLastName', e.target.value)}
                error={!!errors.residentLastName}
                helperText={errors.residentLastName}
                required
                inputProps={{ maxLength: 25 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <TextField
                fullWidth
                label="Homeowner Name"
                value={formData.homeownerName}
                onChange={(e) => handleInputChange('homeownerName', e.target.value)}
                error={!!errors.homeownerName}
                helperText={errors.homeownerName}
                required
                inputProps={{ maxLength: 50 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
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
                label="Block"
                value={formData.block}
                onChange={(e) => handleInputChange('block', e.target.value)}
                error={!!errors.block}
                helperText={errors.block || 'Format: B#A (e.g., B3A)'}
                required
                placeholder="B3A"
                inputProps={{ maxLength: 10 }}
                sx={{ minWidth: 200, maxWidth: 300 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Lot"
                value={formData.lot}
                onChange={(e) => handleInputChange('lot', e.target.value)}
                error={!!errors.lot}
                helperText={errors.lot || 'Format: L## (e.g., L23)'}
                required
                placeholder="L23"
                inputProps={{ maxLength: 10 }}
                sx={{ minWidth: 200, maxWidth: 300 }}
              />
            </Grid>
            <Grid item xs={12}>
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
                helperText={errors.email || 'Auto-generated from first name'}
                placeholder="firstname@gmail.com"
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
                    residentName: `${formData.residentFirstName} ${formData.residentLastName}`,
                    residentId: formData.residentId,
                    houseNumber: `${formData.block}-${formData.lot}`,
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

export default AddResidents; 
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Stack,
  Button,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import WarningIcon from '@mui/icons-material/Warning';
import FloraTable from '../../../components/FloraTable';

const steps = [
  'Resident Information',
  'Property Details',
  'Alert Information',
  'Status & Response',
  'Review & Save'
];

const streets = [
  'Camia',
  'Bongavilla',
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

function EditAlerts() {
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock alert data - in real app this would come from API based on id
  const [alertData, setAlertData] = useState({
    residentName: 'Maria Lopez',
    homeownerName: 'Cristina Lopez',
    contactNumber: '+639061234567',
    blockLot: 'B5A-L10',
    street: 'Camia',
    date: '2025-04-07',
    time: '08:15 AM',
    reason: 'Package Theft Suspected',
    status: 'Resolved',
    notifiedParties: 'Guardhouse'
  });

  const handleInputChange = (field, value) => {
    setAlertData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSave = () => {
    console.log('Saving alert data:', alertData);
    // Here you would typically make an API call to save the data
    navigate('/alerts-security/alerts');
  };

  const handleCancel = () => {
    navigate('/alerts-security/alerts');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved': return 'success';
      case 'Responded': return 'info';
      case 'Investigation Ongoing': return 'warning';
      case 'Escalated': return 'error';
      default: return 'default';
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
                              <TextField
                  fullWidth
                  label="Resident Name"
                  value={alertData.residentName}
                  onChange={(e) => handleInputChange('residentName', e.target.value)}
                  size="medium"
                  sx={{ minWidth: 400 }}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                              <TextField
                  fullWidth
                  label="Homeowner Name"
                  value={alertData.homeownerName}
                  onChange={(e) => handleInputChange('homeownerName', e.target.value)}
                  size="medium"
                  sx={{ minWidth: 400 }}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                              <TextField
                  fullWidth
                  label="Contact Number"
                  value={alertData.contactNumber}
                  onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                  size="medium"
                  sx={{ minWidth: 400 }}
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
                  label="Block & Lot"
                  value={alertData.blockLot}
                  onChange={(e) => handleInputChange('blockLot', e.target.value)}
                  size="medium"
                  sx={{ minWidth: 400 }}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                              <FormControl fullWidth sx={{ minWidth: 400 }}>
                  <InputLabel>Street</InputLabel>
                  <Select
                    value={alertData.street}
                    label="Street"
                    onChange={(e) => handleInputChange('street', e.target.value)}
                    size="medium"
                  >
                    {streets.map((street) => (
                      <MenuItem key={street} value={street}>
                        {street}
                      </MenuItem>
                    ))}
                  </Select>
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
                  label="Date"
                  type="date"
                  value={alertData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  size="medium"
                  InputLabelProps={{ shrink: true }}
                  sx={{ minWidth: 400 }}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                              <TextField
                  fullWidth
                  label="Time"
                  type="time"
                  value={alertData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  size="medium"
                  InputLabelProps={{ shrink: true }}
                  sx={{ minWidth: 400 }}
                />
            </Grid>
            <Grid item xs={12}>
                              <TextField
                  fullWidth
                  label="Reason"
                  value={alertData.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                  size="medium"
                  multiline
                  rows={3}
                  sx={{ minWidth: 400 }}
                />
            </Grid>
          </Grid>
        );
            case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Update Status"
                value={alertData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                size="medium"
                SelectProps={{
                  native: true,
                }}
                sx={{ minWidth: 400 }}
              >
                <option value="Resolved">Resolved</option>
                <option value="Responded">Responded</option>
                <option value="Investigation Ongoing">Investigation Ongoing</option>
                <option value="Escalated">Escalated</option>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notified Parties"
                value={alertData.notifiedParties}
                onChange={(e) => handleInputChange('notifiedParties', e.target.value)}
                size="medium"
                multiline
                rows={3}
                sx={{ minWidth: 400 }}
              />
            </Grid>
          </Grid>
        );
      case 4:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Alert Information
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <FloraTable
                columns={[
                  { id: 'field', label: 'Field' },
                  { id: 'value', label: 'Value' }
                ]}
                rows={[
                  { field: 'Resident Name', value: alertData.residentName },
                  { field: 'Homeowner Name', value: alertData.homeownerName },
                  { field: 'Contact Number', value: alertData.contactNumber },
                  { field: 'Block & Lot', value: alertData.blockLot },
                  { field: 'Street', value: alertData.street },
                  { field: 'Date', value: alertData.date },
                  { field: 'Time', value: alertData.time },
                  { field: 'Status', value: alertData.status },
                  { field: 'Reason', value: alertData.reason },
                  { field: 'Notified Parties', value: alertData.notifiedParties }
                ]}
                actions={[]}
                page={1}
                rowsPerPage={10}
                zebra={true}
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <WarningIcon sx={{ fontSize: 24, color: 'primary.main' }} />
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Edit Alert
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Update alert information step by step
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
    </Box>
  );
}

export default EditAlerts; 
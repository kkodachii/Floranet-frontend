import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
  IconButton,
  Select, 
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import FloraTable from '../../../components/FloraTable';
import StatusBadge from '../../../components/StatusBadge';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import apiService from '../../../services/api';

function PaymentDetails() {
  const { residentId } = useParams();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [monthlyDues, setMonthlyDues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);

  // Get years from backend
  useEffect(() => {
    const loadYears = async () => {
      try {
        const resp = await apiService.getResidentMonthlyDueYears(residentId);
        if (resp.success) {
          const yrs = resp.data.map((y) => Number(y)).sort((a, b) => b - a);
          setAvailableYears(yrs);
          if (yrs.length && !yrs.includes(Number(selectedYear))) {
            setSelectedYear(yrs[0]);
          }
        }
      } catch (e) {
        // ignore silently
      }
    };
    if (residentId) loadYears();
  }, [residentId]);

  // Filter options
  const years = React.useMemo(() => {
    if (availableYears.length) return availableYears;
    if (!monthlyDues || monthlyDues.length === 0) return [];
    const yearSet = new Set();
    monthlyDues.forEach((due) => yearSet.add(due.year));
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [availableYears, monthlyDues]);

  // We fetch by year from API, so display as-is
  const filteredPaymentHistory = React.useMemo(() => {
    return paymentDetails ? paymentDetails.paymentHistory : [];
  }, [paymentDetails]);

  useEffect(() => {
    const loadPaymentDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load resident information
        const residentData = await apiService.getResidentById(residentId);
        
        // Load monthly due history for the resident (by selected year only)
        const monthlyDuesData = await apiService.getResidentMonthlyDueHistory(
          residentId,
          selectedYear
        );

        // Transform the data to match the expected format
        const transformedPaymentHistory = monthlyDuesData.data.map((due, index) => ({
          id: due.id,
          dateDue: due.month === 1 ? 'JANUARY' : 
                   due.month === 2 ? 'FEBRUARY' : 
                   due.month === 3 ? 'MARCH' : 
                   due.month === 4 ? 'APRIL' : 
                   due.month === 5 ? 'MAY' : 
                   due.month === 6 ? 'JUNE' : 
                   due.month === 7 ? 'JULY' : 
                   due.month === 8 ? 'AUGUST' : 
                   due.month === 9 ? 'SEPTEMBER' : 
                   due.month === 10 ? 'OCTOBER' : 
                   due.month === 11 ? 'NOVEMBER' : 'DECEMBER',
          paymentStatus: due.status.toUpperCase(),
          paymentDate: due.paid_at ? new Date(due.paid_at).toLocaleDateString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric'
          }) : '—',
          amount: `₱${parseFloat(due.amount).toFixed(2)}`,
          reference: due.payments && due.payments.length > 0 ? due.payments[0].id : '—',
          method: due.payments && due.payments.length > 0 ? due.payments[0].method_of_payment.toUpperCase() : '—',
          hasReceipt: due.status === 'paid',
        }));

        setPaymentDetails({
          residentId: residentData.data.resident_id || residentData.data.id,
          blockLot: residentData.data.house?.house_number || 'N/A',
          residentName: residentData.data.name || 'N/A',
          contactNumber: residentData.data.contact_no || 'N/A',
          email: residentData.data.email || 'N/A',
          profileImage: residentData.data.profile_picture || 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg',
          paymentHistory: transformedPaymentHistory,
        });

        setMonthlyDues(monthlyDuesData.data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading payment details:', error);
        setError('Failed to load payment details. Please try again.');
        setLoading(false);
      }
    };

    if (residentId) {
      loadPaymentDetails();
    }
  }, [residentId, selectedYear]);

  const handlePrintReceipt = async () => {
    try {
      setLoading(true);
      const response = await apiService.generatePaymentDetailsPDF(residentId, selectedYear);
      
      if (response.success) {
        const blob = response.data;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `payment-details-${paymentDetails?.residentName || 'resident'}-${selectedYear}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };


  const columns = [
    { id: 'dateDue', label: 'DATE DUE', align: 'left' },
    { 
      id: 'paymentStatus', 
      label: 'PAYMENT STATUS',
      align: 'center',
      render: (value) => {
        const statusColors = {
          'PAID': { backgroundColor: 'rgba(76, 175, 80, 0.25)', color: '#4caf50' },
          'OVERDUE': { backgroundColor: 'rgba(255, 152, 0, 0.25)', color: '#ff9800' },
          'UNPAID': { backgroundColor: 'rgba(244, 67, 54, 0.25)', color: '#f44336' },
        };
        
        const statusStyle = statusColors[value] || {
          backgroundColor: 'rgba(33, 150, 243, 0.25)',
          color: '#2196f3'
        };

        return (
          <Chip
            label={value}
            size="small"
            sx={{
              fontWeight: 600,
              fontSize: 11,
              textTransform: 'capitalize',
              backgroundColor: statusStyle.backgroundColor,
              color: statusStyle.color,
              '& .MuiChip-label': {
                color: statusStyle.color,
              },
              '&:hover': {
                backgroundColor: statusStyle.backgroundColor,
              },
              '&:focus': {
                backgroundColor: statusStyle.backgroundColor,
              }
            }}
          />
        );
      }
    },
    { id: 'paymentDate', label: 'PAYMENT DATE', align: 'center' },
    { id: 'amount', label: 'AMOUNT', align: 'center' },
    { id: 'reference', label: 'REFERENCE', align: 'center' },
    { id: 'method', label: 'METHOD', align: 'center' },
  ];

  if (loading) {
    return (
      <Box sx={{ p: { xs: 0.5, sm: 1 } }}>
        <Box maxWidth="xl" mx="auto">
          <Paper elevation={3} sx={{ borderRadius: 1, overflow: 'hidden', p: { xs: 1, sm: 2 }, boxShadow: 3, minHeight: 300 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
              <CircularProgress color="primary" />
            </Box>
          </Paper>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: { xs: 0.5, sm: 1 } }}>
        <Box maxWidth="xl" mx="auto">
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button onClick={handleBack} startIcon={<ArrowBackIcon />}>
            Go Back
          </Button>
        </Box>
      </Box>
    );
  }

  if (!paymentDetails) {
    return (
      <Box sx={{ p: { xs: 0.5, sm: 1 } }}>
        <Box maxWidth="xl" mx="auto">
          <Alert severity="warning" sx={{ mb: 2 }}>
            Payment details not found.
          </Alert>
          <Button onClick={handleBack} startIcon={<ArrowBackIcon />}>
            Go Back
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 0.5, sm: 1 } }}>
      <Box maxWidth="xl" mx="auto">
        

        {/* Resident Profile Section */}
        <Paper elevation={3} sx={{ borderRadius: 1, overflow: 'hidden', p: { xs: 1, sm: 2 }, boxShadow: 3, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontFamily: 'monospace',
                fontSize: '1.2rem',
              }}
            >
              Resident Information
            </Typography>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              sx={{ minWidth: 100 }}
            >
              Back
            </Button>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'center', sm: 'flex-start' },
              gap: 2,
            }}
          >
            {/* Profile Picture */}
            <Avatar
              src={paymentDetails.profileImage}
              sx={{
                width: 120,
                height: 120,
                border: '4px solid #fff',
                boxShadow: 3,
                mb: { xs: 1, sm: 0 },
              }}
            />

            {/* Resident Information */}
            <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  mb: 0.5,
                  fontSize: '1.1rem',
                }}
              >
                {paymentDetails.blockLot}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  mb: 0.5,
                  fontSize: '1.3rem',
                }}
              >
                {paymentDetails.residentName}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: 'monospace',
                  fontWeight: 600,
                  mb: 0.5,
                  fontSize: '1rem',
                }}
              >
                {paymentDetails.contactNumber}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: 'monospace',
                  fontWeight: 600,
                  fontSize: '1rem',
                }}
              >
                {paymentDetails.email}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Payment History Table */}
        <Paper elevation={3} sx={{ borderRadius: 1, overflow: 'hidden', p: { xs: 0.5, sm: 1 }, boxShadow: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                px: 1,
                fontFamily: 'monospace',
              }}
            >
              Payment History - {selectedYear}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button
                variant="contained"
                startIcon={<PrintIcon />}
                onClick={handlePrintReceipt}
                disabled={loading}
              >
                Print Report
              </Button>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="year-select-label">Year</InputLabel>
                <Select
                  labelId="year-select-label"
                  value={selectedYear}
                  label="Year"
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
          <FloraTable
            columns={columns}
            rows={filteredPaymentHistory}
            page={1}
            rowsPerPage={13}
            maxHeight="60vh"
            emptyMessage="No payment history found."
            loading={false}
            zebra={false}
          />
        </Paper>
      </Box>
    </Box>
  );
}

export default PaymentDetails; 
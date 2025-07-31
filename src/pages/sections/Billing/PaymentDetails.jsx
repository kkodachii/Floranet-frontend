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
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import FloraTable from '../../../components/FloraTable';
import StatusBadge from '../../../components/StatusBadge';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Mock API fetch for payment details
const fetchPaymentDetails = (residentId) =>
  Promise.resolve({
    residentId: 'MHH0004',
    blockLot: 'B3A - L23',
    residentName: 'MENDOZA, RAVEN',
    contactNumber: '09617060676',
    email: 'MENDOZA@GMAIL.COM',
    profileImage: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg', 
    paymentHistory: [
      {
        id: 'PAY001',
        dateDue: 'JANUARY',
        paymentStatus: 'PAID',
        paymentDate: '1/27/2025',
        amount: '300.00',
        reference: '0000001',
        method: 'ONLINE',
        hasReceipt: true,
      },
      {
        id: 'PAY002',
        dateDue: 'FEBRUARY',
        paymentStatus: 'PAID',
        paymentDate: '2/27/2025',
        amount: '300.00',
        reference: '0000002',
        method: 'PERSONAL',
        hasReceipt: true,
      },
      {
        id: 'PAY003',
        dateDue: 'MARCH',
        paymentStatus: 'PAID',
        paymentDate: '2/27/2025',
        amount: '300.00',
        reference: '0000003',
        method: 'ONLINE',
        hasReceipt: true,
      },
      {
        id: 'PAY004',
        dateDue: 'APRIL',
        paymentStatus: 'OVERDUE',
        paymentDate: '—',
        amount: '300.00',
        reference: '—',
        method: '—',
        hasReceipt: false,
      },
      {
        id: 'PAY005',
        dateDue: 'MAY',
        paymentStatus: 'UNPAID',
        paymentDate: '—',
        amount: '300.00',
        reference: '—',
        method: '—',
        hasReceipt: false,
      },
      {
        id: 'PAY006',
        dateDue: 'JUNE',
        paymentStatus: 'UNPAID',
        paymentDate: '—',
        amount: '300.00',
        reference: '—',
        method: '—',
        hasReceipt: false,
      },
      {
        id: 'PAY007',
        dateDue: 'JULY',
        paymentStatus: 'UNPAID',
        paymentDate: '—',
        amount: '300.00',
        reference: '—',
        method: '—',
        hasReceipt: false,
      },
      {
        id: 'PAY008',
        dateDue: 'AUGUST',
        paymentStatus: 'UNPAID',
        paymentDate: '—',
        amount: '300.00',
        reference: '—',
        method: '—',
        hasReceipt: false,
      },
      {
        id: 'PAY009',
        dateDue: 'SEPTEMBER',
        paymentStatus: 'UNPAID',
        paymentDate: '—',
        amount: '300.00',
        reference: '—',
        method: '—',
        hasReceipt: false,
      },
      {
        id: 'PAY010',
        dateDue: 'OCTOBER',
        paymentStatus: 'UNPAID',
        paymentDate: '—',
        amount: '300.00',
        reference: '—',
        method: '—',
        hasReceipt: false,
      },
      {
        id: 'PAY011',
        dateDue: 'NOVEMBER',
        paymentStatus: 'UNPAID',
        paymentDate: '—',
        amount: '300.00',
        reference: '—',
        method: '—',
        hasReceipt: false,
      },
      {
        id: 'PAY012',
        dateDue: 'DECEMBER',
        paymentStatus: 'UNPAID',
        paymentDate: '—',
        amount: '300.00',
        reference: '—',
        method: '—',
        hasReceipt: false,
      },
    ],
  });

function PaymentDetails() {
  const { residentId } = useParams();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState('all');

  // Extract unique years from paymentHistory
  const years = React.useMemo(() => {
    if (!paymentDetails) return [];
    const yearSet = new Set();
    paymentDetails.paymentHistory.forEach((p) => {
      if (p.paymentDate && p.paymentDate !== '—') {
        const match = p.paymentDate.match(/\d{4}$/);
        if (match) yearSet.add(match[0]);
      }
    });
    return Array.from(yearSet).sort((a, b) => b - a); // Descending order
  }, [paymentDetails]);

  // Filter paymentHistory by selected year
  const filteredPaymentHistory = React.useMemo(() => {
    if (!paymentDetails) return [];
    if (selectedYear === 'all') return paymentDetails.paymentHistory;
    return paymentDetails.paymentHistory.filter((p) => {
      if (p.paymentDate && p.paymentDate !== '—') {
        const match = p.paymentDate.match(/\d{4}$/);
        return match && match[0] === selectedYear;
      }
      return false;
    });
  }, [paymentDetails, selectedYear]);

  useEffect(() => {
    fetchPaymentDetails(residentId).then((data) => {
      setPaymentDetails(data);
      setLoading(false);
    });
  }, [residentId]);

  const handlePrintReceipt = (payment) => {
    console.log('Print receipt for:', payment);
    // Implement print functionality
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Actions for payment table
  const actions = [
    {
      label: 'Print Receipt',
      icon: <PrintIcon fontSize="small" />,
      color: 'success',
      sx: { '&:hover': { bgcolor: 'success.main', color: '#fff' } },
      onClick: (row) => {
        if (row.hasReceipt) {
          handlePrintReceipt(row);
        }
      },
      show: (row) => row.hasReceipt, // Only show for paid payments
    },
  ];

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
        <Typography>Loading payment details...</Typography>
      </Box>
    );
  }

  if (!paymentDetails) {
    return (
      <Box sx={{ p: { xs: 0.5, sm: 1 } }}>
        <Typography>Payment details not found.</Typography>
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
              Payment History
            </Typography>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="year-select-label">Year</InputLabel>
              <Select
                labelId="year-select-label"
                value={selectedYear}
                label="Year"
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <MenuItem value="all">All Years</MenuItem>
                {years.map((year) => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <FloraTable
            columns={columns}
            rows={filteredPaymentHistory}
            actions={actions}
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
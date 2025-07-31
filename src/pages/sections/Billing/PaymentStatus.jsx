import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Stack,
  Tooltip,
  InputAdornment,
  IconButton,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTheme } from '@mui/material/styles';
import FloraTable from '../../../components/FloraTable';

// Mock API fetch for residents with payment data
const fetchResidentsWithPayments = () =>
  Promise.resolve([
    {
      id: 'RES001',
      street: 'Camia',
      blockLot: 'B3A - L23',
      homeownerName: 'Juan Dela Cruz',
      residentName: 'Carlos Dela Cruz',
      residentId: 'MHH0001',
      contactNumber: '09171234567',
      email: 'juan.cruz@email.com',
      monthlyDue: 2500,
      lastPayment: '2024-02-15',
      paymentStatus: 'Paid',
      outstandingBalance: 0,
    },
    {
      id: 'RES002',
      street: 'Bouganvilla',
      blockLot: 'B1B - L17',
      homeownerName: 'Maria Santos',
      residentName: 'Anna Santos',
      residentId: 'MHH0002',
      contactNumber: '09281234567',
      email: 'maria.santos@email.com',
      monthlyDue: 2500,
      lastPayment: '2024-01-20',
      paymentStatus: 'Overdue',
      outstandingBalance: 5000,
    },
    {
      id: 'RES003',
      street: 'Dahlia',
      blockLot: 'B4C - L09',
      homeownerName: 'Jose Rizal',
      residentName: 'Emilio Rizal',
      residentId: 'MHH0003',
      contactNumber: '+639171234568',
      email: 'jose.rizal@email.com',
      monthlyDue: 2500,
      lastPayment: '2024-03-01',
      paymentStatus: 'Paid',
      outstandingBalance: 0,
    },
    {
      id: 'RES004',
      street: 'Champaca',
      blockLot: 'B2A - L12',
      homeownerName: 'Ana Mendoza',
      residentName: 'Patricia Mendoza',
      residentId: 'MHH0004',
      contactNumber: '09351234567',
      email: 'ana.mendoza@email.com',
      monthlyDue: 2500,
      lastPayment: '2024-02-28',
      paymentStatus: 'Paid',
      outstandingBalance: 0,
    },
    {
      id: 'RES005',
      street: 'Sampaguita',
      blockLot: 'B5D - L02',
      homeownerName: 'Lito Garcia',
      residentName: 'Michael Garcia',
      residentId: 'MHH0005',
      contactNumber: '+639291234567',
      email: 'lito.garcia@email.com',
      monthlyDue: 2500,
      lastPayment: '2024-01-15',
      paymentStatus: 'Overdue',
      outstandingBalance: 7500,
    },
    {
      id: 'RES006',
      street: 'Adelfa',
      blockLot: 'B4C - L08',
      homeownerName: 'Elena Reyes',
      residentName: 'Jessica Reyes',
      residentId: 'MHH0006',
      contactNumber: '09181234567',
      email: 'elena.reyes@email.com',
      monthlyDue: 2500,
      lastPayment: '2024-03-10',
      paymentStatus: 'Paid',
      outstandingBalance: 0,
    },
    {
      id: 'RES007',
      street: 'Dahlia',
      blockLot: 'B3B - L33',
      homeownerName: 'Mario Aquino',
      residentName: 'Leo Aquino',
      residentId: 'MHH0007',
      contactNumber: '09081234567',
      email: 'mario.aquino@email.com',
      monthlyDue: 2500,
      lastPayment: '2024-02-25',
      paymentStatus: 'Paid',
      outstandingBalance: 0,
    },
    {
      id: 'RES008',
      street: 'Gumamela',
      blockLot: 'B2D - L16',
      homeownerName: 'Cristina Lopez',
      residentName: 'Daniel Lopez',
      residentId: 'MHH0008',
      contactNumber: '+639061234567',
      email: 'cristina.lopez@email.com',
      monthlyDue: 2500,
      lastPayment: '2024-01-30',
      paymentStatus: 'Overdue',
      outstandingBalance: 2500,
    },
    {
      id: 'RES009',
      street: 'Santan',
      blockLot: 'B4C - L01',
      homeownerName: 'Andres Bonifacio',
      residentName: 'Teresa Bonifacio',
      residentId: 'MHH0009',
      contactNumber: '09191234567',
      email: 'andres.bonifacio@email.com',
      monthlyDue: 2500,
      lastPayment: '2024-03-05',
      paymentStatus: 'Paid',
      outstandingBalance: 0,
    },
    {
      id: 'RES010',
      street: 'Jasmine',
      blockLot: 'B5B - L05',
      homeownerName: 'Jenny Lim',
      residentName: 'Allan Lim',
      residentId: 'MHH0010',
      contactNumber: '09209234567',
      email: 'jenny.lim@email.com',
      monthlyDue: 2500,
      lastPayment: '2024-02-20',
      paymentStatus: 'Paid',
      outstandingBalance: 0,
    },
    {
      id: 'RES011',
      street: 'Ilang-ilang',
      blockLot: 'B1A - L11',
      homeownerName: 'Ramon Torres',
      residentName: 'Edwin Torres',
      residentId: 'MHH0011',
      contactNumber: '09300234567',
      email: 'ramon.torres@email.com',
      monthlyDue: 2500,
      lastPayment: '2024-01-25',
      paymentStatus: 'Overdue',
      outstandingBalance: 5000,
    },
    {
      id: 'RES012',
      street: 'Rosal',
      blockLot: 'B2C - L19',
      homeownerName: 'Grace David',
      residentName: 'Melanie David',
      residentId: 'MHH0012',
      contactNumber: '+639331234567',
      email: 'grace.david@email.com',
      monthlyDue: 2500,
      lastPayment: '2024-03-08',
      paymentStatus: 'Paid',
      outstandingBalance: 0,
    },
    {
      id: 'RES013',
      street: 'Kalachuchi',
      blockLot: 'B3B - L29',
      homeownerName: 'Fernando Cruz',
      residentName: 'Robyn Cruz',
      residentId: 'MHH0013',
      contactNumber: '09101122334',
      email: 'fernando.cruz@email.com',
      monthlyDue: 2500,
      lastPayment: '2024-02-18',
      paymentStatus: 'Paid',
      outstandingBalance: 0,
    },
    {
      id: 'RES014',
      street: 'Camia',
      blockLot: 'B4B - L13',
      homeownerName: 'Isabel Navarro',
      residentName: 'Francis Navarro',
      residentId: 'MHH0014',
      contactNumber: '09221122334',
      email: 'isabel.navarro@email.com',
      monthlyDue: 2500,
      lastPayment: '2024-01-22',
      paymentStatus: 'Overdue',
      outstandingBalance: 2500,
    },
    {
      id: 'RES015',
      street: 'Bouganvilla',
      blockLot: 'B5C - L07',
      homeownerName: 'Roberto Ramos',
      residentName: 'Vincent Ramos',
      residentId: 'MHH0015',
      contactNumber: '09351122334',
      email: 'roberto.ramos@email.com',
      monthlyDue: 2500,
      lastPayment: '2024-03-12',
      paymentStatus: 'Paid',
      outstandingBalance: 0,
    },
  ]);

function PaymentStatus() {
  const [residents, setResidents] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedStreet, setSelectedStreet] = useState('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const rowsPerPage = 10;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  useEffect(() => {
    fetchResidentsWithPayments().then((data) => {
      setResidents(data);
      setLoading(false);
    });
  }, []);

  const handleSearch = (e) => setSearch(e.target.value);
  const handleStreetChange = (e) => setSelectedStreet(e.target.value);

  // Get unique streets for dropdown
  const uniqueStreets = ['all', ...Array.from(new Set(residents.map(r => r.street)))];

  // Filter residents based on search and street selection
  const filteredResidents = residents.filter((resident) => {
    const matchesSearch = Object.values(resident)
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase());
    
    const matchesStreet = selectedStreet === 'all' || resident.street === selectedStreet;
    
    return matchesSearch && matchesStreet;
  });

  // Actions for each row
  const actions = [
    {
      label: 'View Payment',
      icon: <VisibilityIcon fontSize="small" />,
      color: 'primary',
      sx: { '&:hover': { bgcolor: 'primary.main', color: '#fff' } },
      onClick: (row) => {
        // Handle view payment - navigate to payment details page
        navigate(`/billing-payment/payment-details/${row.residentId}`);
      },
    },
  ];

  const columns = [
    { id: 'street', label: 'Street' },
    { id: 'blockLot', label: 'Block & Lot' },
    { id: 'homeownerName', label: 'Homeowner Name' },
    { id: 'residentName', label: 'Resident Name' },
    { id: 'residentId', label: 'Resident ID' },
    { id: 'contactNumber', label: 'Contact Number' },
    { id: 'email', label: 'Email Address' },
  ];

  // Pagination logic
  const total = filteredResidents.length;
  const from = total === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const to = Math.min(page * rowsPerPage, total);

  // Table max height
  const tableMaxHeight = isMobile ? '40vh' : '60vh';

  return (
    <Box sx={{ p: { xs: 0.5, sm: 1 } }}>
      <Box maxWidth="xl" mx="auto">
        <Paper elevation={3} sx={{ borderRadius: 1, overflow: 'hidden', p: { xs: 0.5, sm: 1 }, boxShadow: 3, minHeight: 300 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
              mb: 1,
              px: 1,
              py: 0.5,
            }}
          >
            <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' }, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search residents..."
                value={search}
                onChange={handleSearch}
                sx={{
                  width: { xs: '100%', sm: 320 },
                  m: 0,
                  height: 40,
                  '& .MuiInputBase-root': {
                    height: 40,
                    minHeight: 40,
                    py: 0,
                  },
                  '& .MuiOutlinedInput-root': {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                  sx: { py: 0 }
                }}
              />
              <FormControl size="small" sx={{ width: { xs: '100%', sm: 200 } }}>
                <InputLabel>Filter by Street</InputLabel>
                <Select
                  value={selectedStreet}
                  label="Filter by Street"
                  onChange={handleStreetChange}
                  sx={{
                    height: 40,
                    '& .MuiSelect-select': {
                      py: 0,
                      display: 'flex',
                      alignItems: 'center',
                    },
                  }}
                >
                  {uniqueStreets.map((street) => (
                    <MenuItem key={street} value={street}>
                      {street === 'all' ? 'All Streets' : street}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
          <FloraTable
            columns={columns}
            rows={filteredResidents}
            actions={actions}
            page={page}
            rowsPerPage={rowsPerPage}
            maxHeight={tableMaxHeight}
            emptyMessage="No residents found."
            loading={loading}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', md: 'center' },
              p: 1,
              gap: 1,
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', minHeight: 32 }}
            >
              {total === 0 ? '0 of 0' : `${from}–${to} of ${total}`}
            </Typography>
            <Box width="100%" display="flex" justifyContent={{ xs: 'center', md: 'flex-end' }}>
              <IconButton
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                sx={{
                  border: '1.5px solid',
                  borderColor: page === 1 ? 'divider' : 'primary.main',
                  borderRadius: 2,
                  mx: 0.5,
                  bgcolor: 'background.paper',
                  color: page === 1 ? 'text.disabled' : 'primary.main',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'primary.main',
                    color: '#fff',
                    borderColor: 'primary.main',
                    '& .MuiSvgIcon-root': {
                      color: '#fff'
                    }
                  }
                }}
                size="small"
              >
                <ChevronLeftIcon sx={{ color: page === 1 ? 'text.disabled' : 'primary.main' }} />
              </IconButton>
              <IconButton
                onClick={() => setPage(page + 1)}
                disabled={page * rowsPerPage >= total}
                sx={{
                  border: '1.5px solid',
                  borderColor: page * rowsPerPage >= total ? 'divider' : 'primary.main',
                  borderRadius: 2,
                  mx: 0.5,
                  bgcolor: 'background.paper',
                  color: page * rowsPerPage >= total ? 'text.disabled' : 'primary.main',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'primary.main',
                    color: '#fff',
                    borderColor: 'primary.main',
                    '& .MuiSvgIcon-root': {
                      color: '#fff'
                    }
                  }
                }}
                size="small"
              >
                <ChevronRightIcon sx={{ color: page * rowsPerPage >= total ? 'text.disabled' : 'primary.main' }} />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default PaymentStatus; 
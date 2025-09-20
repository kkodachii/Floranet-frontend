import React, { useEffect, useState, useCallback } from 'react';
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
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTheme } from '@mui/material/styles';
import FloraTable from '../../../components/FloraTable';
import apiService from '../../../services/api';

function PaymentStatus() {
  const [residents, setResidents] = useState([]);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedStreet, setSelectedStreet] = useState('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResidents, setTotalResidents] = useState(0);
  const rowsPerPage = 10;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  useEffect(() => {
    const loadResidents = async () => {
      try {
        if (page === 1) {
          setSearchLoading(true);
        } else {
          setLoading(true);
        }
        setError(null);
        
        // Load residents with pagination
        const residentsData = await apiService.getResidents(page, search, { per_page: rowsPerPage });
        
        if (!residentsData.success) {
          throw new Error('Failed to load residents');
        }
        
        // Transform the data to include payment status information
        const transformedResidents = (residentsData.data || []).map(resident => {
          // Calculate payment status based on monthly dues
          const currentYear = new Date().getFullYear();
          const currentMonth = new Date().getMonth() + 1;
          
          // For now, we'll set a default status - in a real app you'd fetch monthly dues
          let paymentStatus = 'Paid';
          let outstandingBalance = 0;
          let lastPayment = null;
          
          // You can enhance this by fetching monthly dues for each resident
          // const monthlyDues = await apiService.getResidentMonthlyDueHistory(resident.id, currentYear);
          
          return {
            id: resident.id,
            street: resident.house?.street || 'N/A',
            blockLot: resident.house?.house_number || 'N/A',
            homeownerName: resident.house_owner_name || resident.name,
            residentName: resident.name,
            residentId: resident.resident_id || resident.id,
            contactNumber: resident.contact_no || 'N/A',
            email: resident.email || 'N/A',
            monthlyDue: 200, // Default amount from your backend
            lastPayment: lastPayment || 'N/A',
            paymentStatus: paymentStatus,
            outstandingBalance: outstandingBalance,
          };
        });

        setResidents(transformedResidents);
        setTotalResidents(residentsData.pagination?.total || transformedResidents.length);
      } catch (error) {
        console.error('Error loading residents:', error);
        setError('Failed to load residents. Please try again.');
      } finally {
        setLoading(false);
        setSearchLoading(false);
      }
    };

    loadResidents();
  }, [page, search]);

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId;
      return (value) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setSearch(value);
        }, 500); // 500ms delay
      };
    })(),
    []
  );

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearch('');
  };
  
  const handleStreetChange = (e) => setSelectedStreet(e.target.value);

  // Reset page when search or street filter changes
  useEffect(() => {
    setPage(1);
  }, [search, selectedStreet]);

  // Get unique streets for dropdown
  const hardcodedStreets = [
    'Adelfa',
    'Bougainvillea',
    'Camia',
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
  const uniqueStreets = ['all', ...hardcodedStreets];

  // Filter residents based on street selection (search is handled by server)
  const filteredResidents = residents.filter((resident) => {
    const matchesStreet = selectedStreet === 'all' || resident.street === selectedStreet;
    return matchesStreet;
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
  const total = totalResidents;
  const from = total === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const to = Math.min(page * rowsPerPage, total);
  const totalPages = Math.ceil(total / rowsPerPage);

  // Table max height
  const tableMaxHeight = isMobile ? '40vh' : '60vh';

  if (loading) {
    return (
      <Box sx={{ p: { xs: 0.5, sm: 1 } }}>
        <Box maxWidth="xl" mx="auto">
          <Paper elevation={3} sx={{ borderRadius: 1, overflow: 'hidden', p: { xs: 0.5, sm: 1 }, boxShadow: 3, minHeight: 300 }}>
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
        </Box>
      </Box>
    );
  }

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
                placeholder="Search by street, resident name, homeowner, or resident ID..."
                value={searchInput}
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
                  endAdornment: search && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={handleClearSearch}
                        sx={{ p: 0 }}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
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
          
          {/* Active filters and search summary */}
          {(search || selectedStreet !== 'all') && (
            <Box sx={{ px: 1, py: 0.5, mb: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {search && `Search: "${search}"`}
                {search && selectedStreet !== 'all' && ' | '}
                {selectedStreet !== 'all' && `Street: ${selectedStreet}`}
              </Typography>
            </Box>
          )}
          
          <FloraTable
            columns={columns}
            rows={filteredResidents}
            actions={actions}
            page={1}
            rowsPerPage={rowsPerPage}
            maxHeight={tableMaxHeight}
            emptyMessage="No residents found."
            loading={loading || searchLoading}
            disableInternalPagination={true}
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
                disabled={page <= 1}
                sx={{
                  border: '1.5px solid',
                  borderColor: page <= 1 ? 'divider' : 'primary.main',
                  borderRadius: 2,
                  mx: 0.5,
                  bgcolor: 'background.paper',
                  color: page <= 1 ? 'text.disabled' : 'primary.main',
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
                <ChevronLeftIcon sx={{ color: page <= 1 ? 'text.disabled' : 'primary.main' }} />
              </IconButton>
              <IconButton
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
                sx={{
                  border: '1.5px solid',
                  borderColor: page >= totalPages ? 'divider' : 'primary.main',
                  borderRadius: 2,
                  mx: 0.5,
                  bgcolor: 'background.paper',
                  color: page >= totalPages ? 'text.disabled' : 'primary.main',
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
                <ChevronRightIcon sx={{ color: page >= totalPages ? 'text.disabled' : 'primary.main' }} />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default PaymentStatus; 
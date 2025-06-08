import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Stack,
  Tooltip,
  InputAdornment,
  IconButton,
  useMediaQuery
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import PeopleIcon from '@mui/icons-material/People';
import Badge from '@mui/material/Badge';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SearchIcon from '@mui/icons-material/Search';
import FloraTable from '../../../components/FloraTable';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

// Mock API fetch
const fetchUsers = () =>
  Promise.resolve([
    {
      homeownerName: 'Juan Dela Cruz',
      residentName: 'Andrea Dela Cruz',
      residentId: 'MHH0001',
      houseNumber: 'B3A - L23',
      street: 'Camia',
      businessName: 'Cruz Sari-Sari Store',
      contactNumber: '09171234567',
    },
    {
      homeownerName: 'Maria Santos',
      residentName: 'Luis Santos',
      residentId: 'MHH0002',
      houseNumber: 'B1B - L17',
      street: 'Bouganvilla',
      businessName: "Maria's Laundry Hub",
      contactNumber: '09281234567',
    },
    {
      homeownerName: 'Jose Rizal',
      residentName: 'Lea Rizal',
      residentId: 'MHH0003',
      houseNumber: 'B4C - L09',
      street: 'Dahlia',
      businessName: 'Rizal Tailoring',
      contactNumber: '09171234568',
    },
    {
      homeownerName: 'Ana Mendoza',
      residentName: 'Marco Mendoza',
      residentId: 'MHH0004',
      houseNumber: 'B2A - L12',
      street: 'Champaca',
      businessName: "Ana's Flower Shop",
      contactNumber: '09351234567',
    },
    {
      homeownerName: 'Lito Garcia',
      residentName: 'Nina Garcia',
      residentId: 'MHH0005',
      houseNumber: 'B5D - L02',
      street: 'Sampaguita',
      businessName: 'Garcia Car Wash',
      contactNumber: '09291234567',
    },
    {
      homeownerName: 'Elena Reyes',
      residentName: 'Paolo Reyes',
      residentId: 'MHH0006',
      houseNumber: 'B4C - L08',
      street: 'Adelfa',
      businessName: 'Reyes Eatery',
      contactNumber: '09181234567',
    },
    {
      homeownerName: 'Mario Aquino',
      residentName: 'Anna Aquino',
      residentId: 'MHH0007',
      houseNumber: 'B3B - L33',
      street: 'Dahlia',
      businessName: 'Aquino Hardware',
      contactNumber: '09081234567',
    },
    {
      homeownerName: 'Cristina Lopez',
      residentName: 'Enzo Lopez',
      residentId: 'MHH0008',
      houseNumber: 'B2D - L16',
      street: 'Gumamela',
      businessName: 'Lopez Salon',
      contactNumber: '09061234567',
    },
    {
      homeownerName: 'Andres Bonifacio',
      residentName: 'Lara Bonifacio',
      residentId: 'MHH0009',
      houseNumber: 'B4C - L01',
      street: 'Santan',
      businessName: 'Bonifacio Printing',
      contactNumber: '09191234567',
    },
    {
      homeownerName: 'Jenny Lim',
      residentName: 'Kevin Lim',
      residentId: 'MHH0010',
      houseNumber: 'B5B - L05',
      street: 'Jasmine',
      businessName: "Lim's Milk Tea",
      contactNumber: '09209234567',
    },
    {
      homeownerName: 'Ramon Torres',
      residentName: 'Julia Torres',
      residentId: 'MHH0011',
      houseNumber: 'B1A - L11',
      street: 'Ilang-ilang',
      businessName: 'Torres Motor Parts',
      contactNumber: '09300234567',
    },
    {
      homeownerName: 'Grace David',
      residentName: 'Leo David',
      residentId: 'MHH0012',
      houseNumber: 'B2C - L19',
      street: 'Rosal',
      businessName: "Grace's Bakehouse",
      contactNumber: '09331234567',
    },
    {
      homeownerName: 'Fernando Cruz',
      residentName: 'Jasmine Cruz',
      residentId: 'MHH0013',
      houseNumber: 'B3B - L29',
      street: 'Kalachuchi',
      businessName: 'Cruz Barbershop',
      contactNumber: '09101122334',
    },
    {
      homeownerName: 'Isabel Navarro',
      residentName: 'Anton Navarro',
      residentId: 'MHH0014',
      houseNumber: 'B4B - L13',
      street: 'Camia',
      businessName: 'Navarro Internet Cafe',
      contactNumber: '09221122334',
    },
    {
      homeownerName: 'Roberto Ramos',
      residentName: 'Bianca Ramos',
      residentId: 'MHH0015',
      houseNumber: 'B5C - L07',
      street: 'Bouganvilla',
      businessName: 'Ramos General Merchandise',
      contactNumber: '09351122334',
    },
  ]);

// Mock request data
const fetchRequests = () =>
  Promise.resolve([
    {
      id: 'VREQ001',
      homeownerName: 'Juan Dela Cruz',
      residentName: 'Andrea Dela Cruz',
      residentId: 'MHH0001',
      houseNumber: 'B3A - L23',
      street: 'Camia',
      businessName: 'Cruz Sari-Sari Store',
      requestType: 'New Vendor Registration',
      status: 'pending',
      dateSubmitted: '2024-03-15',
    },
    {
      id: 'VREQ002',
      homeownerName: 'Maria Santos',
      residentName: 'Luis Santos',
      residentId: 'MHH0002',
      houseNumber: 'B1B - L17',
      street: 'Bouganvilla',
      businessName: "Maria's Laundry Hub",
      requestType: 'Update Business Information',
      status: 'pending',
      dateSubmitted: '2024-03-14',
    },
    {
      id: 'VREQ003',
      homeownerName: 'Jose Rizal',
      residentName: 'Lea Rizal',
      residentId: 'MHH0003',
      houseNumber: 'B4C - L09',
      street: 'Dahlia',
      businessName: 'Rizal Tailoring',
      requestType: 'New Vendor Registration',
      status: 'pending',
      dateSubmitted: '2024-03-13',
    },
    {
      id: 'VREQ004',
      homeownerName: 'Ana Mendoza',
      residentName: 'Marco Mendoza',
      residentId: 'MHH0004',
      houseNumber: 'B2A - L12',
      street: 'Champaca',
      businessName: "Ana's Flower Shop",
      requestType: 'Update Business Information',
      status: 'pending',
      dateSubmitted: '2024-03-12',
    },
    {
      id: 'VREQ005',
      homeownerName: 'Lito Garcia',
      residentName: 'Nina Garcia',
      residentId: 'MHH0005',
      houseNumber: 'B5D - L02',
      street: 'Sampaguita',
      businessName: 'Garcia Car Wash',
      requestType: 'New Vendor Registration',
      status: 'pending',
      dateSubmitted: '2024-03-11',
    },
  ]);

function Vendors() {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showRequests, setShowRequests] = useState(false);
  const rowsPerPage = 9;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    Promise.all([fetchUsers(), fetchRequests()]).then(([usersData, requestsData]) => {
      setUsers(usersData);
      setRequests(requestsData);
      setLoading(false);
    });
  }, []);

  const handleSearch = (e) => setSearch(e.target.value);

  const filteredData = showRequests ? requests : users;
  const filteredItems = filteredData.filter(
    (item) =>
      Object.values(item)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  // Actions for each row
  const actions = showRequests ? [
    {
      label: 'Accept',
      icon: <CheckIcon fontSize="small" />,
      color: 'success',
      sx: { '&:hover': { bgcolor: 'success.main', color: '#fff' } },
      onClick: (row) => {
        // Handle accept request
        console.log('Accept request:', row);
      },
    },
    {
      label: 'Reject',
      icon: <CloseIcon fontSize="small" />,
      color: 'error',
      sx: { '&:hover': { bgcolor: 'error.main', color: '#fff' } },
      onClick: (row) => {
        // Handle reject request
        console.log('Reject request:', row);
      },
    },
  ] : [
    {
      label: 'Edit',
      icon: <EditIcon fontSize="small" />,
      color: 'default',
      sx: { '&:hover': { bgcolor: 'primary.main', color: '#fff' } },
      onClick: (row) => {/* handle edit */},
    },
    {
      label: 'Delete',
      icon: <DeleteIcon fontSize="small" />,
      color: 'error',
      sx: { '&:hover': { bgcolor: 'error.main', color: '#fff' } },
      onClick: (row) => {/* handle delete */},
    },
  ];

  const columns = showRequests ? [
    { id: 'homeownerName', label: 'Homeowner Name' },
    { id: 'residentName', label: 'Resident Name' },
    { id: 'residentId', label: 'Resident ID' },
    { id: 'houseNumber', label: 'House Number' },
    { id: 'street', label: 'Street' },
    { id: 'businessName', label: 'Business Name' },
    { id: 'requestType', label: 'Request Type' },
    { id: 'dateSubmitted', label: 'Date Submitted' },
  ] : [
    { id: 'homeownerName', label: 'Homeowner Name' },
    { id: 'residentName', label: 'Resident Name' },
    { id: 'residentId', label: 'Resident ID' },
    { id: 'houseNumber', label: 'House Number' },
    { id: 'street', label: 'Street' },
    { id: 'businessName', label: 'Business Name' },
    { id: 'contactNumber', label: 'Contact Number' },
  ];

  // Pagination logic
  const total = filteredItems.length;
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
            <TextField
              variant="outlined"
              size="small"
              placeholder={`Search ${showRequests ? 'requests' : 'vendors'}...`}
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
            <Stack direction="row" spacing={1} sx={{ width: { xs: '100%', sm: 'auto' } }}>
              {!showRequests && (
                <Tooltip title="Add Vendor">
                  <IconButton color="primary" size="small" sx={{ '&:hover': { bgcolor: 'primary.main', color: '#fff' } }}>
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Filter">
                <IconButton color="default" size="small" sx={{ '&:hover': { bgcolor: 'primary.main', color: '#fff' } }}>
                  <FilterListIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title={showRequests ? "Show Vendors" : "Show Requests"}>
                <Badge 
                  color="error" 
                  variant="dot" 
                  overlap="circular" 
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  invisible={!showRequests || requests.length === 0}
                >
                  <IconButton 
                    color={showRequests ? "primary" : "default"} 
                    size="small" 
                    onClick={() => setShowRequests(!showRequests)}
                    sx={{ '&:hover': { bgcolor: 'primary.main', color: '#fff' } }}
                  >
                    {showRequests ? <PeopleIcon fontSize="small" /> : <MarkEmailUnreadIcon fontSize="small" />}
                  </IconButton>
                </Badge>
              </Tooltip>
            </Stack>
          </Box>
          <FloraTable
            columns={columns}
            rows={filteredItems}
            actions={actions}
            page={page}
            rowsPerPage={rowsPerPage}
            maxHeight={tableMaxHeight}
            emptyMessage={`No ${showRequests ? 'requests' : 'vendors'} found.`}
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

export default Vendors; 
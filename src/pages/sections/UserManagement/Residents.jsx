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
import FilterPopover from '../../../components/FilterPopover';

// Mock API fetch
const fetchUsers = () =>
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

// Mock request data
const fetchRequests = () =>
  Promise.resolve([
    {
      id: 'REQ001',
      homeownerName: 'Juan Dela Cruz',
      residentName: 'Carlos Dela Cruz',
      residentId: 'MHH0001',
      houseNumber: 'B3A - L23',
      street: 'Camia',
      requestType: 'New Resident Registration',
      status: 'pending',
      dateSubmitted: '2024-03-15',
    },
    {
      id: 'REQ002',
      homeownerName: 'Maria Santos',
      residentName: 'Anna Santos',
      residentId: 'MHH0002',
      houseNumber: 'B1B - L17',
      street: 'Bouganvilla',
      requestType: 'Update Contact Information',
      status: 'pending',
      dateSubmitted: '2024-03-14',
    },
    {
      id: 'REQ003',
      homeownerName: 'Jose Rizal',
      residentName: 'Emilio Rizal',
      residentId: 'MHH0003',
      houseNumber: 'B4C - L09',
      street: 'Dahlia',
      requestType: 'New Resident Registration',
      status: 'pending',
      dateSubmitted: '2024-03-13',
    },
    {
      id: 'REQ004',
      homeownerName: 'Ana Mendoza',
      residentName: 'Patricia Mendoza',
      residentId: 'MHH0004',
      houseNumber: 'B2A - L12',
      street: 'Champaca',
      requestType: 'Update Contact Information',
      status: 'pending',
      dateSubmitted: '2024-03-12',
    },
    {
      id: 'REQ005',
      homeownerName: 'Lito Garcia',
      residentName: 'Michael Garcia',
      residentId: 'MHH0005',
      houseNumber: 'B5D - L02',
      street: 'Sampaguita',
      requestType: 'New Resident Registration',
      status: 'pending',
      dateSubmitted: '2024-03-11',
    },
  ]);

function Residents() {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showRequests, setShowRequests] = useState(false);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [filterValues, setFilterValues] = useState({ status: '', street: '' });
  const rowsPerPage = 9;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([fetchUsers(), fetchRequests()]).then(([usersData, requestsData]) => {
      setUsers(usersData);
      setRequests(requestsData);
      setLoading(false);
    });
  }, []);

  const handleSearch = (e) => setSearch(e.target.value);

  // Demo: status options for requests only
  const statusOptions = ['pending'];
  const streetOptions = Array.from(new Set((showRequests ? requests : users).map(u => u.street))).filter(Boolean);
  const homeownerOptions = Array.from(new Set((showRequests ? requests : users).map(u => u.homeownerName))).filter(Boolean);
  const residentOptions = Array.from(new Set((showRequests ? requests : users).map(u => u.residentName))).filter(Boolean);
  const houseNumberOptions = Array.from(new Set((showRequests ? requests : users).map(u => u.houseNumber))).filter(Boolean);
  const contactOptions = Array.from(new Set((showRequests ? requests : users).map(u => u.contactNumber))).filter(Boolean);
  const emailOptions = Array.from(new Set(users.map(u => u.email))).filter(Boolean);

  const handleFilterOpen = (e) => setFilterAnchorEl(e.currentTarget);
  const handleFilterClose = () => setFilterAnchorEl(null);
  const handleFilterChange = (name, value) => setFilterValues(f => ({ ...f, [name]: value }));
  const handleFilterReset = () => setFilterValues({ status: '', street: '' });
  const handleFilterApply = () => handleFilterClose();

  const filteredData = showRequests ? requests : users;
  const filteredItems = filteredData.filter(
    (item) => {
      const matchesSearch = Object.values(item)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus = !showRequests || !filterValues.status || (item.status === filterValues.status);
      const matchesStreet = !filterValues.street || (item.street === filterValues.street);
      const matchesHomeowner = !filterValues.homeownerName || (item.homeownerName === filterValues.homeownerName);
      const matchesResident = !filterValues.residentName || (item.residentName === filterValues.residentName);
      const matchesHouseNumber = !filterValues.houseNumber || (item.houseNumber === filterValues.houseNumber);
      const matchesContact = !filterValues.contactNumber || (item.contactNumber === filterValues.contactNumber);
      const matchesEmail = !filterValues.email || (item.email === filterValues.email);
      return matchesSearch && matchesStatus && matchesStreet && matchesHomeowner && matchesResident && matchesHouseNumber && matchesContact && matchesEmail;
    }
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
      onClick: (row) => navigate(`/user-management/edit-resident/${row.residentId}`),
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
    { id: 'requestType', label: 'Request Type' },
    { id: 'dateSubmitted', label: 'Date Submitted' },
  ] : [
    { id: 'homeownerName', label: 'Homeowner Name' },
    { id: 'residentName', label: 'Resident Name' },
    { id: 'residentId', label: 'Resident ID' },
    { id: 'houseNumber', label: 'House Number' },
    { id: 'street', label: 'Street' },
    { id: 'contactNumber', label: 'Contact Number' },
    { id: 'email', label: 'Email Address' },
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
              placeholder={`Search ${showRequests ? 'requests' : 'users'}...`}
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
                <Tooltip title="Add User">
                  <IconButton 
                    color="primary" 
                    size="small" 
                    onClick={() => navigate('/user-management/add-resident')}
                    sx={{ '&:hover': { bgcolor: 'primary.main', color: '#fff' } }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Filter">
                <IconButton color="default" size="small" sx={{ '&:hover': { bgcolor: 'primary.main', color: '#fff' } }} onClick={handleFilterOpen}>
                  <FilterListIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <FilterPopover
                open={Boolean(filterAnchorEl)}
                anchorEl={filterAnchorEl}
                onClose={handleFilterClose}
                fields={[
                  ...(showRequests ? [{ name: 'status', label: 'Status', type: 'select', options: statusOptions }] : []),
                  { name: 'street', label: 'Street', type: 'select', options: streetOptions },
                  { name: 'homeownerName', label: 'Homeowner Name', type: 'select', options: homeownerOptions },
                  { name: 'residentName', label: 'Resident Name', type: 'select', options: residentOptions },
                  { name: 'houseNumber', label: 'House Number', type: 'select', options: houseNumberOptions },
                  { name: 'contactNumber', label: 'Contact Number', type: 'select', options: contactOptions },
                  ...(!showRequests ? [{ name: 'email', label: 'Email', type: 'select', options: emailOptions }] : []),
                ]}
                values={filterValues}
                onChange={handleFilterChange}
                onApply={handleFilterApply}
                onReset={handleFilterReset}
              />
              <Tooltip title={showRequests ? "Show Users" : "Show Requests"}>
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
            emptyMessage={`No ${showRequests ? 'requests' : 'users'} found.`}
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

export default Residents; 
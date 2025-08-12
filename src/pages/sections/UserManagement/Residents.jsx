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
import apiService from '../../../services/api';

function Residents() {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showRequests, setShowRequests] = useState(false);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [filterValues, setFilterValues] = useState({ status: '', street: '' });
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 9,
    total: 0,
    from: 0,
    to: 0
  });
  const rowsPerPage = 9;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const fetchData = async (pageNum = 1, isRequest = false) => {
    try {
      setLoading(true);
      if (isRequest) {
        const response = await apiService.getResidentRequests(pageNum);
        setRequests(response.data || []);
        setPagination(response.pagination || {});
      } else {
        const response = await apiService.getResidents(pageNum);
        setUsers(response.data || []);
        setPagination(response.pagination || {});
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set empty data on error
      if (isRequest) {
        setRequests([]);
      } else {
        setUsers([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, showRequests);
  }, [showRequests]);

  useEffect(() => {
    fetchData(page, showRequests);
  }, [page, showRequests]);

  const handleSearch = (e) => setSearch(e.target.value);

  // Get filter options from current data
  const currentData = showRequests ? requests : users;
  const statusOptions = ['pending'];
  const streetOptions = Array.from(new Set(currentData.map(u => u.house?.street || u.street))).filter(Boolean);
  const homeownerOptions = Array.from(new Set(currentData.map(u => u.house_owner_name || u.homeownerName))).filter(Boolean);
  const residentOptions = Array.from(new Set(currentData.map(u => u.name || u.residentName))).filter(Boolean);
  const houseNumberOptions = Array.from(new Set(currentData.map(u => u.house?.house_number || u.houseNumber))).filter(Boolean);
  const contactOptions = Array.from(new Set(currentData.map(u => u.contact_no || u.contactNumber))).filter(Boolean);
  const emailOptions = Array.from(new Set(currentData.map(u => u.email))).filter(Boolean);

  const handleFilterOpen = (e) => setFilterAnchorEl(e.currentTarget);
  const handleFilterClose = () => setFilterAnchorEl(null);
  const handleFilterChange = (name, value) => setFilterValues(f => ({ ...f, [name]: value }));
  const handleFilterReset = () => setFilterValues({ status: '', street: '' });
  const handleFilterApply = () => handleFilterClose();

  // Transform backend data to match frontend expectations
  const transformData = (data) => {
    return data.map(item => ({
      id: item.id,
      homeownerName: item.house_owner_name || 'N/A',
      residentName: item.name || 'N/A',
      residentId: item.resident_id || 'N/A',
      houseNumber: item.house?.house_number || 'N/A',
      street: item.house?.street || 'N/A',
      contactNumber: item.contact_no || 'N/A',
      email: item.email || 'N/A',
      requestType: item.request_type || 'New Resident Registration',
      status: item.status || 'pending',
      dateSubmitted: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A',
      // Keep original data for actions
      originalData: item
    }));
  };

  const filteredData = showRequests ? requests : users;
  const transformedData = transformData(filteredData);

  // Actions for each row
  const actions = showRequests ? [
    {
      label: 'Accept',
      icon: <CheckIcon fontSize="small" />,
      color: 'success',
      sx: { '&:hover': { bgcolor: 'success.main', color: '#fff' } },
      onClick: (row) => {
        // Handle accept request
        console.log('Accept request:', row.originalData);
        // TODO: Implement accept logic
      },
    },
    {
      label: 'Reject',
      icon: <CloseIcon fontSize="small" />,
      color: 'error',
      sx: { '&:hover': { bgcolor: 'error.main', color: '#fff' } },
      onClick: (row) => {
        // Handle reject request
        console.log('Reject request:', row.originalData);
        // TODO: Implement reject logic
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
      onClick: (row) => {
        // Handle delete
        console.log('Delete user:', row.originalData);
        // TODO: Implement delete logic
      },
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

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

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
                    onClick={() => {
                      setShowRequests(!showRequests);
                      setPage(1); // Reset to first page when switching views
                    }}
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
            rows={transformedData}
            actions={actions}
            page={page}
            rowsPerPage={rowsPerPage}
            maxHeight={tableMaxHeight}
            emptyMessage={`No ${showRequests ? 'requests' : 'users'} found.`}
            loading={loading}
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
              {pagination.total === 0 ? '0 of 0' : `${pagination.from}–${pagination.to} of ${pagination.total}`}
            </Typography>
            <Box width="100%" display="flex" justifyContent={{ xs: 'center', md: 'flex-end' }}>
              <IconButton
                onClick={() => handlePageChange(page - 1)}
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
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= pagination.last_page}
                sx={{
                  border: '1.5px solid',
                  borderColor: page >= pagination.last_page ? 'divider' : 'primary.main',
                  borderRadius: 2,
                  mx: 0.5,
                  bgcolor: 'background.paper',
                  color: page >= pagination.last_page ? 'text.disabled' : 'primary.main',
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
                <ChevronRightIcon sx={{ color: page >= pagination.last_page ? 'text.disabled' : 'primary.main' }} />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default Residents; 
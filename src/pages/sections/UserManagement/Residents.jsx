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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import PeopleIcon from '@mui/icons-material/People';
import ArchiveIcon from '@mui/icons-material/Archive';
import Badge from '@mui/material/Badge';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import { useTheme } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FloraTable from '../../../components/FloraTable';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import FilterPopover from '../../../components/FilterPopover';
import apiService from '../../../services/api';

function Residents() {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [archivedUsers, setArchivedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [filterValues, setFilterValues] = useState({ 
    status: '', 
    street: '', 
    homeownerName: '', 
    residentName: '', 
    houseNumber: '', 
    contactNumber: '', 
    email: '' 
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 9,
    total: 0,
    from: 0,
    to: 0
  });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: '', data: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const rowsPerPage = 9;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const fetchData = async (pageNum = 1, viewType = 'users') => {
    try {
      if (pageNum === 1) {
        setSearchLoading(true);
      } else {
        setLoading(true);
      }
      if (viewType === 'requests') {
        const response = await apiService.getResidentRequests(pageNum, search, filterValues);
        setRequests(response.data || []);
        setPagination(response.pagination || {});
      } else if (viewType === 'archived') {
        const response = await apiService.getArchivedResidents(pageNum, search, filterValues);
        setArchivedUsers(response.data || []);
        setPagination(response.pagination || {});
      } else {
        const response = await apiService.getResidents(pageNum, search, filterValues);
        setUsers(response.data || []);
        setPagination(response.pagination || {});
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set empty data on error
      if (viewType === 'requests') {
        setRequests([]);
      } else if (viewType === 'archived') {
        setArchivedUsers([]);
      } else {
        setUsers([]);
      }
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const handleAccept = async (resident) => {
    try {
      await apiService.acceptResidentRequest(resident.originalData.id);
      setSnackbar({ open: true, message: 'Resident request accepted successfully', severity: 'success' });
      
      // Remove the accepted request from the current requests list
      setRequests(prevRequests => 
        prevRequests.filter(req => req.id !== resident.originalData.id)
      );
      
      // Update pagination if needed
      if (pagination.total > 0) {
        setPagination(prev => ({
          ...prev,
          total: prev.total - 1,
          to: Math.max(prev.from, prev.to - 1)
        }));
      }
      
      // If we're on a page that might be empty now, go to previous page
      if (requests.length === 1 && page > 1) {
        setPage(page - 1);
      }
    } catch (error) {
      console.error('Error accepting resident request:', error);
      setSnackbar({ open: true, message: error.message || 'Failed to accept resident request', severity: 'error' });
    }
  };

  const handleDelete = async (resident) => {
    try {
      await apiService.deleteResidentRequest(resident.originalData.id);
      setSnackbar({ open: true, message: 'Resident request deleted successfully', severity: 'success' });
      
      // Remove the deleted request from the current requests list
      setRequests(prevRequests => 
        prevRequests.filter(req => req.id !== resident.originalData.id)
      );
      
      // Update pagination if needed
      if (pagination.total > 0) {
        setPagination(prev => ({
          ...prev,
          total: prev.total - 1,
          to: Math.max(prev.from, prev.to - 1)
        }));
      }
      
      // If we're on a page that might be empty now, go to previous page
      if (requests.length === 1 && page > 1) {
        setPage(page - 1);
      }
    } catch (error) {
      console.error('Error deleting resident request:', error);
      setSnackbar({ open: true, message: error.message || 'Failed to delete resident request', severity: 'error' });
    }
  };

  const handleArchive = async (resident) => {
    try {
      await apiService.archiveResident(resident.originalData.resident_id);
      setSnackbar({ open: true, message: 'Resident archived successfully', severity: 'success' });
      // Refresh the data
      fetchData(page, getCurrentViewType());
    } catch (error) {
      console.error('Error archiving resident:', error);
      setSnackbar({ open: true, message: error.message || 'Failed to archive resident', severity: 'error' });
    }
  };

  const handleUnarchive = async (resident) => {
    try {
      await apiService.unarchiveResident(resident.originalData.resident_id);
      setSnackbar({ open: true, message: 'Resident unarchived successfully', severity: 'success' });
      // Refresh the data
      fetchData(page, getCurrentViewType());
    } catch (error) {
      console.error('Error unarchiving resident:', error);
      setSnackbar({ open: true, message: error.message || 'Failed to unarchive resident', severity: 'error' });
    }
  };

  const getCurrentViewType = () => {
    if (showRequests) return 'requests';
    if (showArchived) return 'archived';
    return 'users';
  };

  const handleConfirmAction = () => {
    if (confirmDialog.type === 'accept') {
      handleAccept(confirmDialog.data);
    } else if (confirmDialog.type === 'delete') {
      handleDelete(confirmDialog.data);
    } else if (confirmDialog.type === 'archive') {
      handleArchive(confirmDialog.data);
    } else if (confirmDialog.type === 'unarchive') {
      handleUnarchive(confirmDialog.data);
    }
    setConfirmDialog({ open: false, type: '', data: null });
  };

  useEffect(() => {
    fetchData(1, getCurrentViewType());
  }, [showRequests, showArchived]);

  useEffect(() => {
    fetchData(page, getCurrentViewType());
  }, [page, showRequests, showArchived]);

  // Add effect to handle search and filter changes
  useEffect(() => {
    setPage(1); // Reset to first page when search or filters change
    fetchData(1, getCurrentViewType());
  }, [search, filterValues]);

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

  // Get filter options from current data
  const currentData = showRequests ? requests : showArchived ? archivedUsers : users;
  const statusOptions = ['pending'];
  // Hardcoded street options as requested
  const streetOptions = [
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
  const homeownerOptions = Array.from(new Set(currentData.map(u => u.house_owner_name || u.homeownerName))).filter(Boolean);
  const residentOptions = Array.from(new Set(currentData.map(u => u.name || u.residentName))).filter(Boolean);
  const houseNumberOptions = Array.from(new Set(currentData.map(u => u.house?.house_number || u.houseNumber))).filter(Boolean);
  const contactOptions = Array.from(new Set(currentData.map(u => u.contact_no || u.contactNumber))).filter(Boolean);
  const emailOptions = Array.from(new Set(currentData.map(u => u.email))).filter(Boolean);

  // Check if any filters are active
  const hasActiveFilters = Object.values(filterValues).some(value => value && value !== '');

  const handleFilterOpen = (e) => setFilterAnchorEl(e.currentTarget);
  const handleFilterClose = () => setFilterAnchorEl(null);
  const handleFilterChange = (name, value) => setFilterValues(f => ({ ...f, [name]: value }));
  const handleFilterReset = () => {
    setFilterValues({ status: '', street: '', homeownerName: '', residentName: '', houseNumber: '', contactNumber: '', email: '' });
    // The useEffect will handle the data fetching when filterValues changes
  };
  const handleFilterApply = () => {
    handleFilterClose();
    // The useEffect will handle the data fetching when filterValues changes
  };

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
      dateArchived: item.updated_at ? new Date(item.updated_at).toLocaleDateString() : 'N/A',
      // Keep original data for actions
      originalData: item
    }));
  };

  const filteredData = showRequests ? requests : showArchived ? archivedUsers : users;
  const transformedData = transformData(filteredData);

  // Actions for each row
  const actions = showRequests ? [
    {
      label: 'Accept',
      icon: <CheckIcon fontSize="small" />,
      color: 'success',
      sx: { '&:hover': { bgcolor: 'success.main', color: '#fff' } },
      onClick: (row) => {
        setConfirmDialog({ 
          open: true, 
          type: 'accept', 
          data: row 
        });
      },
    },
    {
      label: 'Reject',
      icon: <CloseIcon fontSize="small" />,
      color: 'error',
      sx: { 
        color: 'error.main',
        '&:hover': { bgcolor: 'error.main', color: '#fff' } 
      },
      onClick: (row) => {
        setConfirmDialog({ 
          open: true, 
          type: 'delete', 
          data: row 
        });
      },
    },
  ] : showArchived ? [
    {
      label: 'Unarchive',
      icon: <RestoreIcon fontSize="small" />,
      color: 'success',
      sx: { 
        color: 'success.main',
        '&:hover': { bgcolor: 'success.main', color: '#fff' } 
      },
      onClick: (row) => {
        setConfirmDialog({ 
          open: true, 
          type: 'unarchive', 
          data: row 
        });
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
      label: 'Archive',
      icon: <DeleteIcon fontSize="small" />,
      color: 'error',
      sx: { 
        color: 'error.main',
        '&:hover': { bgcolor: 'error.main', color: '#fff' } 
      },
      onClick: (row) => {
        setConfirmDialog({ 
          open: true, 
          type: 'archive', 
          data: row 
        });
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
  ] : showArchived ? [
    { id: 'homeownerName', label: 'Homeowner Name' },
    { id: 'residentName', label: 'Resident Name' },
    { id: 'residentId', label: 'Resident ID' },
    { id: 'houseNumber', label: 'House Number' },
    { id: 'street', label: 'Street' },
    { id: 'contactNumber', label: 'Contact Number' },
    { id: 'email', label: 'Email Address' },
    { id: 'dateArchived', label: 'Date Archived' },
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
              placeholder={`Search ${showRequests ? 'requests' : showArchived ? 'archived users' : 'users'}...`}
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
                endAdornment: searchInput && (
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
                <IconButton 
                  color={hasActiveFilters ? "primary" : "default"} 
                  size="small" 
                  sx={{ 
                    '&:hover': { bgcolor: 'primary.main', color: '#fff' },
                    ...(hasActiveFilters && { bgcolor: 'primary.main', color: '#fff' })
                  }} 
                  onClick={handleFilterOpen}
                >
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
                      setShowArchived(false);
                      setPage(1); // Reset to first page when switching views
                    }}
                    sx={{ '&:hover': { bgcolor: 'primary.main', color: '#fff' } }}
                  >
                    {showRequests ? <PeopleIcon fontSize="small" /> : <MarkEmailUnreadIcon fontSize="small" />}
                  </IconButton>
                </Badge>
              </Tooltip>
              <Tooltip title={showArchived ? "Show Users" : "Show Archived"}>
                <IconButton 
                  color={showArchived ? "primary" : "default"} 
                  size="small" 
                  onClick={() => {
                    setShowArchived(!showArchived);
                    setShowRequests(false);
                    setPage(1); // Reset to first page when switching views
                  }}
                  sx={{ '&:hover': { bgcolor: 'primary.main', color: '#fff' } }}
                >
                  <ArchiveIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
                    </Box>
          
          {/* Active filters and search summary */}
          {(search || hasActiveFilters) && (
            <Box sx={{ px: 1, py: 0.5, mb: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {search && `Search: "${search}"`}
                {search && hasActiveFilters && ' | '}
                {hasActiveFilters && `Filters: ${Object.entries(filterValues)
                  .filter(([key, value]) => value && value !== '')
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(', ')}`}
              </Typography>
            </Box>
          )}
          
          <FloraTable
              columns={columns}
              rows={transformedData}
              actions={actions}
              page={page}
              rowsPerPage={rowsPerPage}
              maxHeight={tableMaxHeight}
              emptyMessage={`No ${showRequests ? 'requests' : showArchived ? 'archived users' : 'users'} found.`}
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

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, type: '', data: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {confirmDialog.type === 'accept' ? 'Accept Resident Request' : 
           confirmDialog.type === 'archive' ? 'Archive Resident' : 
           confirmDialog.type === 'unarchive' ? 'Unarchive Resident' : 'Delete Resident Request'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {confirmDialog.type === 'accept' 
              ? `Are you sure you want to accept the resident request for ${confirmDialog.data?.residentName || 'this resident'}?`
              : confirmDialog.type === 'archive'
              ? `Are you sure you want to archive ${confirmDialog.data?.residentName || 'this resident'}? This will remove them from the active residents list.`
              : confirmDialog.type === 'unarchive'
              ? `Are you sure you want to unarchive ${confirmDialog.data?.residentName || 'this resident'}? This will restore them to the active residents list.`
              : `Are you sure you want to delete the resident request for ${confirmDialog.data?.residentName || 'this resident'}? This action cannot be undone.`
            }
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setConfirmDialog({ open: false, type: '', data: null })}
            color="inherit"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmAction}
            color={confirmDialog.type === 'accept' ? 'success' : confirmDialog.type === 'archive' ? 'error' : confirmDialog.type === 'unarchive' ? 'success' : 'error'}
            variant="contained"
          >
            {confirmDialog.type === 'accept' ? 'Accept' : confirmDialog.type === 'archive' ? 'Archive' : confirmDialog.type === 'unarchive' ? 'Unarchive' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ open: false, message: '', severity: 'success' })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ open: false, message: '', severity: 'success' })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Residents; 
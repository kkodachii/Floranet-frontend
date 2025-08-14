import React, { useEffect, useState, useCallback } from 'react';
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
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
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
import { useNavigate } from 'react-router-dom';
import FilterPopover from '../../../components/FilterPopover';
import apiService from '../../../services/api';

  // API functions
  const fetchVendors = async (search = '', filters = {}) => {
    try {
      const response = await apiService.getVendorsWithDetails(search, filters);
      return response || [];
    } catch (error) {
      console.error('Error fetching vendors:', error);
      return [];
    }
  };

  const fetchVendorRequests = async (search = '', filters = {}) => {
    try {
      const response = await apiService.getVendorRequests(search, filters);
      return response || [];
    } catch (error) {
      console.error('Error fetching vendor requests:', error);
      return [];
    }
  };

  const fetchArchivedVendors = async (search = '', filters = {}) => {
    try {
      const response = await apiService.getArchivedVendors(search, filters);
      return response || [];
    } catch (error) {
      console.error('Error fetching archived vendors:', error);
      return [];
    }
  };

function Vendors() {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [archivedVendors, setArchivedVendors] = useState([]);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [filterValues, setFilterValues] = useState({ 
    status: '', 
    street: '', 
    residentName: '', 
    houseNumber: '', 
    businessName: '', 
    contactNumber: '' 
  });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: '', data: null });
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const rowsPerPage = 9;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  // Add effect to handle view changes
  useEffect(() => {
    loadData();
  }, [showRequests, showArchived]);

  // Add effect to handle search and filter changes
  useEffect(() => {
    setPage(1); // Reset to first page when search or filters change
    loadData(search, filterValues);
  }, [search, filterValues]);

  // Add effect to reload data after successful actions
  useEffect(() => {
    if (snackbar.open && snackbar.severity === 'success') {
      // Reload data after successful actions
      const timer = setTimeout(() => {
        loadData(search, filterValues);
      }, 1000); // Wait 1 second for the snackbar to show
      return () => clearTimeout(timer);
    }
  }, [snackbar.open, snackbar.severity]);

  const loadData = async (searchTerm = '', filterValues = {}) => {
    try {
      if (searchTerm) {
        setSearchLoading(true);
      } else if (Object.values(filterValues).some(v => v !== '')) {
        setFilterLoading(true);
      } else {
        setLoading(true);
      }
      setError('');
      
      // Fetch data with better error handling
      let vendorsData = [];
      let requestsData = [];
      let archivedData = [];
      
      try {
        vendorsData = await fetchVendors(searchTerm, filterValues);
      } catch (error) {
        console.error('Error fetching vendors:', error);
        vendorsData = [];
      }
      
      try {
        requestsData = await fetchVendorRequests(searchTerm, filterValues);
      } catch (error) {
        console.error('Error fetching vendor requests:', error);
        requestsData = [];
      }
      
      try {
        archivedData = await fetchArchivedVendors(searchTerm, filterValues);
      } catch (error) {
        console.error('Error fetching archived vendors:', error);
        archivedData = [];
      }
      
      setUsers(vendorsData);
      setRequests(requestsData);
      setArchivedVendors(archivedData);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data. Please try again.');
      // Set empty data on error
      setUsers([]);
      setRequests([]);
      setArchivedVendors([]);
    } finally {
      setLoading(false);
      setSearchLoading(false);
      setFilterLoading(false);
    }
  };

  const handleArchive = async (vendor) => {
    try {
      await apiService.archiveVendor(vendor.id);
      setSnackbar({ open: true, message: 'Vendor archived successfully', severity: 'success' });
      // loadData call removed - useEffect will handle it automatically
    } catch (error) {
      console.error('Error archiving vendor:', error);
      setSnackbar({ open: true, message: 'Failed to archive vendor', severity: 'error' });
    }
  };

  const handleUnarchive = async (vendor) => {
    try {
      await apiService.unarchiveVendor(vendor.id);
      setSnackbar({ open: true, message: 'Vendor unarchived successfully', severity: 'success' });
      // loadData call removed - useEffect will handle it automatically
    } catch (error) {
      console.error('Error unarchiving vendor:', error);
      return;
    }
  };

  const getCurrentViewType = () => {
    if (showRequests) return 'requests';
    if (showArchived) return 'archived';
    return 'users';
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId;
      return (value) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setSearch(value);
          setError(''); // Clear any previous errors
          // loadData call removed - useEffect will handle it automatically
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

  const handleConfirmAction = async () => {
    try {
      if (confirmDialog.type === 'accept') {
        await apiService.acceptVendor(confirmDialog.data.id);
        setSnackbar({ open: true, message: 'Vendor accepted successfully', severity: 'success' });
        // loadData call removed - useEffect will handle it automatically
      } else if (confirmDialog.type === 'reject') {
        await apiService.rejectVendor(confirmDialog.data.id);
        setSnackbar({ open: true, message: 'Vendor request rejected', severity: 'success' });
        // loadData call removed - useEffect will handle it automatically
      } else if (confirmDialog.type === 'archive') {
        handleArchive(confirmDialog.data);
      } else if (confirmDialog.type === 'unarchive') {
        handleUnarchive(confirmDialog.data);
      }
    } catch (error) {
      console.error('Error performing action:', error);
      setSnackbar({ 
        open: true, 
        message: error.message || 'Failed to perform action. Please try again.', 
        severity: 'error' 
      });
    } finally {
      setConfirmDialog({ open: false, type: '', data: null });
    }
  };

  const statusOptions = ['pending'];
  const currentData = showRequests ? requests : showArchived ? archivedVendors : users;
  
  // Generate filter options from current data, handling empty data gracefully
  const streetOptions = currentData.length > 0 ? 
    Array.from(new Set(currentData.map(u => u.street || u.resident?.house?.street))).filter(Boolean) : [];
  
  const residentOptions = currentData.length > 0 ? 
    Array.from(new Set(currentData.map(u => u.residentName || u.resident?.name))).filter(Boolean) : [];
  
  const houseNumberOptions = currentData.length > 0 ? 
    Array.from(new Set(currentData.map(u => u.houseNumber || u.resident?.house?.house_number))).filter(Boolean) : [];
  
  const businessOptions = currentData.length > 0 ? 
    Array.from(new Set(currentData.map(u => u.businessName || u.business_name))).filter(Boolean) : [];
  
  const contactOptions = currentData.length > 0 ? 
    Array.from(new Set(currentData.map(u => u.contactNumber || u.resident?.contact_no))).filter(Boolean) : [];

  const handleFilterOpen = (e) => setFilterAnchorEl(e.currentTarget);
  const handleFilterClose = () => setFilterAnchorEl(null);
  const handleFilterChange = (name, value) => {
    const newFilterValues = { ...filterValues, [name]: value };
    setFilterValues(newFilterValues);
    console.log('Applying filters:', newFilterValues); // Debug log
    setError(''); // Clear any previous errors
    // loadData call removed - useEffect will handle it automatically
  };

  const handleFilterReset = () => {
    const resetFilters = { status: '', street: '', residentName: '', houseNumber: '', businessName: '', contactNumber: '' };
    setFilterValues(resetFilters);
    console.log('Resetting filters'); // Debug log
    setError(''); // Clear any previous errors
    // loadData call removed - useEffect will handle it automatically
  };

  const handleFilterApply = () => {
    handleFilterClose();
    // Filters are already applied in handleFilterChange
  };

  // Clear search when switching views
  const handleViewSwitch = (viewType) => {
    console.log('Switching to view:', viewType); // Debug log
    if (viewType === 'requests') {
      setShowRequests(true);
      setShowArchived(false);
    } else if (viewType === 'archived') {
      setShowArchived(true);
      setShowRequests(false);
    } else if (viewType === 'vendors') {
      setShowRequests(false);
      setShowArchived(false);
    }
    console.log('New state - showRequests:', !showRequests && viewType === 'requests', 'showArchived:', !showArchived && viewType === 'archived'); // Debug log
    setPage(1); // Reset to first page when switching views
    setSearch(''); // Clear search when switching views
    setSearchInput(''); // Clear search input
    setFilterValues({ status: '', street: '', residentName: '', houseNumber: '', businessName: '', contactNumber: '' }); // Reset filters
    setError(''); // Clear any previous errors
    // loadData() call removed - useEffect will handle it automatically
  };

  // Transform data to include additional fields
  const transformData = (data) => {
    return data.map(item => ({
      ...item,
      dateArchived: item.updated_at ? new Date(item.updated_at).toLocaleDateString() : 'N/A',
      // Keep original data for actions
      originalData: item
    }));
  };

  // Transform archived vendors to match the expected structure
  const transformArchivedData = (data) => {
    return data.map(item => ({
      ...item,
      dateArchived: item.updated_at ? new Date(item.updated_at).toLocaleDateString() : 'N/A',
      // Keep original data for actions
      originalData: item
    }));
  };

  const filteredData = showRequests ? requests : showArchived ? archivedVendors : users;
  const transformedData = showArchived ? transformArchivedData(filteredData) : transformData(filteredData);
  // Remove the old filtering logic since it's now handled by the backend
  const filteredItems = transformedData;

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
          type: 'reject', 
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
      onClick: (row) => navigate(`/user-management/edit-vendor/${row.id}`),
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
    { id: 'residentName', label: 'Resident Name' },
    { id: 'houseNumber', label: 'House Number' },
    { id: 'street', label: 'Street' },
    { id: 'businessName', label: 'Business Name' },
    { id: 'requestType', label: 'Request Type' },
    { id: 'dateSubmitted', label: 'Date Submitted' },
  ] : showArchived ? [
    { id: 'residentName', label: 'Resident Name' },
    { id: 'houseNumber', label: 'House Number' },
    { id: 'street', label: 'Street' },
    { id: 'businessName', label: 'Business Name' },
    { id: 'contactNumber', label: 'Contact Number' },
    { id: 'dateArchived', label: 'Date Archived' },
  ] : [
    { id: 'residentName', label: 'Resident Name' },
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

  // Check if any filters are active
  const hasActiveFilters = Object.values(filterValues).some(value => value && value !== '');

  return (
    <Box sx={{ p: { xs: 0.5, sm: 1 } }}>
      <Box maxWidth="xl" mx="auto">
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
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
              placeholder={`Search ${showRequests ? 'requests' : showArchived ? 'archived vendors' : 'vendors'}...`}
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
                <Tooltip title="Add Vendor">
                  <IconButton 
                    color="primary" 
                    size="small" 
                    sx={{ '&:hover': { bgcolor: 'primary.main', color: '#fff' } }}
                    onClick={() => navigate('/user-management/add-vendors')}
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
                  { name: 'residentName', label: 'Resident Name', type: 'select', options: residentOptions },
                  { name: 'houseNumber', label: 'House Number', type: 'select', options: houseNumberOptions },
                  ...(!showRequests ? [{ name: 'businessName', label: 'Business Name', type: 'select', options: businessOptions }] : []),
                  { name: 'contactNumber', label: 'Contact Number', type: 'select', options: contactOptions },
                ]}
                values={filterValues}
                onChange={handleFilterChange}
                onApply={handleFilterApply}
                onReset={handleFilterReset}
              />
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
                    onClick={() => handleViewSwitch(showRequests ? 'vendors' : 'requests')}
                    sx={{ '&:hover': { bgcolor: 'primary.main', color: '#fff' } }}
                  >
                    {showRequests ? <PeopleIcon fontSize="small" /> : <MarkEmailUnreadIcon fontSize="small" />}
                  </IconButton>
                </Badge>
              </Tooltip>
              <Tooltip title={showArchived ? "Show Vendors" : "Show Archived"}>
                <IconButton 
                  color={showArchived ? "primary" : "default"} 
                  size="small" 
                  onClick={() => handleViewSwitch(showArchived ? 'vendors' : 'archived')}
                  sx={{ '&:hover': { bgcolor: 'primary.main', color: '#fff' } }}
                >
                  <ArchiveIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
          
          {/* Active filters and search summary */}
          {(search || Object.values(filterValues).some(v => v !== '')) && (
            <Box sx={{ px: 1, py: 0.5, mb: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {search && `Search: "${search}"`}
                {search && Object.values(filterValues).some(v => v !== '') && ' | '}
                {Object.values(filterValues).some(v => v !== '') && `Filters: ${Object.entries(filterValues)
                  .filter(([key, value]) => value && value !== '')
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(', ')}`}
              </Typography>
            </Box>
          )}
          
          <FloraTable
            columns={columns}
            rows={filteredItems}
            actions={actions}
            page={page}
            rowsPerPage={rowsPerPage}
            maxHeight={tableMaxHeight}
            emptyMessage={`No ${showRequests ? 'requests' : showArchived ? 'archived vendors' : 'vendors'} found.`}
            loading={loading || searchLoading || filterLoading}
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
      
      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, type: '', data: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {confirmDialog.type === 'accept' ? 'Accept Vendor Request' : 
           confirmDialog.type === 'reject' ? 'Reject Vendor Request' :
           confirmDialog.type === 'archive' ? 'Archive Vendor' : 
           confirmDialog.type === 'unarchive' ? 'Unarchive Vendor' : 'Confirm Action'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {confirmDialog.type === 'accept' 
              ? `Are you sure you want to accept the vendor request for ${confirmDialog.data?.businessName || 'this vendor'}?`
              : confirmDialog.type === 'reject'
              ? `Are you sure you want to reject the vendor request for ${confirmDialog.data?.businessName || 'this vendor'}? This action cannot be undone.`
              : confirmDialog.type === 'archive' 
              ? `Are you sure you want to archive ${confirmDialog.data?.residentName || 'this vendor'}? This will remove them from the active vendors list.`
              : confirmDialog.type === 'unarchive'
              ? `Are you sure you want to unarchive ${confirmDialog.data?.residentName || 'this vendor'}? This will restore them to the active vendors list.`
              : 'Are you sure you want to perform this action?'
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
            color={confirmDialog.type === 'accept' ? 'success' : 
                   confirmDialog.type === 'reject' ? 'error' :
                   confirmDialog.type === 'unarchive' ? 'success' : 
                   confirmDialog.type === 'archive' ? 'error' : 'primary'}
            variant="contained"
          >
            {confirmDialog.type === 'accept' ? 'Accept' : 
             confirmDialog.type === 'reject' ? 'Reject' :
             confirmDialog.type === 'archive' ? 'Archive' : 
             confirmDialog.type === 'unarchive' ? 'Unarchive' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Vendors; 
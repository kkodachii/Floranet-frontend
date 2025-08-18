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
const fetchVehicles = async (search = '', filters = {}) => {
  try {
    const response = await apiService.getVehiclesWithDetails(search, filters);
    return response || [];
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return [];
  }
};

const fetchVehicleRequests = async (search = '', filters = {}) => {
  try {
    const response = await apiService.getVehicleRequests(search, filters);
    return response || [];
  } catch (error) {
    console.error('Error fetching vehicle requests:', error);
    return [];
  }
};

const fetchArchivedVehicles = async (search = '', filters = {}) => {
  try {
    const response = await apiService.getArchivedVehicles(search, filters);
    return response || [];
  } catch (error) {
    console.error('Error fetching archived vehicles:', error);
    return [];
  }
};

function Vehicle() {
  const [vehicles, setVehicles] = useState([]);
  const [requests, setRequests] = useState([]);
  const [archivedVehicles, setArchivedVehicles] = useState([]);
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
    vehicleType: '', 
    residentName: '', 
    vehiclePassId: '', 
    plateNumber: ''
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
      let vehiclesData = [];
      let requestsData = [];
      let archivedData = [];
      
      try {
        vehiclesData = await fetchVehicles(searchTerm, filterValues);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        vehiclesData = [];
      }
      
      try {
        requestsData = await fetchVehicleRequests(searchTerm, filterValues);
      } catch (error) {
        console.error('Error fetching vehicle requests:', error);
        requestsData = [];
      }
      
      try {
        archivedData = await fetchArchivedVehicles(searchTerm, filterValues);
      } catch (error) {
        console.error('Error fetching archived vehicles:', error);
        archivedData = [];
      }
      
      setVehicles(vehiclesData);
      setRequests(requestsData);
      setArchivedVehicles(archivedData);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data. Please try again.');
      // Set empty data on error
      setVehicles([]);
      setRequests([]);
      setArchivedVehicles([]);
    } finally {
      setLoading(false);
      setSearchLoading(false);
      setFilterLoading(false);
    }
  };

  const handleArchive = async (vehicle) => {
    try {
      await apiService.archiveVehicle(vehicle.id);
      setSnackbar({ open: true, message: 'Vehicle archived successfully', severity: 'success' });
    } catch (error) {
      console.error('Error archiving vehicle:', error);
      setSnackbar({ open: true, message: 'Failed to archive vehicle', severity: 'error' });
    }
  };

  const handleUnarchive = async (vehicle) => {
    try {
      await apiService.unarchiveVehicle(vehicle.id);
      setSnackbar({ open: true, message: 'Vehicle unarchived successfully', severity: 'success' });
    } catch (error) {
      console.error('Error unarchiving vehicle:', error);
      return;
    }
  };

  const getCurrentViewType = () => {
    if (showRequests) return 'requests';
    if (showArchived) return 'archived';
    return 'vehicles';
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
        await apiService.acceptVehicle(confirmDialog.data.id);
        setSnackbar({ open: true, message: 'Vehicle request accepted successfully', severity: 'success' });
      } else if (confirmDialog.type === 'reject') {
        await apiService.rejectVehicle(confirmDialog.data.id);
        setSnackbar({ open: true, message: 'Vehicle request rejected', severity: 'success' });
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

  const statusOptions = ['pending', 'active', 'archived'];
  const vehicleTypeOptions = ['Car', 'Motorcycle', 'SUV', 'Truck', 'Bus', 'Tricycle'];
  const currentData = showRequests ? requests : showArchived ? archivedVehicles : vehicles;
  
  // Generate filter options from current data, handling empty data gracefully
  const residentOptions = currentData.length > 0 ? 
    Array.from(new Set(currentData.map(v => v.residentName))).filter(Boolean) : [];
  
  const vehiclePassIdOptions = currentData.length > 0 ? 
    Array.from(new Set(currentData.map(v => v.vehiclePassId))).filter(Boolean) : [];
  
  const plateNumberOptions = currentData.length > 0 ? 
    Array.from(new Set(currentData.map(v => v.plateNumber))).filter(Boolean) : [];

  const handleFilterOpen = (e) => setFilterAnchorEl(e.currentTarget);
  const handleFilterClose = () => setFilterAnchorEl(null);
  const handleFilterChange = (name, value) => {
    const newFilterValues = { ...filterValues, [name]: value };
    setFilterValues(newFilterValues);
    console.log('Applying filters:', newFilterValues); // Debug log
    setError(''); // Clear any previous errors
  };

  const handleFilterReset = () => {
    const resetFilters = { status: '', vehicleType: '', residentName: '', vehiclePassId: '', plateNumber: '' };
    setFilterValues(resetFilters);
    console.log('Resetting filters'); // Debug log
    setError(''); // Clear any previous errors
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
    } else if (viewType === 'vehicles') {
      setShowRequests(false);
      setShowArchived(false);
    }
    console.log('New state - showRequests:', !showRequests && viewType === 'requests', 'showArchived:', !showArchived && viewType === 'archived'); // Debug log
    setPage(1); // Reset to first page when switching views
    setSearch(''); // Clear search when switching views
    setSearchInput(''); // Clear search input
    setFilterValues({ status: '', vehicleType: '', residentName: '', vehiclePassId: '', plateNumber: '' }); // Reset filters
    setError(''); // Clear any previous errors
  };

  // Transform data to include additional fields
  const transformData = (data) => {
    return data.map(item => ({
      ...item,
      // Map API response fields to expected structure
      residentName: item.residentName || 'N/A',
      vehicleType: item.vehicleType || 'N/A',
      vehiclePassId: item.vehiclePassId || 'N/A',
      plateNumber: item.plateNumber || 'N/A',
      dateArchived: item.updated_at ? new Date(item.updated_at).toLocaleDateString() : 'N/A',
      // Keep original data for actions
      originalData: item
    }));
  };

  // Transform archived vehicles to match the expected structure
  const transformArchivedData = (data) => {
    return data.map(item => ({
      ...item,
      // Map API response fields to expected structure
      residentName: item.residentName || 'N/A',
      vehicleType: item.vehicleType || 'N/A',
      vehiclePassId: item.vehiclePassId || 'N/A',
      plateNumber: item.plateNumber || 'N/A',
      dateArchived: item.updated_at ? new Date(item.updated_at).toLocaleDateString() : 'N/A',
      // Keep original data for actions
      originalData: item
    }));
  };

  const filteredData = showRequests ? requests : showArchived ? archivedVehicles : vehicles;
  const transformedData = showArchived ? transformArchivedData(filteredData) : transformData(filteredData);
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
      onClick: (row) => navigate(`/user-management/edit-vehicle/${row.id}`),
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
    { id: 'vehicleType', label: 'Vehicle Type' },
    { id: 'vehiclePassId', label: 'Vehicle Pass ID' },
    { id: 'plateNumber', label: 'Plate Number' },
    { id: 'requestType', label: 'Request Type' },
    { id: 'dateSubmitted', label: 'Date Submitted' },
  ] : showArchived ? [
    { id: 'residentName', label: 'Resident Name' },
    { id: 'vehicleType', label: 'Vehicle Type' },
    { id: 'vehiclePassId', label: 'Vehicle Pass ID' },
    { id: 'plateNumber', label: 'Plate Number' },
    { id: 'dateArchived', label: 'Date Archived' },
  ] : [
    { id: 'residentName', label: 'Resident Name' },
    { id: 'vehicleType', label: 'Vehicle Type' },
    { id: 'vehiclePassId', label: 'Vehicle Pass ID' },
    { id: 'plateNumber', label: 'Plate Number' },
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
              placeholder={`Search ${showRequests ? 'requests' : showArchived ? 'archived vehicles' : 'vehicles'}...`}
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
                <Tooltip title="Add Vehicle">
                  <IconButton 
                    color="primary" 
                    size="small" 
                    sx={{ '&:hover': { bgcolor: 'primary.main', color: '#fff' } }}
                    onClick={() => navigate('/user-management/add-vehicle')}
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
                  { name: 'vehicleType', label: 'Vehicle Type', type: 'select', options: vehicleTypeOptions },
                  { name: 'residentName', label: 'Resident Name', type: 'select', options: residentOptions },
                  { name: 'vehiclePassId', label: 'Vehicle Pass ID', type: 'select', options: vehiclePassIdOptions },
                  { name: 'plateNumber', label: 'Plate Number', type: 'select', options: plateNumberOptions },
                ]}
                values={filterValues}
                onChange={handleFilterChange}
                onApply={handleFilterApply}
                onReset={handleFilterReset}
              />
              <Tooltip title={showRequests ? "Show Vehicles" : "Show Requests"}>
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
                    onClick={() => handleViewSwitch(showRequests ? 'vehicles' : 'requests')}
                    sx={{ '&:hover': { bgcolor: 'primary.main', color: '#fff' } }}
                  >
                    {showRequests ? <PeopleIcon fontSize="small" /> : <MarkEmailUnreadIcon fontSize="small" />}
                  </IconButton>
                </Badge>
              </Tooltip>
              <Tooltip title={showArchived ? "Show Vehicles" : "Show Archived"}>
                <IconButton 
                  color={showArchived ? "primary" : "default"} 
                  size="small" 
                  onClick={() => handleViewSwitch(showArchived ? 'vehicles' : 'archived')}
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
            emptyMessage={`No ${showRequests ? 'requests' : showArchived ? 'archived vehicles' : 'vehicles'} found.`}
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
          {confirmDialog.type === 'accept' ? 'Accept Vehicle Request' : 
           confirmDialog.type === 'reject' ? 'Reject Vehicle Request' :
           confirmDialog.type === 'archive' ? 'Archive Vehicle' : 
           confirmDialog.type === 'unarchive' ? 'Unarchive Vehicle' : 'Confirm Action'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {confirmDialog.type === 'accept' 
              ? `Are you sure you want to accept the vehicle request for ${confirmDialog.data?.residentName || 'this vehicle'}?`
              : confirmDialog.type === 'reject'
              ? `Are you sure you want to reject the vehicle request for ${confirmDialog.data?.residentName || 'this vehicle'}? This action cannot be undone.`
              : confirmDialog.type === 'archive' 
              ? `Are you sure you want to archive ${confirmDialog.data?.residentName || 'this vehicle'}? This will remove them from the active vehicles list.`
              : confirmDialog.type === 'unarchive'
              ? `Are you sure you want to unarchive ${confirmDialog.data?.residentName || 'this vehicle'}? This will restore them to the active vehicles list.`
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

export default Vehicle; 
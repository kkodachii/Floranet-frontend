import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Stack,
  Tooltip,
  InputAdornment,
  IconButton,
  Typography,
  useMediaQuery,
  Alert,
  Snackbar
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useTheme } from '@mui/material/styles';
import ExpandableFloraTable from '../../../components/ExpandableFloraTable';
import FilterPopover from '../../../components/FilterPopover';
import CCTVAccordion from '../../../components/CCTVAccordion';
import StatusPriorityDropdown from '../../../components/StatusPriorityDropdown';
import StatusBadge from '../../../components/StatusBadge';
import apiService from '../../../services/api';

const columns = [
  { id: 'cctv_id', label: 'CCTV ID' },
  { id: 'resident_name', label: 'Resident Name' },
  { id: 'date_time_incident', label: 'Date & Time of Incident' },
  { id: 'location', label: 'Location' },
  { id: 'status', label: 'Status' },
  { id: 'actions', label: 'Actions' },
];

const statusOptions = ['pending', 'in_progress', 'completed', 'cancelled'];

// Helper function to format time
const formatTime = (timeString) => {
  if (!timeString) return '';
  
  // If it's already a simple time format (HH:MM), return as is
  if (typeof timeString === 'string' && timeString.includes(':') && !timeString.includes('T')) {
    return timeString;
  }
  
  // If it's a timestamp, extract just the time part
  try {
    const date = new Date(timeString);
    if (isNaN(date.getTime())) {
      // If it's not a valid date, try to extract time from string
      const timeMatch = timeString.match(/(\d{1,2}):(\d{2})/);
      if (timeMatch) {
        const hours = parseInt(timeMatch[1]);
        const minutes = timeMatch[2];
        return `${hours}:${minutes}`;
      }
      return timeString; // Return original if we can't parse it
    }
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  } catch (error) {
    return timeString; // Return original if parsing fails
  }
};

export default function CCTV() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [cctvRequests, setCctvRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [filterValues, setFilterValues] = useState({ 
    status: ''
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 9,
    total: 0,
    from: 0,
    to: 0
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [expandedRows, setExpandedRows] = useState(new Set());

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Fetch CCTV requests from API
  const fetchCCTVRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {
        ...filterValues
      };
      
      console.log('Fetching CCTV requests with filters:', filters);
      
      const response = await apiService.getCCTVRequestsFiltered(page, search, filters);
      
      console.log('API response:', response);
      
      setCctvRequests(response.data);
      setPagination({
        current_page: response.meta.current_page,
        last_page: response.meta.last_page,
        per_page: response.meta.per_page,
        total: response.meta.total,
        from: response.meta.from,
        to: response.meta.to
      });
    } catch (err) {
      console.error('Error fetching CCTV requests:', err);
      setError(err.message || 'Failed to fetch CCTV requests');
    } finally {
      setLoading(false);
    }
  };

  // Fetch CCTV requests when component mounts or dependencies change
  useEffect(() => {
    fetchCCTVRequests();
  }, [page, search, filterValues]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  const handleStatusChange = async (cctvId, newStatus) => {
    try {
      await apiService.updateCCTVStatus(cctvId, newStatus);
      
      // Update the CCTV request in the local state
      setCctvRequests(prevRequests => 
        prevRequests.map(request => 
          request.id === cctvId 
            ? { ...request, status: newStatus }
            : request
        )
      );
      
      setSnackbar({
        open: true,
        message: 'Status updated successfully',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error updating status:', err);
      setSnackbar({
        open: true,
        message: err.message || 'Failed to update status',
        severity: 'error'
      });
    }
  };

  const handleFilterOpen = (e) => setFilterAnchorEl(e.currentTarget);
  const handleFilterClose = () => setFilterAnchorEl(null);
  
  const handleFilterChange = (name, value) => {
    console.log('Filter change:', name, value);
    setFilterValues(prev => ({ ...prev, [name]: value }));
    setPage(1); // Reset to first page when filtering
  };
  
  const handleFilterReset = () => {
    console.log('Filter reset');
    setFilterValues({ status: '' });
    setPage(1);
  };
  
  const handleFilterApply = () => {
    console.log('Filter apply, current values:', filterValues);
    handleFilterClose();
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleToggleRow = (cctvId) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(cctvId)) {
      newExpandedRows.delete(cctvId);
    } else {
      newExpandedRows.add(cctvId);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleUpdateFollowups = async (cctvId, followups) => {
    try {
      const response = await apiService.updateCCTVFollowups(cctvId, followups);
      
      // Update the CCTV request in the local state with the response data
      setCctvRequests(prevRequests => 
        prevRequests.map(request => 
          request.id === cctvId 
            ? { ...request, followups: response.data.followups }
            : request
        )
      );
      
      setSnackbar({
        open: true,
        message: 'Followups updated successfully',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error updating followups:', err);
      throw err;
    }
  };

  const handleUpdateFootage = async (cctvId, footageData) => {
    try {
      await apiService.updateCCTVFootage(cctvId, footageData);
      
      // Refresh the CCTV request data to get the updated footage array
      const updatedRequest = await apiService.getCCTVRequestById(cctvId);
      
      setCctvRequests(prevRequests => 
        prevRequests.map(request => 
          request.id === cctvId 
            ? updatedRequest.data
            : request
        )
      );
      
      setSnackbar({
        open: true,
        message: 'Footage uploaded successfully',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error uploading footage:', err);
      throw err;
    }
  };

  const handleDeleteFootage = async (cctvId, footageId) => {
    try {
      await apiService.deleteCCTVFootage(cctvId, footageId);
      
      // Refresh the CCTV request data to get the updated footage array
      const updatedRequest = await apiService.getCCTVRequestById(cctvId);
      
      setCctvRequests(prevRequests => 
        prevRequests.map(request => 
          request.id === cctvId 
            ? updatedRequest.data
            : request
        )
      );
      
      setSnackbar({
        open: true,
        message: 'Footage deleted successfully',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error deleting footage:', err);
      setSnackbar({
        open: true,
        message: err.message || 'Failed to delete footage',
        severity: 'error'
      });
    }
  };

  // Transform CCTV requests data for the table
  const tableRows = cctvRequests.map(request => {
    const isExpanded = expandedRows.has(request.id);
    
    return {
      ...request,
      cctv_id: request.cctv_id || `CCTV-${request.id}`,
      resident_name: request.resident?.name || 'N/A',
      date_time_incident: request.date_of_incident 
        ? `${new Date(request.date_of_incident).toLocaleDateString()} ${request.time_of_incident ? formatTime(request.time_of_incident) : ''}`
        : 'N/A',
      location: (
        <Box sx={{ 
          maxWidth: 350,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          lineHeight: 1.4,
          fontSize: '0.875rem'
        }}>
          {request.location}
        </Box>
      ),
      status: (
        <StatusPriorityDropdown
          value={request.status}
          options={statusOptions}
          onUpdate={(newStatus) => handleStatusChange(request.id, newStatus)}
          type="status"
        />
      ),
      actions: (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="View Details & Footage">
            <IconButton
              size="small"
              onClick={() => handleToggleRow(request.id)}
              sx={{ '&:hover': { bgcolor: 'primary.main', color: '#fff' } }}
            >
              {isExpanded ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      ),
      // Add accordion data for expanded rows
      accordion: isExpanded ? (
        <CCTVAccordion
          cctvRequest={request}
          onUpdateFollowups={handleUpdateFollowups}
          onUpdateFootage={handleUpdateFootage}
          onDeleteFootage={handleDeleteFootage}
          loading={loading}
        />
      ) : null,
      isExpanded
    };
  });

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
              placeholder="Search CCTV requests..."
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
                  { name: 'status', label: 'Status', type: 'select', options: statusOptions },
                ]}
                values={filterValues}
                onChange={handleFilterChange}
                onApply={handleFilterApply}
                onReset={handleFilterReset}
              />
            </Stack>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box sx={{ overflowX: 'auto', width: '100%' }}>
            <ExpandableFloraTable
              columns={columns}
              rows={tableRows}
              actions={[]}
              page={pagination.current_page}
              rowsPerPage={pagination.per_page}
              maxHeight={tableMaxHeight}
              emptyMessage="No CCTV requests found."
              loading={loading}
              sx={{ 
                minWidth: '100%',
                overflowX: 'auto'
              }}
            />
          </Box>
          
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
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 
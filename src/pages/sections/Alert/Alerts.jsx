import React, { useState, useEffect } from 'react';
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
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Divider,
  Select,
  MenuItem,
  FormControl,
  Alert as MuiAlert,
  Snackbar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import WarningIcon from '@mui/icons-material/Warning';
import { useTheme } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ClearIcon from '@mui/icons-material/Clear';
import FloraTable from '../../../components/FloraTable';
import FilterPopover from '../../../components/FilterPopover';
import apiService from '../../../services/api';

const getStatusHoverColor = (status, theme) => {
  const isDark = theme.palette.mode === 'dark';
  switch (status) {
    case 'Resolved':
      return isDark ? '#145317' : '#388e3c';
    case 'Ongoing':
      return isDark ? '#c66900' : '#ef6c00';
    case 'Pending':
      return isDark ? '#08306b' : '#0d47a1';
    case 'Called':
      return isDark ? '#7f1313' : '#b71c1c';
    case 'Cancelled':
      return isDark ? '#424242' : '#757575';
    default:
      return isDark ? theme.palette.grey[900] : theme.palette.grey[800];
  }
};

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAlerts, setTotalAlerts] = useState(0);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 5,
    total: 0,
    from: 0,
    to: 0
  });
  const rowsPerPage = 5;
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [filterValues, setFilterValues] = useState({ 
    status: '', 
    type: '', 
    resident_id: '',
    date_from: '',
    date_to: ''
  });

  // Fetch alerts from API
  const fetchAlerts = async (page = 1, searchTerm = '', filters = {}) => {
    try {
      if (page === 1) {
        setSearchLoading(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const response = await apiService.getAlerts(page, searchTerm, filters);
      
      if (response.success) {
        setAlerts(response.data);
        setTotalPages(response.pagination.last_page);
        setTotalAlerts(response.pagination.total);
        setCurrentPage(response.pagination.current_page);
        setPagination(response.pagination);
      } else {
        throw new Error('Failed to fetch alerts');
      }
    } catch (err) {
      console.error('Error fetching alerts:', err);
      setError(err.message || 'Failed to fetch alerts');
      setAlerts([]);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchAlerts();
  }, []);

  // Handle pagination changes
  useEffect(() => {
    if (currentPage > 1) {
      fetchAlerts(currentPage, search, filterValues);
    }
  }, [currentPage]);

  // Handle search and filter changes
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when search or filters change
    fetchAlerts(1, search, filterValues);
  }, [search, filterValues]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearch(searchInput);
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [searchInput]);



  const handleStatusChange = async (alertId, newStatus) => {
    try {
      const response = await apiService.updateAlertStatus(alertId, newStatus);
      
      if (response.success) {
        // Update local state
        setAlerts(prevAlerts =>
          prevAlerts.map(alert =>
            alert.id === alertId
              ? { ...alert, status: newStatus }
              : alert
          )
        );
        
        setSuccessMessage(`Alert status updated to ${newStatus}`);
        
        // Refresh alerts to get updated data
        fetchAlerts(currentPage, search, filterValues);
      }
    } catch (err) {
      console.error('Error updating alert status:', err);
      setError(err.message || 'Failed to update alert status');
    }
  };

  const getStatusColor = (status, theme) => {
    const isDark = theme.palette.mode === 'dark';
    switch (status) {
      case 'Resolved':
        return isDark ? '#1b5e20' : '#2e7d32';
      case 'Ongoing':
        return isDark ? '#ff9800' : '#f57c00';
      case 'Pending':
        return isDark ? '#0d47a1' : '#1565c0';
      case 'Called':
        return isDark ? '#b71c1c' : '#c62828';
      case 'Cancelled':
        return isDark ? '#424242' : '#616161';
      default:
        return isDark ? theme.palette.grey[800] : theme.palette.grey[700];
    }
  };

  const statusOptions = ['Pending', 'Ongoing', 'Resolved', 'Called', 'Cancelled'];
  const typeOptions = ['incident', 'urgent'];

  const handleFilterOpen = (e) => setFilterAnchorEl(e.currentTarget);
  const handleFilterClose = () => setFilterAnchorEl(null);
  const handleFilterChange = (name, value) => setFilterValues(f => ({ ...f, [name]: value }));
  const handleFilterReset = () => {
    const resetFilters = { status: '', type: '', resident_id: '', date_from: '', date_to: '' };
    setFilterValues(resetFilters);
    setSearchInput('');
    setSearch('');
    setCurrentPage(1);
    fetchAlerts(1, '', resetFilters);
  };
  const handleFilterApply = () => {
    setCurrentPage(1);
    fetchAlerts(1, search, filterValues);
    handleFilterClose();
  };



  const columns = [
    { id: 'resident_name', label: 'Resident Name' },
    {
      id: 'type',
      label: 'Type',
      render: (value, row) => (
        <Chip
          label={value}
          size="small"
          color={value === 'urgent' ? 'error' : 'primary'}
          sx={{ fontSize: '0.75rem' }}
        />
      )
    },
    {
      id: 'description',
      label: 'Description',
      render: (value, row) => (
        <Box sx={{ 
          color: row.type === 'urgent' ? 'error.main' : 'text.primary', 
          fontWeight: row.type === 'urgent' ? 600 : 400 
        }}>
          {value || 'N/A'}
        </Box>
      )
    },
    { id: 'location', label: 'Location' },
    { id: 'reported_at', label: 'Reported At' },
    {
      id: 'status',
      label: 'Status',
      render: (value) => {
        return (
          <Chip
            label={value}
            size="small"
            sx={{
              fontSize: '0.75rem',
              bgcolor: getStatusColor(value, theme),
              color: '#fff',
              border: 'none',
            }}
            variant="outlined"
          />
        );
      }
    },
  ];

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Format time for display
  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Box sx={{ p: { xs: 0.5, sm: 1 }, maxWidth: '100%' }}>
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiAlert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </MuiAlert>
      </Snackbar>

      <Snackbar 
        open={!!successMessage} 
        autoHideDuration={4000} 
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiAlert onClose={() => setSuccessMessage('')} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </MuiAlert>
      </Snackbar>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          overflow: 'visible',
          boxShadow: theme.palette.mode === 'dark' ? '0 2px 12px rgba(0,0,0,0.2)' : '0 2px 12px rgba(0,0,0,0.06)',
          backgroundColor: theme.palette.background.paper,
          maxWidth: '100%',
          mx: 'auto',
        }}
      >


        {/* Search and Controls Section */}
        <Box
          sx={{
            p: { xs: 0.75, sm: 1 },
            borderRadius: 1,
            borderColor: 'divider',
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : '#ffffff',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'center' },
              justifyContent: 'space-between',
              gap: 1,
            }}
          >
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search alerts by description, location, or notified party..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{
                flex: { xs: '1 1 auto', sm: '0 0 auto' },
                width: { xs: '100%', sm: 300, md: 350 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  backgroundColor: theme.palette.background.paper,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                    borderWidth: 2,
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" sx={{ fontSize: 16 }} />
                  </InputAdornment>
                ),
                endAdornment: searchInput && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSearchInput('');
                        setSearch('');
                      }}
                      sx={{ p: 0 }}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Stack 
              direction="row" 
              spacing={0.5}
              sx={{ 
                flexShrink: 0,
                justifyContent: { xs: 'center', sm: 'flex-end' }
              }}
            >
              <Tooltip title="Filter Alerts">
                <IconButton
                  size="small"
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: '#fff',
                      borderColor: 'primary.main',
                    },
                  }}
                  onClick={handleFilterOpen}
                >
                  <FilterListIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
              <FilterPopover
                open={Boolean(filterAnchorEl)}
                anchorEl={filterAnchorEl}
                onClose={handleFilterClose}
                fields={[
                  { name: 'status', label: 'Status', type: 'select', options: statusOptions },
                  { name: 'type', label: 'Type', type: 'select', options: typeOptions },
                  { name: 'date_from', label: 'Date From', type: 'date' },
                  { name: 'date_to', label: 'Date To', type: 'date' },
                ]}
                values={filterValues}
                onChange={handleFilterChange}
                onApply={handleFilterApply}
                onReset={handleFilterReset}
              />
            </Stack>
          </Box>
        </Box>

        <Box sx={{ overflow: 'auto', p: 0.75 }}>
          {loading || searchLoading ? (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              py={4}
              textAlign="center"
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1.5,
                }}
              >
                <WarningIcon sx={{ fontSize: 24, color: theme.palette.mode === 'dark' ? theme.palette.grey[500] : '#999' }} />
              </Box>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Loading alerts...
              </Typography>
            </Box>
          ) : alerts.length === 0 ? (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              py={4}
              textAlign="center"
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1.5,
                }}
              >
                <WarningIcon sx={{ fontSize: 24, color: theme.palette.mode === 'dark' ? theme.palette.grey[500] : '#999' }} />
              </Box>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No alerts found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search criteria.
              </Typography>
            </Box>
          ) : (
            alerts.map((alert, index) => (
              <Accordion
                key={alert.id}
                sx={{
                  mb: 0.75,
                  '&:before': { display: 'none' },
                  borderRadius: 1,
                  overflow: 'hidden',
                  boxShadow: theme.palette.mode === 'dark' ? '0 1px 6px rgba(0,0,0,0.15)' : '0 1px 6px rgba(0,0,0,0.05)',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    boxShadow: theme.palette.mode === 'dark' ? '0 2px 12px rgba(0,0,0,0.2)' : '0 2px 12px rgba(0,0,0,0.08)',
                    transform: 'translateY(-1px)',
                    transition: 'all 0.2s ease-in-out',
                  },
                  backgroundColor: theme.palette.background.paper,
                  cursor: 'pointer',
                }}
              >
                <AccordionSummary
                  expandIcon={null}
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    p: 0.75,
                    '&:hover': { backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : '#fafafa' },
                    '& .MuiAccordionSummary-content': {
                      m: 0
                    },
                    cursor: 'pointer',
                  }}
                >
                                    <Box sx={{ 
                    display: 'flex', 
                    width: '100%', 
                    alignItems: 'center', 
                    gap: { xs: 1.5, sm: 2 },
                    flexWrap: { xs: 'wrap', sm: 'nowrap' }
                  }}>
                    <Box sx={{ flex: { xs: '1 1 100%', sm: '0 0 180px' }, minWidth: { xs: '100%', sm: 'auto' } }}>
                      <Typography variant="caption" color="text.secondary" gutterBottom>
                        Resident
                      </Typography>
                      <Typography variant="body2" fontWeight={600} color="text.primary">
                        {alert.resident?.name || 'Unknown'}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 auto' }, minWidth: { xs: '100%', sm: 0 } }}>
                      <Typography variant="caption" color="text.secondary" gutterBottom>
                        Description
                      </Typography>
                      <Box
                        sx={{
                          color: alert.type === 'urgent' ? '#d32f2f' : 'text.primary',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }}
                      >
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: alert.type === 'urgent' ? '#d32f2f' : 'primary.main',
                            flexShrink: 0
                          }}
                        />
                        <Typography variant="body2" component="span" sx={{ 
                          maxWidth: { xs: '100%', sm: '200px', md: '300px' },
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {alert.description || (alert.type === 'urgent' ? 'URGENT Alert' : 'Incident Report')}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ flex: { xs: '1 1 50%', sm: '0 0 90px' }, textAlign: 'center', minWidth: { xs: '50%', sm: 'auto' } }}>
                      <Typography variant="caption" color="text.secondary" gutterBottom>
                        Date
                      </Typography>
                      <Typography variant="body2" color="text.primary" fontWeight={500} sx={{ fontSize: '0.75rem' }}>
                        {formatDate(alert.reported_at)}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: { xs: '1 1 50%', sm: '0 0 90px' }, textAlign: 'center', minWidth: { xs: '50%', sm: 'auto' } }}>
                      <Typography variant="caption" color="text.secondary" gutterBottom>
                        Time
                      </Typography>
                      <Typography variant="body2" color="text.primary" fontWeight={500} sx={{ fontSize: '0.75rem' }}>
                        {formatTime(alert.reported_at)}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: { xs: '1 1 100%', sm: '0 0 110px' }, textAlign: 'center', minWidth: { xs: '100%', sm: 'auto' }, ml: { xs: 0, sm: 1 } }}>
                      <Typography variant="caption" color="text.secondary" gutterBottom>
                        Status
                      </Typography>
                      <FormControl size="small" sx={{ minWidth: 90, width: '100%' }}>
                        <Select
                          value={alert.status}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleStatusChange(alert.id, e.target.value);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => e.stopPropagation()}
                          sx={{
                            height: 28,
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            color: '#fff',
                            '& .MuiSelect-select': {
                              py: 0.25,
                              px: 0.75,
                              color: '#fff',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              border: 'none'
                            },
                            '& .MuiSelect-icon': {
                              color: '#fff',
                            },
                            backgroundColor: getStatusColor(alert.status, theme),
                            borderRadius: 1,
                            '&:hover': {
                              backgroundColor: getStatusHoverColor(alert.status, theme),
                            },
                          }}
                        >
                          {statusOptions.map((status) => (
                            <MenuItem key={status} value={status} sx={{ fontSize: '0.7rem' }}>
                              {status}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : '#ffffff', py: 1, px: 0 }}>
                  <Grid container spacing={1} justifyContent="center">
                    <Grid xs={12} sm={6} md={4}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 1.5,
                          backgroundColor: theme.palette.background.paper,
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        <Typography variant="subtitle1" color="primary.main" gutterBottom sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                          Resident Information
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Resident Name
                            </Typography>
                            <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>
                              {alert.resident?.name || 'Unknown'}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Contact Number
                            </Typography>
                            <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>
                              {alert.resident?.contact_no || 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                    <Grid xs={12} sm={4}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 1.5,
                          backgroundColor: theme.palette.background.paper,
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        <Typography variant="subtitle1" color="primary.main" gutterBottom sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                          Alert Details
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Type
                            </Typography>
                            <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>
                              {alert.type}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Location
                            </Typography>
                            <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>
                              {alert.location || 'N/A'}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Description
                            </Typography>
                            <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>
                              {alert.description || 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                    <Grid xs={12} sm={4}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 1.5,
                          backgroundColor: theme.palette.background.paper,
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        <Typography variant="subtitle1" color="primary.main" gutterBottom sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                          Response Information
                        </Typography>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Notified Parties
                          </Typography>
                          <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>
                            {alert.notified_party || 'N/A'}
                          </Typography>
                        </Box>
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Reported At
                          </Typography>
                          <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>
                            {new Date(alert.reported_at).toLocaleString()}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>

                </AccordionDetails>
              </Accordion>
            ))
          )}
        </Box>


        {/* Pagination Controls */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            p: 0.75,
            gap: 0.75,
            borderRadius: 1,
            borderColor: 'divider',
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : '#ffffff',
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
              onClick={() => {
                const newPage = currentPage - 1;
                setCurrentPage(newPage);
                fetchAlerts(newPage, search, filterValues);
              }}
              disabled={currentPage === 1}
              sx={{
                border: '1.5px solid',
                borderColor: currentPage === 1 ? 'divider' : 'primary.main',
                borderRadius: 2,
                mx: 0.5,
                bgcolor: 'background.paper',
                color: currentPage === 1 ? 'text.disabled' : 'primary.main',
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
              <ChevronLeftIcon sx={{ color: currentPage === 1 ? 'text.disabled' : 'primary.main' }} />
            </IconButton>
            <IconButton
              onClick={() => {
                const newPage = currentPage + 1;
                setCurrentPage(newPage);
                fetchAlerts(newPage, search, filterValues);
              }}
              disabled={currentPage >= totalPages}
              sx={{
                border: '1.5px solid',
                borderColor: currentPage >= totalPages ? 'divider' : 'primary.main',
                borderRadius: 2,
                mx: 0.5,
                bgcolor: 'background.paper',
                color: currentPage >= totalPages ? 'text.disabled' : 'primary.main',
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
              <ChevronRightIcon sx={{ color: currentPage >= totalPages ? 'text.disabled' : 'primary.main' }} />
            </IconButton>
          </Box>
                </Box>
        </Paper>
      </Box>
    );
  }

export default Alerts; 
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
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FloraTable from '../../../components/FloraTable';
import DeleteConfirmationModal from '../../../components/DeleteConfirmationModal';
import apiService from '../../../services/api';


function Collection() {
  const [collections, setCollections] = useState([]);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [filterValues, setFilterValues] = useState({ 
    year: new Date().getFullYear().toString(),
    street: 'all',
    month: 'all'
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 9,
    total: 0,
    from: 0,
    to: 0
  });
  const [amountDialog, setAmountDialog] = useState({ open: false, data: null, amount: '' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, data: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [yearOptions, setYearOptions] = useState([]);
  const [streetOptions, setStreetOptions] = useState([]);
  const [monthOptions, setMonthOptions] = useState([]);
  const rowsPerPage = 9;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const fetchData = async (pageNum = 1) => {
    try {
      if (pageNum === 1) {
        setSearchLoading(true);
      } else {
        setLoading(true);
      }
      
      const filters = {
        year: filterValues.year,
        street: filterValues.street !== 'all' ? filterValues.street : undefined,
        month: filterValues.month !== 'all' ? filterValues.month : undefined
      };

      const response = await apiService.getCollections(pageNum, search, filters);
      
      if (response.success) {
        setCollections(response.data || []);
        setPagination({
          current_page: response.current_page || 1,
          last_page: response.last_page || 1,
          per_page: response.per_page || 9,
          total: response.total || 0,
          from: response.from || 0,
          to: response.to || 0
        });
      } else {
        console.error('Failed to fetch collections:', response.message);
        setCollections([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setCollections([]);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const [yearsResponse, streetsResponse, monthsResponse] = await Promise.all([
        apiService.getCollectionYears(),
        apiService.getCollectionStreets(),
        apiService.getCollectionMonths()
      ]);

      if (yearsResponse.success) {
        const yrs = yearsResponse.data.map((y) => y.toString()).sort((a, b) => Number(b) - Number(a));
        setYearOptions(yrs);
        // Ensure selected year is in options; if not, pick latest
        if (yrs.length && !yrs.includes(filterValues.year)) {
          setFilterValues((f) => ({ ...f, year: yrs[0] }));
        }
      }

      if (streetsResponse.success) {
        setStreetOptions(['all', ...streetsResponse.data]);
      }

      if (monthsResponse.success) {
        setMonthOptions(['all', ...monthsResponse.data]);
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const handleSetAmount = async (collection) => {
    try {
      const response = await apiService.updateCollectionAmount(
        collection.originalData.id, 
        parseFloat(amountDialog.amount)
      );
      
      if (response.success) {
        setSnackbar({ open: true, message: 'Collection amount updated successfully', severity: 'success' });
        setAmountDialog({ open: false, data: null, amount: '' });
        // Refresh the data
        fetchData(page);
      } else {
        setSnackbar({ open: true, message: response.message || 'Failed to update collection amount', severity: 'error' });
      }
    } catch (error) {
      console.error('Error updating collection amount:', error);
      setSnackbar({ open: true, message: 'Failed to update collection amount', severity: 'error' });
    }
  };

  const handleEdit = (row) => {
    const amount = row.originalData?.amount_per_resident || '';
    setAmountDialog({ 
      open: true, 
      data: row, 
      amount: amount.toString() 
    });
  };

  const handleDelete = async () => {
    if (!deleteDialog.data) return;
    
    try {
      const response = await apiService.deleteCollection(deleteDialog.data.originalData.id);
      
      if (response.success) {
        setSnackbar({ open: true, message: 'Collection deleted successfully', severity: 'success' });
        setDeleteDialog({ open: false, data: null });
        // Refresh the data
        fetchData(page);
      } else {
        setSnackbar({ open: true, message: response.message || 'Failed to delete collection', severity: 'error' });
      }
    } catch (error) {
      console.error('Error deleting collection:', error);
      setSnackbar({ 
        open: true, 
        message: error.message || 'Failed to delete collection', 
        severity: 'error' 
      });
    }
  };

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    fetchData(1);
  }, []);

  useEffect(() => {
    fetchData(page);
  }, [page]);

  // Add effect to handle search and filter changes
  useEffect(() => {
    setPage(1); // Reset to first page when search or filters change
    fetchData(1);
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

  // Check if any filters are active
  const hasActiveFilters = filterValues.year !== new Date().getFullYear().toString() || filterValues.street !== 'all' || filterValues.month !== 'all';

  const handleYearChange = (e) => setFilterValues(f => ({ ...f, year: e.target.value }));
  const handleStreetChange = (e) => setFilterValues(f => ({ ...f, street: e.target.value }));
  const handleMonthChange = (e) => setFilterValues(f => ({ ...f, month: e.target.value }));

  // Transform data for table
  const transformData = (data) => {
    return data.map(item => ({
      id: item.id,
      month: item.month,
      street: item.street,
      needToCollect: item.needToCollect,
      totalResidents: item.totalResidents,
      reason: item.reason || 'No reason specified',
      // Keep original data for actions
      originalData: item.originalData
    }));
  };

  const transformedData = transformData(collections);

  // Actions for each row
  const actions = [
    {
      icon: <EditIcon fontSize="small" />,
      label: 'Edit Amount',
      onClick: handleEdit,
      color: 'primary'
    },
    {
      icon: <DeleteIcon fontSize="small" />,
      label: 'Delete',
      onClick: (row) => setDeleteDialog({ open: true, data: row }),
      color: 'error'
    }
  ];

  const columns = [
    { id: 'month', label: 'Month' },
    { id: 'street', label: 'Street' },
    { id: 'needToCollect', label: 'To Collect' },
    { id: 'totalResidents', label: 'Total Residents' },
    { id: 'reason', label: 'Reason for Collection' },
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
            <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' }, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search by month, street, or reason..."
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
              <FormControl size="small" sx={{ width: { xs: '100%', sm: 150 } }}>
                <InputLabel>Year</InputLabel>
                <Select
                  value={filterValues.year}
                  label="Year"
                  onChange={handleYearChange}
                  sx={{
                    height: 40,
                    '& .MuiSelect-select': {
                      py: 0,
                      display: 'flex',
                      alignItems: 'center',
                    },
                  }}
                >
                  {yearOptions.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ width: { xs: '100%', sm: 180 } }}>
                <InputLabel>Month</InputLabel>
                <Select
                  value={filterValues.month}
                  label="Month"
                  onChange={handleMonthChange}
                  sx={{
                    height: 40,
                    '& .MuiSelect-select': {
                      py: 0,
                      display: 'flex',
                      alignItems: 'center',
                    },
                  }}
                >
                  {monthOptions.map((month) => (
                    <MenuItem key={month} value={month}>
                      {month === 'all' ? 'All Months' : month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ width: { xs: '100%', sm: 150 } }}>
                <InputLabel>Street</InputLabel>
                <Select
                  value={filterValues.street}
                  label="Street"
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
                  {streetOptions.map((street) => (
                    <MenuItem key={street} value={street}>
                      {street === 'all' ? 'All Streets' : street}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Stack direction="row" spacing={1} sx={{ width: { xs: '100%', sm: 'auto' } }}>
              <Tooltip title="Add Collection">
                <IconButton 
                  color="primary" 
                  size="small" 
                  onClick={() => navigate('/billing-payment/add-collection')}
                  sx={{ '&:hover': { bgcolor: 'primary.main', color: '#fff' } }}
                >
                  <AddIcon fontSize="small" />
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
                {hasActiveFilters && `Filters: ${[
                  filterValues.year !== new Date().getFullYear().toString() && `Year: ${filterValues.year}`,
                  filterValues.month !== 'all' && `Month: ${filterValues.month}`,
                  filterValues.street !== 'all' && `Street: ${filterValues.street}`
                ].filter(Boolean).join(', ')}`}
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
            emptyMessage="No collections found."
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

      {/* Edit Amount Dialog */}
      <Dialog
        open={amountDialog.open}
        onClose={() => setAmountDialog({ open: false, data: null, amount: '' })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Edit Collection Amount
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Edit the amount to collect per resident for {amountDialog.data?.originalData?.month} {amountDialog.data?.originalData?.year} - {amountDialog.data?.originalData?.street}
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Amount per resident"
            type="number"
            fullWidth
            variant="outlined"
            value={amountDialog.amount}
            onChange={(e) => setAmountDialog(prev => ({ ...prev, amount: e.target.value }))}
            InputProps={{
              startAdornment: <InputAdornment position="start">₱</InputAdornment>,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setAmountDialog({ open: false, data: null, amount: '' })}
            color="inherit"
          >
            Cancel
          </Button>
          <Button 
            onClick={() => handleSetAmount(amountDialog.data)}
            color="primary"
            variant="contained"
            disabled={!amountDialog.amount || parseFloat(amountDialog.amount) <= 0}
          >
            Update Amount
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationModal
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, data: null })}
        onConfirm={handleDelete}
        title="Delete Collection"
        message={`Are you sure you want to delete the collection for ${deleteDialog.data?.originalData?.month} ${deleteDialog.data?.originalData?.year} - ${deleteDialog.data?.originalData?.street}?`}
        itemName="collection"
      />

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

export default Collection; 
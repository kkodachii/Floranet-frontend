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
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useTheme } from '@mui/material/styles';
import FloraTable from '../../../components/FloraTable';
import StatusBadge from '../../../components/StatusBadge';
import FilterPopover from '../../../components/FilterPopover';
import EditRemarksModal from '../../../components/EditRemarksModal';
import ComplaintAccordion from '../../../components/ComplaintAccordion';
import ExpandableFloraTable from '../../../components/ExpandableFloraTable';
import StatusPriorityDropdown from '../../../components/StatusPriorityDropdown';
import apiService from '../../../services/api';

const columns = [
  { id: 'log_id', label: 'Log ID' },
  { id: 'complained_at', label: 'Date & Time' },
  { id: 'resident_name', label: 'Resident Name' },
  { id: 'complained_title', label: 'Title' },
  { id: 'priority', label: 'Priority' },
  { id: 'status', label: 'Status' },
  { id: 'remarks', label: 'Remarks' },
  { id: 'actions', label: 'Actions' },
];

const statusOptions = ['pending', 'in_progress', 'resolved'];
const priorityOptions = ['none', 'low', 'medium', 'high'];
const categoryOptions = ['general', 'service'];

export default function GeneralComplaints() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [filterValues, setFilterValues] = useState({ 
    status: '', 
    priority: '', 
    category: 'general' // Default to general complaints
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
  const [remarksModalOpen, setRemarksModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [updatingRemarks, setUpdatingRemarks] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Fetch complaints from API
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {
        ...filterValues,
        category: 'general' // Always filter for general complaints
      };
      
      console.log('Fetching complaints with filters:', filters); // Debug log
      
      const response = await apiService.getComplaintsFiltered(page, search, filters);
      
      console.log('API response:', response); // Debug log
      
      setComplaints(response.data);
      setPagination({
        current_page: response.meta.current_page,
        last_page: response.meta.last_page,
        per_page: response.meta.per_page,
        total: response.meta.total,
        from: response.meta.from,
        to: response.meta.to
      });
    } catch (err) {
      console.error('Error fetching complaints:', err);
      setError(err.message || 'Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  // Fetch complaints when component mounts or dependencies change
  useEffect(() => {
    fetchComplaints();
  }, [page, search, filterValues]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      await apiService.updateComplaintStatus(complaintId, newStatus);
      
      // Update the complaint in the local state
      setComplaints(prevComplaints => 
        prevComplaints.map(complaint => 
          complaint.id === complaintId 
            ? { ...complaint, status: newStatus }
            : complaint
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
    console.log('Filter change:', name, value); // Debug log
    setFilterValues(prev => ({ ...prev, [name]: value }));
    setPage(1); // Reset to first page when filtering
  };
  
  const handleFilterReset = () => {
    console.log('Filter reset'); // Debug log
    setFilterValues({ status: '', priority: '', category: 'general' });
    setPage(1);
  };
  
  const handleFilterApply = () => {
    console.log('Filter apply, current values:', filterValues); // Debug log
    handleFilterClose();
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleRemarksUpdate = async (complaintId, remarks) => {
    try {
      setUpdatingRemarks(true);
      await apiService.updateComplaintRemarks(complaintId, remarks);
      
      // Update the complaint in the local state
      setComplaints(prevComplaints => 
        prevComplaints.map(complaint => 
          complaint.id === complaintId 
            ? { ...complaint, remarks }
            : complaint
        )
      );
      
      setSnackbar({
        open: true,
        message: 'Remarks updated successfully',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error updating remarks:', err);
      throw err; // Re-throw to be handled by the modal
    } finally {
      setUpdatingRemarks(false);
    }
  };

  const handleEditRemarks = (complaint) => {
    setSelectedComplaint(complaint);
    setRemarksModalOpen(true);
  };

  const handleCloseRemarksModal = () => {
    setRemarksModalOpen(false);
    setSelectedComplaint(null);
  };

  const handleToggleRow = (complaintId) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(complaintId)) {
      newExpandedRows.delete(complaintId);
    } else {
      newExpandedRows.add(complaintId);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleUpdateRemarksWithFollowups = async (complaintId, remarks) => {
    try {
      setUpdatingRemarks(true);
      await apiService.updateComplaintRemarks(complaintId, remarks);
      
      // Update the complaint in the local state
      setComplaints(prevComplaints => 
        prevComplaints.map(complaint => 
          complaint.id === complaintId 
            ? { ...complaint, remarks }
            : complaint
        )
      );
      
      setSnackbar({
        open: true,
        message: 'Followup updated successfully',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error updating followup:', err);
      throw err;
    } finally {
      setUpdatingRemarks(false);
    }
  };

  const handleUpdateFollowups = async (complaintId, followups) => {
    try {
      setUpdatingRemarks(true);
      const response = await apiService.updateComplaintFollowups(complaintId, followups);
      
      // Update the complaint in the local state with the response data
      setComplaints(prevComplaints => 
        prevComplaints.map(complaint => 
          complaint.id === complaintId 
            ? { ...complaint, followups: response.data.followups }
            : complaint
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
    } finally {
      setUpdatingRemarks(false);
    }
  };

  const handlePriorityChange = async (complaintId, newPriority) => {
    try {
      await apiService.updateComplaintPriority(complaintId, newPriority);
      
      // Update the complaint in the local state
      setComplaints(prevComplaints => 
        prevComplaints.map(complaint => 
          complaint.id === complaintId 
            ? { ...complaint, priority: newPriority }
            : complaint
        )
      );
      
      setSnackbar({
        open: true,
        message: 'Priority updated successfully',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error updating priority:', err);
      setSnackbar({
        open: true,
        message: err.message || 'Failed to update priority',
        severity: 'error'
      });
    }
  };

  // Transform complaints data for the table
  const tableRows = complaints.map(complaint => {
    const isExpanded = expandedRows.has(complaint.id);
    
    return {
      ...complaint,
      resident_name: complaint.resident?.name || 'N/A',
      complained_at: new Date(complaint.complained_at).toLocaleString(),
      complained_title: (
        <Box sx={{ 
          maxWidth: 280,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          lineHeight: 1.4,
          fontSize: '0.875rem'
        }}>
          {complaint.complained_title}
        </Box>
      ),
      priority: (
        <StatusPriorityDropdown
          value={complaint.priority}
          options={priorityOptions}
          onUpdate={(newPriority) => handlePriorityChange(complaint.id, newPriority)}
          type="priority"
        />
      ),
      status: (
        <StatusPriorityDropdown
          value={complaint.status}
          options={statusOptions}
          onUpdate={(newStatus) => handleStatusChange(complaint.id, newStatus)}
          type="status"
          disabled={complaint.status === 'resolved'}
        />
      ),
      remarks: (
        <Box sx={{ 
          maxWidth: 280,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          lineHeight: 1.4,
          fontSize: '0.875rem',
          color: complaint.remarks ? 'text.primary' : 'text.secondary',
          fontStyle: complaint.remarks ? 'normal' : 'italic'
        }}>
          {complaint.remarks || 'No remarks'}
        </Box>
      ),
      actions: (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="View Details & Followups">
            <IconButton
              size="small"
              onClick={() => handleToggleRow(complaint.id)}
              sx={{ '&:hover': { bgcolor: 'primary.main', color: '#fff' } }}
            >
              {isExpanded ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Remarks">
            <IconButton
              size="small"
              onClick={(e) => handleEditRemarks(complaint)}
              sx={{ '&:hover': { bgcolor: 'primary.main', color: '#fff' } }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
      // Add accordion data for expanded rows
      accordion: isExpanded ? (
        <ComplaintAccordion
          complaint={complaint}
          onUpdateRemarks={handleUpdateRemarksWithFollowups}
          onUpdateFollowups={handleUpdateFollowups}
          loading={updatingRemarks}
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
              placeholder="Search complaints..."
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
                  { name: 'priority', label: 'Priority', type: 'select', options: priorityOptions },
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
              emptyMessage="No complaints found."
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
      
      <EditRemarksModal
        open={remarksModalOpen}
        handleClose={handleCloseRemarksModal}
        complaint={selectedComplaint}
        onSave={handleRemarksUpdate}
        loading={updatingRemarks}
      />
    </Box>
  );
} 
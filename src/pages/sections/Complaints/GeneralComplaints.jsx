import React, { useState } from 'react';
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
  Menu,
  MenuItem,
  ListItemText
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTheme } from '@mui/material/styles';
import FloraTable from '../../../components/FloraTable';
import StatusBadge from '../../../components/StatusBadge';

const columns = [
  { id: 'logId', label: 'Log ID' },
  { id: 'dateTime', label: 'Date & Time' },
  { id: 'residentName', label: 'Resident Name' },
  { id: 'serviceType', label: 'Service Type' },
  { id: 'triggerType', label: 'Trigger Type' },
  { id: 'status', label: 'Status' },
  { id: 'remarks', label: 'Remarks' },
  { id: 'actions', label: 'Actions' },
];

const initialRows = [
  { logId: '001', dateTime: '2025-04-07 09:24 AM', residentName: 'Juan Dela Cruz', serviceType: 'Emergency Alert', triggerType: 'Accidental Tap', status: 'Resolved', remarks: 'User reported misclick' },
  { logId: '002', dateTime: '2025-04-07 11:03 AM', residentName: 'Carlos Reyes', serviceType: 'Maintenance Request', triggerType: 'Accidental Tap', status: 'Cancelled', remarks: 'User contacted support to cancel' },
  { logId: '003', dateTime: '2025-04-06 05:30 PM', residentName: 'Rico Fernandez', serviceType: 'Visitor Pass Request', triggerType: 'Accidental Tap', status: 'Resolved', remarks: 'Visitor request deleted by user' },
  { logId: '004', dateTime: '2025-04-05 08:10 AM', residentName: 'Anna Lopez', serviceType: 'Gate Pass Renewal', triggerType: 'Accidental Tap', status: 'Miscall', remarks: 'No action taken after user inquiry' },
  { logId: '005', dateTime: '2025-04-04 07:45 AM', residentName: 'Miguel Torres', serviceType: 'Emergency Alert', triggerType: 'Accidental Tap', status: 'Resolved', remarks: 'Guardhouse contacted, stood' },
  { logId: '006', dateTime: '2025-04-03 10:15 AM', residentName: 'Liza Cruz', serviceType: 'Emergency Alert', triggerType: 'Manual', status: 'Resolved', remarks: 'Handled by admin' },
  { logId: '007', dateTime: '2025-04-02 02:30 PM', residentName: 'Mario Santos', serviceType: 'Maintenance Request', triggerType: 'Accidental Tap', status: 'Cancelled', remarks: 'Duplicate request' },
  { logId: '008', dateTime: '2025-04-01 09:00 AM', residentName: 'Nina Reyes', serviceType: 'Visitor Pass Request', triggerType: 'Manual', status: 'Resolved', remarks: 'Approved by guard' },
  { logId: '009', dateTime: '2025-03-31 04:20 PM', residentName: 'Oscar Lopez', serviceType: 'Gate Pass Renewal', triggerType: 'Accidental Tap', status: 'Miscall', remarks: 'No follow up' },
  { logId: '010', dateTime: '2025-03-30 11:10 AM', residentName: 'Paula Torres', serviceType: 'Emergency Alert', triggerType: 'Manual', status: 'Resolved', remarks: 'Security dispatched' },
  { logId: '011', dateTime: '2025-03-29 08:00 AM', residentName: 'Quinn Garcia', serviceType: 'Maintenance Request', triggerType: 'Manual', status: 'Resolved', remarks: 'Issue fixed' },
  { logId: '012', dateTime: '2025-03-28 03:45 PM', residentName: 'Rita Fernandez', serviceType: 'Visitor Pass Request', triggerType: 'Accidental Tap', status: 'Cancelled', remarks: 'User cancelled' },
];

const statusOptions = ['Resolved', 'Cancelled', 'Miscall', 'Pending', 'In Progress'];

export default function GeneralComplaints() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [allRows, setAllRows] = useState(initialRows);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const rowsPerPage = 7;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSearch = (e) => setSearch(e.target.value);

  const handleStatusChange = (logId, newStatus) => {
    setAllRows(prevRows => 
      prevRows.map(row => 
        row.logId === logId ? { ...row, status: newStatus } : row
      )
    );
    setAnchorEl(null);
    setSelectedRowId(null);
  };

  const handleMenuOpen = (event, logId) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(logId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRowId(null);
  };

  // Filter rows by search
  const filteredRows = allRows.filter(row =>
    Object.values(row).join(' ').toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const total = filteredRows.length;
  const from = total === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const to = Math.min(page * rowsPerPage, total);
  const paginatedRows = filteredRows.slice((page - 1) * rowsPerPage, page * rowsPerPage).map(row => ({
    ...row,
    status: <StatusBadge status={row.status} />,
    actions: (
      <IconButton
        size="small"
        onClick={(e) => handleMenuOpen(e, row.logId)}
        sx={{ '&:hover': { bgcolor: 'primary.main', color: '#fff' } }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
    )
  }));

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
                <IconButton color="default" size="small" sx={{ '&:hover': { bgcolor: 'primary.main', color: '#fff' } }}>
                  <FilterListIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
          <FloraTable
            columns={columns}
            rows={paginatedRows}
            actions={[]}
            page={1}
            rowsPerPage={rowsPerPage}
            maxHeight={tableMaxHeight}
            emptyMessage="No complaints found."
            loading={false}
          />
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                minWidth: 150,
                boxShadow: 3,
                '& .MuiMenuItem-root': {
                  py: 1,
                  px: 2,
                  '&:hover': {
                    bgcolor: 'primary.main',
                    color: '#fff',
                  }
                }
              }
            }}
          >
            {statusOptions.map((status) => (
              <MenuItem
                key={status}
                onClick={() => handleStatusChange(selectedRowId, status)}
              >
                <ListItemText primary={status} />
              </MenuItem>
            ))}
          </Menu>
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
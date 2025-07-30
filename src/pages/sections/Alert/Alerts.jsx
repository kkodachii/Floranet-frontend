import React, { useState } from 'react';
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
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import WarningIcon from '@mui/icons-material/Warning';
import { useTheme } from '@mui/material/styles';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FloraTable from '../../../components/FloraTable';

// Mock alerts data based on the image
const mockAlerts = [
  {
    id: 1,
    residentName: 'Maria Lopez',
    homeownerName: 'Cristina Lopez',
    contactNumber: '+639061234567',
    blockLot: 'B5A-L10',
    street: 'Camia',
    date: '2025-04-07',
    time: '08:15 AM',
    reason: 'Package Theft Suspected',
    status: 'Resolved',
    notifiedParties: 'Guardhouse',
    isAlert: true
  },
  {
    id: 2,
    residentName: 'Jose Ramos',
    homeownerName: 'Roberto Ramos',
    contactNumber: '09351122334',
    blockLot: 'B3C-L04',
    street: 'Bongavilla',
    date: '2025-04-06',
    time: '10:45 PM',
    reason: 'Stranger Seen Near Gate',
    status: 'Responded',
    notifiedParties: 'Guardhouse',
    isAlert: true
  },
  {
    id: 3,
    residentName: 'Carmen Dizon',
    homeownerName: 'Ana Mendoza',
    contactNumber: '09351234567',
    blockLot: 'B7F-L19',
    street: 'Dahlia',
    date: '2025-04-06',
    time: '03:25 PM',
    reason: 'Possible Vandalism',
    status: 'Resolved',
    notifiedParties: 'Guardhouse',
    isAlert: true
  },
  {
    id: 4,
    residentName: 'Roberto Santos',
    homeownerName: 'Elena Santos',
    contactNumber: '09181234567',
    blockLot: 'B2A-L15',
    street: 'Champaca',
    date: '2025-04-05',
    time: '11:30 AM',
    reason: 'Attempted Break-in',
    status: 'Investigation Ongoing',
    notifiedParties: 'Security, Police',
    isAlert: true
  },
  {
    id: 5,
    residentName: 'Patricia Cruz',
    homeownerName: 'Fernando Cruz',
    contactNumber: '09101122334',
    blockLot: 'B4B-L08',
    street: 'Sampaguita',
    date: '2025-04-05',
    time: '09:20 AM',
    reason: 'Suspicious Car Parked Nearby',
    status: 'Escalated',
    notifiedParties: 'Admin Office',
    isAlert: true
  },
  {
    id: 6,
    residentName: 'Michael Garcia',
    homeownerName: 'Lito Garcia',
    contactNumber: '+639291234567',
    blockLot: 'B5D-L02',
    street: 'Adelfa',
    date: '2025-04-04',
    time: '07:45 PM',
    reason: 'Unknown Individual Knocked',
    status: 'Resolved',
    notifiedParties: 'Security Team',
    isAlert: true
  },
  {
    id: 7,
    residentName: 'Jessica Reyes',
    homeownerName: 'Elena Reyes',
    contactNumber: '09181234567',
    blockLot: 'B4C-L08',
    street: 'Gumamela',
    date: '2025-04-04',
    time: '02:15 PM',
    reason: 'CCTV Footage Request for Lost Pet',
    status: 'Resolved',
    notifiedParties: 'Admin Office',
    isAlert: false
  },
  {
    id: 8,
    residentName: 'Leo Aquino',
    homeownerName: 'Mario Aquino',
    contactNumber: '09081234567',
    blockLot: 'B3B-L33',
    street: 'Santan',
    date: '2025-04-03',
    time: '10:30 PM',
    reason: 'Reported Loitering',
    status: 'Responded',
    notifiedParties: 'Barangay, Police',
    isAlert: true
  },
  {
    id: 9,
    residentName: 'Daniel Lopez',
    homeownerName: 'Cristina Lopez',
    contactNumber: '+639061234567',
    blockLot: 'B2D-L16',
    street: 'Jasmine',
    date: '2025-04-03',
    time: '06:20 AM',
    reason: 'Alarm Went Off Unexpectedly',
    status: 'Resolved',
    notifiedParties: 'Security Team',
    isAlert: true
  },
  {
    id: 10,
    residentName: 'Teresa Bonifacio',
    homeownerName: 'Andres Bonifacio',
    contactNumber: '09191234567',
    blockLot: 'B4C-L01',
    street: 'Ilang-ilang',
    date: '2025-04-02',
    time: '04:45 PM',
    reason: 'Check for Trespasser in Garden',
    status: 'Investigation Ongoing',
    notifiedParties: 'Admin, Maintenance',
    isAlert: true
  },
  {
    id: 11,
    residentName: 'Allan Lim',
    homeownerName: 'Jenny Lim',
    contactNumber: '09209234567',
    blockLot: 'B5B-L05',
    street: 'Rosal',
    date: '2025-04-02',
    time: '01:10 PM',
    reason: 'Bike Stolen from Porch',
    status: 'Escalated',
    notifiedParties: 'Security, Police',
    isAlert: true
  },
  {
    id: 12,
    residentName: 'Edwin Torres',
    homeownerName: 'Ramon Torres',
    contactNumber: '09300234567',
    blockLot: 'B1A-L11',
    street: 'Kalachuchi',
    date: '2025-04-01',
    time: '08:55 PM',
    reason: 'Unauthorized Entry in Driveway',
    status: 'Resolved',
    notifiedParties: 'Guardhouse',
    isAlert: true
  },
  {
    id: 13,
    residentName: 'Melanie David',
    homeownerName: 'Grace David',
    contactNumber: '+639331234567',
    blockLot: 'B2C-L19',
    street: 'Camia',
    date: '2025-04-01',
    time: '03:30 PM',
    reason: 'Noise Disruption from Neighbor',
    status: 'Resolved',
    notifiedParties: 'Admin Office',
    isAlert: false
  },
  {
    id: 14,
    residentName: 'Robyn Cruz',
    homeownerName: 'Fernando Cruz',
    contactNumber: '09101122334',
    blockLot: 'B3B-L29',
    street: 'Bongavilla',
    date: '2025-03-31',
    time: '11:45 AM',
    reason: 'Footage for Delivery Dispute',
    status: 'Resolved',
    notifiedParties: 'Admin Office',
    isAlert: false
  },
  {
    id: 15,
    residentName: 'Francis Navarro',
    homeownerName: 'Isabel Navarro',
    contactNumber: '09221122334',
    blockLot: 'B4B-L13',
    street: 'Dahlia',
    date: '2025-03-31',
    time: '09:15 AM',
    reason: 'Footage Request: Fence Damage',
    status: 'Resolved',
    notifiedParties: 'Admin Office',
    isAlert: false
  }
];

function Alerts() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const handleSearch = (e) => setSearch(e.target.value);

  const filteredAlerts = alerts.filter(
    (alert) =>
      Object.values(alert)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  // Actions for each row
  const actions = [
    {
      label: 'Edit',
      onClick: (row) => {
        navigate(`/alerts-security/edit-alert/${row.id}`);
      },
    },
  ];

  const columns = [
    { id: 'residentName', label: 'Resident Name' },
    { 
      id: 'reason', 
      label: 'Reason',
      render: (value, row) => (
        <Box sx={{ color: row.isAlert ? 'error.main' : 'text.primary', fontWeight: row.isAlert ? 600 : 400 }}>
          {value}
        </Box>
      )
    },
    { id: 'date', label: 'Date' },
    { id: 'time', label: 'Time' },
    { 
      id: 'status', 
      label: 'Status',
      render: (value) => {
        const getStatusColor = (status) => {
          switch (status) {
            case 'Resolved': return 'success';
            case 'Responded': return 'info';
            case 'Investigation Ongoing': return 'warning';
            case 'Escalated': return 'error';
            default: return 'default';
          }
        };
        return (
          <Chip 
            label={value} 
            size="small" 
            color={getStatusColor(value)}
            variant="outlined"
            sx={{ fontSize: '0.75rem' }}
          />
        );
      }
    },
  ];



  return (
   
      <Paper 
        elevation={0} 
        sx={{ 
          borderRadius: 3, 
          overflow: 'hidden', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)', 
          backgroundColor: '#fff'
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            p: { xs: 1.5, sm: 2 },
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <WarningIcon sx={{ fontSize: 24, color: 'primary.main' }} />
            <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Resident Alerts
            </Typography>
          </Box>
        </Box>

        {/* Search and Controls Section */}
        <Box
          sx={{
            p: { xs: 1.5, sm: 2 },
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: '#fafafa'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1.5,
            }}
          >
            <TextField
              variant="outlined"
              size="medium"
              placeholder="Search alerts by resident, reason, or status..."
              value={search}
              onChange={handleSearch}
              sx={{
                width: { xs: '100%', sm: 400 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#fff',
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
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <Stack direction="row" spacing={1}>
              <Tooltip title="Filter Alerts">
                <IconButton 
                  sx={{ 
                    backgroundColor: '#fff',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': { 
                      backgroundColor: 'primary.main', 
                      color: '#fff',
                      borderColor: 'primary.main'
                    } 
                  }}
                >
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
        </Box>
        <Box sx={{ height: 'calc(100vh - 200px)', overflow: 'auto', p: 1.5 }}>
          {filteredAlerts.length === 0 ? (
            <Box 
              display="flex" 
              flexDirection="column"
              justifyContent="center" 
              alignItems="center" 
              py={6}
              textAlign="center"
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2
                }}
              >
                <WarningIcon sx={{ fontSize: 32, color: '#999' }} />
              </Box>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {loading ? 'Loading alerts...' : 'No alerts found'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {loading ? 'Please wait while we fetch the latest alerts.' : 'Try adjusting your search criteria.'}
              </Typography>
            </Box>
          ) : (
            filteredAlerts.map((alert, index) => (
              <Accordion 
                key={alert.id} 
                sx={{ 
                  mb: 1.5, 
                  '&:before': { display: 'none' },
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    transform: 'translateY(-1px)',
                    transition: 'all 0.2s ease-in-out'
                  }
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff'
                      }}
                    >
                      <ExpandMoreIcon sx={{ fontSize: 20 }} />
                    </Box>
                  }
                  sx={{
                    backgroundColor: '#fff',
                    p: 1.5,
                    '&:hover': { backgroundColor: '#fafafa' },
                    '& .MuiAccordionSummary-content': {
                      m: 0
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ flex: '0 0 200px' }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Resident
                      </Typography>
                      <Typography variant="body1" fontWeight={600} color="text.primary">
                        {alert.residentName}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Alert Reason
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: '#d32f2f', 
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: '#d32f2f',
                            flexShrink: 0
                          }}
                        />
                        {alert.reason}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: '0 0 100px', textAlign: 'center' }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Date
                      </Typography>
                      <Typography variant="body2" color="text.primary" fontWeight={500}>
                        {alert.date}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: '0 0 100px', textAlign: 'center' }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Time
                      </Typography>
                      <Typography variant="body2" color="text.primary" fontWeight={500}>
                        {alert.time}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: '0 0 120px', textAlign: 'center' }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Status
                      </Typography>
                                              <Chip 
                          label={alert.status === 'Investigation Ongoing' ? 'Ongoing' : alert.status} 
                          size="small" 
                          color={alert.status === 'Resolved' ? 'success' : 
                                 alert.status === 'Responded' ? 'info' : 
                                 alert.status === 'Investigation Ongoing' ? 'warning' : 'error'}
                          sx={{ 
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            borderRadius: 1.5
                          }}
                        />
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ backgroundColor: '#fafafa', py: 2, px: 0 }}>
                  <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} sm={4}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2.5, 
                          backgroundColor: '#fff', 
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          minHeight: '200px'
                        }}
                      >
                        <Typography variant="h6" color="primary.main" gutterBottom sx={{ fontWeight: 600 }}>
                          Homeowner Information
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Homeowner Name
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {alert.homeownerName}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Contact Number
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {alert.contactNumber}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2.5, 
                          backgroundColor: '#fff', 
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          minHeight: '200px'
                        }}
                      >
                        <Typography variant="h6" color="primary.main" gutterBottom sx={{ fontWeight: 600 }}>
                          Property Details
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Block & Lot
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {alert.blockLot}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Street
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {alert.street}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2.5, 
                          backgroundColor: '#fff', 
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          minHeight: '200px'
                        }}
                      >
                        <Typography variant="h6" color="primary.main" gutterBottom sx={{ fontWeight: 600 }}>
                          Response Information
                        </Typography>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Notified Parties
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {alert.notifiedParties}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, px: 2 }}>
                    <Box
                      component="button"
                      onClick={() => actions[0].onClick(alert)}
                      sx={{
                        backgroundColor: 'primary.main',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 2,
                        px: 2.5,
                        py: 1.5,
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }
                      }}
                    >
                      Edit
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))
          )}
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            backgroundColor: '#fafafa'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}
            >
              <Typography variant="caption" fontWeight={600}>
                {filteredAlerts.length}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {filteredAlerts.length === 1 ? 'alert found' : 'alerts found'}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Last updated: {new Date().toLocaleDateString()}
          </Typography>
        </Box>
      </Paper>
  );
}

export default Alerts; 
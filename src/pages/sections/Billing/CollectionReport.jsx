import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  Button,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FloraTable from '../../../components/FloraTable';
import apiService from '../../../services/api';

export default function CollectionReport() {
  const theme = useTheme();
  const [selectedYear, setSelectedYear] = useState('all');
  const [collectionData, setCollectionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [yearOptions, setYearOptions] = useState(['all']);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(12); // Show 12 months per page

  // Load year options
  const loadYearOptions = async () => {
    try {
      const resp = await apiService.getCollectionReportYears();
      if (resp.success) {
        const yrs = resp.data.map((y) => Number(y)).sort((a, b) => b - a);
        setYearOptions(['all', ...yrs]);
        if (selectedYear !== 'all' && !yrs.includes(Number(selectedYear))) {
          setSelectedYear('all');
        }
      } else {
        console.error('Failed to load year options:', resp.message);
      }
    } catch (e) {
      console.error('Error loading year options:', e);
    }
  };

  // Extract unique years from data
  const years = useMemo(() => {
    const yearSet = new Set(collectionData.map((row) => row.year));
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [collectionData]);

  // Filter data by selected year and sort by month (Jan to Dec)
  const filteredRows = useMemo(() => {
    let filtered = selectedYear === 'all' ? collectionData : collectionData.filter((row) => row.year === selectedYear);
    
    // Sort by year (descending) and month (ascending - Jan to Dec)
    return filtered.sort((a, b) => {
      if (a.year !== b.year) {
        return b.year - a.year; // Newer years first
      }
      return a.month - b.month; // January to December
    });
  }, [selectedYear, collectionData]);

  // Calculate pagination info
  const paginationInfo = useMemo(() => {
    if (selectedYear === 'all') {
      const total = filteredRows.length;
      const totalPages = Math.ceil(total / rowsPerPage);
      const from = (page - 1) * rowsPerPage + 1;
      const to = Math.min(page * rowsPerPage, total);
      
      return {
        total,
        totalPages,
        from,
        to,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      };
    }
    return null;
  }, [filteredRows, selectedYear, page, rowsPerPage]);

  // Transform API data to table format
  const transformedRows = useMemo(() => {
    return filteredRows.map((report) => {
      // Get month name safely
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const monthName = report.month_name || monthNames[report.month - 1] || `Month ${report.month}`;
      
      // Parse values safely with fallbacks
      const totalBilled = parseFloat(report.total_bill) || 0;
      const collected = parseFloat(report.collected) || 0;
      const outstanding = totalBilled - collected;
      // Backend returns collection_rate as percentage, convert to decimal
      const collectionRate = parseFloat(report.collection_rate) / 100 || 0;
      
      const transformedRow = {
        id: `${report.year}-${report.month}`,
        year: report.year.toString(),
        month: `${monthName} ${report.year}`,
        totalBilled: totalBilled,
        collected: collected,
        outstanding: outstanding,
        collectionRate: collectionRate
      };
      
      return transformedRow;
    });
  }, [filteredRows]);

  // Load collection reports
  const loadCollectionReports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getCollectionReports(selectedYear !== 'all' ? selectedYear : null);
      if (response.success) {
        setCollectionData(response.data);
      } else {
        setError('Failed to load collection reports');
      }
    } catch (err) {
      console.error('Error loading collection reports:', err);
      setError(err.message || 'Failed to load collection reports');
    } finally {
      setLoading(false);
    }
  };

  // Load summary data
  const loadSummary = async () => {
    try {
      const year = selectedYear !== 'all' ? selectedYear : null;
      const response = await apiService.getCollectionReportSummary(year);
      if (response.success) {
        setSummary(response.data);
      }
    } catch (err) {
      console.error('Error loading summary:', err);
    }
  };

  // Generate reports for selected year (or current year when 'all')
  const generateCurrentYearReports = async () => {
    try {
      setLoading(true);
      const yearToGenerate = selectedYear !== 'all' ? Number(selectedYear) : new Date().getFullYear();
      const response = await apiService.generateCollectionReportRange(
        yearToGenerate, 1, yearToGenerate, 12
      );
      if (response.success) {
        await loadYearOptions();
        await loadCollectionReports();
        await loadSummary();
      }
    } catch (err) {
      console.error('Error generating reports:', err);
      setError('Failed to generate collection reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadYearOptions();
    loadCollectionReports();
  }, []);

  useEffect(() => {
    loadSummary();
    loadCollectionReports();
  }, [selectedYear]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Reset page when year changes
  useEffect(() => {
    setPage(1);
  }, [selectedYear]);

  // Table columns
  const columns = [
    { id: 'month', label: 'Month', align: 'left' },
    { id: 'totalBilled', label: 'Total Billed', align: 'center', render: (v) => `₱${v.toLocaleString()}` },
    { id: 'collected', label: 'Collected', align: 'center', render: (v) => `₱${v.toLocaleString()}` },
    { id: 'outstanding', label: 'Outstanding', align: 'center', render: (v) => `₱${v.toLocaleString()}` },
    { id: 'collectionRate', label: 'Collection Rate', align: 'center', render: (v) => `${(v * 100).toFixed(1)}%` },
  ];

  return (
    <Box sx={{ p: { xs: 0.5, sm: 1 } }}>
      <Box maxWidth="xl" mx="auto">
        <Paper elevation={3} sx={{ borderRadius: 1, overflow: 'hidden', p: { xs: 0.5, sm: 1 }, boxShadow: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, px: 1, fontFamily: 'monospace' }}
            >
              Collection Report
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="year-select-label">Year</InputLabel>
                <Select
                  labelId="year-select-label"
                  value={selectedYear}
                  label="Year"
                  onChange={(e) => setSelectedYear(e.target.value)}
                  disabled={loading}
                >
                  {yearOptions.map((year) => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                size="small"
                onClick={generateCurrentYearReports}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={16} /> : null}
              >
                Generate Reports
              </Button>
            </Box>
          </Box>

          {/* Summary Cards */}
          {summary && (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
                <Typography variant="h6">₱{(summary.total_billed || 0).toLocaleString()}</Typography>
                <Typography variant="body2">Total Billed</Typography>
              </Paper>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light', color: 'white' }}>
                <Typography variant="h6">₱{(summary.total_collected || 0).toLocaleString()}</Typography>
                <Typography variant="body2">Total Collected</Typography>
              </Paper>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light', color: 'white' }}>
                <Typography variant="h6">₱{((summary.total_billed || 0) - (summary.total_collected || 0)).toLocaleString()}</Typography>
                <Typography variant="body2">Outstanding</Typography>
              </Paper>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light', color: 'white' }}>
                <Typography variant="h6">{(summary.average_collection_rate || 0).toFixed(1)}%</Typography>
                <Typography variant="body2">Avg Collection Rate</Typography>
              </Paper>
            </Box>
          )}

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Loading State */}
          {loading && collectionData.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
              <CircularProgress />
            </Box>
          ) : (
            <FloraTable
              columns={columns}
              rows={transformedRows}
              actions={[]}
              page={page}
              rowsPerPage={rowsPerPage}
              maxHeight="60vh"
              emptyMessage="No collection data found. Click 'Generate Reports' to create collection reports."
              loading={loading}
              zebra={false}
              disableInternalPagination={selectedYear === 'all'}
              paginationInfo={paginationInfo}
              onPageChange={handlePageChange}
              PrevIcon={<ChevronLeftIcon />}
              NextIcon={<ChevronRightIcon />}
            />
          )}
        </Paper>
      </Box>
    </Box>
  );
} 
import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme
} from '@mui/material';
import FloraTable from '../../../components/FloraTable';

// Mock collection report data for two years
const mockCollectionData = [
  // 2025
  { id: '2025-01', year: '2025', month: 'Jan 2025', totalBilled: 120000, collected: 111000, collectionRate: 0.925 },
  { id: '2025-02', year: '2025', month: 'Feb 2025', totalBilled: 120000, collected: 113000, collectionRate: 0.942 },
  { id: '2025-03', year: '2025', month: 'Mar 2025', totalBilled: 120000, collected: 110000, collectionRate: 0.917 },
  { id: '2025-04', year: '2025', month: 'Apr 2025', totalBilled: 120000, collected: 114000, collectionRate: 0.95 },
  { id: '2025-05', year: '2025', month: 'May 2025', totalBilled: 120000, collected: 112500, collectionRate: 0.938 },
  { id: '2025-06', year: '2025', month: 'Jun 2025', totalBilled: 120000, collected: 111500, collectionRate: 0.93 },
  { id: '2025-07', year: '2025', month: 'Jul 2025', totalBilled: 120000, collected: 113500, collectionRate: 0.946 },
  { id: '2025-08', year: '2025', month: 'Aug 2025', totalBilled: 120000, collected: 112000, collectionRate: 0.933 },
  { id: '2025-09', year: '2025', month: 'Sep 2025', totalBilled: 120000, collected: 115000, collectionRate: 0.958 },
  { id: '2025-10', year: '2025', month: 'Oct 2025', totalBilled: 120000, collected: 114500, collectionRate: 0.954 },
  { id: '2025-11', year: '2025', month: 'Nov 2025', totalBilled: 120000, collected: 113000, collectionRate: 0.942 },
  { id: '2025-12', year: '2025', month: 'Dec 2025', totalBilled: 120000, collected: 116000, collectionRate: 0.967 },
  // 2024
  { id: '2024-01', year: '2024', month: 'Jan 2024', totalBilled: 115000, collected: 110000, collectionRate: 0.957 },
  { id: '2024-02', year: '2024', month: 'Feb 2024', totalBilled: 115000, collected: 109000, collectionRate: 0.948 },
  { id: '2024-03', year: '2024', month: 'Mar 2024', totalBilled: 115000, collected: 108000, collectionRate: 0.939 },
  { id: '2024-04', year: '2024', month: 'Apr 2024', totalBilled: 115000, collected: 111000, collectionRate: 0.965 },
  { id: '2024-05', year: '2024', month: 'May 2024', totalBilled: 115000, collected: 110500, collectionRate: 0.961 },
  { id: '2024-06', year: '2024', month: 'Jun 2024', totalBilled: 115000, collected: 107500, collectionRate: 0.935 },
  { id: '2024-07', year: '2024', month: 'Jul 2024', totalBilled: 115000, collected: 112000, collectionRate: 0.974 },
  { id: '2024-08', year: '2024', month: 'Aug 2024', totalBilled: 115000, collected: 109500, collectionRate: 0.952 },
  { id: '2024-09', year: '2024', month: 'Sep 2024', totalBilled: 115000, collected: 113000, collectionRate: 0.983 },
  { id: '2024-10', year: '2024', month: 'Oct 2024', totalBilled: 115000, collected: 114000, collectionRate: 0.991 },
  { id: '2024-11', year: '2024', month: 'Nov 2024', totalBilled: 115000, collected: 110000, collectionRate: 0.957 },
  { id: '2024-12', year: '2024', month: 'Dec 2024', totalBilled: 115000, collected: 115000, collectionRate: 1.0 },
];

export default function CollectionReport() {
  const theme = useTheme();
  const [selectedYear, setSelectedYear] = useState('all');

  // Extract unique years from data
  const years = useMemo(() => {
    const yearSet = new Set(mockCollectionData.map((row) => row.year));
    return Array.from(yearSet).sort((a, b) => b - a);
  }, []);

  // Filter data by selected year
  const filteredRows = useMemo(() => {
    if (selectedYear === 'all') return mockCollectionData;
    return mockCollectionData.filter((row) => row.year === selectedYear);
  }, [selectedYear]);

  // Table columns
  const columns = [
    { id: 'month', label: 'Month', align: 'left' },
    { id: 'totalBilled', label: 'Total Billed', align: 'center', render: (v) => `₱${v.toLocaleString()}` },
    { id: 'collected', label: 'Collected', align: 'center', render: (v) => `₱${v.toLocaleString()}` },
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
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="year-select-label">Year</InputLabel>
              <Select
                labelId="year-select-label"
                value={selectedYear}
                label="Year"
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <MenuItem value="all">All Years</MenuItem>
                {years.map((year) => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <FloraTable
            columns={columns}
            rows={filteredRows}
            actions={[]}
            page={1}
            rowsPerPage={13}
            maxHeight="60vh"
            emptyMessage="No collection data found."
            loading={false}
            zebra={false}
          />
        </Paper>
      </Box>
    </Box>
  );
} 
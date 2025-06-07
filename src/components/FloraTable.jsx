import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Paper,
  Box,
  IconButton,
  useTheme
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

// columns: [{ id, label }], rows: array of objects, actions: [{ icon, label, onClick, color }]
const FloraTable = ({ columns, rows, actions, page, rowsPerPage, zebra = true, maxHeight = '60vh', emptyMessage = 'No data found.', loading = false }) => {
  const theme = useTheme();
  const paginatedRows = rows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <TableContainer component={Paper} sx={{ maxHeight, borderRadius: 1, background: '#fff', px: 0, py: 0 }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow sx={{ background: theme.palette.primary.main }}>
            {columns.map((col) => (
              <TableCell
                key={col.id}
                sx={{
                  fontWeight: 700,
                  fontSize: 13,
                  background: theme.palette.primary.main,
                  color: '#fff',
                  borderBottom: '2px solid ' + theme.palette.primary.main,
                  whiteSpace: 'nowrap',
                  py: 0.5,
                  px: 1,
                }}
              >
                {col.label}
              </TableCell>
            ))}
            {actions && actions.length > 0 && (
              <TableCell align="right" sx={{ fontWeight: 700, fontSize: 13, background: theme.palette.primary.main, color: '#fff', borderBottom: '2px solid ' + theme.palette.primary.main, py: 0.5, px: 1 }}>
                Actions
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedRows.map((row, idx) => (
            <TableRow
              key={row.id || row.residentId || idx}
              hover
              sx={{
                backgroundColor: zebra && idx % 2 === 0 ? theme.palette.action.hover : '#fff',
                transition: 'background 0.2s',
              }}
            >
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  sx={{
                    maxWidth: 120,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: 13,
                    py: 0.5,
                    px: 1,
                  }}
                >
                  <Tooltip title={row[col.id]} placement="top" arrow disableInteractive>
                    <span>{row[col.id]}</span>
                  </Tooltip>
                </TableCell>
              ))}
              {actions && actions.length > 0 && (
                <TableCell align="right" sx={{ py: 0.5, px: 1 }}>
                  {actions.map((action, i) => (
                    <Tooltip title={action.label} key={action.label}>
                      <IconButton
                        size="small"
                        color={action.color || 'default'}
                        onClick={() => action.onClick(row)}
                        sx={action.sx}
                      >
                        {action.icon}
                      </IconButton>
                    </Tooltip>
                  ))}
                </TableCell>
              )}
            </TableRow>
          ))}
          {paginatedRows.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length + (actions && actions.length > 0 ? 1 : 0)} align="center" sx={{ py: 4 }}>
                <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                  {loading ? (
                    <CircularProgress color="primary" />
                  ) : (
                    <>
                      <span role="img" aria-label="empty">😕</span>
                      <span style={{ color: theme.palette.text.secondary }}>{emptyMessage}</span>
                    </>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FloraTable; 
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

// columns: [{ id, label, render }], rows: array of objects, actions: [{ icon, label, onClick, color }]
const FloraTable = ({ columns, rows, actions, page, rowsPerPage, zebra = true, maxHeight = '60vh', emptyMessage = 'No data found.', loading = false }) => {
  const theme = useTheme();
  const paginatedRows = rows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        maxHeight, 
        borderRadius: 1, 
        background: theme.palette.mode === 'light' ? '#fff' : theme.palette.background.paper,
        px: 0, 
        py: 0,
        transition: 'background-color 0.3s ease-in-out'
      }}
    >
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow sx={{ background: theme.palette.primary.main }}>
            {columns.map((col) => (
              <TableCell
                key={col.id}
                align={col.align || 'left'}
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
                backgroundColor: zebra && idx % 2 === 0 
                  ? theme.palette.mode === 'light' 
                    ? theme.palette.action.hover 
                    : theme.palette.action.hover
                  : theme.palette.mode === 'light'
                    ? '#fff'
                    : theme.palette.background.paper,
                transition: 'background-color 0.3s ease-in-out',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                }
              }}
            >
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align || 'left'}
                  sx={{
                    maxWidth: 120,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: 13,
                    py: 0.5,
                    px: 1,
                    color: theme.palette.text.primary,
                    transition: 'color 0.3s ease-in-out'
                  }}
                >
                  <Tooltip title={row[col.id]} placement="top" arrow disableInteractive>
                    <span>
                      {col.render ? col.render(row[col.id], row) : row[col.id]}
                    </span>
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
                        sx={{
                          ...action.sx,
                          '&:hover': {
                            backgroundColor: theme.palette.action.hover,
                          }
                        }}
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
              <TableCell 
                colSpan={columns.length + (actions && actions.length > 0 ? 1 : 0)} 
                align="center" 
                sx={{ 
                  py: 4,
                  color: theme.palette.text.secondary,
                  transition: 'color 0.3s ease-in-out'
                }}
              >
                <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                  {loading ? (
                    <CircularProgress color="primary" />
                  ) : (
                    <>
                      <span>{emptyMessage}</span>
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
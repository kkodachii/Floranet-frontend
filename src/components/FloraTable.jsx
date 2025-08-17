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
  useTheme,
  Typography
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

// columns: [{ id, label, render }], rows: array of objects, actions: [{ icon, label, onClick, color }]
const FloraTable = ({ 
  columns, 
  rows, 
  actions, 
  page, 
  rowsPerPage, 
  zebra = true, 
  maxHeight = '60vh', 
  emptyMessage = 'No data found.', 
  loading = false, 
  disableInternalPagination = false,
  paginationInfo = null,
  onPageChange = null,
  PrevIcon = null,
  NextIcon = null
}) => {
  const theme = useTheme();
  // Always slice the data for pagination, regardless of disableInternalPagination
  const paginatedRows = rows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <Box>
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
                    // Special handling for specific columns
                    ...(col.id === 'log_id' && { minWidth: 100, maxWidth: 120 }),
                    ...(col.id === 'complained_at' && { minWidth: 140, maxWidth: 160 }),
                    ...(col.id === 'resident_name' && { minWidth: 120, maxWidth: 150 }),
                    ...(col.id === 'complained_title' && { minWidth: 200, maxWidth: 300 }),
                    ...(col.id === 'priority' && { minWidth: 80, maxWidth: 100 }),
                    ...(col.id === 'status' && { minWidth: 100, maxWidth: 120 }),
                    ...(col.id === 'remarks' && { minWidth: 200, maxWidth: 300 }),
                    ...(col.id === 'actions' && { minWidth: 100, maxWidth: 120 }),
                    ...(col.id === 'location' && { minWidth: 250, maxWidth: 350 }),
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
                      maxWidth: col.id === 'businessName' || col.id === 'complained_title' || col.id === 'remarks' ? 250 : 120,
                      overflow: col.id === 'businessName' || col.id === 'complained_title' || col.id === 'remarks' ? 'visible' : 'hidden',
                      textOverflow: col.id === 'businessName' || col.id === 'complained_title' || col.id === 'remarks' ? 'clip' : 'ellipsis',
                      whiteSpace: col.id === 'businessName' || col.id === 'complained_title' || col.id === 'remarks' ? 'normal' : 'nowrap',
                      fontSize: 13,
                      py: 0.5,
                      px: 1,
                      color: theme.palette.text.primary,
                      transition: 'color 0.3s ease-in-out',
                      wordBreak: col.id === 'businessName' || col.id === 'complained_title' || col.id === 'remarks' ? 'break-word' : 'normal',
                      minHeight: col.id === 'businessName' || col.id === 'complained_title' || col.id === 'remarks' ? 'auto' : '32px',
                      // Special handling for specific columns
                      ...(col.id === 'log_id' && { minWidth: 100, maxWidth: 120 }),
                      ...(col.id === 'complained_at' && { minWidth: 140, maxWidth: 160 }),
                      ...(col.id === 'resident_name' && { minWidth: 120, maxWidth: 150 }),
                      ...(col.id === 'complained_title' && { minWidth: 200, maxWidth: 300 }),
                      ...(col.id === 'priority' && { minWidth: 80, maxWidth: 100 }),
                      ...(col.id === 'status' && { minWidth: 100, maxWidth: 120 }),
                      ...(col.id === 'remarks' && { minWidth: 200, maxWidth: 300 }),
                      ...(col.id === 'actions' && { minWidth: 100, maxWidth: 120 }),
                      ...(col.id === 'location' && { minWidth: 250, maxWidth: 350 }),
                    }}
                  >
                    {col.id === 'priority' || col.id === 'status' || col.id === 'remarks' || col.id === 'actions' ? (
                      <span style={{ 
                        lineHeight: col.id === 'businessName' || col.id === 'complained_title' || col.id === 'remarks' ? '1.4' : '1.2',
                        maxHeight: col.id === 'complained_title' || col.id === 'remarks' ? '60px' : 'auto',
                        overflow: col.id === 'complained_title' || col.id === 'remarks' ? 'hidden' : 'visible',
                        textOverflow: col.id === 'complained_title' || col.id === 'remarks' ? 'ellipsis' : 'clip',
                        display: col.id === 'complained_title' || col.id === 'remarks' ? '-webkit-box' : 'block',
                        WebkitLineClamp: col.id === 'complained_title' || col.id === 'remarks' ? '3' : 'unset',
                        WebkitBoxOrient: col.id === 'complained_title' || col.id === 'remarks' ? 'vertical' : 'unset',
                      }}>
                        {col.render ? col.render(row[col.id], row) : row[col.id]}
                      </span>
                    ) : (
                      <Tooltip title={row[col.id]} placement="top" arrow disableInteractive>
                        <span style={{ 
                          lineHeight: col.id === 'businessName' || col.id === 'complained_title' || col.id === 'remarks' ? '1.4' : '1.2',
                          maxHeight: col.id === 'complained_title' || col.id === 'remarks' ? '60px' : 'auto',
                          overflow: col.id === 'complained_title' || col.id === 'remarks' ? 'hidden' : 'visible',
                          textOverflow: col.id === 'complained_title' || col.id === 'remarks' ? 'ellipsis' : 'clip',
                          display: col.id === 'complained_title' || col.id === 'remarks' ? '-webkit-box' : 'block',
                          WebkitLineClamp: col.id === 'complained_title' || col.id === 'remarks' ? '3' : 'unset',
                          WebkitBoxOrient: col.id === 'complained_title' || col.id === 'remarks' ? 'vertical' : 'unset',
                        }}>
                          {col.render ? col.render(row[col.id], row) : row[col.id]}
                        </span>
                      </Tooltip>
                    )}
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

      {/* External Pagination Controls */}
      {paginationInfo && onPageChange && (
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
            {paginationInfo.total === 0 ? '0 of 0' : `${paginationInfo.from}–${paginationInfo.to} of ${paginationInfo.total}`}
          </Typography>
          <Box width="100%" display="flex" justifyContent={{ xs: 'center', md: 'flex-end' }}>
            <IconButton
              onClick={() => onPageChange(page - 1)}
              disabled={!paginationInfo.hasPrevPage}
              sx={{
                border: '1.5px solid',
                borderColor: !paginationInfo.hasPrevPage ? 'divider' : 'primary.main',
                borderRadius: 2,
                mx: 0.5,
                bgcolor: 'background.paper',
                color: !paginationInfo.hasPrevPage ? 'text.disabled' : 'primary.main',
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
              {PrevIcon && React.cloneElement(PrevIcon, { 
                sx: { color: !paginationInfo.hasPrevPage ? 'text.disabled' : 'primary.main' } 
              })}
            </IconButton>
            <IconButton
              onClick={() => onPageChange(page + 1)}
              disabled={!paginationInfo.hasNextPage}
              sx={{
                border: '1.5px solid',
                borderColor: !paginationInfo.hasNextPage ? 'divider' : 'primary.main',
                borderRadius: 2,
                mx: 0.5,
                bgcolor: 'background.paper',
                color: !paginationInfo.hasNextPage ? 'text.disabled' : 'primary.main',
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
              {NextIcon && React.cloneElement(NextIcon, { 
                sx: { color: !paginationInfo.hasNextPage ? 'text.disabled' : 'primary.main' } 
              })}
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default FloraTable; 
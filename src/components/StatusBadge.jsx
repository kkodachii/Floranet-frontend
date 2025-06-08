import React from 'react';
import Chip from '@mui/material/Chip';

const statusColors = {
  Resolved: 'success',
  Cancelled: 'default',
  Miscall: 'warning',
};

export default function StatusBadge({ status }) {
  return (
    <Chip
      label={status}
      color={statusColors[status] || 'info'}
      size="small"
      sx={{ fontWeight: 600, fontSize: 12, textTransform: 'capitalize' }}
    />
  );
} 
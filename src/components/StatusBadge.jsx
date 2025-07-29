import React from 'react';
import Chip from '@mui/material/Chip';

const statusColors = {
  Resolved: { 
    backgroundColor: 'rgba(76, 175, 80, 0.25)',
    color: '#4caf50'
  },
  Cancelled: { 
    backgroundColor: 'rgba(244, 67, 54, 0.25)',
    color: '#f44336'
  },
  Miscall: { 
    backgroundColor: 'rgba(255, 152, 0, 0.25)',
    color: '#ff9800'
  },
};

export default function StatusBadge({ status }) {
  const statusStyle = statusColors[status] || {
    backgroundColor: 'rgba(33, 150, 243, 0.25)',
    color: '#2196f3'
  };

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        fontWeight: 600,
        fontSize: 12,
        textTransform: 'capitalize',
        backgroundColor: statusStyle.backgroundColor,
        color: statusStyle.color,
        '& .MuiChip-label': {
          color: statusStyle.color,
        },
        '&:hover': {
          backgroundColor: statusStyle.backgroundColor,
        },
        '&:focus': {
          backgroundColor: statusStyle.backgroundColor,
        }
      }}
    />
  );
}
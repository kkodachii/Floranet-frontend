import React from 'react';
import Chip from '@mui/material/Chip';

const statusColors = {
  // Complaint statuses
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
  // CCTV statuses
  pending: { 
    backgroundColor: 'rgba(255, 152, 0, 0.25)',
    color: '#ff9800'
  },
  in_progress: { 
    backgroundColor: 'rgba(33, 150, 243, 0.25)',
    color: '#2196f3'
  },
  completed: { 
    backgroundColor: 'rgba(76, 175, 80, 0.25)',
    color: '#4caf50'
  },
  cancelled: { 
    backgroundColor: 'rgba(244, 67, 54, 0.25)',
    color: '#f44336'
  },
  // Complaint statuses (lowercase)
  open: { 
    backgroundColor: 'rgba(255, 152, 0, 0.25)',
    color: '#ff9800'
  },
  closed: { 
    backgroundColor: 'rgba(158, 158, 158, 0.25)',
    color: '#9e9e9e'
  },
  resolved: { 
    backgroundColor: 'rgba(76, 175, 80, 0.25)',
    color: '#4caf50'
  },
};

export default function StatusBadge({ status }) {
  const statusStyle = statusColors[status] || {
    backgroundColor: 'rgba(33, 150, 243, 0.25)',
    color: '#2196f3'
  };

  // Format status for display
  const formatStatus = (status) => {
    if (!status) return 'Unknown';
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Chip
      label={formatStatus(status)}
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
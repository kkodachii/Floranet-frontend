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
  // Common statuses
  Open: { 
    backgroundColor: 'rgba(33, 150, 243, 0.25)',
    color: '#2196f3'
  },
  Pending: { 
    backgroundColor: 'rgba(255, 152, 0, 0.25)',
    color: '#ff9800'
  },
  Approved: { 
    backgroundColor: 'rgba(76, 175, 80, 0.25)',
    color: '#4caf50'
  },
  Rejected: { 
    backgroundColor: 'rgba(244, 67, 54, 0.25)',
    color: '#f44336'
  },
  'In Progress': { 
    backgroundColor: 'rgba(156, 39, 176, 0.25)',
    color: '#9c27b0'
  },
  'In_progress': { 
    backgroundColor: 'rgba(156, 39, 176, 0.25)',
    color: '#9c27b0'
  },
  Closed: { 
    backgroundColor: 'rgba(158, 158, 158, 0.25)',
    color: '#9e9e9e'
  },
  // Priority levels
  Low: { 
    backgroundColor: 'rgba(76, 175, 80, 0.25)',
    color: '#4caf50'
  },
  Medium: { 
    backgroundColor: 'rgba(255, 152, 0, 0.25)',
    color: '#ff9800'
  },
  High: { 
    backgroundColor: 'rgba(244, 67, 54, 0.25)',
    color: '#f44336'
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
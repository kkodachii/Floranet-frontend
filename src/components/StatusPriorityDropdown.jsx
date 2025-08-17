import React, { useState } from 'react';
import {
  Box,
  Menu,
  MenuItem,
  ListItemText,
  IconButton,
  Tooltip
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const StatusPriorityDropdown = ({ 
  value, 
  options, 
  onUpdate, 
  type = 'status',
  disabled = false 
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    if (!disabled) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOptionClick = async (option) => {
    try {
      await onUpdate(option);
      handleClose();
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
    }
  };

  const getDisplayText = (value) => {
    if (type === 'status') {
      // CCTV Status display text
      if (value === 'pending') return 'PENDING';
      if (value === 'in_progress') return 'IN PROGRESS';
      if (value === 'completed') return 'COMPLETED';
      if (value === 'cancelled') return 'CANCELLED';
      
      // Fallback for other statuses
      return value === 'open' ? 'OPEN' :
             value === 'in_progress' ? 'IN PROGRESS' :
             value === 'resolved' ? 'RESOLVED' :
             value === 'closed' ? 'CLOSED' : value.toUpperCase();
    } else if (type === 'priority') {
      return value === 'high' ? 'HIGH' :
             value === 'medium' ? 'MEDIUM' : 'LOW';
    }
    return value.toUpperCase();
  };

  const getColor = (value) => {
    if (type === 'status') {
      // CCTV Status colors
      if (value === 'pending') return '#ff9800'; // Orange background
      if (value === 'in_progress') return '#2196f3'; // Blue background
      if (value === 'completed') return '#4caf50'; // Green background
      if (value === 'cancelled') return '#f44336'; // Red background
      
      // Complaint Status colors (same color scheme)
      if (value === 'open') return '#ff9800'; // Orange background (same as pending)
      if (value === 'in_progress') return '#2196f3'; // Blue background
      if (value === 'resolved') return '#4caf50'; // Green background (same as completed)
      if (value === 'closed') return '#9e9e9e'; // Grey background
      
      // Fallback for other statuses
      return 'grey.300';
    } else if (type === 'priority') {
      return value === 'high' ? 'error.light' :
             value === 'medium' ? 'warning.light' : 'success.light';
    }
    return 'grey.300';
  };

  const getTextColor = (value) => {
    if (type === 'status') {
      // CCTV Status text colors
      if (value === 'pending') return '#ffffff'; // White text
      if (value === 'in_progress') return '#ffffff'; // White text
      if (value === 'completed') return '#ffffff'; // White text
      if (value === 'cancelled') return '#ffffff'; // White text
      
      // Complaint Status text colors (same color scheme)
      if (value === 'open') return '#ffffff'; // White text (same as pending)
      if (value === 'in_progress') return '#ffffff'; // White text
      if (value === 'resolved') return '#ffffff'; // White text (same as completed)
      if (value === 'closed') return '#ffffff'; // White text
      
      // Fallback for other statuses
      return 'grey.700';
    } else if (type === 'priority') {
      return value === 'high' ? 'error.contrastText' :
             value === 'medium' ? 'warning.contrastText' : 'success.contrastText';
    }
    return 'grey.700';
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        px: 1.5, 
        py: 0.75, 
        borderRadius: 1, 
        fontSize: '0.75rem',
        fontWeight: 'medium',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.5,
        minWidth: type === 'priority' ? 70 : 110,
        bgcolor: getColor(value),
        color: getTextColor(value),
        cursor: disabled ? 'default' : 'pointer',
        '&:hover': !disabled ? {
          opacity: 0.8,
          transform: 'translateY(-1px)',
          transition: 'all 0.2s ease-in-out'
        } : {}
      }}
      onClick={handleClick}
    >
      <span>{getDisplayText(value)}</span>
      {!disabled && (
        <KeyboardArrowDownIcon 
          fontSize="small" 
          sx={{ 
            fontSize: '0.875rem',
            opacity: 0.8
          }} 
        />
      )}
    </Box>
      
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
      PaperProps={{
        sx: {
          minWidth: 150,
          boxShadow: 3,
          '& .MuiMenuItem-root': {
            py: 1,
            px: 2,
            '&:hover': {
              bgcolor: 'primary.main',
              color: '#fff',
            }
          }
        }
      }}
    >
      {options.filter(option => option !== value).map((option) => (
        <MenuItem
          key={option}
          onClick={() => handleOptionClick(option)}
        >
          <ListItemText primary={getDisplayText(option)} />
        </MenuItem>
      ))}
    </Menu>
  </Box>
  );
};

export default StatusPriorityDropdown; 
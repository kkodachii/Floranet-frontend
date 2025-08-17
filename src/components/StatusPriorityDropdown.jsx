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
      return value === 'open' ? 'OPEN' :
             value === 'in_progress' ? 'IN PROGRESS' :
             value === 'resolved' ? 'RESOLVED' :
             value === 'completed' ? 'COMPLETED' :
             value === 'closed' ? 'CLOSED' :
             value === 'pending' ? 'PENDING' :
             value === 'cancelled' ? 'CANCELLED' : value.toUpperCase();
    } else if (type === 'priority') {
      return value === 'high' ? 'HIGH' :
             value === 'medium' ? 'MEDIUM' : 'LOW';
    }
    return value.toUpperCase();
  };

  const getColor = (value) => {
    if (type === 'status') {
      return value === 'open' ? 'info.light' :
             value === 'in_progress' ? 'warning.light' :
             value === 'resolved' ? 'success.light' :
             value === 'completed' ? 'success.light' :
             value === 'pending' ? 'warning.light' :
             value === 'cancelled' ? 'error.light' :
             value === 'closed' ? 'grey.300' : 'grey.300';
    } else if (type === 'priority') {
      return value === 'high' ? 'error.light' :
             value === 'medium' ? 'warning.light' : 'success.light';
    }
    return 'grey.300';
  };

  const getTextColor = (value) => {
    if (type === 'status') {
      return value === 'open' ? 'info.contrastText' :
             value === 'in_progress' ? 'warning.contrastText' :
             value === 'resolved' ? 'success.contrastText' :
             value === 'completed' ? 'success.contrastText' :
             value === 'pending' ? 'warning.contrastText' :
             value === 'cancelled' ? 'error.contrastText' :
             value === 'closed' ? 'grey.700' : 'grey.700';
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
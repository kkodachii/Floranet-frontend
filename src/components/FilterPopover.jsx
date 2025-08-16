import React from 'react';
import {
  Popover,
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  MenuItem,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

/**
 * FilterPopover - A reusable popover for filtering table data.
 *
 * Props:
 * - open: boolean
 * - anchorEl: element
 * - onClose: function
 * - fields: array of { name, label, type, options? } (type: 'text' | 'select')
 * - values: object (current filter values)
 * - onChange: function (fieldName, value)
 * - onApply: function
 * - onReset: function
 */
const FilterPopover = ({
  open,
  anchorEl,
  onClose,
  fields = [],
  values = {},
  onChange,
  onApply,
  onReset
}) => {
  // Helper function to get display text for status and priority
  const getDisplayText = (value, fieldName) => {
    if (fieldName === 'status') {
      return value === 'open' ? 'OPEN' :
             value === 'in_progress' ? 'IN PROGRESS' :
             value === 'resolved' ? 'RESOLVED' :
             value === 'closed' ? 'CLOSED' : value.toUpperCase();
    } else if (fieldName === 'priority') {
      return value === 'high' ? 'HIGH' :
             value === 'medium' ? 'MEDIUM' : 'LOW';
    }
    return value;
  };

  // Helper function to get current display text for selected value
  const getCurrentDisplayText = (fieldName, currentValue) => {
    if (!currentValue) return 'All';
    return getDisplayText(currentValue, fieldName);
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      PaperProps={{ 
        sx: { 
          p: 3, 
          minWidth: 300, 
          borderRadius: 2,
          boxShadow: 3,
          border: '1px solid',
          borderColor: 'divider'
        } 
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6" fontWeight={600} color="primary.main">
          Filter Options
        </Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: 'text.secondary' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Stack spacing={3}>
        {fields.map((field) => (
          field.type === 'select' ? (
            <TextField
              key={field.name}
              select
              label={field.label}
              value={values[field.name] || ''}
              onChange={e => onChange(field.name, e.target.value)}
              size="medium"
              fullWidth
              placeholder="Select option"
              SelectProps={{
                displayEmpty: false,
                MenuProps: {
                  PaperProps: {
                    sx: {
                      maxHeight: 300
                    }
                  }
                }
              }}
              sx={{
                '& .MuiInputLabel-root': {
                  '&.Mui-focused': {
                    color: 'primary.main'
                  },
                  '&.MuiInputLabel-shrink': {
                    color: 'primary.main'
                  }
                },
                '& .MuiOutlinedInput-root': {
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main'
                  }
                },
                '& .MuiSelect-select': {
                  color: values[field.name] ? 'text.primary' : 'text.secondary'
                }
              }}
            >
              <MenuItem value="" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                All {field.label}
              </MenuItem>
              {field.options && field.options.map(opt => (
                <MenuItem key={opt} value={opt}>
                  {getDisplayText(opt, field.name)}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <TextField
              key={field.name}
              label={field.label}
              value={values[field.name] || ''}
              onChange={e => onChange(field.name, e.target.value)}
              size="medium"
              fullWidth
              sx={{
                '& .MuiInputLabel-root': {
                  '&.Mui-focused': {
                    color: 'primary.main'
                  }
                },
                '& .MuiOutlinedInput-root': {
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main'
                  }
                }
              }}
            />
          )
        ))}
      </Stack>
      <Stack direction="row" spacing={2} mt={3} justifyContent="flex-end">
        <Button 
          onClick={onReset} 
          size="medium" 
          color="inherit"
          sx={{ 
            px: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          Reset
        </Button>
        <Button 
          onClick={onApply} 
          size="medium" 
          variant="contained"
          sx={{ 
            px: 3,
            borderRadius: 2,
            fontWeight: 'bold'
          }}
        >
          Apply Filters
        </Button>
      </Stack>
    </Popover>
  );
};

export default FilterPopover; 
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
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      PaperProps={{ sx: { p: 2, minWidth: 260, borderRadius: 2 } }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <Typography variant="subtitle1" fontWeight={600}>Filter</Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Stack spacing={2}>
        {fields.map((field) => (
          field.type === 'select' ? (
            <TextField
              key={field.name}
              select
              label={field.label}
              value={values[field.name] || ''}
              onChange={e => onChange(field.name, e.target.value)}
              size="small"
              fullWidth
            >
              <MenuItem value="">All</MenuItem>
              {field.options && field.options.map(opt => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </TextField>
          ) : (
            <TextField
              key={field.name}
              label={field.label}
              value={values[field.name] || ''}
              onChange={e => onChange(field.name, e.target.value)}
              size="small"
              fullWidth
            />
          )
        ))}
      </Stack>
      <Stack direction="row" spacing={1} mt={2} justifyContent="flex-end">
        <Button onClick={onReset} size="small" color="inherit">Reset</Button>
        <Button onClick={onApply} size="small" variant="contained">Apply</Button>
      </Stack>
    </Popover>
  );
};

export default FilterPopover; 
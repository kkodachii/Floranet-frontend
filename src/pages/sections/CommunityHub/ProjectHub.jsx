import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

function ProjectHub() {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Paper 
        variant="outlined"
        sx={{ 
          p: 2,
          backgroundColor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
          borderColor: 'divider'
        }}
      >
        <Typography variant="subtitle1" color="text.primary" sx={{ mb: 1 }}>
          Community Projects
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Community projects and updates will be displayed here.
        </Typography>
      </Paper>
    </Box>
  );
}

export default ProjectHub; 
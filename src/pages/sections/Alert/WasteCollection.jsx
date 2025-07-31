import React, { useState } from "react";
import { Box, Paper, Typography, Button, Stack, TextField } from "@mui/material";
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { useTheme } from '@mui/material/styles';

export default function WasteCollection() {
  const [collectionTime, setCollectionTime] = useState("07:30"); // 24h format for input type="time"
  const [collectionDate, setCollectionDate] = useState("2025-04-07"); // yyyy-mm-dd for input type="date"
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: theme.palette.background.default,
        p: { xs: 2, sm: 4 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          maxWidth: 800,
          width: '100%',
          mx: 'auto',
          p: { xs: 4, sm: 8 },
          boxShadow: theme.palette.mode === 'dark' ? '0 4px 32px rgba(0,0,0,0.40)' : '0 4px 32px rgba(0,0,0,0.10)',
          border: '1.5px solid',
          borderColor: theme.palette.divider,
          textAlign: 'center',
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Stack spacing={5} alignItems="center">
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.primary.light,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1,
            }}
          >
            <DeleteSweepIcon sx={{ fontSize: 70, color: theme.palette.primary.main }} />
          </Box>
          <Typography variant="h3" fontWeight={800} color="text.primary" gutterBottom>
            Waste Collection Alert
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            The garbage collector is on its way. Please prepare your waste for collection.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={6} justifyContent="center" alignItems="center">
            <Box>
              <Typography variant="subtitle1" color="text.secondary" mb={1}>
                Collection Time
              </Typography>
              <TextField
                type="time"
                value={collectionTime}
                onChange={e => setCollectionTime(e.target.value)}
                inputProps={{ step: 60 }}
                sx={{ minWidth: 120, bgcolor: theme.palette.background.paper }}
              />
            </Box>
            <Box>
              <Typography variant="subtitle1" color="text.secondary" mb={1}>
                Collection Date
              </Typography>
              <TextField
                type="date"
                value={collectionDate}
                onChange={e => setCollectionDate(e.target.value)}
                sx={{ minWidth: 120, bgcolor: theme.palette.background.paper }}
              />
            </Box>
          </Stack>
          <Button
            variant="contained"
            color="error"
            size="large"
            sx={{ mt: 2, px: 10, py: 2.5, fontWeight: 800, borderRadius: 2, textTransform: 'uppercase', letterSpacing: 2, fontSize: '1.5rem' }}
          >
            Send Alert
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

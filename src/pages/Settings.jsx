import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  TextField,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';

function Settings() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          width: '100%',
          mb: 3,
        }}
      >
        {/* Profile Picture Section */}
        <Paper
          sx={{
            flex: { md: '0 0 320px', xs: '1 1 100%' },
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: 3,
          }}
          elevation={2}
        >
          <Box sx={{ width: '100%', mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 700, textAlign: 'left' }}>
              Update Profile Picture
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
              Update your account's profile picture.
            </Typography>
          </Box>
          <Avatar
            src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"
            sx={{
              width: 140,
              height: 140,
              border: '4px solid #fff',
              boxShadow: 3,
              mb: 2,
            }}
          />
          <Typography
            variant="caption"
            sx={{
              display: 'inline-block',
              fontWeight: 700,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              px: 2,
              py: 0.5,
              borderRadius: 2,
              mb: 2,
              letterSpacing: 1,
              fontSize: '0.85rem',
              textAlign: 'center',
            }}
          >
            ADMIN
          </Typography>
        </Paper>

        {/* Profile Information Section */}
        <Paper
          sx={{
            flex: 1,
            p: 3,
            minWidth: 250,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
          elevation={2}
        >
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
            Profile Information
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Update your account's profile information. Inform a valid email address.
          </Typography>
          <Stack spacing={2}>
            <TextField label="Name" defaultValue="Kean Lucas" fullWidth size="small" />
            <TextField label="Email" defaultValue="lucas.kean.bsit@gmail.com" fullWidth size="small" />
            <TextField label="Phone Number" defaultValue="09605643884" fullWidth size="small" />
            <Button variant="contained" sx={{ alignSelf: 'flex-start', mt: 1 }}>
              Save
            </Button>
          </Stack>
        </Paper>
      </Box>

      {/* Password Section */}
      <Paper sx={{ p: 3, mb: 3, width: '100%' }} elevation={2}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
          Update Password
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Ensure your account is using a long, random password to stay secure.
        </Typography>
        <Stack spacing={2} maxWidth={400}>
          <TextField label="Current Password" type="password" fullWidth size="small" />
          <TextField label="New Password" type="password" fullWidth size="small" />
          <TextField label="Confirm New Password" type="password" fullWidth size="small" />
          <Button variant="contained" sx={{ alignSelf: 'flex-start', mt: 1 }}>
            Save
          </Button>
        </Stack>
      </Paper>

      {/* Deactivate Account Section */}
      <Paper sx={{ p: 3, background: (theme) => theme.palette.mode === 'light' ? '#fff8f8' : '#2d2323', width: '100%', mb: 4 }} elevation={2}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }} color="error">
          Deactivate Account
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Deactivating your account will disable access to your profile and all associated data. Please be aware that if you choose to deactivate your account, you will lose immediate access to all your data and any ongoing activities associated with your account until it is reactivated.
        </Typography>
        <Button variant="contained" color="error">
          DEACTIVATE ACCOUNT
        </Button>
      </Paper>
    </Box>
  );
}

export default Settings; 
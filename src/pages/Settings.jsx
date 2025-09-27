import React, { useState, useEffect } from 'react';
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
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import config from '../config/env';
import { getProfilePictureUrl } from '../utils/profilePicture';
import { useAuth } from '../AuthContext';

function Settings() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { token, isAuthenticated, user, login } = useAuth();

  // State for profile information
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    contact_no: '',
    profile_picture: '',
  });

  // State for password change
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    confirm_password: '',
  });

  // State for form handling
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [showSnackbar, setShowSnackbar] = useState(false);

  // Fetch admin profile on component mount
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchAdminProfile();
    }
  }, [isAuthenticated, token]);

  // API function to fetch admin profile
  const fetchAdminProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.API_BASE_URL}/api/admin/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfileData({
        name: data.name || '',
        email: data.email || '',
        contact_no: data.contact_no || '',
        profile_picture: data.profile_picture || '',
      });
      
      // Update user data in AuthContext if profile picture is different
      if (user && user.profile_picture !== data.profile_picture) {
        const updatedUser = {
          ...user,
          profile_picture: data.profile_picture || '',
        };
        login(updatedUser, token);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage('Failed to load profile data');
      setSeverity('error');
      setShowSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  // API function to update admin profile
  const updateAdminProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.API_BASE_URL}/api/admin/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const data = await response.json();
      setMessage('Profile updated successfully');
      setSeverity('success');
      setShowSnackbar(true);
      
      // Update local state with new data
      setProfileData({
        name: data.user.name || profileData.name,
        email: data.user.email || profileData.email,
        contact_no: data.user.contact_no || profileData.contact_no,
        profile_picture: data.user.profile_picture || profileData.profile_picture,
      });
      
      // Update user data in AuthContext so Header shows updated profile
      if (user) {
        const updatedUser = {
          ...user,
          name: data.user.name || user.name,
          email: data.user.email || user.email,
          contact_no: data.user.contact_no || user.contact_no,
          profile_picture: data.user.profile_picture || user.profile_picture,
        };
        login(updatedUser, token);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage(error.message || 'Failed to update profile');
      setSeverity('error');
      setShowSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  // API function to update password
  const updatePassword = async () => {
    if (passwordData.password !== passwordData.confirm_password) {
      setMessage('New passwords do not match');
      setSeverity('error');
      setShowSnackbar(true);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${config.API_BASE_URL}/api/admin/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          password: passwordData.password,
          current_password: passwordData.current_password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update password');
      }

      setMessage('Password updated successfully');
      setSeverity('success');
      setShowSnackbar(true);
      
      // Clear password fields
      setPasswordData({
        current_password: '',
        password: '',
        confirm_password: '',
      });
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage(error.message || 'Failed to update password');
      setSeverity('error');
      setShowSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  // API function to upload profile picture
  const uploadProfilePicture = async (file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('profile_picture', file);

      const response = await fetch(`${config.API_BASE_URL}/api/admin/profile/picture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload profile picture');
      }

      const data = await response.json();
      setMessage('Profile picture updated successfully');
      setSeverity('success');
      setShowSnackbar(true);
      
      // Update profile picture in state
      setProfileData(prev => ({
        ...prev,
        profile_picture: data.profile_picture,
      }));
      
      // Update user data in AuthContext so Header shows new profile picture
      if (user) {
        const updatedUser = {
          ...user,
          profile_picture: data.profile_picture,
        };
        login(updatedUser, token);
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      setMessage(error.message || 'Failed to upload profile picture');
      setSeverity('error');
      setShowSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadProfilePicture(file);
    }
  };

  // Handle profile field changes
  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle password field changes
  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  // Show loading or redirect if not authenticated
  if (!isAuthenticated || !token) {
    return (
      <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
        <Typography variant="h6">Please log in to access settings</Typography>
      </Box>
    );
  }

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
          <Box
            sx={{
              position: 'relative',
              width: 140,
              height: 140,
              mb: 2,
                          cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            '&:hover .profile-overlay': {
              opacity: loading ? 0 : 1,
            },
          }}
          onClick={() => !loading && document.getElementById('profile-picture-upload').click()}
          >
            <Avatar
              src={getProfilePictureUrl(profileData.profile_picture) || "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"}
              sx={{
                width: 140,
                height: 140,
                border: '4px solid #fff',
                boxShadow: 3,
                cursor: 'pointer',
              }}
            />
            
            {/* Hover Overlay with Camera Icon */}
            <Box
              className="profile-overlay"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                cursor: 'pointer',
              }}
            >
              <Box
                sx={{
                  color: 'white',
                  fontSize: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                }}
              >
                {loading ? (
                  <CircularProgress
                    size={24}
                    sx={{
                      color: 'white',
                    }}
                  />
                ) : (
                  <PhotoCameraIcon
                    sx={{
                      fontSize: '28px',
                      color: 'white',
                    }}
                  />
                )}
              </Box>
            </Box>
          </Box>
          
          {/* Hidden File Input */}
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="profile-picture-upload"
            type="file"
            onChange={handleFileSelect}
            disabled={loading}
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
            <TextField 
              label="Name" 
              value={profileData.name}
              onChange={(e) => handleProfileChange('name', e.target.value)}
              fullWidth 
              size="small" 
            />
            <TextField 
              label="Email" 
              value={profileData.email}
              onChange={(e) => handleProfileChange('email', e.target.value)}
              fullWidth 
              size="small" 
            />
            <TextField 
              label="Phone Number" 
              value={profileData.contact_no}
              onChange={(e) => handleProfileChange('contact_no', e.target.value)}
              fullWidth 
              size="small" 
            />
            <Button 
              variant="contained" 
              onClick={updateAdminProfile}
              disabled={loading}
              sx={{ alignSelf: 'flex-start', mt: 1 }}
            >
              {loading ? 'Saving...' : 'Save'}
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
          <TextField 
            label="Current Password" 
            type="password" 
            value={passwordData.current_password}
            onChange={(e) => handlePasswordChange('current_password', e.target.value)}
            fullWidth 
            size="small" 
          />
          <TextField 
            label="New Password" 
            type="password" 
            value={passwordData.password}
            onChange={(e) => handlePasswordChange('password', e.target.value)}
            fullWidth 
            size="small" 
          />
          <TextField 
            label="Confirm New Password" 
            type="password" 
            value={passwordData.confirm_password}
            onChange={(e) => handlePasswordChange('confirm_password', e.target.value)}
            fullWidth 
            size="small" 
          />
          <Button 
            variant="contained" 
            onClick={updatePassword}
            disabled={loading}
            sx={{ alignSelf: 'flex-start', mt: 1 }}
          >
            {loading ? 'Saving...' : 'Save'}
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

      {/* Snackbar for showing messages */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Settings; 
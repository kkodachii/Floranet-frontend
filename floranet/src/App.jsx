import { useState } from 'react'
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  InputAdornment,
  IconButton,
  ThemeProvider,
} from '@mui/material'
import { Visibility, VisibilityOff, Person, Lock } from '@mui/icons-material'
import theme from './theme'
import './App.css'

function App() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Login attempt:', formData)
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #DDEB9D 0%, #A0C878 30%, #27667B 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={8}
          sx={{
            borderRadius: 6,
            overflow: 'hidden',
            width: { xs: '100%', sm: 700, md: 900 },
            maxWidth: '98vw',
            minHeight: { xs: 'auto', md: 480 },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            boxShadow: '0 8px 32px 0 rgba(39,102,123,0.18)',
            position: 'relative',
          }}
        >
          {/* Left: Login Form */}
          <Box
            sx={{
              flex: 1,
              p: { xs: 3, sm: 5 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'transparent',
              zIndex: 2,
              position: 'relative',
              boxShadow: '0 0 24px 0 #27667B22',
            }}
          >
            <Typography variant="h4" fontWeight={700} color="primary.dark" mb={1}>
              Hello!
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" mb={3}>
              Sign in to your account
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 340 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={formData.username}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: '#27667B' }} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 5,
                    background: 'rgba(255,255,255,0.85)',
                    boxShadow: '0 2px 12px 0 #27667B11',
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#e0e0e0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#27667B',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#27667B',
                    },
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#27667B' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: 'primary.main' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 5,
                    background: 'rgba(255,255,255,0.85)',
                    boxShadow: '0 2px 12px 0 #27667B11',
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#e0e0e0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#27667B',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#27667B',
                    },
                  },
                }}
              />
              <Box display="flex" alignItems="center" justifyContent="space-between" mt={1} mb={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.remember}
                      onChange={handleChange}
                      name="remember"
                      sx={{ color: 'primary.main' }}
                    />
                  }
                  label={<Typography variant="body2" color="primary.main">Remember me</Typography>}
                  sx={{ ml: 0 }}
                />
                <Link href="#" variant="body2" sx={{ color: '#27667B', fontWeight: 500 }} underline="hover">
                  Forgot password?
                </Link>
              </Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 1,
                  mb: 2,
                  borderRadius: 5,
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(90deg, #27667B 0%, #143D60 100%)',
                  boxShadow: '0 4px 16px 0 #27667B33',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #143D60 0%, #27667B 100%)',
                  },
                }}
              >
                LOGIN
              </Button>
            </Box>
          </Box>

          {/* Right: Welcome Message */}
          <Box
            sx={{
              flex: 1.1,
              p: { xs: 3, sm: 5 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #A0C878 0%, #27667B 100%)',
              color: '#fff',
              position: 'relative',
              zIndex: 0,
            }}
          >
            {/* Logo: larger white circle only */}
            <Box
              sx={{
                width: 130,
                height: 130,
                borderRadius: '50%',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                boxShadow: '0 2px 24px 0 #143D6044',
              }}
            />
            {/* FLORANET text */}
            <Box display="flex" alignItems="center" mb={2}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  letterSpacing: 2,
                  color: '#fff',
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '2.8rem' },
                  lineHeight: 1.1,
                }}
              >
                FLORA
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  letterSpacing: 2,
                  color: '#A0C878',
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '2.8rem' },
                  lineHeight: 1.1,
                }}
              >
                NET
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ opacity: 0.92, maxWidth: 320 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed pharetra magna nisl, at posuere sem dapibus sed.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  )
}

export default App

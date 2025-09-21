import * as React from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  useTheme,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config/env";
import floranetLogo from "../assets/floranet_logo.svg";
import backgroundSvg from "../assets/svg.svg";

export default function ForgotPassword() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [successMsg, setSuccessMsg] = React.useState("");
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);

  const handleForgotPassword = async () => {
    // Basic validation
    if (!email.trim()) {
      setErrorMsg("Please enter your email address.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      // Use admin forgot password endpoint for admin users
      const response = await axios.post(config.ENDPOINTS.FORGOT_PASSWORD_ADMIN, {
        email: email
      });
      
      console.log("Admin forgot password response:", response.data);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Admin forgot password error:", error);
      if (error.response?.data?.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg("Failed to send reset email. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Custom styles for transparent autofill
  const autofillTransparentStyles = {
    "& input": {
      "&:-webkit-autofill": {
        WebkitBoxShadow: `0 0 0 30px ${theme.palette.background.paper} inset !important`,
        WebkitTextFillColor: `${theme.palette.text.primary} !important`,
        backgroundColor: "transparent !important",
        backgroundImage: "none !important",
        transition: "background-color 5000s ease-in-out 0s !important",
      },
      "&:-webkit-autofill:hover": {
        WebkitBoxShadow: `0 0 0 30px ${theme.palette.background.paper} inset !important`,
        WebkitTextFillColor: `${theme.palette.text.primary} !important`,
        backgroundColor: "transparent !important",
        backgroundImage: "none !important",
        transition: "background-color 5000s ease-in-out 0s !important",
      },
      "&:-webkit-autofill:focus": {
        WebkitBoxShadow: `0 0 0 30px ${theme.palette.background.paper} inset !important`,
        WebkitTextFillColor: `${theme.palette.text.primary} !important`,
        backgroundColor: "transparent !important",
        backgroundImage: "none !important",
        transition: "background-color 5000s ease-in-out 0s !important",
      },
      "&:-webkit-autofill:active": {
        WebkitBoxShadow: `0 0 0 30px ${theme.palette.background.paper} inset !important`,
        WebkitTextFillColor: `${theme.palette.text.primary} !important`,
        backgroundColor: "transparent !important",
        backgroundImage: "none !important",
        transition: "background-color 5000s ease-in-out 0s !important",
      },
      "&:-moz-autofill": {
        backgroundColor: "transparent !important",
        backgroundImage: "none !important",
      },
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        transition: "background-color 0.3s ease-in-out",
        padding: 2,
        position: "relative",

        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("${backgroundSvg}")`,
          backgroundPosition: "center center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          opacity: theme.palette.mode === "light" ? 0.15 : 0.15,
          filter:
            theme.palette.mode === "light"
              ? "brightness(0.9) grayscale(100%) contrast(0.8)"
              : "grayscale(40%) brightness(1.2) contrast(1.1)",
          zIndex: 0,
          pointerEvents: "none",
        },
        "& > *": {
          position: "relative",
          zIndex: 1,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          maxWidth: 1200,
          width: "100%",
          minHeight: 500,
          boxShadow: 4,
          borderRadius: 2,
          overflow: "hidden",
          backgroundColor: theme.palette.background.paper,
          backdropFilter: "blur(10px)",
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            padding: 4,
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h3"
            fontWeight="bold"
            align="center"
            sx={{ color: "green", fontSize: "2.5rem" }}
          >
            Admin Forgot Password
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary">
            Enter your admin email to receive password reset instructions
          </Typography>
          
          {errorMsg && (
            <Typography
              variant="body2"
              color="error"
              align="center"
              sx={{ mb: 1 }}
            >
              {errorMsg}
            </Typography>
          )}

          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleForgotPassword();
            }}
            error={!!errorMsg}
            sx={{
              width: "350px",
              alignSelf: "center",
              ...autofillTransparentStyles,
            }}
          />

          <Box
            sx={{
              width: "350px",
              alignSelf: "center",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate("/login")}
              sx={{
                fontSize: "0.85rem",
                color: theme.palette.primary.main,
              }}
            >
              Back to Login
            </Link>
          </Box>

          <Button
            variant="contained"
            onClick={handleForgotPassword}
            disabled={isLoading}
            sx={{ 
              width: "350px", 
              alignSelf: "center",
              position: "relative"
            }}
          >
            {isLoading ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                Sending...
              </Box>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 4,
            backgroundColor:
              theme.palette.mode === "light" ? "#1a237e" : "#ffffff",
            borderLeft: `1px solid ${
              theme.palette.mode === "light"
                ? "#e0e0e0"
                : "rgba(255, 255, 255, 0.12)"
            }`,
            transition: "background-color 0.3s ease-in-out",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <img
              src={floranetLogo}
              alt="Floranet Logo"
              style={{ height: "150px" }}
            />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 900,
                "& .flora": {
                  color: theme.palette.mode === "light" ? "#ffffff" : "#424242",
                },
                "& .net": {
                  color:
                    theme.palette.mode === "light"
                      ? "#4caf50"
                      : theme.palette.primary.main,
                },
              }}
            >
              <span className="flora">FLORA</span>
              <span className="net">NET</span>
            </Typography>

            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  color:
                    theme.palette.mode === "light"
                      ? "rgba(255, 255, 255, 0.8)"
                      : "#424242",
                }}
              >
                Don't worry! We'll help you reset your password. Just enter your email address and we'll send you a link to reset it.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Success Modal */}
      <Dialog
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor: "success.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <Typography variant="h4">✓</Typography>
            </Box>
          </Box>
          <Typography variant="h5" fontWeight="bold" color="success.main">
            Admin Reset Email Sent!
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", pb: 2 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            We've sent admin password reset instructions to your email address. Please check your inbox and follow the link to reset your password.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            After resetting your password, you can close the page and use your new password to login.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Check your spam folder if you don't see the email.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              setShowSuccessModal(false);
              navigate("/login");
            }}
            sx={{ minWidth: 120 }}
          >
            Got it!
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

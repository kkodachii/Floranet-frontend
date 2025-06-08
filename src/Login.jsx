import * as React from "react";
import { Box, TextField, Button, Typography, Link } from "@mui/material";

import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function FullForm() {
  const [view, setView] = React.useState("login");
  const [showPassword, setShowPassword] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [otpDigits, setOtpDigits] = React.useState(["", "", "", "", "", ""]);
  const [errorMsg, setErrorMsg] = React.useState({});
  const inputRefs = React.useRef([]);

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleLoginSubmit = () => {
    let errors = {};
    if (!username) errors.username = "Username is required.";
    if (!password) errors.password = "Password is required.";
    setErrorMsg(errors);
    if (!errors.username && !errors.password) {
      alert("Signed in!");
    }
  };

  const handleForgotSubmit = () => {
    let errors = {};
    if (!email) errors.email = "Email is required.";
    setErrorMsg(errors);
    if (!errors.email) {
      alert("OTP sent to email!");
      setView("otp");
    }
  };

  const handleOtpSubmit = () => {
    const otpValue = otpDigits.join("");
    let errors = {};
    if (otpValue.length !== 6 || otpDigits.includes("")) {
      errors.otp = "Enter a valid 6-digit OTP.";
    }
    setErrorMsg(errors);
    if (!errors.otp) {
      alert("OTP verified: " + otpValue);
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otpDigits];
    newOtp[index] = value;
    setOtpDigits(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Box
        sx={{
          width: 500,
          minHeight: 400,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          padding: 4,
          border: "1px solid #ccc",
          borderRadius: 1,
          boxShadow: 3,
          backgroundColor: "white",
        }}
      >
        {view === "login" && (
          <>
            <Typography variant="h5" fontWeight="bold" align="center">
              Welcome
            </Typography>
            <Typography variant="body2" align="center" color="gray">
              Sign in to your account
            </Typography>

            <TextField
              label="User Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!!errorMsg.username}
              helperText={errorMsg.username}
              sx={{ width: "350px", alignSelf: "center" }}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errorMsg.password}
              helperText={errorMsg.password}
              sx={{ width: "350px", alignSelf: "center" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
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
                onClick={() => setView("forgot")}
                sx={{ fontSize: "0.85rem", color: "green" }}
              >
                Forgot Password?
              </Link>
            </Box>

            <Button
              variant="contained"
              onClick={handleLoginSubmit}
              sx={{ width: "350px", alignSelf: "center" }}
            >
              Sign In
            </Button>
          </>
        )}

        {view === "forgot" && (
          <>
            <Typography variant="h5" fontWeight="bold" align="center">
              Forgot Password
            </Typography>
            <Typography variant="body2" align="center" color="gray">
              Enter your email to receive an OTP
            </Typography>

            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errorMsg.email}
              helperText={errorMsg.email}
              sx={{ width: "350px", alignSelf: "center" }}
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
                onClick={() => setView("login")}
                sx={{ fontSize: "0.85rem" }}
              >
                Back to Login
              </Link>
            </Box>

            <Button
              variant="contained"
              onClick={handleForgotSubmit}
              sx={{ width: "350px", alignSelf: "center" }}
            >
              Send OTP
            </Button>
          </>
        )}

        {view === "otp" && (
          <>
            <Typography variant="h5" fontWeight="bold" align="center">
              Verify OTP
            </Typography>
            <Typography variant="body2" align="center" color="gray">
              Enter the 6-digit code sent to your email
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 1,
                justifyContent: "center",
                mt: 2,
                mb: 1,
              }}
            >
              {[0, 1, 2, 3, 4, 5].map((_, index) => (
                <TextField
                  key={index}
                  inputRef={(ref) => (inputRefs.current[index] = ref)}
                  value={otpDigits[index] || ""}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  inputProps={{
                    maxLength: 1,
                    style: {
                      textAlign: "center",
                      fontSize: "20px",
                      width: "25px",
                      height: "35px",
                    },
                  }}
                  error={!!errorMsg.otp}
                />
              ))}
            </Box>

            {errorMsg.otp && (
              <Typography
                variant="caption"
                color="error"
                sx={{ textAlign: "center", display: "block" }}
              >
                {errorMsg.otp}
              </Typography>
            )}

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
                onClick={() => setView("forgot")}
                sx={{ fontSize: "0.85rem" }}
              >
                Resend OTP
              </Link>
            </Box>

            <Button
              variant="contained"
              onClick={handleOtpSubmit}
              sx={{ width: "350px", alignSelf: "center", mt: 1 }}
            >
              Verify
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
}

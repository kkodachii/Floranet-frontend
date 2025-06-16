import * as React from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  useTheme,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import floranetLogo from "../assets/floranet_logo.svg";
import backgroundSvg from "../assets/svg.svg";

export default function FullForm() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [view, setView] = React.useState("login");
  const [showPassword, setShowPassword] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [otpDigits, setOtpDigits] = React.useState(["", "", "", "", "", ""]);
  const [errorMsg, setErrorMsg] = React.useState({});
  const inputRefs = React.useRef([]);
  const [isPasswordFocused, setIsPasswordFocused] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleLoginSubmit = () => {
    let errors = {};
    if (!username) errors.username = "Username is required.";
    if (!password) errors.password = "Password is required.";
    setErrorMsg(errors);
    if (!errors.username && !errors.password) {
      navigate("/user-management/residents");
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
              ? "brightness(0.7) sepia(1) hue-rotate(90deg) saturate(3) contrast(1.2)"
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
            gap: 2,
            padding: 4,
            justifyContent: "center",
          }}
        >
          {view === "login" && (
            <>
              <Typography
                variant="h3"
                fontWeight="bold"
                align="center"
                sx={{ color: "green", fontSize: "3rem", fontWeight: 800 }}
              >
                Welcome
              </Typography>
              <Typography
                variant="body2"
                align="center"
                color="text.secondary"
                sx={{ mt: -1, mb: 2 }}
              >
                Sign in to your account
              </Typography>
              <Box
                sx={{
                  minHeight: "76px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <TextField
                  label="User Name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  error={!!errorMsg.username}
                  helperText={errorMsg.username || " "}
                  sx={{ width: "350px" }}
                />
              </Box>
              <Box
                sx={{
                  minHeight: "76px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <TextField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  error={!!errorMsg.password}
                  helperText={errorMsg.password || " "}
                  sx={{ width: "350px" }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          sx={{
                            color: errorMsg.password
                              ? "error.main"
                              : isPasswordFocused
                              ? "green"
                              : "inherit",
                          }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
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
                  sx={{
                    fontSize: "0.85rem",
                    color: theme.palette.primary.main,
                  }}
                >
                  Forgot Password?
                </Link>
              </Box>
              <Button
                variant="contained"
                onClick={handleLoginSubmit}
                sx={{
                  width: "350px",
                  alignSelf: "center",
                  height: "56px",
                }}
              >
                Sign In
              </Button>
            </>
          )}

          {view === "forgot" && (
            <>
              <Typography
                variant="h3"
                fontWeight="bold"
                align="center"
                sx={{ color: "green", fontSize: "3rem", fontWeight: 800 }}
              >
                Forgot Password
              </Typography>
              <Typography
                variant="body2"
                align="center"
                color="text.secondary"
                sx={{ mt: -1, mb: 2 }}
              >
                Enter your email to receive an OTP
              </Typography>
              <Box
                sx={{
                  minHeight: "76px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <TextField
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!errorMsg.email}
                  helperText={errorMsg.email || " "}
                  sx={{ width: "350px" }}
                />
              </Box>
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
                onClick={handleForgotSubmit}
                sx={{
                  width: "350px",
                  alignSelf: "center",
                  height: "56px",
                }}
              >
                Send OTP
              </Button>
            </>
          )}

          {view === "otp" && (
            <>
              <Typography
                variant="h3"
                fontWeight="bold"
                align="center"
                sx={{ color: "green", fontSize: "3rem", fontWeight: 800 }}
              >
                Verify OTP
              </Typography>
              <Typography
                variant="body2"
                align="center"
                color="text.secondary"
                sx={{ mt: -1, mb: 2 }}
              >
                Enter the 6-digit code sent to your email
              </Typography>
              <Box sx={{ minHeight: "76px" }}>
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
                <Box sx={{ minHeight: "20px", textAlign: "center" }}>
                  {errorMsg.otp && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ display: "block" }}
                    >
                      {errorMsg.otp}
                    </Typography>
                  )}
                </Box>
              </Box>
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
                  sx={{
                    fontSize: "0.85rem",
                    color: theme.palette.primary.main,
                  }}
                >
                  Resend OTP
                </Link>
              </Box>
              <Button
                variant="contained"
                onClick={handleOtpSubmit}
                sx={{
                  width: "350px",
                  alignSelf: "center",
                  mt: 1,
                  height: "56px",
                }}
              >
                Verify
              </Button>
            </>
          )}
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
              variant="h4"
              sx={{
                fontWeight: 900,
                fontSize: "2rem",
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

            <Box sx={{ textAlign: "center", maxWidth: "400px", px: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  color:
                    theme.palette.mode === "light"
                      ? "rgba(255, 255, 255, 0.8)"
                      : "#424242",
                  lineHeight: 1.6,
                  textAlign: "justify",
                }}
              >
                FloraNet is a smart city system made for communities like
                MiFlora Homes Subdivision. It's built to make everyday life
                easier for residents by offering simple, digital ways to handle
                community tasks.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

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
import { useAuth } from "../AuthContext";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import floranetLogo from "../assets/floranet_logo.svg";
import backgroundSvg from "../assets/svg.svg";
import axios from "axios";
import config from "../config/env";

export default function FullForm() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleLoginSubmit = async () => {
    let errors = {};
    if (!email) errors.email = "Email is required.";
    if (!password) errors.password = "Password is required.";
    setErrorMsg(errors);

    if (!errors.email && !errors.password) {
      setIsLoading(true);
      try {
        const response = await axios.post(config.ENDPOINTS.LOGIN, {
          email: email,
          password: password,
        });

        if (response.data) {
          const userData = {
            email: email,
            ...response.data.user,
          };
          const authToken = response.data.token || response.data.access_token;
          login(userData, authToken);
          navigate("/user-management/residents");
        }
      } catch (error) {
        console.error("Login error:", error);
        if (error.response?.data?.message) {
          setErrorMsg({ general: error.response.data.message });
        } else if (error.response?.status === 401) {
          setErrorMsg({ general: "Invalid email or password" });
        } else {
          setErrorMsg({ general: "Login failed. Please try again." });
        }
      } finally {
        setIsLoading(false);
      }
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
            Welcome
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary">
            Sign in to your account
          </Typography>
          {errorMsg.general && (
            <Typography
              variant="body2"
              color="error"
              align="center"
              sx={{ mb: 1 }}
            >
              {errorMsg.general}
            </Typography>
          )}
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLoginSubmit();
            }}
            error={!!errorMsg.email}
            helperText={errorMsg.email}
            sx={{
              width: "350px",
              alignSelf: "center",
              ...autofillTransparentStyles,
            }}
          />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLoginSubmit();
            }}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
            error={!!errorMsg.password}
            helperText={errorMsg.password}
            sx={{
              width: "350px",
              alignSelf: "center",
              ...autofillTransparentStyles,
            }}
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
              onClick={() => navigate("/forgot-password")}
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
            disabled={isLoading}
            sx={{ width: "350px", alignSelf: "center" }}
          >
            {isLoading ? "Signing In..." : "Sign In"}
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
                A smart community management system for Milflora Homes
                Subdivision. Floranet improves communication, promotes
                transparency, and strengthens emergency response. It gives
                residents one platform to receive announcements, pay bills,
                promote businesses, and access essential community services with
                ease.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

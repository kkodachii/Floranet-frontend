import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

export default function FullForm() {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();

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
          maxWidth: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          padding: 4,
          border: "1px solid #ccc",
          borderRadius: 1,
          boxShadow: 3,
          backgroundColor: "white",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          align="center"
          sx={{ mb: 3 }}
        >
          Sign in to your account
        </Typography>

        <TextField
          label="User Name"
          id="username"
          sx={{
            width: "350px",
            alignSelf: "center",
            "& .MuiOutlinedInput-root": {
              borderRadius: 0.5,
            },
          }}
        />

        <TextField
          label="Password"
          id="password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          sx={{
            width: "350px",
            alignSelf: "center",
            "& .MuiOutlinedInput-root": {
              borderRadius: 0.5,
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
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
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "0.85rem",
          }}
        >
          <FormControlLabel
            control={<Checkbox />}
            label={
              <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                Remember Me
              </Typography>
            }
          />
          <Link
            href="#"
            underline="hover"
            variant="body2"
            sx={{
              fontSize: "0.85rem",
              color: "green",
              "&:hover": {
                color: "darkgreen",
              },
            }}
          >
            Forgot Password?
          </Link>
        </Box>

        <Button
          variant="contained"
          size="large"
          sx={{
            width: "350px",
            height: "56px",
            alignSelf: "center",
            fontWeight: "bold",
            borderRadius: 0.5,
            backgroundColor: "#1976d2",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
            "&:focus": {
              outline: "none",
              boxShadow: "none",
            },
          }}
        >
          Sign in
        </Button>
      </Box>
    </Box>
  );
}

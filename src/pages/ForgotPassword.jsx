import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useTheme } from "@mui/material/styles";

import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

export default function FullForm() {
  const theme = useTheme();
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
        backgroundColor: theme.palette.background.default,
        transition: 'background-color 0.3s ease-in-out',
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
          border: `1px solid ${theme.palette.mode === 'light' ? '#ccc' : 'rgba(255, 255, 255, 0.12)'}`,
          borderRadius: 1,
          boxShadow: 3,
          backgroundColor: theme.palette.background.paper,
          transition: 'background-color 0.3s ease-in-out, border-color 0.3s ease-in-out',
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          align="center"
          sx={{ mb: 3 }}
          color="text.primary"
        >
          Forgot your password?
        </Typography>

        <TextField
          label="Email"
          id="email"
          sx={{
            width: "350px",
            alignSelf: "center",
            "& .MuiOutlinedInput-root": {
              borderRadius: 0.5,
            },
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
            backgroundColor: theme.palette.primary.main,
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
            "&:focus": {
              outline: "none",
              boxShadow: "none",
            },
          }}
        >
          Get OTP
        </Button>
      </Box>
    </Box>
  );
}

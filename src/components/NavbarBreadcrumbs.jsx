import * as React from "react";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Breadcrumbs, { breadcrumbsClasses } from "@mui/material/Breadcrumbs";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import { useLocation } from "react-router-dom";

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: "center",
  },
}));

const toTitleCase = (str) => {
  const acronyms = ['cctv'];
  
  return str
    .replace(/-/g, ' ')
    .replace(/\w\S*/g, (txt) => {
      const lower = txt.toLowerCase();
      if (acronyms.includes(lower)) {
        return txt.toUpperCase();
      }
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

export default function NavbarBreadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      <Typography variant="body1">Floranet</Typography>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        return last ? (
          <Typography key={to} variant="body1" sx={{ color: "text.primary", fontWeight: 600 }}>
            {toTitleCase(value)}
          </Typography>
        ) : (
          <Typography key={to} variant="body1">
            {toTitleCase(value)}
          </Typography>
        );
      })}
    </StyledBreadcrumbs>
  );
}
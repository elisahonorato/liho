import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { NavLink } from 'react-router-dom';
import theme from '../Theme/Theme';

const headerItems = [
  { to: '/', label: 'Home' },
  { to: '/liho', label: 'Liho' },
  { to: '/about', label: 'About' },
  { to: '/tutorial', label: 'Tutorial' },
];

function Navbar() {
  return (
    <>
      <AppBar position="sticky" color="primary" elevation={0}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <NavLink exact to="/" activeClassName="active">
              <img src={process.env.PUBLIC_URL + '/logo_liho.png'} alt="Logo" height="60" />
            </NavLink>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexShrink: 1 }}>
            {headerItems.map((d, i) => (
              <Typography key={'item' + i} sx={{ ml: 4 }}>
                <NavLink exact to={d.to} activeClassName="active" style={{ color: theme.palette.primary.dark }}>
                  {d.label}
                </NavLink>
              </Typography>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Navbar;


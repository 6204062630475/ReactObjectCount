import React from 'react';
import { AppBar, Toolbar, Typography, Button, Link } from '@mui/material';

const Navbar = ({ ButtonHome, ButtonHistory }) => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Navbar
        </Typography> */}
        <Button variant="h6" color="inherit" component={Link} onClick={ButtonHome}>
          Home
        </Button>
        <Button variant="h6" color="inherit" component={Link} onClick={ButtonHistory}>
          History
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

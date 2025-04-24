import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUser, FaTasks } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:768px)');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <AppBar position="static" color="default" elevation={1} className="bg-white">
      <Toolbar className="container mx-auto px-4">
        <Typography 
          variant="h6" 
          component={Link} 
          to={isAuthenticated ? '/dashboard' : '/'} 
          className="text-primary-600 font-bold flex items-center no-underline mr-auto"
        >
          <FaTasks className="mr-2" /> Todo App
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMobileMenuToggle}
            >
              <MenuIcon />
            </IconButton>
            {mobileMenuOpen && (
              <Box className="absolute top-16 right-0 left-0 bg-white shadow-md z-10 py-2">
                {isAuthenticated ? (
                  <>
                    <Button
                      component={Link}
                      to="/dashboard"
                      color="inherit"
                      className="w-full justify-start px-4 py-2"
                      startIcon={<DashboardIcon />}
                    >
                      Dashboard
                    </Button>
                    <Button
                      component={Link}
                      to="/profile"
                      color="inherit"
                      className="w-full justify-start px-4 py-2"
                      startIcon={<AccountCircleIcon />}
                    >
                      Profile
                    </Button>
                    <Button
                      color="inherit"
                      onClick={handleLogout}
                      className="w-full justify-start px-4 py-2"
                      startIcon={<LogoutIcon />}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      component={Link}
                      to="/login"
                      color="inherit"
                      className="w-full justify-start px-4 py-2"
                    >
                      Login
                    </Button>
                    <Button
                      component={Link}
                      to="/register"
                      color="inherit"
                      className="w-full justify-start px-4 py-2"
                    >
                      Register
                    </Button>
                  </>
                )}
              </Box>
            )}
          </>
        ) : (
          <>
            {isAuthenticated ? (
              <Box className="flex items-center">
                <Button
                  component={Link}
                  to="/dashboard"
                  color="inherit"
                  className="mr-2"
                  startIcon={<DashboardIcon />}
                >
                  Dashboard
                </Button>
                <IconButton onClick={handleMenuOpen} className="ml-2">
                  <Avatar className="h-8 w-8 bg-primary-600">
                    {user && user.name ? user.name.charAt(0).toUpperCase() : <AccountCircleIcon />}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  className="mt-2"
                >
                  <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                    <ListItemIcon>
                      <AccountCircleIcon fontSize="small" />
                    </ListItemIcon>
                    Profile
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Box>
                <Button
                  component={Link}
                  to="/login"
                  color="inherit"
                  className="mr-2"
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  color="primary"
                >
                  Register
                </Button>
              </Box>
            )}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
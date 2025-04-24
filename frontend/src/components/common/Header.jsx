import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
  CheckCircle as CompletedIcon,
  List as ListIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import useAuth from '../../hooks/useAuth';

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuClick = (path) => {
    navigate(path);
    handleCloseNavMenu();
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    navigate('/login');
  };

  const pages = isAuthenticated ? [
    { name: 'Dashboard', path: '/', icon: <DashboardIcon fontSize="small" /> },
    { name: 'All Todos', path: '/todos', icon: <ListIcon fontSize="small" /> },
    { name: 'Add Todo', path: '/add', icon: <AddIcon fontSize="small" /> }
  ] : [];

  const userMenuItems = [
    { name: 'Profile', path: '/profile', icon: <PersonIcon fontSize="small" /> },
    { name: 'Logout', action: handleLogout, icon: <LogoutIcon fontSize="small" /> }
  ];

  // Check if the current path matches the button path
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/';
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      className="glass-card"
      sx={{ 
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.18)',
        color: 'text.primary'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* Logo for larger screens */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'Poppins',
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'primary.main',
                textDecoration: 'none',
              }}
            >
              TODO APP
            </Typography>
          </motion.div>

          {/* Mobile menu icon */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            {isAuthenticated && (
              <>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: 'block', md: 'none' },
                  }}
                >
                  {pages.map((page) => (
                    <MenuItem 
                      key={page.name} 
                      onClick={() => handleMenuClick(page.path)}
                      selected={isActive(page.path)}
                    >
                      <ListItemIcon>
                        {page.icon}
                      </ListItemIcon>
                      <ListItemText>{page.name}</ListItemText>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}
          </Box>

          {/* Logo for mobile screens */}
          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'Poppins',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'primary.main',
              textDecoration: 'none',
            }}
          >
            TODO APP
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {isAuthenticated && pages.map((page) => (
              <motion.div
                key={page.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => handleMenuClick(page.path)}
                  sx={{ 
                    my: 2, 
                    mx: 1,
                    color: isActive(page.path) ? 'primary.main' : 'text.primary',
                    display: 'flex', 
                    fontWeight: isActive(page.path) ? 700 : 500,
                    backgroundColor: isActive(page.path) ? 'rgba(58, 134, 255, 0.08)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(58, 134, 255, 0.12)',
                    }
                  }}
                  startIcon={page.icon}
                >
                  {page.name}
                </Button>
              </motion.div>
            ))}
          </Box>

          {/* User Menu */}
          <Box sx={{ flexGrow: 0 }}>
            {isAuthenticated ? (
              <>
                <Tooltip title="Open settings">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    style={{ display: 'inline-block' }}
                  >
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {user?.firstName?.charAt(0) || 'U'}
                      </Avatar>
                    </IconButton>
                  </motion.div>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {user?.name || 'User'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user?.email}
                    </Typography>
                  </Box>
                  <Divider />
                  {userMenuItems.map((item) => (
                    <motion.div key={item.name} whileHover={{ backgroundColor: 'rgba(0,0,0,0.04)' }}>
                      <MenuItem
                        onClick={item.action || (() => {
                          navigate(item.path);
                          handleCloseUserMenu();
                        })}
                      >
                        <ListItemIcon>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText>{item.name}</ListItemText>
                      </MenuItem>
                    </motion.div>
                  ))}
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/login')}
                    sx={{ 
                      borderRadius: 2,
                      fontWeight: 600
                    }}
                  >
                    Login
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    onClick={() => navigate('/register')}
                    sx={{ 
                      borderRadius: 2,
                      fontWeight: 600
                    }}
                  >
                    Sign Up
                  </Button>
                </motion.div>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header; 
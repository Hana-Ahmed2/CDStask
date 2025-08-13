import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
} from '@mui/material';
import {
  AccountCircle,
  Settings,
  Logout,
  Dashboard,
  Menu as MenuIcon,
  Home,
  Business,
  Support,
  Info,
  DarkMode,
  LightMode,
  Domain,
  Security,
} from '@mui/icons-material';

interface NavbarProps {
  darkMode?: boolean;
  toggleDarkMode?: () => void;
}

const Navbar = ({ darkMode = false, toggleDarkMode }: NavbarProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileOpen(false); // Close mobile drawer when navigating
  };

  const navItems = [
    { text: 'Home', icon: <Home />, path: '/Home' },
    { text: 'Business Units', icon: <Domain />, path: '/business-units' },
    { text: 'Active Directory', icon: <Security />, path: '/active-directories' },
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Services', icon: <Business />, path: '/services' },
    { text: 'About', icon: <Info />, path: '/about' },
    { text: 'Support', icon: <Support />, path: '/support' },
  ];

  // el mobile drawer elly yezhar lama el screen ykoun sghayar
  const drawer = (
    <Box sx={{ width: 250, bgcolor: 'transparent' }}>
      <Box
        sx={{
          p: 2,
          background: darkMode 
            ? 'linear-gradient(135deg, #0f172a, #374151)' 
            : 'linear-gradient(135deg, #1e3a8a, #7336dbff)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          CDS Menu
        </Typography>
      </Box>
      {/* list bta3t el navigation items */}
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              sx={{
                '&:hover': {
                  bgcolor: darkMode 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(124, 58, 237, 0.1)',
                  color: darkMode ? '#e5e7eb' : '#7c3aed',
                },
              }}
            >
              <ListItemIcon sx={{ 
                color: darkMode ? '#9ca3af' : 'rgb(47, 58, 156)' 
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: 500,
                    color: darkMode ? 'rgb(156, 163, 175)' : 'rgb(47, 58, 156)',
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const handleLogout = () => {
    const token = localStorage.getItem('authToken');
    console.log("token ", token )
    localStorage.removeItem('authToken');
    const rtoken = localStorage.getItem('authToken');
    console.log("refreshed token ", rtoken )

    handleProfileMenuClose();
    localStorage.removeItem('users');
    navigate('/', { replace: true });
  };

  return (
    <>
      {/* El App Bar  */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: darkMode 
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #374151 50%, #4b5563 75%, #6b7280 100%)'
            : 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 25%, #7c3aed 50%, #be185d 75%, #dc2626 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: darkMode 
            ? '1px solid rgba(255, 255, 255, 0.2)' 
            : '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: darkMode 
            ? '0 4px 20px rgba(0, 0, 0, 0.5)' 
            : '0 4px 20px rgba(30, 58, 138, 0.3)',
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: isMobile ? 1 : 0 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 45,
                height: 45,
                borderRadius: '50%',
                background: darkMode 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(255, 255, 255, 0.15)',
                border: darkMode 
                  ? '2px solid rgba(255, 255, 255, 0.3)' 
                  : '2px solid rgba(255, 255, 255, 0.2)',
                mr: 2,
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontFamily: 'Arial, sans-serif',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                CDS
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'white',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Connect digital Solutions
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', mx: 4 }}>
              {navItems.map((item) => (
                <Button
                  key={item.text}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    color: 'white',
                    mx: 1,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    fontWeight: 500,
                    textTransform: 'none',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: darkMode 
                        ? 'rgba(255, 255, 255, 0.15)' 
                        : 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-2px)',
                      boxShadow: darkMode 
                        ? '0 4px 15px rgba(255, 255, 255, 0.1)' 
                        : '0 4px 15px rgba(255, 255, 255, 0.2)',
                    },
                    // underline animation
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      width: 0,
                      height: '2px',
                      background: 'white',
                      transition: 'all 0.3s ease',
                      transform: 'translateX(-50%)',
                    },
                    '&:hover::after': {
                      width: '80%',
                    },
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          {/* Dark Mode Toggle Button */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <IconButton
              onClick={toggleDarkMode}
              sx={{
                color: 'white',
                border: darkMode 
                  ? '2px solid rgba(255, 255, 255, 0.3)' 
                  : '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                width: 44,
                height: 44,
                transition: 'all 0.3s ease',
                background: darkMode 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'transparent',
                '&:hover': {
                  background: darkMode 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  borderColor: darkMode 
                    ? 'rgba(255, 255, 255, 0.5)' 
                    : 'rgba(255, 255, 255, 0.4)',
                  transform: 'scale(1.05) rotate(180deg)',
                },
              }}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Box>

          {/* Profile Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              sx={{
                color: 'white',
                border: darkMode 
                  ? '2px solid rgba(255, 255, 255, 0.3)' 
                  : '2px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: darkMode 
                    ? 'rgba(255, 255, 255, 0.15)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  borderColor: darkMode 
                    ? 'rgba(255, 255, 255, 0.5)' 
                    : 'rgba(255, 255, 255, 0.4)',
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Avatar
                sx={{
                  width: 35,
                  height: 35,
                  background: darkMode 
                    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1))' 
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                U
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 250,
            background: darkMode 
              ? 'rgba(15, 23, 42, 0.95)' 
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRight: darkMode 
              ? '1px solid rgba(255, 255, 255, 0.1)' 
              : '1px solid rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        sx={{
          '& .MuiPaper-root': {
            background: darkMode 
              ? 'rgba(15, 23, 42, 0.95)' 
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: darkMode 
              ? '1px solid rgba(255, 255, 255, 0.2)' 
              : '1px solid rgba(124, 58, 237, 0.2)',
            borderRadius: 2,
            mt: 1,
            minWidth: 200,
            boxShadow: darkMode 
              ? '0 10px 30px rgba(0, 0, 0, 0.5)' 
              : '0 10px 30px rgba(30, 58, 138, 0.3)',
          },
        }}
      >
        <Box sx={{ 
          px: 2, 
          py: 1.5, 
          borderBottom: darkMode 
            ? '1px solid rgba(255, 255, 255, 0.1)' 
            : '1px solid rgba(124, 58, 237, 0.1)' 
        }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: darkMode ? '#f3f4f6' : '#1e3a8a',
            }}
          >
            admin
          </Typography>
        </Box>
        
        <MenuItem
          onClick={handleProfileMenuClose}
          sx={{
            py: 1.5,
            '&:hover': {
              background: darkMode 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(124, 58, 237, 0.1)',
            },
          }}
        >
          <AccountCircle sx={{ 
            mr: 2, 
            color: darkMode ? '#9ca3af' : '#7c3aed' 
          }} />
          <Typography sx={{ 
            fontWeight: 500,
            color: darkMode ? '#f3f4f6' : 'inherit' 
          }}>Profile</Typography>
        </MenuItem>
        
        <MenuItem
          onClick={handleProfileMenuClose}
          sx={{
            py: 1.5,
            '&:hover': {
              background: darkMode 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(124, 58, 237, 0.1)',
            },
          }}
        >
          <Settings sx={{ 
            mr: 2, 
            color: darkMode ? '#9ca3af' : '#7c3aed' 
          }} />
          <Typography sx={{ 
            fontWeight: 500,
            color: darkMode ? '#f3f4f6' : 'inherit' 
          }}>Settings</Typography>
        </MenuItem>
        
        {/* divider  */}
        <Divider sx={{ 
          backgroundColor: darkMode 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(124, 58, 237, 0.1)' 
        }} />
        
        <MenuItem
          onClick={handleLogout}  
          sx={{
            py: 1.5,
            '&:hover': {
              background: 'rgba(220, 38, 38, 0.1)',
            },
          }}
        >
          <Logout sx={{ mr: 2, color: '#dc2626' }} />
          <Typography sx={{ fontWeight: 500, color: '#dc2626' }}>Logout</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default Navbar;
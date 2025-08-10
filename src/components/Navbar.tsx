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

  const navItems = [
    { text: 'Home', icon: <Home />, path: '/NextPage.tsx' },
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Services', icon: <Business />, path: '/services' },
    { text: 'About', icon: <Info />, path: '/about' },
    { text: 'Support', icon: <Support />, path: '/support' },
  ];

  const drawer = (
    <Box sx={{ width: 250, bgcolor: 'transparent' }}>
      <Box
        sx={{
          p: 2,
          background: 'linear-gradient(135deg, #1e3a8a, #7c3aed)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          CDS Menu
        </Typography>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              sx={{
                '&:hover': {
                  bgcolor: 'rgba(124, 58, 237, 0.1)',
                  color: '#7c3aed',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#7c3aed' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: 500,
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
    // Clear authentication data
    localStorage.removeItem('authToken');
    
    // Close the menu
    handleProfileMenuClose();
    
    // Redirect to login page
    navigate('/', { replace: true });
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 25%, #7c3aed 50%, #be185d 75%, #dc2626 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 20px rgba(30, 58, 138, 0.3)',
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
                background: 'rgba(255, 255, 255, 0.15)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                mr: 2,
                backdropFilter: 'blur(10px)',
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
                      background: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 15px rgba(255, 255, 255, 0.2)',
                    },
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
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                width: 44,
                height: 44,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(255, 255, 255, 0.4)',
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
                border: '2px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Avatar
                sx={{
                  width: 35,
                  height: 35,
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
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
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
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
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(124, 58, 237, 0.2)',
            borderRadius: 2,
            mt: 1,
            minWidth: 200,
            boxShadow: '0 10px 30px rgba(30, 58, 138, 0.3)',
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(124, 58, 237, 0.1)' }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: '#1e3a8a',
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
              background: 'rgba(124, 58, 237, 0.1)',
            },
          }}
        >
          <AccountCircle sx={{ mr: 2, color: '#7c3aed' }} />
          <Typography sx={{ fontWeight: 500 }}>Profile</Typography>
        </MenuItem>
        
        <MenuItem
          onClick={handleProfileMenuClose}
          sx={{
            py: 1.5,
            '&:hover': {
              background: 'rgba(124, 58, 237, 0.1)',
            },
          }}
        >
          <Settings sx={{ mr: 2, color: '#7c3aed' }} />
          <Typography sx={{ fontWeight: 500 }}>Settings</Typography>
        </MenuItem>
        
        <Divider sx={{ backgroundColor: 'rgba(124, 58, 237, 0.1)' }} />
        
        <MenuItem
          onClick={handleLogout}  // Change this line
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
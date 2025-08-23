import { useNavigate } from 'react-router-dom';
import { useCustomTheme } from './contexts/ThemeContext'; 
import Navbar from "./components/Navbar"; 
import {
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Paper
} from '@mui/material';
import {
  People,
  Domain,
  Security,
  TrendingUp,
  Settings,
  Group
} from '@mui/icons-material';

export default function Home() {
  const { darkMode, toggleDarkMode } = useCustomTheme();
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'User Management',
      description: 'Manage team members, roles, and permissions',
      icon: <People sx={{ fontSize: 40 }} />,
      path: '/users',
      color: '#3b82f6',
      bgColor: darkMode ? '#1e3a8a' : '#dbeafe'
    },
    {
      title: 'Business Units',
      description: 'Organize and manage business departments',
      icon: <Domain sx={{ fontSize: 40 }} />,
      path: '/business-units',
      color: '#8b5cf6',
      bgColor: darkMode ? '#5b21b6' : '#ede9fe'
    },
    {
      title: 'Active Directory',
      description: 'Configure directory services and authentication',
      icon: <Security sx={{ fontSize: 40 }} />,
      path: '/active-directories',
      color: '#10b981',
      bgColor: darkMode ? '#047857' : '#d1fae5'
    },
  ];

  const stats = [
    {
      title: 'Total Users',
      value: '142',
      change: '+12%',
      icon: <Group sx={{ fontSize: 24 }} />,
      color: '#3b82f6'
    },
    {
      title: 'Active Sessions',
      value: '89',
      change: '+5%',
      icon: <TrendingUp sx={{ fontSize: 24 }} />,
      color: '#10b981'
    },
    {
      title: 'Business Units',
      value: '8',
      change: '+2',
      icon: <Domain sx={{ fontSize: 24 }} />,
      color: '#8b5cf6'
    },
    {
      title: 'System Health',
      value: '98%',
      change: '+1%',
      icon: <Settings sx={{ fontSize: 24 }} />,
      color: '#f59e0b'
    }
  ];

  return (
    <>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <Container 
        maxWidth="xl" 
        sx={{ 
          py: 4,
          backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
          maxHeight: 'calc(100vh - 64px)',
          overflow: 'auto'
        }}
      >
        {/* Welcome Section */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 25%, #7c3aed 50%, #be185d 75%, #dc2626 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Welcome to CDS Portal
          </Typography>
          {/* Stats Cards */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
            gap: 3, 
            mb: 4 
          }}>
            {stats.map((stat, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: darkMode 
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.9) 100%)',
                  border: darkMode 
                    ? '1px solid rgba(255,255,255,0.1)' 
                    : '1px solid rgba(0,0,0,0.05)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: darkMode 
                      ? '0 10px 25px rgba(0,0,0,0.3)' 
                      : '0 10px 25px rgba(0,0,0,0.1)'
                  }
                }}
              >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        backgroundColor: `${stat.color}20`,
                        color: stat.color,
                        mr: 2
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Box>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          color: darkMode ? '#f1f5f9' : '#1e293b'
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: darkMode ? '#64748b' : '#64748b'
                        }}
                      >
                        {stat.title}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#10b981',
                      fontWeight: 500
                    }}
                  >
                    {stat.change} from last month
                  </Typography>
                </Paper>
            ))}
          </Box>
        </Box>

        {/* Quick Actions */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 600,
              color: darkMode ? '#f1f5f9' : '#1e293b',
              mb: 3
            }}
          >
            Quick Actions
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 3,
            justifyContent: 'center',
            justifyItems: 'center',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            {quickActions.map((action, index) => (
              <Card
                key={index}
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  background: darkMode 
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.9) 100%)',
                  border: darkMode 
                    ? '1px solid rgba(255,255,255,0.1)' 
                    : '1px solid rgba(0,0,0,0.05)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: darkMode 
                      ? '0 15px 35px rgba(0,0,0,0.4)' 
                      : '0 15px 35px rgba(0,0,0,0.15)'
                  }
                }}
                onClick={() => navigate(action.path)}
              >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 3,
                        backgroundColor: action.bgColor,
                        color: action.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2
                      }}
                    >
                      {action.icon}
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600,
                        color: darkMode ? '#f1f5f9' : '#1e293b',
                        mb: 1
                      }}
                    >
                      {action.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: darkMode ? '#64748b' : '#64748b',
                        lineHeight: 1.5
                      }}
                    >
                      {action.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      variant="outlined"
                      sx={{
                        borderColor: action.color,
                        color: action.color,
                        '&:hover': {
                          backgroundColor: `${action.color}10`,
                          borderColor: action.color
                        }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(action.path);
                      }}
                    >
                      Start
                    </Button>
                  </CardActions>
                </Card>
            ))}
          </Box>
        </Box>

        
      </Container>
    </>
  );
}

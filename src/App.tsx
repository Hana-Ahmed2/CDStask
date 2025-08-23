import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  Alert,
  CircularProgress,
  IconButton,
  Link,
} from '@mui/material';
import { Visibility, VisibilityOff, Person, Lock } from '@mui/icons-material';
import { login } from './auth';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin, token } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await login({ username, password });
      // Use the auth context login function which handles token refresh scheduling
      authLogin(result);
      navigate('/Home');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 25%, #7c3aed 50%, #be185d 75%, #dc2626 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 1.5,
        position: 'relative',
        overflow: 'hidden',
        // de 3ashan na3mel overlay 3ala el background
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.05) 0%, transparent 50%)',
          pointerEvents: 'none',
        }
      }}
    >
      {/* circles fel background 3ashan design */}
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, rgba(30,58,138,0.2), rgba(124,58,237,0.1))',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-15%',
          left: '-15%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, rgba(190,24,93,0.15), rgba(220,38,38,0.1))',
          zIndex: 0,
        }}
      />

      {/* el container el abyad elly feeh el form */}
      <Paper
        elevation={24}
        sx={{
          p: 4,
          maxWidth: 580,
          width: '100%',
          borderRadius: 4,
          bgcolor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)', // glass effect
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(30, 58, 138, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          position: 'relative',
          zIndex: 1,
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #1e3a8a, #7c3aed, #be185d, #dc2626)',
          }
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 70,
              height: 70,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1e3a8a, #7c3aed)',
              mb: 1.5,
              boxShadow: '0 10px 25px rgba(30, 58, 138, 0.4)',
              border: '3px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                fontFamily: 'Arial, sans-serif',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              CDS
            </Typography>
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #1e3a8a, #7c3aed, #be185d)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent', 
              mb: 0.5,
              letterSpacing: '0.5px',
            }}
          >
            Welcome Back
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(0,0,0,0.6)',
              fontWeight: 400,
            }}
          >
            Sign in to continue to your account
          </Typography>
        </Box>

        {/* el form nafso */}
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {/* username field */}
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Enter your username"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person sx={{ color: '#7c3aed' }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                bgcolor: 'rgba(248, 250, 252, 0.8)',
                // styling el border lama ykon normal
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(124, 58, 237, 0.3)',
                  borderWidth: 2,
                },
                // lama yehoot el mouse 3aleeh
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(124, 58, 237, 0.5)',
                },
                // lama yclick gowah
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#7c3aed',
                  borderWidth: 2,
                },
                '& input': {
                  fontSize: '1rem',
                  fontWeight: 500,
                  py: 1.2,
                }
              },
            }}
            InputLabelProps={{
              sx: {
                color: 'rgba(124, 58, 237, 0.8)',
                fontWeight: 600,
                '&.Mui-focused': {
                  color: '#7c3aed',
                }
              }
            }}
          />

          {/* password field */}
          <TextField
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            fullWidth
            placeholder="Enter your password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: '#7c3aed' }} />
                </InputAdornment>
              ),
              // law feeh password, hatezhar el eye button
              endAdornment: password.length > 0 ? (
                <InputAdornment position="end">
                  <IconButton
                    onClick={togglePasswordVisibility}
                    edge="end"
                    sx={{ 
                      color: '#7c3aed',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(124, 58, 237, 0.1)',
                      }
                    }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ) : null,
              sx: {
                borderRadius: 2,
                bgcolor: 'rgba(248, 250, 252, 0.8)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(124, 58, 237, 0.3)',
                  borderWidth: 2,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(124, 58, 237, 0.5)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#7c3aed',
                  borderWidth: 2,
                },
                '& input': {
                  fontSize: '1rem',
                  fontWeight: 500,
                  py: 1.2,
                }
              },
            }}
            InputLabelProps={{
              sx: {
                color: 'rgba(124, 58, 237, 0.8)',
                fontWeight: 600,
                '&.Mui-focused': {
                  color: '#7c3aed',
                }
              }
            }}
          />

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: 2,
                py: 0.5,
                '& .MuiAlert-icon': {
                  color: '#ef4444'
                }
              }}
            >
              {error}
            </Alert>
          )}
          
          {token && (
            <Alert 
              severity="success" 
              sx={{ 
                borderRadius: 2,
                py: 0.5,
                bgcolor: 'rgba(34, 197, 94, 0.1)',
                '& .MuiAlert-icon': {
                  color: '#22c55e'
                }
              }}
            >
              Login successful! Redirecting...
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              fontSize: '1rem',
              py: 1.5,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #be185d 100%)',
              boxShadow: '0 10px 25px rgba(124, 58, 237, 0.4)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1e40af 0%, #8b5cf6 50%, #c2185b 100%)',
                transform: 'translateY(-2px)', 
                boxShadow: '0 15px 35px rgba(124, 58, 237, 0.5)',
              },
              '&:active': {
                transform: 'translateY(0px)',
              },
              '&:disabled': {
                background: 'rgba(124, 58, 237, 0.3)',
                transform: 'none',
                boxShadow: 'none',
              }
            }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CircularProgress size={20} sx={{ color: 'white' }} />
                <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '0.95rem' }}>
                  Signing In...
                </Typography>
              </Box>
            ) : (
              'Sign In'
            )}
          </Button>

          <Box sx={{ mt: 1.5 }}>
            {/* forgot password link */}
            <Box sx={{ textAlign: 'center', mb: 1.5 }}>
              <Link
                component="button"
                type="button"
                onClick={() => console.log('Forgot password clicked')}
                sx={{
                  color: '#7c3aed',
                  fontWeight: 500,
                  textDecoration: 'none',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  '&:hover': {
                    color: '#be185d',
                    textDecoration: 'underline',
                  },
                  // underline animation
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -2,
                    left: 0,
                    width: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, #7c3aed, #be185d)',
                    transition: 'width 0.3s ease',
                  },
                  '&:hover::after': {
                    width: '100%',
                  }
                }}
              >
                Forgot Password?
              </Link>
            </Box>

            {/* el khat elly fe nos el text */}
            <Box
              sx={{
                position: 'relative',
                textAlign: 'center',
                mb: 1.5,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.3), transparent)',
                  transform: 'translateY(-50%)',
                }
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  display: 'inline-block',
                  px: 2.5,
                  py: 0.3,
                  bgcolor: 'rgba(255,255,255,0.95)',
                  color: 'rgba(0,0,0,0.5)',
                  fontSize: '0.8rem',
                  borderRadius: '20px',
                  border: '1px solid rgba(124, 58, 237, 0.1)',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                New to CDS?
              </Typography>
            </Box>
 
            {/* sign up section */}
            <Box
              sx={{
                textAlign: 'center',
                p: 2,
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, rgba(190, 24, 93, 0.05) 100%)',
                border: '1px solid rgba(124, 58, 237, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                // shine effect
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                  transition: 'left 0.6s ease',
                },
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(124, 58, 237, 0.15)',
                  borderColor: 'rgba(124, 58, 237, 0.2)',
                },
                '&:hover::before': {
                  left: '100%',
                }
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(0,0,0,0.7)',
                  mb: 1,
                  fontSize: '0.9rem',
                  fontWeight: 500,
                }}
              >
                Don't have an account yet?
              </Typography>
              
              <Button
                variant="contained"
                onClick={() => console.log('Sign up clicked')}
                sx={{
                  borderRadius: 3,
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  px: 3.5,
                  py: 1,
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #7c3aed 0%, #be185d 100%)',
                  boxShadow: '0 6px 20px rgba(124, 58, 237, 0.3)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  // hover overlay
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #c2185b 100%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                  },
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 30px rgba(124, 58, 237, 0.4)',
                  },
                  '&:hover::before': {
                    opacity: 1,
                  },
                  '&:active': {
                    transform: 'translateY(0px)',
                  },
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  Create Account
                </Box>
              </Button>

              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  mt: 1,
                  color: 'rgba(0,0,0,0.5)',
                  fontSize: '0.75rem',
                  fontStyle: 'italic',
                }}
              >
                Join thousands of satisfied users
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default App;

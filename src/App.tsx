import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  Alert,
  CircularProgress,
} from '@mui/material';
import { login } from './auth';
import { useNavigate } from 'react-router-dom';
function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setToken(null);

    try {
      const result = await login({ username, password });
      setToken(result.token);
       navigate('/Nextpage');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #0f2027, #203a43, #2c5364)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper
        elevation={12}
        sx={{
          p: 5,
          maxWidth: 400,
          width: '100%',
          borderRadius: 5,
          bgcolor: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          color: 'white',
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: 'white',
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          Login
        </Typography>

        <Box
          component="form"
          onSubmit={handleLogin}
          mt={4}
          display="flex"
          flexDirection="column"
          gap={3}
        >
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              sx: {
                borderRadius: '30px',
                bgcolor: 'rgba(255,255,255,0.1)',
                color: 'white',
              },
              startAdornment: (
                <InputAdornment position="start">
                  <span style={{ fontSize: '1.2rem' }}>👤</span>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ shrink: false }}
          />

          <TextField
            type="password"
            variant="outlined"
            fullWidth
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              sx: {
                borderRadius: '30px',
                bgcolor: 'rgba(255,255,255,0.1)',
                color: 'white',
              },
              endAdornment: (
                <InputAdornment position="end">
                  <span role="img" aria-label="lock" style={{ fontSize: '1.2rem' }}>
                    🔒
                  </span>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ shrink: false }}
          />

          {error && <Alert severity="error">{error}</Alert>}
          {token && <Alert severity="success">Logged in!</Alert>}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              borderRadius: '30px',
              fontWeight: 'bold',
              fontSize: '1rem',
              py: 1.5,
              bgcolor: '#ffffff',
              color: '#000',
              transition: '0.3s',
              '&:hover': {
                bgcolor: 'white',
                transform: 'scale(1.02)',
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'LOGIN'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default App;

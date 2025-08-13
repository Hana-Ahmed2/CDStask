import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomTheme } from '../contexts/ThemeContext';
import Navbar from '../components/Navbar';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Snackbar
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import type { ActiveDirectory } from '../types/ActiveDirectory';

export default function AddActiveDirectory() {
  const { darkMode, toggleDarkMode } = useCustomTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' 
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }

    // Create new active directory
    const newActiveDirectory: ActiveDirectory = {
      id: Math.floor(Math.random() * 10000) + 1000, // Generate random ID
      name: formData.name.trim(),
      description: formData.description.trim()
    };

    try {
      // Load existing active directories from localStorage or JSON file
      const loadExistingActiveDirectories = (): Promise<ActiveDirectory[]> => {
        const savedDirectories = localStorage.getItem('activeDirectories');
        if (savedDirectories) {
          return Promise.resolve(JSON.parse(savedDirectories));
        } else {
          return fetch('/activeDirectoryData.json')
            .then(response => response.json())
            .catch(() => []);
        }
      };

      loadExistingActiveDirectories()
        .then((existingDirectories: ActiveDirectory[]) => {
          // Check if name already exists
          const nameExists = existingDirectories.some(dir => 
            dir.name.toLowerCase() === newActiveDirectory.name.toLowerCase()
          );

          if (nameExists) {
            setSnackbar({
              open: true,
              message: 'Active directory name already exists',
              severity: 'error'
            });
            return;
          }

          // Add new active directory to the list
          const updatedDirectories = [...existingDirectories, newActiveDirectory];
          
          // Save to localStorage
          localStorage.setItem('activeDirectories', JSON.stringify(updatedDirectories));

          setSnackbar({
            open: true,
            message: 'Active directory saved successfully!',
            severity: 'success'
          });

          // Reset form and navigate back after short delay
          setFormData({ name: '', description: '' });
          setTimeout(() => {
            navigate('/Home');
          }, 1500);
        });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error saving active directory',
        severity: 'error'
      });
    }
  };
// beyrga3ny tany lel page lama akhalas
  const handleBack = () => {
    navigate('/active-directories');
  };

  return (
    <>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: '16px',
            backgroundColor: darkMode ? '#1e293b' : '#ffffff',
            border: darkMode ? '1px solid #374151' : '1px solid #e2e8f0',
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Button
              onClick={handleBack}
              startIcon={<ArrowBack />}
              sx={{
                mb: 2,
                color: darkMode ? '#94a3b8' : '#64748b',
                '&:hover': {
                  backgroundColor: darkMode ? '#374151' : '#f1f5f9',
                }
              }}
            >
              Back to Active Directories
            </Button>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 25%, #7c3aed 50%, #be185d 75%, #dc2626 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: darkMode ? '#f1f5f9' : '#1e293b',
                mb: 1
              }}
            >
              Add New Active Directory
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: darkMode ? '#94a3b8' : '#64748b'
              }}
            >
              Create a new active directory for your organization
            </Typography>
          </Box>

          {/* Form */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Active Directory Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#374151' : '#f9fafb',
                  '& fieldset': {
                    borderColor: darkMode ? '#6b7280' : '#d1d5db',
                  },
                  '&:hover fieldset': {
                    borderColor: darkMode ? '#9ca3af' : '#9ca3af',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: darkMode ? '#3b82f6' : '#2563eb',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#9ca3af' : '#6b7280',
                  '&.Mui-focused': {
                    color: darkMode ? '#3b82f6' : '#2563eb',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  color: darkMode ? '#f1f5f9' : '#1e293b',
                },
              }}
            />

            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              required
              multiline
              rows={3}
              helperText="Describe the purpose and scope of this active directory"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#374151' : '#f9fafb',
                  '& fieldset': {
                    borderColor: darkMode ? '#6b7280' : '#d1d5db',
                  },
                  '&:hover fieldset': {
                    borderColor: darkMode ? '#9ca3af' : '#9ca3af',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: darkMode ? '#3b82f6' : '#2563eb',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#9ca3af' : '#6b7280',
                  '&.Mui-focused': {
                    color: darkMode ? '#3b82f6' : '#2563eb',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  color: darkMode ? '#f1f5f9' : '#1e293b',
                },
                '& .MuiFormHelperText-root': {
                  color: darkMode ? '#9ca3af' : '#6b7280',
                },
              }}
            />
          </Box>

          {/* Actions */}
          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              onClick={handleBack}
              variant="outlined"
              sx={{
                borderColor: darkMode ? '#6b7280' : '#d1d5db',
                color: darkMode ? '#f1f5f9' : '#374151',
                '&:hover': {
                  borderColor: darkMode ? '#9ca3af' : '#9ca3af',
                  backgroundColor: darkMode ? '#374151' : '#f9fafb',
                }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              startIcon={<Save />}
              sx={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 25%, #7c3aed 50%, #be185d 75%, #dc2626 100%)',
                color: '#ffffff',
                fontWeight: 500,
                textTransform: 'none',
                boxShadow: '0 4px 15px rgba(30, 58, 138, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1e40af 0%, #4338ca 25%, #8b5cf6 50%, #db2777 75%, #ef4444 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 8px 25px rgba(30, 58, 138, 0.5)',
                }
              }}
            >
              Save Active Directory
            </Button>
          </Box>
        </Paper>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%', borderRadius: '8px' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}

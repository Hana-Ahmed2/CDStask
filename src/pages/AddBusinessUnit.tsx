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
import type { BusinessUnit } from '../types/BusinessUnit';

export default function AddBusinessUnit() {
  const { darkMode, toggleDarkMode } = useCustomTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    code: ''
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
    // Validate form
    if (!formData.name.trim() || !formData.code.trim()) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }

    // Create new business unit
    const newBusinessUnit: BusinessUnit = {
      id: crypto.randomUUID(), // Generate unique ID
      name: formData.name.trim(),
      code: formData.code.trim()
    };

    try {
      // Load existing business units from localStorage or JSON file
      const loadExistingBusinessUnits = (): Promise<BusinessUnit[]> => {
        const savedUnits = localStorage.getItem('businessUnits');
        if (savedUnits) {
          return Promise.resolve(JSON.parse(savedUnits));
        } else {
          return fetch('/businessUnitData.json')
            .then(response => response.json())
            .catch(() => []);
        }
      };

      loadExistingBusinessUnits()
        .then((existingUnits: BusinessUnit[]) => {
          // Check if code already exists
          const codeExists = existingUnits.some(unit => 
            unit.code.toLowerCase() === newBusinessUnit.code.toLowerCase()
          );

          if (codeExists) {
            setSnackbar({
              open: true,
              message: 'Business unit code already exists',
              severity: 'error'
            });
            return;
          }

          // Add new business unit to the list
          const updatedUnits = [...existingUnits, newBusinessUnit];
          
          // Save to localStorage
          localStorage.setItem('businessUnits', JSON.stringify(updatedUnits));

          setSnackbar({
            open: true,
            message: 'Business unit saved successfully!',
            severity: 'success'
          });

          // Reset form and navigate back after short delay
          setFormData({ name: '', code: '' });
          setTimeout(() => {
            navigate('/Home');
          }, 1500);
        });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error saving business unit',
        severity: 'error'
      });
    }
  };

  const handleBack = () => {
    navigate('/business-units');
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
              Back to Business Units
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
              Add New Business Unit
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: darkMode ? '#94a3b8' : '#64748b'
              }}
            >
              Create a new business unit for your organization
            </Typography>
          </Box>

          {/* Form */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Business Unit Name"
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
              label="Business Unit Code"
              value={formData.code}
              onChange={(e) => handleInputChange('code', e.target.value)}
              required
              helperText="A unique identifier for this business unit"
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
              Save Business Unit
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

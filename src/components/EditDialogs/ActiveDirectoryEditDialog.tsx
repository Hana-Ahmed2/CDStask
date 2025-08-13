import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import type { ActiveDirectory } from '../../types/ActiveDirectory';

interface ActiveDirectoryEditDialogProps {
  open: boolean;
  activeDirectory: ActiveDirectory | null;
  darkMode: boolean;
  onClose: () => void;
  onSave: (updatedDirectory: ActiveDirectory) => void;
}

export default function ActiveDirectoryEditDialog({
  open,
  activeDirectory,
  darkMode,
  onClose,
  onSave
}: ActiveDirectoryEditDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (activeDirectory) {
      setFormData({
        name: activeDirectory.name,
        description: activeDirectory.description || ''
      });
    } else {
      setFormData({ name: '', description: '' });
    }
    setErrors({ name: '', description: '' });
  }, [activeDirectory, open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: '',
      description: ''
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);
    return !newErrors.name;
  };

  const handleSave = () => {
    if (!validateForm() || !activeDirectory) return;

    const updatedDirectory: ActiveDirectory = {
      ...activeDirectory,
      name: formData.name.trim(),
      description: formData.description.trim()
    };

    onSave(updatedDirectory);
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '' });
    setErrors({ name: '', description: '' });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
      scroll="body"
      PaperProps={{
        sx: {
          backgroundColor: darkMode ? '#374151' : '#ffffff',
          color: darkMode ? '#f1f5f9' : '#1e293b',
          borderRadius: 2,
          minHeight: 200,
          width: '100%',
          maxWidth: 600,
          margin: 0,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }
      }}
      sx={{
        '& .MuiDialog-root': {
          zIndex: 1300,
        },
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        '& .MuiDialog-container': {
          padding: '20px !important',
          paddingTop: '50px !important',
          paddingBottom: '20px !important',
          display: 'flex !important',
          alignItems: 'flex-start !important',
          justifyContent: 'center !important',
          minHeight: '100vh',
          boxSizing: 'border-box',
        }
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 25%, #7c3aed 50%, #be185d 75%, #dc2626 100%)',
          color: '#ffffff',
          fontWeight: 600,
          textAlign: 'center',
          fontSize: '1.1rem',
          padding: '16px 24px',
          margin: 0,
        }}
      >
        Edit Active Directory
      </DialogTitle>
<br></br>
      <DialogContent sx={{ 
        padding: '24px', 
        backgroundColor: darkMode ? '#374151' : '#ffffff',
        maxHeight: 'calc(100vh - 200px)',
        overflowY: 'auto',
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Active Directory Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            required
            size="medium"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: darkMode ? '#4b5563' : '#ffffff',
                color: darkMode ? '#f1f5f9' : '#1e293b',
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
                color: darkMode ? '#d1d5db' : '#6b7280',
                '&.Mui-focused': {
                  color: darkMode ? '#3b82f6' : '#2563eb',
                },
              },
            }}
          />

          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            error={!!errors.description}
            helperText={errors.description || 'Optional description for this Active Directory'}
            fullWidth
            multiline
            rows={3}
            size="medium"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: darkMode ? '#4b5563' : '#ffffff',
                color: darkMode ? '#f1f5f9' : '#1e293b',
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
                color: darkMode ? '#d1d5db' : '#6b7280',
                '&.Mui-focused': {
                  color: darkMode ? '#3b82f6' : '#2563eb',
                },
              },
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ padding: '16px 24px 24px', gap: 1.5, backgroundColor: darkMode ? '#374151' : '#ffffff' }}>
        <Button
          onClick={handleCancel}
          startIcon={<Cancel />}
          sx={{
            borderRadius: '6px',
            padding: '8px 16px',
            backgroundColor: darkMode ? '#6b7280' : '#e5e7eb',
            color: darkMode ? '#f1f5f9' : '#374151',
            fontWeight: 500,
            textTransform: 'none',
            minWidth: 100,
            '&:hover': {
              backgroundColor: darkMode ? '#4b5563' : '#d1d5db',
            },
          }}
        >
          Cancel
        </Button>
        
        <Button
          onClick={handleSave}
          startIcon={<Save />}
          variant="contained"
          sx={{
            borderRadius: '6px',
            padding: '8px 16px',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 25%, #7c3aed 50%, #be185d 75%, #dc2626 100%)',
            color: '#ffffff',
            fontWeight: 500,
            textTransform: 'none',
            minWidth: 120,
            boxShadow: '0 4px 15px rgba(30, 58, 138, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1e40af 0%, #4338ca 25%, #8b5cf6 50%, #db2777 75%, #ef4444 100%)',
              transform: 'translateY(-1px)',
              boxShadow: '0 6px 20px rgba(30, 58, 138, 0.5)',
            },
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

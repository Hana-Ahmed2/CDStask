import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomTheme } from '../contexts/ThemeContext';
import Navbar from '../components/Navbar';
import ManagementTable from '../components/ManagementTable';
import { ActiveDirectoryEditDialog } from '../components/EditDialogs';
import type { ColumnDefinition } from '../components/ManagementTable';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import type { ActiveDirectory } from '../types/ActiveDirectory';

export default function ActiveDirectoriesPage() {
  const { darkMode, toggleDarkMode } = useCustomTheme();
  const navigate = useNavigate();
  const [activeDirectories, setActiveDirectories] = useState<ActiveDirectory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingDirectory, setEditingDirectory] = useState<ActiveDirectory | null>(null);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' 
  });

  // Column definitions for active directories table
  const activeDirectoryColumns: ColumnDefinition<ActiveDirectory>[] = [
    {
      key: 'name',
      label: 'Name',
      render: (directory) => (
        <Typography sx={{ 
          color: darkMode ? '#f1f5f9' : '#1e293b',
          fontWeight: 500,
          fontSize: { xs: '0.75rem', sm: '0.875rem' }
        }}>
          {directory.name}
        </Typography>
      )
    },
    {
      key: 'description',
      label: 'Description',
      hideOnMobile: true,
      render: (directory) => (
        <Typography sx={{ 
          color: darkMode ? '#94a3b8' : '#64748b',
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
          maxWidth: '300px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {directory.description || 'No description'}
        </Typography>
      )
    },
    {
      key: 'id',
      label: 'ID',
      hideOnMobile: true,
      render: (directory) => (
        <Typography sx={{ 
          color: darkMode ? '#94a3b8' : '#64748b',
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
          fontFamily: 'monospace',
          backgroundColor: darkMode ? '#374151' : '#f3f4f6',
          padding: '4px 8px',
          borderRadius: 1,
          display: 'inline-block'
        }}>
          {directory.id}
        </Typography>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (directory) => (
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => handleEdit(directory)}
              sx={{
                color: darkMode ? '#60a5fa' : '#2563eb',
                '&:hover': {
                  backgroundColor: darkMode ? '#1e3a8a' : '#dbeafe',
                }
              }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => handleDelete(directory.id)}
              sx={{
                color: darkMode ? '#f87171' : '#dc2626',
                '&:hover': {
                  backgroundColor: darkMode ? '#991b1b' : '#fee2e2',
                }
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  const loadActiveDirectories = () => {
    setLoading(true);
    
    // Load from localStorage first, then fall back to JSON file
    const savedDirectories = localStorage.getItem('activeDirectories');
    if (savedDirectories) {
      setActiveDirectories(JSON.parse(savedDirectories));
      setLoading(false);
    } else {
      fetch('/activeDirectoryData.json')
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch active directories');
          }
          return response.json();
        })
        .then(data => {
          setActiveDirectories(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching active directories:', error);
          setActiveDirectories([]);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    loadActiveDirectories();

    // Add event listener to reload data when window regains focus
    const handleFocus = () => {
      loadActiveDirectories();
    };
    
    window.addEventListener('focus', handleFocus);
    
    // Cleanup event listener
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const handleAdd = () => {
    navigate('/add-active-directory');
  };

  const handleEdit = (directory: ActiveDirectory) => {
    setEditingDirectory(directory);
    setEditDialogOpen(true);
  };

  const handleEditSave = (updatedDirectory: ActiveDirectory) => {
    const updatedDirectories = activeDirectories.map(dir => 
      dir.id === updatedDirectory.id ? updatedDirectory : dir
    );
    
    setActiveDirectories(updatedDirectories);
    localStorage.setItem('activeDirectories', JSON.stringify(updatedDirectories));
    
    setSnackbar({ 
      open: true, 
      message: 'Active directory updated successfully!', 
      severity: 'success' 
    });
    
    setEditDialogOpen(false);
    setEditingDirectory(null);
  };

  const handleEditCancel = () => {
    setEditDialogOpen(false);
    setEditingDirectory(null);
  };

  const handleDelete = (directoryId: number) => {
    if (window.confirm('Are you sure you want to delete this active directory?')) {
      const updatedDirectories = activeDirectories.filter(dir => dir.id !== directoryId);
      
      setActiveDirectories(updatedDirectories);
      localStorage.setItem('activeDirectories', JSON.stringify(updatedDirectories));
      
      setSnackbar({ 
        open: true, 
        message: 'Active directory deleted successfully!', 
        severity: 'success' 
      });
    }
  };

  return (
    <>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <Container 
        maxWidth="xl" 
        sx={{ 
          maxHeight: 'calc(100vh - 64px)', 
          display: 'flex',
          flexDirection: 'column',
          py: 2,
          overflow: 'auto',
          backgroundColor: darkMode ? '#0f172a' : '#f8fafc' 
        }}
      >
        <Box sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Page Header */}
          <Box sx={{ textAlign: 'center', mb: 2, flexShrink: 0 }}>
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
                mb: 0.5,
                letterSpacing: '-0.5px',
                fontSize: { xs: '1.25rem', sm: '1.50rem', md: '1.75rem' },
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              }}
            >
              Active Directories Management
            </Typography>
          </Box>
          
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" flex={1}>
              <CircularProgress sx={{ color: '#2563eb' }} />
            </Box>
          ) : (
            <ManagementTable
              data={activeDirectories}
              columns={activeDirectoryColumns}
              title="Active Directories"
              addButtonText="Add Active Directory"
              loading={loading}
              darkMode={darkMode}
              onAdd={handleAdd}
              getItemId={(directory) => directory.id}
              emptyStateMessage="No active directories found"
              emptyStateSubMessage="Start by adding your first active directory"
            />
          )}
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity} 
            sx={{ 
              width: '100%',
              borderRadius: '8px'
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Edit Dialog */}
        <ActiveDirectoryEditDialog
          open={editDialogOpen}
          activeDirectory={editingDirectory}
          darkMode={darkMode}
          onClose={handleEditCancel}
          onSave={handleEditSave}
        />
      </Container>
    </>
  );
}

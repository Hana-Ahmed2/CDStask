import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomTheme } from '../contexts/ThemeContext';
import Navbar from '../components/Navbar';
import ManagementTable from '../components/ManagementTable';
import { BusinessUnitEditDialog } from '../components/EditDialogs';
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
import type { BusinessUnit } from '../types/BusinessUnit';

export default function BusinessUnitsPage() {
  const { darkMode, toggleDarkMode } = useCustomTheme();
  const navigate = useNavigate();
  const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<BusinessUnit | null>(null);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' 
  });

  // Column definitions for business units table
  const businessUnitColumns: ColumnDefinition<BusinessUnit>[] = [
    {
      key: 'name',
      label: 'Name',
      render: (unit) => (
        <Typography sx={{ 
          color: darkMode ? '#f1f5f9' : '#1e293b',
          fontWeight: 500,
          fontSize: { xs: '0.75rem', sm: '0.875rem' }
        }}>
          {unit.name}
        </Typography>
      )
    },
    {
      key: 'code',
      label: 'Code',
      render: (unit) => (
        <Typography sx={{ 
          color: darkMode ? '#94a3b8' : '#64748b',
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
          fontFamily: 'monospace',
          backgroundColor: darkMode ? '#374151' : '#f3f4f6',
          padding: '4px 8px',
          borderRadius: 1,
          display: 'inline-block'
        }}>
          {unit.code}
        </Typography>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (unit) => (
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => handleEdit(unit)}
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
              onClick={() => handleDelete(unit.id)}
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

  const loadBusinessUnits = () => {
    setLoading(true);
    
    // Load from localStorage first, then fall back to JSON file
    const savedUnits = localStorage.getItem('businessUnits');
    if (savedUnits) {
      setBusinessUnits(JSON.parse(savedUnits));
      setLoading(false);
    } else {
      fetch('/businessUnitData.json')
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch business units');
          }
          return response.json();
        })
        .then(data => {
          setBusinessUnits(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching business units:', error);
          setBusinessUnits([]);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    loadBusinessUnits();

    // Add event listener to reload data when window regains focus
    const handleFocus = () => {
      loadBusinessUnits();
    };
    
    window.addEventListener('focus', handleFocus);
    
    // Cleanup event listener
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const handleAdd = () => {
    navigate('/add-business-unit');
  };

  const handleEdit = (unit: BusinessUnit) => {
    setEditingUnit(unit);
    setEditDialogOpen(true);
  };

  const handleEditSave = (updatedUnit: BusinessUnit) => {
    const updatedUnits = businessUnits.map(unit => 
      unit.id === updatedUnit.id ? updatedUnit : unit
    );
    
    setBusinessUnits(updatedUnits);
    localStorage.setItem('businessUnits', JSON.stringify(updatedUnits));
    
    setSnackbar({ 
      open: true, 
      message: 'Business unit updated successfully!', 
      severity: 'success' 
    });
    
    setEditDialogOpen(false);
    setEditingUnit(null);
  };

  const handleEditCancel = () => {
    setEditDialogOpen(false);
    setEditingUnit(null);
  };

  const handleDelete = (unitId: string) => {
    if (window.confirm('Are you sure you want to delete this business unit?')) {
      const updatedUnits = businessUnits.filter(unit => unit.id !== unitId);
      
      setBusinessUnits(updatedUnits);
      localStorage.setItem('businessUnits', JSON.stringify(updatedUnits));
      
      setSnackbar({ 
        open: true, 
        message: 'Business unit deleted successfully!', 
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
          height: 'calc(100vh - 64px)', 
          display: 'flex',
          flexDirection: 'column',
          py: 2,
          overflow: 'visible',
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
              Business Units Management
            </Typography>
          </Box>
          
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" flex={1}>
              <CircularProgress sx={{ color: '#2563eb' }} />
            </Box>
          ) : (
            <ManagementTable
              data={businessUnits}
              columns={businessUnitColumns}
              title="Business Units"
              addButtonText="Add Business Unit"
              loading={loading}
              darkMode={darkMode}
              onAdd={handleAdd}
              getItemId={(unit) => unit.id}
              emptyStateMessage="No business units found"
              emptyStateSubMessage="Start by adding your first business unit"
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
        <BusinessUnitEditDialog
          open={editDialogOpen}
          businessUnit={editingUnit}
          darkMode={darkMode}
          onClose={handleEditCancel}
          onSave={handleEditSave}
        />
      </Container>
    </>
  );
}

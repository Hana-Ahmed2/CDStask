import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomTheme } from './contexts/ThemeContext'; 
import Navbar from "./components/Navbar"; 
import ManagementTable from './components/ManagementTable';
import type { ColumnDefinition } from './components/ManagementTable';
import {Container, Typography, Box, CircularProgress, Chip,Snackbar, Alert} from '@mui/material';
import type { User } from './types/User';
import type { BusinessUnit } from './types/BusinessUnit';
import type { ActiveDirectory } from './types/ActiveDirectory';
import ActionButtons from './components/UserTable/ActionButtons';
import UserDialog from './components/UserDialog/UserDialog';

export default function Home() {
  const { darkMode, toggleDarkMode } = useCustomTheme();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null); 
  const [dialogOpen, setDialogOpen] = useState(false); 
  const [isEditing, setIsEditing] = useState(false); 
  const [isCreating, setIsCreating] = useState(false); 
  const [editedUser, setEditedUser] = useState<User | null>(null); 
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' }); // el notifications
  const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>([]);
  const [activeDirectories, setActiveDirectories] = useState<ActiveDirectory[]>([]);

  // Column definitions for the management table
  const userColumns: ColumnDefinition<User>[] = [
    {
      key: 'username',
      label: 'Username',
      render: (user) => (
        <Typography sx={{ 
          color: darkMode ? '#94a3b8' : '#64748b',
          fontSize: { xs: '0.75rem', sm: '0.875rem' }
        }}>
          {user.username}
        </Typography>
      )
    },
    {
      key: 'email',
      label: 'Email',
      render: (user) => (
        <Typography sx={{ 
          color: darkMode ? '#f1f5f9' : '#1e293b', 
          fontWeight: 500,
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
          maxWidth: { xs: '120px', sm: 'none' },
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {user.email}
        </Typography>
      )
    },
    {
      key: 'roleCode',
      label: 'Role',
      hideOnMobile: true,
      render: (user) => (
        user.roleCode ? (
          <Chip 
            label={user.roleCode} 
            size="small" 
            sx={{ 
              backgroundColor: darkMode ? '#1e3a8a' : '#dbeafe',
              color: darkMode ? '#bfdbfe' : '#1e40af',
              fontWeight: 500,
              fontSize: '0.75rem',
              textTransform: 'capitalize',
              border: darkMode ? '1px solid #1e40af' : '1px solid #bfdbfe'
            }}
          />
        ) : (
          <Typography variant="body2" sx={{ color: darkMode ? '#64748b' : '#94a3b8', fontStyle: 'italic' }}>
            No role assigned
          </Typography>
        )
      )
    },
    {
      key: 'department',
      label: 'Department',
      hideOnMobile: true,
      hideOnTablet: true,
      render: (user) => (
        <Typography sx={{ 
          color: darkMode ? '#94a3b8' : '#64748b',
          fontSize: { xs: '0.75rem', sm: '0.875rem' }
        }}>
          {user.department || 'N/A'}
        </Typography>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (user) => (
        <Chip 
          label={user.status} 
          size="small"
          sx={{
            fontWeight: 500,
            fontSize: '0.75rem',
            textTransform: 'capitalize',
            ...(user.status.toLowerCase() === 'active' && {
              backgroundColor: darkMode ? '#166534' : '#dcfce7',
              color: darkMode ? '#bbf7d0' : '#166534',
              border: darkMode ? '1px solid #22c55e' : '1px solid #bbf7d0'
            }),
            ...(user.status.toLowerCase() === 'inactive' && {
              backgroundColor: darkMode ? '#991b1b' : '#fee2e2',
              color: darkMode ? '#fecaca' : '#991b1b',
              border: darkMode ? '1px solid #ef4444' : '1px solid #fecaca'
            })
          }}
        />
      )
    },
    {
      key: 'provider',
      label: 'Provider',
      hideOnMobile: true,
      render: (user) => (
        <Typography sx={{ 
          color: darkMode ? '#94a3b8' : '#64748b',
          fontSize: { xs: '0.75rem', sm: '0.875rem' }
        }}>
          {user.provider}
        </Typography>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (user) => (
        <ActionButtons
          user={user}
          darkMode={darkMode}
          onViewDetails={handleViewDetails}
          onDelete={handleDelete}
        />
      )
    }
  ];
  
  // function 3ashan n save el users fel localStorage
  const saveUsersToStorage = (usersData: User[]) => {
    try {
      localStorage.setItem('users', JSON.stringify(usersData));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // function 3ashan negeb el users men el localStorage
  const loadUsersFromStorage = (): User[] | null => {
    try {
      const savedUsers = localStorage.getItem('users');
      return savedUsers ? JSON.parse(savedUsers) : null;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  };

  // Function to load business units and active directories
  const loadBusinessUnitsAndDirectories = () => {
    // Load business units from localStorage first, then fall back to JSON file
    const loadBusinessUnits = (): Promise<BusinessUnit[]> => {
      const savedUnits = localStorage.getItem('businessUnits');
      if (savedUnits) {
        return Promise.resolve(JSON.parse(savedUnits));
      } else {
        return fetch('/businessUnitData.json')
          .then(response => response.ok ? response.json() : [])
          .catch(() => []);
      }
    };
    
    // Load active directories from localStorage first, then fall back to JSON file
    const loadActiveDirectories = (): Promise<ActiveDirectory[]> => {
      const savedDirectories = localStorage.getItem('activeDirectories');
      if (savedDirectories) {
        return Promise.resolve(JSON.parse(savedDirectories));
      } else {
        return fetch('/activeDirectoryData.json')
          .then(response => response.ok ? response.json() : [])
          .catch(() => []);
      }
    };
    
    Promise.all([loadBusinessUnits(), loadActiveDirectories()])
      .then(([buData, adData]) => {
        setBusinessUnits(buData);
        setActiveDirectories(adData);
      });
  };

  useEffect(() => {
    const savedUsers = loadUsersFromStorage();
    
    // Load initial data
    loadBusinessUnitsAndDirectories();
    
    // Add event listener to reload data when window regains focus
    const handleFocus = () => {
      loadBusinessUnitsAndDirectories();
    };
    
    window.addEventListener('focus', handleFocus);
    
    if (savedUsers && savedUsers.length > 0) {
      setUsers(savedUsers);
      setLoading(false);
    } else {
      fetch('/users.json')
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch users');
          }
          return response.json();
        })
        .then(data => {
          setUsers(data);
          saveUsersToStorage(data); 
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching users:', error);
          setLoading(false);
        });
    }

    // Cleanup event listener
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // function 3ashan n save el users fel localStorage

  const handleCreateUser = () => {
    const newUser: User = {
      id: Math.max(...users.map(u => u.id), 0) + 1, // geeb akbar ID w zeedo 1
      name: '',
      email: '',
      password: '',
      provider: 'local',
      roleCode: 'user',
      businessUnitId: '',
      username: '',
      status: 'ACTIVE',
      firstName: '',
      lastName: '',
      department: '',
      phoneNumber: '',
      activeDirectoryId: '',
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      createdById: 'current-user-id',
      modifiedById: 'current-user-id'
    };
    setEditedUser(newUser);
    setIsCreating(true);
    setIsEditing(true);
    setDialogOpen(true);
    setSelectedUser(null);
  };

  // lama yedoos 3ala el 3en 3ashan yeshoof details el user
  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setEditedUser({ ...user }); // na3mel copy men el user
    setDialogOpen(true);
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedUser) {
      let updatedUsers: User[];
      
      if (isCreating) {
        updatedUsers = [...users, editedUser];
        setSnackbar({ open: true, message: 'User created successfully!', severity: 'success' });
      } else {
        updatedUsers = users.map(user => 
          user.id === editedUser.id ? { ...editedUser, modifiedAt: new Date().toISOString() } : user
        );
        setSelectedUser(editedUser);
        setSnackbar({ open: true, message: 'User updated successfully!', severity: 'success' });
      }
      
      // save el taghyeerat fel state w fel localStorage
      setUsers(updatedUsers);
      saveUsersToStorage(updatedUsers);
      
      setIsEditing(false);
      setIsCreating(false);
      setDialogOpen(false);
    }
  };

  const handleDelete = (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(user => user.id !== userId);
      
      setUsers(updatedUsers);
      saveUsersToStorage(updatedUsers);
      
      setSnackbar({ open: true, message: 'User deleted successfully!', severity: 'success' });
    }
  };

  const handleCancel = () => {
    setEditedUser(selectedUser ? { ...selectedUser } : null); 
    setIsEditing(false);
    setIsCreating(false);
    if (isCreating) {
      setDialogOpen(false); 
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUser(null);
    setEditedUser(null);
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleInputChange = (field: keyof User, value: string) => {
    if (editedUser) {
      setEditedUser({
        ...editedUser,
        [field]: value
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleAddBusinessUnit = () => {
    // Navigate to the add business unit page
    navigate('/add-business-unit');
  };

  const handleAddActiveDirectory = () => {
    // Navigate to the add active directory page
    navigate('/add-active-directory');
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
          {/* el header beta3 el page */}
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
                fontSize: { xs: '1.25rem', sm: '1.50rem', md: '1.75rem' }, // dol responsiveness
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              }}
            >
              User Management
            </Typography>
          </Box>
          
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" flex={1}>
              <CircularProgress sx={{ color: '#2563eb' }} />
            </Box>
          ) : users.length === 0 ? (
            <Box sx={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h6" sx={{ color: darkMode ? '#94a3b8' : '#64748b', mb: 2 }}>
                No users found
              </Typography>
              <Typography variant="body2" sx={{ color: darkMode ? '#64748b' : '#94a3b8' }}>
                Start by adding your first team member
              </Typography>
            </Box>
          ) : (
            <ManagementTable
              data={users}
              columns={userColumns}
              title="Users"
              addButtonText="Add Member"
              loading={loading}
              darkMode={darkMode}
              onAdd={handleCreateUser}
              getItemId={(user) => user.id}
              renderActionButtons={(user) => (
                <ActionButtons
                  user={user}
                  darkMode={darkMode}
                  onViewDetails={handleViewDetails}
                  onDelete={handleDelete}
                />
              )}
              emptyStateMessage="No users found"
              emptyStateSubMessage="Start by adding your first team member"
            />
          )}
        </Box>

        {/* User Dialog */}
        <UserDialog
          open={dialogOpen}
          darkMode={darkMode}
          editedUser={editedUser}
          isEditing={isEditing}
          isCreating={isCreating}
          businessUnits={businessUnits}
          activeDirectories={activeDirectories}
          formatDate={formatDate}
          onClose={handleCloseDialog}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
          onInputChange={handleInputChange}
          onAddBusinessUnit={handleAddBusinessUnit}
          onAddActiveDirectory={handleAddActiveDirectory}
        />

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
      </Container>
    </>
  );
}

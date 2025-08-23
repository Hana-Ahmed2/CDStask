import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomTheme } from '../contexts/ThemeContext'; 
import Navbar from "../components/Navbar"; 
import ManagementTable from '../components/ManagementTable';
import type { ColumnDefinition } from '../components/ManagementTable';
import {Container, Typography, Box, CircularProgress, Chip, Snackbar, Alert} from '@mui/material';
import type { User } from '../types/User';
import type { BusinessUnit } from '../types/BusinessUnit';
import type { ActiveDirectory } from '../types/ActiveDirectory';
import ActionButtons from '../components/UserTable/ActionButtons';
import UserDialog from '../components/UserDialog/UserDialog';
import ConfirmDialog from '../components/ConfirmDialog';

export default function UsersPage() {
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
  
  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

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
      hideOnMobile: true,
      render: (user) => (
        <Chip 
          label={user.status} 
          size="small" 
          sx={{ 
            ...(user.status === 'ACTIVE' ? {
              backgroundColor: darkMode ? '#15803d' : '#dcfce7',
              color: darkMode ? '#bbf7d0' : '#15803d',
              border: darkMode ? '1px solid #22c55e' : '1px solid #bbf7d0'
            } : {
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

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load users
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
          setUsers(JSON.parse(storedUsers));
        } else {
          const response = await fetch('/users.json');
          const userData = await response.json();
          setUsers(userData);
          localStorage.setItem('users', JSON.stringify(userData));
        }

        // Load business units
        const storedBusinessUnits = localStorage.getItem('businessUnits');
        if (storedBusinessUnits) {
          setBusinessUnits(JSON.parse(storedBusinessUnits));
        } else {
          const response = await fetch('/businessUnitData.json');
          const businessUnitData = await response.json();
          setBusinessUnits(businessUnitData);
          localStorage.setItem('businessUnits', JSON.stringify(businessUnitData));
        }

        // Load active directories
        const storedActiveDirectories = localStorage.getItem('activeDirectories');
        if (storedActiveDirectories) {
          setActiveDirectories(JSON.parse(storedActiveDirectories));
        } else {
          const response = await fetch('/activeDirectoryData.json');
          const activeDirectoryData = await response.json();
          setActiveDirectories(activeDirectoryData);
          localStorage.setItem('activeDirectories', JSON.stringify(activeDirectoryData));
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setSnackbar({ open: true, message: 'Error loading data', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Function to handle saving users to localStorage and updating state
  const saveUsers = (updatedUsers: User[]) => {
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  // Handle user deletion
  const handleDelete = (userId: number) => {
    const userToDelete = users.find(u => u.id === userId);
    
    setConfirmDialog({
      open: true,
      title: 'Delete User',
      message: `Are you sure you want to delete user "${userToDelete?.username || 'Unknown'}"? This action cannot be undone.`,
      onConfirm: () => {
        const updatedUsers = users.filter(u => u.id !== userId);
        saveUsers(updatedUsers);
        setSnackbar({ 
          open: true, 
          message: `User ${userToDelete?.username || 'Unknown'} deleted successfully`, 
          severity: 'success' 
        });
        setConfirmDialog({ ...confirmDialog, open: false });
      }
    });
  };

  // Handle view details
  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setEditedUser(user);
    setIsEditing(false);
    setIsCreating(false);
    setDialogOpen(true);
  };

  // Handle edit
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Handle save
  const handleSave = () => {
    if (editedUser) {
      const updatedUsers = isCreating 
        ? [...users, editedUser]
        : users.map(u => u.id === editedUser.id ? editedUser : u);
      
      saveUsers(updatedUsers);
      setSnackbar({ 
        open: true, 
        message: isCreating ? 'User created successfully' : 'User updated successfully', 
        severity: 'success' 
      });
      
      setDialogOpen(false);
      setIsEditing(false);
      setIsCreating(false);
      setSelectedUser(null);
      setEditedUser(null);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setIsEditing(false);
    if (isCreating) {
      setDialogOpen(false);
      setIsCreating(false);
    }
    setEditedUser(selectedUser);
  };

  // Handle close dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setIsEditing(false);
    setIsCreating(false);
    setSelectedUser(null);
    setEditedUser(null);
  };

  // Handle create new user
  const handleCreateUser = () => {
    const newUser: User = {
      id: Math.max(...users.map(u => u.id), 0) + 1,
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

  // Handle input changes
  const handleInputChange = (field: keyof User, value: any) => {
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
    navigate('/add-business-unit');
  };

  const handleAddActiveDirectory = () => {
    navigate('/add-active-directory');
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
          {/* Page header */}
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
                textAlign: 'center'
              }}
            >
              User Management
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: darkMode ? '#64748b' : '#64748b',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                textAlign: 'center'
              }}
            >
              Manage your team members and their access
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <CircularProgress sx={{ color: darkMode ? '#7c3aed' : '#1e3a8a' }} />
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

        <ConfirmDialog
          open={confirmDialog.open}
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog({ ...confirmDialog, open: false })}
          darkMode={darkMode}
          severity="error"
        />
      </Container>
    </>
  );
}

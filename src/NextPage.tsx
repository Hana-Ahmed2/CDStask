import React, { useState, useEffect } from 'react';
import { useCustomTheme } from './contexts/ThemeContext'; 
import Navbar from "./components/Navbar"; 
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Box, Pagination, CircularProgress, Chip,
  Card, CardContent, Container, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, TextField, Select,
  MenuItem, FormControl, InputLabel, Snackbar, Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles'; 
import { Visibility, Edit, Save, Cancel, Delete, Add } from '@mui/icons-material'; 

interface User {
  id: number;
  name: string;
  email: string; 
  password: string;
  provider: string;
  roleCode: string;
  businessUnitId: string;
  username: string;
  status: string;
  firstName: string;
  lastName: string;
  department: string;
  phoneNumber: string;
  activeDirectoryId: string;
  createdAt: string;
  modifiedAt: string;
  createdById: string;
  modifiedById: string;
}

// styling el table header cells 
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.mode === 'dark' ? '#1e293b' : '#1e3a8a', 
  color: '#ffffff',
  textAlign: 'center',
  fontSize: '0.875rem',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.mode === 'dark' ? '#1e293b' : '#f8fafc',
  },
  '&:nth-of-type(even)': { 
    backgroundColor: theme.palette.mode === 'dark' ? '#0f172a' : '#ffffff',
  },
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#374151' : '#e0f2fe',
    transition: 'background-color 0.3s ease', // smooth transition
  },
}));

export default function Nextpage() {
  const { darkMode, toggleDarkMode } = useCustomTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); 
  const [usersPerPage] = useState(10); // kam user fe kol page
  const [selectedUser, setSelectedUser] = useState<User | null>(null); 
  const [dialogOpen, setDialogOpen] = useState(false); 
  const [isEditing, setIsEditing] = useState(false); 
  const [isCreating, setIsCreating] = useState(false); 
  const [editedUser, setEditedUser] = useState<User | null>(null); 
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' }); // el notifications
  
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

  useEffect(() => {
    const savedUsers = loadUsersFromStorage();
    
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
  }, []);

  // hesabat el pagination - kam page w el users elly hanwareha
  const totalPages = Math.ceil(users.length / usersPerPage); // maslan lw 3andy 25 user / 10 users per page, hayeb2a 3 pages
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  
  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

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
      status: 'active',
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

        // rooh 3ala akher page 3ashan yeshoof el user el gded
        const newTotalPages = Math.ceil((users.length + 1) / usersPerPage);
        setCurrentPage(newTotalPages);
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
      
      // law el page el haly fadya ba3d el delete, rooh lel page elly ablha
      const newTotalPages = Math.ceil(updatedUsers.length / usersPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      } else if (updatedUsers.length === 0) {
        setCurrentPage(1);
      }
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
          overflow: 'hidden',
          backgroundColor: darkMode ? '#0f172a' : 'transparent' 
        }}
      >
        {/* el card elly feeh el table */}
        <Card 
          elevation={0} 
          sx={{ 
            borderRadius: '16px', 
            border: darkMode ? '1px solid #374151' : '1px solid #e2e8f0', 
            backgroundColor: darkMode ? '#1e293b' : '#ffffff',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <CardContent sx={{ 
            p: 3, 
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
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }, // dol responsiveness
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                }}
              >
                User Management
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: darkMode ? '#94a3b8' : '#64748b', 
                  fontSize: '1rem',
                }}
              >
                Manage your Users and their permissions efficiently
              </Typography>
            </Box>
            
            {/* law lessa bygeeb el data */}
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
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                {/* el controls section - feeh el counter w el Add button */}
                <Box sx={{ 
                  mb: 2, 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 2,
                  flexShrink: 0
                }}>
                  <Box>
                    <Typography variant="h6" sx={{ color: darkMode ? '#f1f5f9' : '#1e293b', fontWeight: 600, mb: 0.5, background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 25%, #7c3aed 50%, #be185d 75%, #dc2626 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text' }}>
                      Users
                    </Typography>
                    <Typography variant="body2" sx={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                      Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, users.length)} of {users.length} users
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleCreateUser}
                  size="small"
                  sx={{
                    borderRadius: '8px',
                    padding: '6px 16px',
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 25%, #7c3aed 50%, #be185d 75%, #dc2626 100%)',
                    color: '#ffffff',
                    fontWeight: 500,
                    textTransform: 'none',
                    fontSize: '0.875rem',
                    boxShadow: '0 4px 20px rgba(30, 58, 138, 0.3)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1e40af 0%, #4338ca 25%, #8b5cf6 50%, #db2777 75%, #ef4444 100%)',
                      transform: 'translateY(-1px)', 
                      boxShadow: '0 6px 25px rgba(30, 58, 138, 0.4)',
                    },
                    '&:active': {
                      transform: 'translateY(0px)',
                    }
                  }}
              >
                    Add Member
                  </Button>
                  </Box>
                </Box>

                {/* el table nafso */}
                <TableContainer 
                  component={Paper} 
                  sx={{ 
                    flex: 1,
                    borderRadius: '12px',
                    border: darkMode ? '1px solid #374151' : '1px solid #e2e8f0',
                    backgroundColor: darkMode ? '#1e293b' : '#ffffff', 
                    boxShadow: 'none',
                    overflow: 'hidden',
                    mb: 2,
                    minHeight: 0
                  }}
                >
                  <Table sx={{ minWidth: 650 }} aria-label="users table">
                    {/* el table header */}
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>ID</StyledTableCell>
                        <StyledTableCell>Email</StyledTableCell>
                        <StyledTableCell>Provider</StyledTableCell>
                        <StyledTableCell>Role</StyledTableCell>
                        <StyledTableCell>Department</StyledTableCell>
                        <StyledTableCell>Username</StyledTableCell>
                        <StyledTableCell>Status</StyledTableCell>
                        <StyledTableCell>Actions</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    {/* el table body - feeh kol el users */}
                    <TableBody>
                      {currentUsers.map((user) => (
                        <StyledTableRow key={user.id}>
                          {/* ID column */}
                          <TableCell sx={{ color: darkMode ? '#94a3b8' : '#64748b', fontWeight: 500 }}>
                            #{user.id}
                          </TableCell>
                          {/* Email column */}
                          <TableCell sx={{ color: darkMode ? '#f1f5f9' : '#1e293b', fontWeight: 500 }}>
                            {user.email}
                          </TableCell>
                          {/* Provider column */}
                          <TableCell sx={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                            {user.provider}
                          </TableCell>
                          {/* Role column - feeh chip maloon */}
                          <TableCell>
                            {user.roleCode ? (
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
                            )}
                          </TableCell>
                          {/* Department column */}
                          <TableCell sx={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                            {user.department || 'N/A'}
                          </TableCell>
                          {/* Username column */}
                          <TableCell sx={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                            {user.username}
                          </TableCell>
                          {/* Status column - feeh chip maloon active/inactive */}
                          <TableCell>
                            <Chip 
                              label={user.status} 
                              size="small"
                              sx={{
                                fontWeight: 500,
                                fontSize: '0.75rem',
                                textTransform: 'capitalize',
                                ...(user.status === 'active' && {
                                  backgroundColor: darkMode ? '#166534' : '#dcfce7',
                                  color: darkMode ? '#bbf7d0' : '#166534',
                                  border: darkMode ? '1px solid #22c55e' : '1px solid #bbf7d0'
                                }),
                                ...(user.status === 'inactive' && {
                                  backgroundColor: darkMode ? '#991b1b' : '#fee2e2',
                                  color: darkMode ? '#fecaca' : '#991b1b',
                                  border: darkMode ? '1px solid #ef4444' : '1px solid #fecaca'
                                })
                              }}
                            />
                          </TableCell>
                          {/* Actions column - feeh el buttons */}
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              {/* View button */}
                              <IconButton 
                                onClick={() => handleViewDetails(user)}
                                title="View Details"
                                size="small"
                                sx={{
                                  backgroundColor: darkMode ? '#1e3a8a' : '#eff6ff',
                                  color: darkMode ? '#bfdbfe' : '#2563eb',
                                  border: darkMode ? '1px solid #1e40af' : '1px solid #dbeafe',
                                  borderRadius: '6px',
                                  padding: '6px',
                                  transition: 'all 0.2s ease',
                                  '&:hover': {
                                    backgroundColor: darkMode ? '#1d4ed8' : '#dbeafe',
                                    color: darkMode ? '#dbeafe' : '#1d4ed8',
                                    transform: 'scale(1.05)', 
                                  }
                                }}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                              {/* Delete button */}
                              <IconButton 
                                onClick={() => handleDelete(user.id)}
                                title="Delete User"
                                size="small"
                                sx={{
                                  backgroundColor: darkMode ? '#991b1b' : '#fef2f2',
                                  color: darkMode ? '#fecaca' : '#dc2626',
                                  border: darkMode ? '1px solid #ef4444' : '1px solid #fecaca',
                                  borderRadius: '6px',
                                  padding: '6px',
                                  transition: 'all 0.2s ease',
                                  '&:hover': {
                                    backgroundColor: darkMode ? '#b91c1c' : '#fee2e2',
                                    color: darkMode ? '#fee2e2' : '#b91c1c',
                                    transform: 'scale(1.05)',
                                  }
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* el pagination - bas law feeh aktar men page */}
                {totalPages > 1 && (
                  <Box display="flex" justifyContent="center" sx={{ flexShrink: 0 }}>
                    <Pagination 
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      size="medium"
                      showFirstButton
                      showLastButton
                      sx={{
                        '& .MuiPaginationItem-root': {
                          color: darkMode ? '#94a3b8' : '#64748b',
                          borderColor: darkMode ? '#374151' : '#e2e8f0',
                          backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                          '&:hover': {
                            backgroundColor: darkMode ? '#374151' : '#f1f5f9',
                          }
                        },
                        '& .MuiPaginationItem-root.Mui-selected': {
                          backgroundColor: '#2563eb',
                          color: '#ffffff',
                          '&:hover': {
                            backgroundColor: '#1d4ed8',
                          }
                        }
                      }}
                    />
                  </Box>
                )}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* el dialog elly beyeftah lama nedoos view/edit/create */}
        <Dialog 
          open={dialogOpen} 
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '16px',
              border: darkMode ? '1px solid #374151' : '1px solid #e2e8f0',
              backgroundColor: darkMode ? '#1e293b' : '#ffffff',
            }
          }}
        >
          {/* el title beta3 el dialog */}
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
            borderBottom: darkMode ? '1px solid #374151' : '1px solid #e2e8f0',
            color: darkMode ? '#f1f5f9' : '#1e293b',
            padding: '20px 24px',
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {isCreating ? 'Add New Member' : isEditing ? 'Edit Member Details' : 'Member Details'}
            </Typography>
            {/* law mash betha3del w mash beta3mel gded, wareeh edit button */}
            {!isEditing && !isCreating && (
              <IconButton 
                onClick={handleEdit} 
                title="Edit User"
                size="small"
                sx={{
                  backgroundColor: darkMode ? '#1e3a8a' : '#eff6ff',
                  color: darkMode ? '#bfdbfe' : '#2563eb',
                  border: darkMode ? '1px solid #1e40af' : '1px solid #dbeafe',
                  '&:hover': {
                    backgroundColor: darkMode ? '#1d4ed8' : '#dbeafe',
                  }
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
            )}
          </DialogTitle>
          
          {/* el content beta3 el dialog - kol el form fields */}
          <DialogContent sx={{ p: 3, backgroundColor: darkMode ? '#1e293b' : '#ffffff' }}>
            {editedUser && (
              <Box sx={{ mt: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* First Name w Last Name fe nafs el row */}
                  <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={editedUser.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      disabled={!isEditing} 
                      required
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          '&.Mui-focused fieldset': {
                            borderColor: '#2563eb',
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#2563eb',
                        }
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={editedUser.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      disabled={!isEditing}
                      required
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          '&.Mui-focused fieldset': {
                            borderColor: '#2563eb',
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#2563eb',
                        }
                      }}
                    />
                  </Box>
                  
                  {/* Email w Username fe nafs el row */}
                  <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={editedUser.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                      required
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          '&.Mui-focused fieldset': {
                            borderColor: '#2563eb',
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#2563eb',
                        }
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Username"
                      value={editedUser.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      disabled={!isEditing}
                      required
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          '&.Mui-focused fieldset': {
                            borderColor: '#2563eb',
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#2563eb',
                        }
                      }}
                    />
                  </Box>
                  
                  {/* Department w Phone fe nafs el row */}
                  <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <TextField
                      fullWidth
                      label="Department"
                      value={editedUser.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      disabled={!isEditing}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          '&.Mui-focused fieldset': {
                            borderColor: '#2563eb',
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#2563eb',
                        }
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={editedUser.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      disabled={!isEditing}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          '&.Mui-focused fieldset': {
                            borderColor: '#2563eb',
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#2563eb',
                        }
                      }}
                    />
                  </Box>
                  
                  {/* Role w Status fe nafs el row - dol select dropdowns */}
                  <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <FormControl fullWidth disabled={!isEditing}>
                      <InputLabel sx={{ '&.Mui-focused': { color: '#2563eb' } }}>Role</InputLabel>
                      <Select
                        value={editedUser.roleCode}
                        onChange={(e) => handleInputChange('roleCode', e.target.value)}
                        label="Role"
                        sx={{
                          borderRadius: '8px',
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#2563eb',
                          }
                        }}
                      >
                        <MenuItem value="admin">Administrator</MenuItem>
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="manager">Manager</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth disabled={!isEditing}>
                      <InputLabel sx={{ '&.Mui-focused': { color: '#2563eb' } }}>Status</InputLabel>
                      <Select
                        value={editedUser.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        label="Status"
                        sx={{
                          borderRadius: '8px',
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#2563eb',
                          }
                        }}
                      >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  
                  {/* Business Unit ID field */}
                  <TextField
                    fullWidth
                    label="Business Unit ID"
                    value={editedUser.businessUnitId}
                    onChange={(e) => handleInputChange('businessUnitId', e.target.value)}
                    disabled={!isEditing}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '&.Mui-focused fieldset': {
                          borderColor: '#2563eb',
                        }
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#2563eb',
                      }
                    }}
                  />
                  
                  {/* law mash beta3mel user gded, wareeh el dates */}
                  {!isCreating && (
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 2, 
                      flexDirection: { xs: 'column', sm: 'row' },
                      pt: 2,
                      borderTop: '1px solid #e2e8f0'
                    }}>
                      <TextField
                        fullWidth
                        label="Created"
                        value={formatDate(editedUser.createdAt)}
                        disabled // dol read-only
                        variant="outlined"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      />
                      <TextField
                        fullWidth
                        label="Last Modified"
                        value={formatDate(editedUser.modifiedAt)}
                        disabled
                        variant="outlined"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      />
                    </Box>
                  )}
                </Box>
              </Box>
            )}
          </DialogContent>
          
          {/* el buttons beta3t el dialog */}
          <DialogActions sx={{ 
            padding: '16px 24px', 
            backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
            borderTop: darkMode ? '1px solid #374151' : '1px solid #e2e8f0'
          }}>
            {isEditing ? (
              <>
                <Button 
                  onClick={handleCancel}
                  startIcon={<Cancel />}
                  sx={{
                    borderRadius: '8px',
                    padding: '8px 16px',
                    color: '#64748b',
                    border: '1px solid #e2e8f0',
                    fontWeight: 500,
                    textTransform: 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  startIcon={<Save />}
                  variant="contained"
                  sx={{
                    borderRadius: '8px',
                    padding: '8px 16px',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    fontWeight: 500,
                    textTransform: 'none',
                    boxShadow: '0 1px 3px rgba(37, 99, 235, 0.3)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: '#1d4ed8',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
                    }
                  }}
                >
                  {isCreating ? 'Create Member' : 'Save Changes'}
                </Button>
              </>
            ) : (
              <Button 
                onClick={handleCloseDialog}
                sx={{
                  borderRadius: '8px',
                  padding: '8px 16px',
                  backgroundColor: '#64748b',
                  color: '#ffffff',
                  fontWeight: 500,
                  textTransform: 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#475569',
                  }
                }}
              >
                Close
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {/* el notifications elly betezhar ta7t - success/error messages */}
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

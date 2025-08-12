import React, { useState, useEffect } from 'react';
import { useCustomTheme } from './contexts/ThemeContext'; 
import Navbar from "./components/Navbar"; 
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Box, Pagination, CircularProgress, Chip,
  Container, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, TextField, Select,
  MenuItem, FormControl, InputLabel, Snackbar, Alert, Menu
} from '@mui/material';
import { styled } from '@mui/material/styles'; 
import { Add, KeyboardArrowDown } from '@mui/icons-material';
import type { User } from './types/User';
import ActionButtons from './components/UserTable/ActionButtons';

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

export default function Home() {
  const { darkMode, toggleDarkMode } = useCustomTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); 
  const [usersPerPage, setUsersPerPage] = useState(5); // customizable page size
  const [isCustomPageSize, setIsCustomPageSize] = useState(false); // track if using custom input
  const [customPageSizeInput, setCustomPageSizeInput] = useState(''); // custom input value
  const [pageSizeMenuAnchor, setPageSizeMenuAnchor] = useState<null | HTMLElement>(null); // for page size menu
  // page size options
  const pageSizeOptions = [5, 10, 15, 20, 'custom'];
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
  
  // handle custom page size input
  const handleCustomPageSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCustomPageSizeInput(value);
    
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0 && numValue <= 1000) {
      setUsersPerPage(numValue);
      setCurrentPage(1); // reset to first page
    }
  };

  // handle page size menu
  const handlePageSizeMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setPageSizeMenuAnchor(event.currentTarget);
  };

  const handlePageSizeMenuClose = () => {
    setPageSizeMenuAnchor(null);
  };

  const handlePageSizeSelect = (size: number | string) => {
    if (size === 'custom') {
      setIsCustomPageSize(true);
      setCustomPageSizeInput(usersPerPage.toString());
    } else {
      setIsCustomPageSize(false);
      setUsersPerPage(Number(size));
      setCurrentPage(1); // reset to first page
    }
    setPageSizeMenuAnchor(null);
  };
  
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
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
              {/* User Stats Section */}
              <Box sx={{ 
                mb: 2, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', sm: 'center' },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                flexShrink: 0
              }}>
                <Box>
                  <Typography variant="h6" sx={{ 
                    color: darkMode ? '#f1f5f9' : '#1e293b', 
                    fontWeight: 600, 
                    mb: 0.5, 
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 25%, #7c3aed 50%, #be185d 75%, #dc2626 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text' 
                  }}>
                    Users
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: darkMode ? '#94a3b8' : '#64748b',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}>
                    Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, users.length)} of {users.length} users
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' }, padding: '12px' }}>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleCreateUser}
                    size="small"
                    sx={{
                      borderRadius: '8px',
                      padding: '6px 16px',
                      margin: '8px',
                      background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 25%, #7c3aed 50%, #be185d 75%, #dc2626 100%)',
                      color: '#ffffff',
                      fontWeight: 500,
                      textTransform: 'none',
                      fontSize: '0.875rem',
                      boxShadow: '0 4px 15px rgba(30, 58, 138, 0.4), 0 2px 8px rgba(30, 58, 138, 0.2)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1e40af 0%, #4338ca 25%, #8b5cf6 50%, #db2777 75%, #ef4444 100%)',
                        transform: 'translateY(-2px)', 
                        boxShadow: '0 8px 25px rgba(30, 58, 138, 0.5), 0 4px 12px rgba(30, 58, 138, 0.3)',
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
                  borderRadius: 3,
                  border: 'none',
                  backgroundColor: 'transparent', 
                  boxShadow: 'none',
                  overflow: 'auto',
                  mb: 2,
                  minHeight: 0,
                  // Custom scrollbar styling for dark mode 
                  '&::-webkit-scrollbar': {
                    width: '8px',
                    height: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: darkMode ? '#374151' : '#f1f5f9',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: darkMode ? '#6b7280' : '#cbd5e1',
                    borderRadius: '4px',
                    '&:hover': {
                      backgroundColor: darkMode ? '#9ca3af' : '#94a3b8',
                    },
                  },
                  '&::-webkit-scrollbar-corner': {
                    backgroundColor: darkMode ? '#374151' : '#f1f5f9',
                  },
                  scrollbarWidth: 'thin',
                  scrollbarColor: darkMode ? '#6b7280 #374151' : '#cbd5e1 #f1f5f9',
                  // Mobile responsiveness
                  '@media (max-width: 768px)': {
                    overflowX: 'auto',
                  },
                  ...(usersPerPage > 5 && {
                    maxHeight: 450,
                    overflowY: 'auto',
                  })
                }}
              >
                <Table sx={{ 
                  minWidth: 650,
                  // Responsive table styling
                  '@media (max-width: 768px)': {
                    minWidth: 300,
                  }
                }} aria-label="users table">
                  {/* el table header */}
                  <TableHead
                    sx={usersPerPage > 5 ? {
                      position: 'sticky',
                      top: 0,
                      zIndex: 1,
                      backgroundColor: darkMode ? '#1e293b' : '#ffffff'
                    } : {}}
                  >
                    <TableRow>
                      <StyledTableCell>Username</StyledTableCell>
                      <StyledTableCell>Email</StyledTableCell>
                      <StyledTableCell sx={{ 
                        display: { xs: 'none', sm: 'table-cell' } 
                      }}>Role</StyledTableCell> 
                      <StyledTableCell sx={{ 
                        display: { xs: 'none', md: 'table-cell' } 
                      }}>Department</StyledTableCell>
                      <StyledTableCell>Status</StyledTableCell>
                      <StyledTableCell sx={{ 
                        display: { xs: 'none', sm: 'table-cell' } 
                      }}>Provider</StyledTableCell>
                      <StyledTableCell>Actions</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  {/* el table body - feeh kol el users */}
                  <TableBody>
                    {currentUsers.map((user) => (
                      <StyledTableRow key={user.id}>
                        <TableCell sx={{ 
                          color: darkMode ? '#94a3b8' : '#64748b', 
                          textAlign: 'center',
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}>
                          {user.username}
                        </TableCell>
                        {/* Email column */}
                        <TableCell sx={{ 
                          color: darkMode ? '#f1f5f9' : '#1e293b', 
                          fontWeight: 500, 
                          textAlign: 'center',
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          maxWidth: { xs: '120px', sm: 'none' },
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {user.email}
                        </TableCell>
                        {/* Role column - feeh chip maloon */}
                        <TableCell sx={{ 
                          textAlign: 'center',
                          display: { xs: 'none', sm: 'table-cell' }
                        }}>
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
                        <TableCell sx={{ 
                          color: darkMode ? '#94a3b8' : '#64748b', 
                          textAlign: 'center',
                          display: { xs: 'none', md: 'table-cell' },
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}>
                          {user.department || 'N/A'}
                        </TableCell>
                        {/* Status column - feeh chip maloon active/inactive */}
                        <TableCell sx={{ textAlign: 'center' }}>
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
                        </TableCell>
                        {/* Provider column */}
                        <TableCell sx={{ 
                          color: darkMode ? '#94a3b8' : '#64748b', 
                          textAlign: 'center',
                          display: { xs: 'none', sm: 'table-cell' },
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}>
                          {user.provider}
                        </TableCell>
                        {/* Actions column - feeh el buttons */}
                        <TableCell sx={{ textAlign: 'center' }}>
                          <ActionButtons
                            user={user}
                            darkMode={darkMode}
                            onViewDetails={handleViewDetails}
                            onDelete={handleDelete}
                          />
                        </TableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* el pagination controls */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mt: 2,
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 0 }
              }}>
                {/* Users per page selector */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  order: { xs: 2, sm: 1 }
                }}>
                  <Typography variant="body2" sx={{ 
                    color: darkMode ? '#94a3b8' : '#64748b',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}>
                    Users per page:
                  </Typography>
                  <Button
                    onClick={handlePageSizeMenuClick}
                    endIcon={<KeyboardArrowDown />}
                    size="small"
                    sx={{
                      borderRadius: '8px',
                      padding: '6px 12px',
                      background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 25%, #7c3aed 50%, #be185d 75%, #dc2626 100%)',
                      color: '#ffffff',
                      fontWeight: 500,
                      textTransform: 'none',
                      fontSize: '0.875rem',
                      boxShadow: '0 2px 8px rgba(30, 58, 138, 0.3)',
                      transition: 'all 0.2s ease',
                      minWidth: '80px',
                      '& .MuiButton-endIcon': {
                        color: darkMode ? '#1e293b' : '#ffffff',
                      },
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1e40af 0%, #4338ca 25%, #8b5cf6 50%, #db2777 75%, #ef4444 100%)',
                        transform: 'translateY(-1px)', 
                        boxShadow: '0 4px 12px rgba(30, 58, 138, 0.4)',
                        '& .MuiButton-endIcon': {
                          color: darkMode ? '#1e293b' : '#ffffff',
                        },
                      },
                      '&:active': {
                        transform: 'translateY(0px)',
                      }
                    }}
                  >
                    {isCustomPageSize ? 'Custom' : usersPerPage}
                  </Button>
                  <Menu
                    anchorEl={pageSizeMenuAnchor}
                    open={Boolean(pageSizeMenuAnchor)}
                    onClose={handlePageSizeMenuClose}
                    PaperProps={{
                      sx: {
                        backgroundColor: darkMode ? '#374151' : '#ffffff',
                        color: darkMode ? '#f1f5f9' : '#1e293b',
                        borderRadius: '8px',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                        '& .MuiMenuItem-root': {
                          '&:hover': {
                            backgroundColor: darkMode ? '#4b5563' : '#f3f4f6',
                          },
                          '&.Mui-selected': {
                            backgroundColor: darkMode ? '#1e40af' : '#dbeafe',
                            '&:hover': {
                              backgroundColor: darkMode ? '#1e3a8a' : '#bfdbfe',
                            },
                          },
                        },
                      },
                    }}
                  >
                    {pageSizeOptions.map((option) => (
                      <MenuItem 
                        key={option} 
                        onClick={() => handlePageSizeSelect(option)}
                        selected={option === usersPerPage || (option === 'custom' && isCustomPageSize)}
                      >
                        {option === 'custom' ? 'Custom' : option}
                      </MenuItem>
                    ))}
                  </Menu>
                  
                  {isCustomPageSize && (
                    <TextField
                      size="small"
                      type="number"
                      value={customPageSizeInput}
                      onChange={handleCustomPageSizeChange}
                      placeholder="Custom size"
                      inputProps={{ min: 1, max: 100 }}
                      sx={{
                        width: 100,
                        ml: 1,
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: darkMode ? '#374151' : '#ffffff',
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
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}
                    />
                  )}
                </Box>

                {/* el pagination nafso */}
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  shape="rounded"
                  size={window.innerWidth > 600 ? 'medium' : 'small'}
                  sx={{
                    order: { xs: 1, sm: 2 },
                    '& .MuiPaginationItem-root': {
                      backgroundColor: darkMode ? '#374151' : '#ffffff',
                      color: darkMode ? '#f1f5f9' : '#374151',
                      border: `1px solid ${darkMode ? '#6b7280' : '#d1d5db'}`,
                      '&:hover': {
                        backgroundColor: darkMode ? '#4b5563' : '#f3f4f6',
                        borderColor: darkMode ? '#9ca3af' : '#9ca3af',
                      },
                      '&.Mui-selected': {
                        backgroundColor: darkMode ? '#1e40af' : '#2563eb',
                        color: '#ffffff',
                        borderColor: darkMode ? '#1e40af' : '#2563eb',
                        '&:hover': {
                          backgroundColor: darkMode ? '#1e3a8a' : '#1d4ed8',
                        },
                      },
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    },
                  }}
                />
              </Box>
            </Box>
          )}
        </Box>

        {/* el dialog el kibeera */}
        <Dialog 
          open={dialogOpen} 
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          sx={{
            '& .MuiDialog-paper': {
              backgroundColor: darkMode ? '#1e293b' : '#ffffff',
              color: darkMode ? '#f1f5f9' : '#1e293b',
              borderRadius: '12px',
              boxShadow: darkMode ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }
          }}
        >
          <DialogTitle sx={{ 
            borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
            color: darkMode ? '#f1f5f9' : '#1e293b',
            fontWeight: 600
          }}>
            {isEditing ? 'Edit User' : (isCreating ? 'Create New User' : 'User Details')}
          </DialogTitle>
          
          <DialogContent sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Username field */}
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={editedUser?.username || ''}
                onChange={(e) => handleInputChange('username', e.target.value)}
                disabled={!isEditing && !isCreating}
                size="small"
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
                    '&.Mui-disabled': {
                      backgroundColor: darkMode ? '#2d3748' : '#f3f4f6',
                      color: darkMode ? '#9ca3af' : '#6b7280',
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

              {/* Email field */}
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={editedUser?.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing && !isCreating}
                size="small"
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
                    '&.Mui-disabled': {
                      backgroundColor: darkMode ? '#2d3748' : '#f3f4f6',
                      color: darkMode ? '#9ca3af' : '#6b7280',
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

              {/* Role field */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Role"
                  name="roleCode"
                  value={editedUser?.roleCode || ''}
                  onChange={(e) => handleInputChange('roleCode', e.target.value)}
                  disabled={!isEditing && !isCreating}
                  size="small"
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
                      '&.Mui-disabled': {
                        backgroundColor: darkMode ? '#2d3748' : '#f3f4f6',
                        color: darkMode ? '#9ca3af' : '#6b7280',
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

                {/* Department field */}
                <TextField
                  fullWidth
                  label="Department"
                  name="department"
                  value={editedUser?.department || ''}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  disabled={!isEditing && !isCreating}
                  size="small"
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
                      '&.Mui-disabled': {
                        backgroundColor: darkMode ? '#2d3748' : '#f3f4f6',
                        color: darkMode ? '#9ca3af' : '#6b7280',
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
              </Box>

              {/* Status and Provider row */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                {/* Status field */}
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ 
                    color: darkMode ? '#9ca3af' : '#6b7280',
                    '&.Mui-focused': {
                      color: darkMode ? '#3b82f6' : '#2563eb',
                    }
                  }}>
                    Status
                  </InputLabel>
                  <Select
                    name="status"
                    value={editedUser?.status || ''}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    disabled={!isEditing && !isCreating}
                    label="Status"
                    sx={{
                      backgroundColor: darkMode ? '#374151' : '#f9fafb',
                      color: darkMode ? '#f1f5f9' : '#1e293b',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: darkMode ? '#6b7280' : '#d1d5db',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: darkMode ? '#9ca3af' : '#9ca3af',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: darkMode ? '#3b82f6' : '#2563eb',
                      },
                      '&.Mui-disabled': {
                        backgroundColor: darkMode ? '#2d3748' : '#f3f4f6',
                        color: darkMode ? '#9ca3af' : '#6b7280',
                      },
                      '& .MuiSelect-icon': {
                        color: darkMode ? '#9ca3af' : '#6b7280',
                      },
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          backgroundColor: darkMode ? '#374151' : '#ffffff',
                          color: darkMode ? '#f1f5f9' : '#1e293b',
                          '& .MuiMenuItem-root': {
                            '&:hover': {
                              backgroundColor: darkMode ? '#4b5563' : '#f3f4f6',
                            },
                            '&.Mui-selected': {
                              backgroundColor: darkMode ? '#1e40af' : '#dbeafe',
                              '&:hover': {
                                backgroundColor: darkMode ? '#1e3a8a' : '#bfdbfe',
                              },
                            },
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>

                {/* Provider field */}
                <TextField
                  fullWidth
                  label="Provider"
                  name="provider"
                  value={editedUser?.provider || ''}
                  onChange={(e) => handleInputChange('provider', e.target.value)}
                  disabled={!isEditing && !isCreating}
                  size="small"
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
                      '&.Mui-disabled': {
                        backgroundColor: darkMode ? '#2d3748' : '#f3f4f6',
                        color: darkMode ? '#9ca3af' : '#6b7280',
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
              </Box>

              {/* Creation date - read only */}
              {editedUser?.createdAt && (
                <TextField
                  fullWidth
                  label="Created At"
                  value={formatDate(editedUser.createdAt)}
                  disabled
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: darkMode ? '#2d3748' : '#f3f4f6',
                      '& fieldset': {
                        borderColor: darkMode ? '#4b5563' : '#e5e7eb',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: darkMode ? '#9ca3af' : '#6b7280',
                    },
                    '& .MuiOutlinedInput-input': {
                      color: darkMode ? '#9ca3af' : '#6b7280',
                    },
                  }}
                />
              )}
            </Box>
          </DialogContent>

          <DialogActions sx={{ 
            borderTop: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
            px: 3,
            py: 2,
            gap: 1
          }}>
            {isEditing || isCreating ? (
              <>
                <Button 
                  onClick={handleCancel} 
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
                  sx={{
                    backgroundColor: darkMode ? '#1e40af' : '#2563eb',
                    '&:hover': {
                      backgroundColor: darkMode ? '#1e3a8a' : '#1d4ed8',
                    }
                  }}
                >
                  {isCreating ? 'Create' : 'Save Changes'}
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={handleCloseDialog} 
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
                  Close
                </Button>
                <Button 
                  onClick={handleEdit} 
                  variant="contained"
                  sx={{
                    backgroundColor: darkMode ? '#1e40af' : '#2563eb',
                    '&:hover': {
                      backgroundColor: darkMode ? '#1e3a8a' : '#1d4ed8',
                    }
                  }}
                >
                  Edit User
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>

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

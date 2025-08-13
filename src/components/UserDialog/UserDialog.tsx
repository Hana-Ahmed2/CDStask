import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Typography, IconButton, TextField, Box,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { Edit, Save, Cancel, Add } from '@mui/icons-material';
import type { User } from '../../types/User';
import type { BusinessUnit } from '../../types/BusinessUnit';
import type { ActiveDirectory } from '../../types/ActiveDirectory';

interface UserDialogProps {
  open: boolean;
  darkMode: boolean;
  editedUser: User | null;
  isEditing: boolean;
  isCreating: boolean;
  businessUnits: BusinessUnit[];
  activeDirectories: ActiveDirectory[];
  formatDate: (dateString: string) => string;
  onClose: () => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onInputChange: (field: keyof User, value: string) => void;
  onAddBusinessUnit: () => void;
  onAddActiveDirectory: () => void;
}

const UserDialog: React.FC<UserDialogProps> = ({
  open,
  darkMode,
  editedUser,
  isEditing,
  isCreating,
  businessUnits,
  activeDirectories,
  formatDate,
  onClose,
  onEdit,
  onSave,
  onCancel,
  onInputChange,
  onAddBusinessUnit,
  onAddActiveDirectory
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="body"
      PaperProps={{
        sx: {
          borderRadius: '16px',
          border: darkMode ? '1px solid #374151' : '1px solid #e2e8f0',
          backgroundColor: darkMode ? '#1e293b' : '#ffffff',
          minHeight: 300,
          width: '100%',
          maxWidth: 800,
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
          paddingTop: '40px !important',
          paddingBottom: '20px !important',
          display: 'flex !important',
          alignItems: 'flex-start !important',
          justifyContent: 'center !important',
          minHeight: '100vh',
          boxSizing: 'border-box',
        }
      }}
    >
      {/* el title beta3 el dialog */}
      <DialogTitle 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
          color: darkMode ? '#f1f5f9' : '#1e293b',
          padding: '15px 24px',
          margin: 0,
        }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {isCreating ? 'Add New Member' : isEditing ? 'Edit Member Details' : 'Member Details'}
        </Typography>
        {/* law mash beta3del w mash beta3mel gded, wareeh edit button */}
        {!isEditing && !isCreating && (
          <IconButton 
            onClick={onEdit} 
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
      <br></br>
      {/* el content beta3 el dialog - kol el form fields */}
      <DialogContent sx={{ p: 2, backgroundColor: darkMode ? '#1e293b' : '#ffffff'}}>
        {editedUser && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Username field */}
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={editedUser?.username || ''}
              onChange={(e) => onInputChange('username', e.target.value)}
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
              onChange={(e) => onInputChange('email', e.target.value)}
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

            {/* Role and Department row */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Role"
                name="roleCode"
                value={editedUser?.roleCode || ''}
                onChange={(e) => onInputChange('roleCode', e.target.value)}
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

              <TextField
                fullWidth
                label="Department"
                name="department"
                value={editedUser?.department || ''}
                onChange={(e) => onInputChange('department', e.target.value)}
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
                  onChange={(e) => onInputChange('status', e.target.value)}
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

              <TextField
                fullWidth
                label="Provider"
                name="provider"
                value={editedUser?.provider || ''}
                onChange={(e) => onInputChange('provider', e.target.value)}
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

            {/* Business Unit and Active Directory row */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              {/* Business Unit field */}
              <Box sx={{ display: 'flex', gap: 1, flex: 1 }}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ 
                    color: darkMode ? '#9ca3af' : '#6b7280',
                    '&.Mui-focused': {
                      color: darkMode ? '#3b82f6' : '#2563eb',
                    }
                  }}>
                    Business Unit
                  </InputLabel>
                  <Select
                    name="businessUnitId"
                    value={editedUser?.businessUnitId || ''}
                    onChange={(e) => onInputChange('businessUnitId', e.target.value)}
                    disabled={!isEditing && !isCreating}
                    label="Business Unit"
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
                    <MenuItem value="">
                      <em>Select Business Unit</em>
                    </MenuItem>
                    {businessUnits.map((bu) => (
                      <MenuItem key={bu.id} value={bu.id}>
                        {bu.name} ({bu.code})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {(isEditing || isCreating) && (
                  <Button
                    onClick={onAddBusinessUnit}
                    size="small"
                    startIcon={<Add />}
                    sx={{
                      borderRadius: '8px',
                      padding: '6px 12px',
                      background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 25%, #7c3aed 50%, #be185d 75%, #dc2626 100%)',
                      color: '#ffffff',
                      fontWeight: 500,
                      textTransform: 'none',
                      fontSize: '0.75rem',
                      minWidth: 'auto',
                      boxShadow: '0 2px 8px rgba(30, 58, 138, 0.3)',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1e40af 0%, #4338ca 25%, #8b5cf6 50%, #db2777 75%, #ef4444 100%)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(30, 58, 138, 0.4)',
                      },
                    }}
                  >
                    Add BU
                  </Button>
                )}
              </Box>

              {/* Active Directory field */}
              <Box sx={{ display: 'flex', gap: 1, flex: 1 }}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ 
                    color: darkMode ? '#9ca3af' : '#6b7280',
                    '&.Mui-focused': {
                      color: darkMode ? '#3b82f6' : '#2563eb',
                    }
                  }}>
                    Active Directory
                  </InputLabel>
                  <Select
                    name="activeDirectoryId"
                    value={editedUser?.activeDirectoryId || ''}
                    onChange={(e) => onInputChange('activeDirectoryId', e.target.value)}
                    disabled={!isEditing && !isCreating}
                    label="Active Directory"
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
                    <MenuItem value="">
                      <em>Select Active Directory</em>
                    </MenuItem>
                    {activeDirectories.map((ad) => (
                      <MenuItem key={ad.id} value={ad.id.toString()}>
                        {ad.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {(isEditing || isCreating) && (
                  <Button
                    onClick={onAddActiveDirectory}
                    size="small"
                    startIcon={<Add />}
                    sx={{
                      borderRadius: '8px',
                      padding: '6px 12px',
                      background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 25%, #7c3aed 50%, #be185d 75%, #dc2626 100%)',
                      color: '#ffffff',
                      fontWeight: 500,
                      textTransform: 'none',
                      fontSize: '0.75rem',
                      minWidth: 'auto',
                      boxShadow: '0 2px 8px rgba(30, 58, 138, 0.3)',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1e40af 0%, #4338ca 25%, #8b5cf6 50%, #db2777 75%, #ef4444 100%)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(30, 58, 138, 0.4)',
                      },
                    }}
                  >
                    Add AD
                  </Button>
                )}
              </Box>
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
              onClick={onCancel}
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
              onClick={onSave}
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
            onClick={onClose}
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
  );
};

export default UserDialog;

import React from 'react';
import { Box, IconButton } from '@mui/material';
import { Visibility, Delete } from '@mui/icons-material';
import { type User } from '../../types/User'; 

interface ActionButtonsProps {
  user: User;
  darkMode: boolean;
  onViewDetails: (user: User) => void;
  onDelete: (userId: string) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  user,
  darkMode,
  onViewDetails,
  onDelete
}) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      gap: { xs: 0.5, sm: 1 }, 
      justifyContent: 'center',
      flexDirection: { xs: 'column', sm: 'row' }
    }}>
      {/* View button */}
      <IconButton 
        onClick={() => onViewDetails(user)}
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
        onClick={() => onDelete(user.id)}
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
  );
};

export default ActionButtons;

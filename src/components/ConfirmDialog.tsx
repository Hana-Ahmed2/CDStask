import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography
} from '@mui/material';
import { Warning } from '@mui/icons-material';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  severity?: 'warning' | 'error' | 'info';
  darkMode?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  severity = 'warning',
  darkMode = false
}) => {
  const getColor = () => {
    switch (severity) {
      case 'error':
        return '#dc2626';
      case 'warning':
        return '#f59e0b';
      case 'info':
        return '#3b82f6';
      default:
        return '#f59e0b';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: darkMode
            ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          border: darkMode
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: darkMode
            ? '0 20px 50px rgba(0, 0, 0, 0.4)'
            : '0 20px 50px rgba(0, 0, 0, 0.15)',
        }
      }}
    >
      <DialogTitle
        id="confirm-dialog-title"
        sx={{
          pb: 1,
          pt: 3,
          px: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: `${getColor()}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: getColor()
          }}
        >
          <Warning sx={{ fontSize: 24 }} />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: darkMode ? '#f1f5f9' : '#1e293b'
          }}
        >
          {title}
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ px: 3, py: 2 }}>
        <DialogContentText
          id="confirm-dialog-description"
          sx={{
            color: darkMode ? '#94a3b8' : '#64748b',
            fontSize: '1rem',
            lineHeight: 1.6
          }}
        >
          {message}
        </DialogContentText>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          sx={{
            borderColor: darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.23)',
            color: darkMode ? '#f1f5f9' : '#374151',
            '&:hover': {
              borderColor: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)',
              backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            backgroundColor: getColor(),
            color: 'white',
            '&:hover': {
              backgroundColor: getColor(),
              opacity: 0.9
            },
            '&:active': {
              transform: 'scale(0.98)'
            }
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;

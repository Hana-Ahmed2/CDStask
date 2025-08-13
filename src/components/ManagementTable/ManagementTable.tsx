import React, { useState } from 'react';
import {
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Paper, 
  Typography, 
  Box, 
  Pagination, 
  Button, 
  TextField, 
  MenuItem, 
  Menu
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Add, KeyboardArrowDown } from '@mui/icons-material';

// Styled components for table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.mode === 'dark' ? '#1e293b' : '#1e3a8a', 
  color: '#ffffff',
  textAlign: 'center',
  fontSize: '0.875rem',
  borderBottom: theme.palette.mode === 'dark' ? '2px solid #475569' : '2px solid #1e40af',
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
    transition: 'background-color 0.3s ease',
  },
}));

export interface ColumnDefinition<T> {
  key: keyof T | 'actions';
  label: string;
  render?: (item: T) => React.ReactNode;
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
}

interface ManagementTableProps<T> {
  data: T[];
  columns: ColumnDefinition<T>[];
  title: string;
  addButtonText: string;
  loading?: boolean;
  darkMode?: boolean;
  onAdd?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  getItemId: (item: T) => string | number;
  renderActionButtons?: (item: T) => React.ReactNode;
  emptyStateMessage?: string;
  emptyStateSubMessage?: string;
}

export default function ManagementTable<T>({
  data,
  columns,
  title,
  addButtonText,
  loading = false,
  darkMode = false,
  onAdd,
  getItemId,
  renderActionButtons,
  emptyStateMessage = "No items found",
  emptyStateSubMessage = "Start by adding your first item"
}: ManagementTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isCustomPageSize, setIsCustomPageSize] = useState(false);
  const [customPageSizeInput, setCustomPageSizeInput] = useState('');
  const [pageSizeMenuAnchor, setPageSizeMenuAnchor] = useState<null | HTMLElement>(null);

  const pageSizeOptions = [5, 10, 15, 20, 'custom'];

  // Pagination calculations
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const handleCustomPageSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCustomPageSizeInput(value);
    
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0 && numValue <= 1000) {
      setItemsPerPage(numValue);
      setCurrentPage(1);
    }
  };

  const handlePageSizeMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setPageSizeMenuAnchor(event.currentTarget);
  };

  const handlePageSizeMenuClose = () => {
    setPageSizeMenuAnchor(null);
  };

  const handlePageSizeSelect = (size: number | string) => {
    if (size === 'custom') {
      setIsCustomPageSize(true);
      setCustomPageSizeInput(itemsPerPage.toString());
    } else {
      setIsCustomPageSize(false);
      setItemsPerPage(Number(size));
      setCurrentPage(1);
    }
    setPageSizeMenuAnchor(null);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" flex={1}>
        <Typography variant="h6" sx={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography variant="h6" sx={{ color: darkMode ? '#94a3b8' : '#64748b', mb: 2 }}>
          {emptyStateMessage}
        </Typography>
        <Typography variant="body2" sx={{ color: darkMode ? '#64748b' : '#94a3b8', mb: 3 }}>
          {emptyStateSubMessage}
        </Typography>
        {onAdd && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onAdd}
            sx={{
              alignSelf: 'center',
              borderRadius: '8px',
              padding: '10px 20px',
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
            }}
          >
            {addButtonText}
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header Section */}
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
            {title}
          </Typography>
          <Typography variant="body2" sx={{ 
            color: darkMode ? '#94a3b8' : '#64748b',
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }}>
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, data.length)} of {data.length} items
          </Typography>
        </Box>
        
        {onAdd && (
          <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' }, padding: '12px' }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={onAdd}
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
              {addButtonText}
            </Button>
          </Box>
        )}
      </Box>

      {/* Table Container */}
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
          '@media (max-width: 768px)': {
            overflowX: 'auto',
          },
          ...(itemsPerPage > 5 && {
            maxHeight: 450,
            overflowY: 'auto',
          })
        }}
      >
        <Table sx={{ 
          minWidth: 650,
          '@media (max-width: 768px)': {
            minWidth: 300,
          }
        }} aria-label="management table">
          {/* Table Header */}
          <TableHead
            sx={itemsPerPage > 5 ? {
              position: 'sticky',
              top: 0,
              zIndex: 1,
              backgroundColor: darkMode ? '#1e293b' : '#ffffff',
              '& .MuiTableCell-root': {
                borderBottom: darkMode ? '2px solid #475569' : '2px solid #1e40af',
              }
            } : {
              '& .MuiTableCell-root': {
                borderBottom: darkMode ? '2px solid #475569' : '2px solid #1e40af',
              }
            }}
          >
            <TableRow>
              {columns.map((column) => (
                <StyledTableCell 
                  key={String(column.key)}
                  sx={{ 
                    display: {
                      xs: column.hideOnMobile ? 'none' : 'table-cell',
                      sm: column.hideOnTablet ? 'none' : 'table-cell',
                      md: 'table-cell'
                    }
                  }}
                >
                  {column.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          
          {/* Table Body */}
          <TableBody>
            {currentItems.map((item) => (
              <StyledTableRow key={getItemId(item)}>
                {columns.map((column) => (
                  <TableCell 
                    key={String(column.key)}
                    sx={{ 
                      color: darkMode ? '#94a3b8' : '#64748b', 
                      textAlign: 'center',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      display: {
                        xs: column.hideOnMobile ? 'none' : 'table-cell',
                        sm: column.hideOnTablet ? 'none' : 'table-cell',
                        md: 'table-cell'
                      }
                    }}
                  >
                    {column.render ? column.render(item) : (
                      column.key === 'actions' ? renderActionButtons?.(item) : String(item[column.key as keyof T] || 'N/A')
                    )}
                  </TableCell>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mt: 2,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 }
      }}>
        {/* Items per page selector */}
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
            Items per page:
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
                color: '#ffffff',
              },
              '&:hover': {
                background: 'linear-gradient(135deg, #1e40af 0%, #4338ca 25%, #8b5cf6 50%, #db2777 75%, #ef4444 100%)',
                transform: 'translateY(-1px)', 
                boxShadow: '0 4px 12px rgba(30, 58, 138, 0.4)',
              },
              '&:active': {
                transform: 'translateY(0px)',
              }
            }}
          >
            {isCustomPageSize ? 'Custom' : itemsPerPage}
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
                selected={option === itemsPerPage || (option === 'custom' && isCustomPageSize)}
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

        {/* Pagination */}
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
  );
}

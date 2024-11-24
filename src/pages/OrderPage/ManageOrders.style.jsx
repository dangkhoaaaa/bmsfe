// ManageOrders.style.jsx
import { styled } from '@mui/material/styles';
import { Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Toolbar, Typography } from '@mui/material';

export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}));

export const StyledTable = styled(Table)(({ theme }) => ({
  minWidth: 650,
  borderCollapse: 'collapse',
}));

export const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  '& th': {
    color: theme.palette.common.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '& td': {
    borderBottom: `1px solid ${theme.palette.divider}`,
    textAlign: 'center',
  },
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '0.9rem',
  padding: theme.spacing(1.5),
}));

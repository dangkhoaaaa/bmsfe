import styled from 'styled-components';
import { Table, TableRow, TableCell, Button, TableContainer as MuiTableContainer, Box } from '@mui/material';

export const TableContainer = styled(MuiTableContainer)`
  margin: 20px 0;
  overflow-x: auto;
`;

export const CustomTable = styled(Table)`
  width: 100%;
`;

export const CustomTableRow = styled(TableRow)`
  &:nth-of-type(odd) {
    background-color: #f9f9f9;
  }
`;

export const ActionButton = styled(Button)`
  margin: 0 0px;
  display: inline-flex;
  align-items: center;
`;

export const StyledBox = styled(Box)`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 20px 0;
`;

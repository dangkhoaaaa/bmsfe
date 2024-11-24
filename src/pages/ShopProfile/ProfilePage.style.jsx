import { styled } from '@mui/material/styles';
import { Box, Avatar, ListItem, Typography, List } from '@mui/material';

// Styles for the main container
export const ProfileContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(6),
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #b4ec51, #429321, #0f9b0f)',
}));

// Styles for the profile card
export const ProfileCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(5),
  backgroundColor: '#fff',
  borderRadius: '20px',
  boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)', 
  maxWidth: '700px',
  width: '100%',
  margin: '0 auto',
  textAlign: 'center', 
}));

// Styles for the Avatar
export const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  marginBottom: theme.spacing(3),
  backgroundColor: '#3498db',
  fontSize: '40px', 
}));

// Styled Typography for Name
export const NameTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  fontWeight: 'bold',
  fontSize: '1.5rem',
}));

// Styled Typography for Role
export const RoleTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: '#7f8c8d',
  fontSize: '1rem',
}));

// Styles for the List Items
export const StyledList = styled(List)(({ theme }) => ({
  width: '100%',
  backgroundColor: '#f9f9f9',
  borderRadius: '10px',
  padding: theme.spacing(2),
  boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.05)', 
}));

// Style for ListItem
export const StyledListItem = styled(ListItem)(({ theme }) => ({
  justifyContent: 'space-between',
  padding: theme.spacing(1, 0),
  borderBottom: '1px solid #ecf0f1',
  '&:last-child': {
    borderBottom: 'none',
  },
}));

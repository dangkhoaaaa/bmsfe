import { Grid } from "@mui/material";
import styled from "styled-components";

export const StyledSelect = styled(Grid)`
  display: flex;
  flex-direction: column;
  margin: 20px auto;
  width: 100%;

  .select-dropdown {
    padding: 15px;
    font-size: 16px;
    border-radius: 30px; /* Bo góc lớn hơn để phù hợp với phong cách */
    border: 1px solid #ccc;
    background-color: #f9f9f9;
    outline: none;
    width: 100%;
    height: 55px;
    transition: border-color 0.3s;
    font-family: 'Roboto', sans-serif; /* Đồng bộ font chữ */
  }

  .select-dropdown:focus {
    border-color: #007BFF;
  }
`;

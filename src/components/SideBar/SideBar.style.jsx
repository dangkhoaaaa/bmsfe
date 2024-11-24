import styled from "styled-components";

export const StyledSidebar = styled.div`
   height: 100vh;
  width: ${(props) => (props.open ? "240px" : "60px")};
  position: fixed;
  top: 0;
  left: 0;
  background: linear-gradient(180deg, #3d996c, #00cc69);
  transition: width 0.3s ease;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  color: white;
  padding-top: 20px;
  
  .logo {
    text-align: center;
    padding: 20px;
    cursor: pointer;
  }

  .links {
    margin: 15px 10px;

    .spann {
      text-transform: uppercase;
      color: gray;
      margin: 10px 0px 5px;
      font-size: 14px;
    }

    li {
      display: flex;
      align-items: center;
      margin-left: 10px;
      padding: 10px;
      font-weight: 500;
      transition: background-color 0.2s ease;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background-color: #4665fdde;
        color: white;

        .icon {
          color: white;
        }
      }

      .icon {
        margin-right: 10px;
        font-size: 18px;
      }
    }
  }
`;

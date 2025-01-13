import { useContext, useEffect, useState } from "react";
import AuthContext from "./auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ element, requiredRole }) => {
  const { user, setUser } = useContext(AuthContext)
  const navigate = useNavigate();

  const [comp, setComp] = useState(null)
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token);
    if (token) {
      const decoded = jwtDecode(token);
      if (!user) {
        setUser(decoded);

        if (decoded.role.includes('Admin')) {
          navigate('/admin');
        } else if (decoded.role.includes('Staff')) {
          //navigate('/home-staff');
        } else if (decoded.role.includes('Shop')) {
          // navigate('/shop');
        } else {
          setError('Unauthorized role');

          return
        }
      }
      setComp(element);
    } else {
      navigate('/login');
    }
  });

  return comp
};

export default ProtectedRoute;

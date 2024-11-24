import { jwtDecode } from 'jwt-decode';
import { createContext, useEffect, useState } from 'react';

const authValue = {
    user: null,
    setUser: null,
}

const AuthContext = createContext(authValue);
export default AuthContext;
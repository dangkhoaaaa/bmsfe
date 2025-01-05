import React, { createContext, useContext, useState } from 'react';
import { ApiGetWalletByUser } from '../services/WalletServices';

// Tạo context
const WalletContext = createContext();

// Custom hook để sử dụng context này
export const useWallet = () => {
  return useContext(WalletContext);
};

// WalletProvider để bọc component và cung cấp context
export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(0);
  const token = localStorage.getItem('token');

  // Function fetchWallet (giả sử fetch dữ liệu ví từ API)
  const fetchWallet = async () => {
    const result = await ApiGetWalletByUser(token);
    if (result.ok) {
      setWallet(result.body.data);
    } else {
      alert(result.message);
    }
  };

  return (
    <WalletContext.Provider value={{ wallet, fetchWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

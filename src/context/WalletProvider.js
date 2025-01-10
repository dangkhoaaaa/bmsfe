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
  const shopId = localStorage.getItem('shopId');

  // Function fetchWallet (giả sử fetch dữ liệu ví từ API)
  const fetchWallet = async (userToken = null) => {
    if (!userToken) {
      if (!shopId || !token) {
        return;
      }
    }
    const result = await ApiGetWalletByUser(userToken && userToken || token);
    if (result.ok) {
      setWallet(result.body.data);
    } else {
      setWallet(0);
      // alert(result.message);
    }
  };

  return (
    <WalletContext.Provider value={{ wallet, fetchWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

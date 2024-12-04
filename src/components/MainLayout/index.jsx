import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../SideBar/index'; // Assuming you have a Sidebar component
import Header from '../Header';

function MainLayout({children}) {
  const location = useLocation();
  
  // Hide sidebar on specific routes like /login
  const hideSidebar = location.pathname === '/login';

  return (
    <div style={{ display: 'flex' }}>
      {!hideSidebar && <Sidebar />}
      <div className='w-100'>
        <Header />
        <div style={{ paddingInline: "20px" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;

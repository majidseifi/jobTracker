import React from 'react';
import { Outlet } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import './AppLayout.css';

function AppLayout() {
  return (
    <div className="jt-layout">
      <AppSidebar />
      <main className="jt-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;

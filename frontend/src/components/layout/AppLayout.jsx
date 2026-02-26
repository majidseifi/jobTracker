import React from 'react';
import { Outlet } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import { ToastProvider } from '../../context/ToastContext';
import KeyboardShortcutsHelp from '../common/KeyboardShortcutsHelp';
import './AppLayout.css';

function AppLayout() {
  return (
    <ToastProvider>
      <div className="jt-layout">
        <AppSidebar />
        <main className="jt-main">
          <Outlet />
        </main>
      </div>
      <KeyboardShortcutsHelp />
    </ToastProvider>
  );
}

export default AppLayout;

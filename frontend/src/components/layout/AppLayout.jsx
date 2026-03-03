import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import { ToastProvider } from '../../context/ToastContext';
import KeyboardShortcutsHelp from '../common/KeyboardShortcutsHelp';
import './AppLayout.css';

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="jt-layout">
        <div className="jt-topbar">
          <button
            className="jt-hamburger"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label="Toggle navigation"
          >
            <span />
            <span />
            <span />
          </button>
          <span className="jt-topbar-brand">Job<span>Tracker</span></span>
        </div>
        <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {sidebarOpen && (
          <div className="jt-sidebar-overlay" onClick={() => setSidebarOpen(false)} />
        )}
        <main className="jt-main">
          <Outlet />
        </main>
      </div>
      <KeyboardShortcutsHelp />
    </ToastProvider>
  );
}

export default AppLayout;

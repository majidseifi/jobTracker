import React from 'react';
import { NavLink } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilBriefcase, cilChartLine, cilSettings } from '@coreui/icons';
import './AppSidebar.css';

const navItems = [
  { name: 'Applications', icon: cilBriefcase, to: '/' },
  { name: 'Analytics', icon: cilChartLine, to: '/analytics' },
  { name: 'Settings', icon: cilSettings, to: '/settings' },
];

function AppSidebar() {
  return (
    <aside className="jt-sidebar">
      <div className="jt-sidebar-brand">
        <span className="brand-full">JobTracker</span>
        <span className="brand-narrow">JT</span>
      </div>
      <nav className="jt-sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `jt-nav-link ${isActive ? 'active' : ''}`
            }
          >
            <CIcon icon={item.icon} size="lg" className="jt-nav-icon" />
            <span className="jt-nav-label">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default AppSidebar;

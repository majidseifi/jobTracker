import React, { useState } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CButton,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/react';
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts';

const SHORTCUTS = [
  { key: '?', description: 'Show keyboard shortcuts' },
  { key: 'n', description: 'Add new application' },
  { key: 'r', description: 'Refresh data' },
  { key: '/', description: 'Focus search input' },
  { key: 'j / \u2193', description: 'Select next row' },
  { key: 'k / \u2191', description: 'Select previous row' },
  { key: 'Enter', description: 'Open selected application' },
  { key: 'Escape', description: 'Close panel / clear focus' },
];

export { SHORTCUTS };

export default function KeyboardShortcutsHelp() {
  const [visible, setVisible] = useState(false);

  useKeyboardShortcuts({
    '?': () => setVisible((v) => !v),
  });

  return (
    <>
      <CButton
        color="dark"
        className="jt-shortcuts-trigger"
        onClick={() => setVisible(true)}
        title="Keyboard shortcuts (?)"
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem',
          fontWeight: 700,
          backgroundColor: 'var(--jt-bg-tertiary)',
          border: '1px solid var(--jt-border-light)',
          color: 'var(--jt-text-secondary)',
          zIndex: 1000,
        }}
      >
        ?
      </CButton>

      <CModal visible={visible} onClose={() => setVisible(false)} alignment="center">
        <CModalHeader>
          <CModalTitle>Keyboard Shortcuts</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CTable small borderless>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell style={{ color: 'var(--jt-text-muted)', width: '120px' }}>Key</CTableHeaderCell>
                <CTableHeaderCell style={{ color: 'var(--jt-text-muted)' }}>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {SHORTCUTS.map((s) => (
                <CTableRow key={s.key}>
                  <CTableDataCell>
                    <kbd style={{
                      backgroundColor: 'var(--jt-bg-tertiary)',
                      border: '1px solid var(--jt-border-light)',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      fontSize: '0.8rem',
                      color: 'var(--jt-accent)',
                    }}>
                      {s.key}
                    </kbd>
                  </CTableDataCell>
                  <CTableDataCell style={{ color: 'var(--jt-text-secondary)' }}>
                    {s.description}
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CModalBody>
      </CModal>
    </>
  );
}

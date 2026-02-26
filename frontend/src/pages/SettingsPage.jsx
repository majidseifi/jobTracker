import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CRow,
  CCol,
  CFormCheck,
  CFormSelect,
  CFormLabel,
  CFormInput,
  CButton,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/react';
import useSettings from '../hooks/useSettings';
import { useToast } from '../context/ToastContext';
import { getConfig, updateSpreadsheetId } from '../utils/api';
import { STATUS_OPTIONS } from '../utils/constants';
import { SHORTCUTS } from '../components/common/KeyboardShortcutsHelp';

function SettingsPage() {
  const { settings, updateSetting } = useSettings();
  const { addToast } = useToast();
  const [sheetId, setSheetId] = useState('');
  const [savedSheetId, setSavedSheetId] = useState('');
  const [sheetSaving, setSheetSaving] = useState(false);

  useEffect(() => {
    getConfig()
      .then((res) => {
        setSheetId(res.data.spreadsheetId || '');
        setSavedSheetId(res.data.spreadsheetId || '');
      })
      .catch(() => {
        addToast('Failed to load config', 'danger');
      });
  }, [addToast]);

  const handleSaveSheetId = async () => {
    if (!sheetId.trim()) {
      addToast('Spreadsheet ID cannot be empty', 'warning');
      return;
    }
    try {
      setSheetSaving(true);
      const res = await updateSpreadsheetId(sheetId.trim());
      setSavedSheetId(sheetId.trim());
      if (res.data.refreshed) {
        addToast('Spreadsheet ID updated — data refreshed', 'success');
      } else {
        addToast(res.data.message, 'warning');
      }
    } catch (err) {
      addToast('Failed to update Spreadsheet ID', 'danger');
    } finally {
      setSheetSaving(false);
    }
  };

  const sheetIdChanged = sheetId.trim() !== savedSheetId;

  return (
    <div style={{ maxWidth: 800 }}>
      <h1 style={{ marginBottom: '1.5rem', fontWeight: 700, fontSize: '1.75rem' }}>
        Settings
      </h1>

      <CRow className="g-3">
        {/* Google Sheets Connection */}
        <CCol xs={12}>
          <CCard>
            <CCardHeader style={{ fontWeight: 600 }}>
              Google Sheets Connection
            </CCardHeader>
            <CCardBody>
              <p style={{ color: 'var(--jt-text-secondary)', marginBottom: '1rem', fontSize: '0.85rem' }}>
                The n8n workflow populates new applications from job boards into your Google Sheet.
                Paste your Sheet ID below to connect.
              </p>
              <div>
                <CFormLabel style={{ color: 'var(--jt-text-secondary)', fontSize: '0.85rem' }}>
                  Google Sheet ID
                </CFormLabel>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <CFormInput
                    value={sheetId}
                    onChange={(e) => setSheetId(e.target.value)}
                    placeholder="Paste your Google Sheet ID here"
                    style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                  />
                  <CButton
                    color="warning"
                    size="sm"
                    onClick={handleSaveSheetId}
                    disabled={sheetSaving || !sheetIdChanged}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {sheetSaving ? 'Saving...' : 'Save'}
                  </CButton>
                </div>
                <small style={{ color: 'var(--jt-text-muted)', marginTop: '0.25rem', display: 'block' }}>
                  Found in the URL: docs.google.com/spreadsheets/d/<strong>sheet-id</strong>/edit
                </small>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Auto-Refresh */}
        <CCol xs={12}>
          <CCard>
            <CCardHeader style={{ fontWeight: 600 }}>
              Auto-Refresh
            </CCardHeader>
            <CCardBody>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <CFormCheck
                  label="Enable auto-refresh"
                  checked={settings.autoRefresh}
                  onChange={(e) => updateSetting('autoRefresh', e.target.checked)}
                />
                <div>
                  <CFormLabel style={{ color: 'var(--jt-text-secondary)', fontSize: '0.85rem' }}>
                    Refresh interval
                  </CFormLabel>
                  <CFormSelect
                    value={settings.refreshInterval}
                    onChange={(e) => updateSetting('refreshInterval', Number(e.target.value))}
                    disabled={!settings.autoRefresh}
                    style={{ maxWidth: 200 }}
                  >
                    <option value={60000}>1 minute</option>
                    <option value={120000}>2 minutes</option>
                    <option value={300000}>5 minutes</option>
                  </CFormSelect>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Table Preferences */}
        <CCol xs={12}>
          <CCard>
            <CCardHeader style={{ fontWeight: 600 }}>
              Table Preferences
            </CCardHeader>
            <CCardBody>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <CFormLabel style={{ color: 'var(--jt-text-secondary)', fontSize: '0.85rem' }}>
                    Items per page
                  </CFormLabel>
                  <CFormSelect
                    value={settings.pageSize}
                    onChange={(e) => updateSetting('pageSize', Number(e.target.value))}
                    style={{ maxWidth: 200 }}
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </CFormSelect>
                </div>
                <div>
                  <CFormLabel style={{ color: 'var(--jt-text-secondary)', fontSize: '0.85rem' }}>
                    Default status filter
                  </CFormLabel>
                  <CFormSelect
                    value={settings.defaultStatusFilter}
                    onChange={(e) => updateSetting('defaultStatusFilter', e.target.value)}
                    style={{ maxWidth: 200 }}
                  >
                    <option value="">All Statuses</option>
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </CFormSelect>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Keyboard Shortcuts */}
        <CCol xs={12}>
          <CCard>
            <CCardHeader style={{ fontWeight: 600 }}>
              Keyboard Shortcuts
            </CCardHeader>
            <CCardBody>
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
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
}

export default SettingsPage;

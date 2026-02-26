import React from 'react';
import { CCard, CCardHeader, CCardBody, CRow, CCol } from '@coreui/react';

function SettingsPage() {
  return (
    <div style={{ maxWidth: 800 }}>
      <h1 style={{ marginBottom: '1.5rem', fontWeight: 700, fontSize: '1.75rem' }}>
        Settings
      </h1>

      <CRow className="g-3">
        <CCol xs={12}>
          <CCard>
            <CCardHeader style={{ fontWeight: 600 }}>
              Google Sheets Connection
            </CCardHeader>
            <CCardBody>
              <p style={{ color: 'var(--jt-text-secondary)', marginBottom: '0.5rem' }}>
                Your application data is synced with Google Sheets via the backend API.
              </p>
              <p style={{ color: 'var(--jt-text-muted)', fontSize: '0.85rem' }}>
                The n8n workflow automatically populates new applications from job boards
                into your Google Sheet, which this app reads from.
              </p>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12}>
          <CCard>
            <CCardHeader style={{ fontWeight: 600 }}>
              Preferences
            </CCardHeader>
            <CCardBody>
              <p style={{ color: 'var(--jt-text-muted)', fontSize: '0.85rem' }}>
                Additional settings (theme toggle, export options, notification preferences)
                will be available in a future update.
              </p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
}

export default SettingsPage;

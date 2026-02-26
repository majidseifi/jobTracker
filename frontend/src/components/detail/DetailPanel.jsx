import React from 'react';
import { COffcanvas, COffcanvasHeader, COffcanvasTitle, COffcanvasBody, CCloseButton } from '@coreui/react';
import DetailView from './DetailView';
import AddForm from './AddForm';
import './DetailPanel.css';

function DetailPanel({ visible, mode, application, onClose, onSaved, onStatusChange }) {
  return (
    <COffcanvas
      placement="end"
      visible={visible}
      onHide={onClose}
      className="jt-detail-panel"
      backdrop={true}
    >
      <COffcanvasHeader>
        <COffcanvasTitle>
          {mode === 'add' ? 'New Application' : application?.companyName || 'Details'}
        </COffcanvasTitle>
        <CCloseButton className="text-reset" onClick={onClose} />
      </COffcanvasHeader>
      <COffcanvasBody>
        {mode === 'view' && application && (
          <DetailView
            application={application}
            onStatusChange={onStatusChange}
            onSaved={onSaved}
          />
        )}
        {mode === 'add' && (
          <AddForm onSaved={onSaved} onCancel={onClose} />
        )}
      </COffcanvasBody>
    </COffcanvas>
  );
}

export default DetailPanel;

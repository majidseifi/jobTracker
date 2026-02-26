import React, { useState } from 'react';
import {
  CListGroup,
  CListGroupItem,
  CButton,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CBadge,
} from '@coreui/react';
import { addInterview } from '../../utils/api';
import { INTERVIEW_TYPES } from '../../utils/constants';

function InterviewSection({ applicationId, interviews, onSaved }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ date: '', type: '', notes: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!formData.date) return;
    try {
      setSaving(true);
      await addInterview(applicationId, formData);
      setFormData({ date: '', type: '', notes: '' });
      setShowForm(false);
      onSaved();
    } catch (err) {
      console.error('Failed to add interview:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {interviews.length > 0 ? (
        <CListGroup className="mb-2">
          {interviews.map((interview, idx) => (
            <CListGroupItem key={idx} className="d-flex justify-content-between align-items-start">
              <div>
                <div style={{ fontWeight: 500, fontSize: '0.85rem' }}>
                  {interview.date}
                  {interview.type && (
                    <CBadge color="info" className="ms-2" size="sm">
                      {interview.type}
                    </CBadge>
                  )}
                </div>
                {interview.notes && (
                  <small style={{ color: 'var(--jt-text-muted)' }}>{interview.notes}</small>
                )}
              </div>
            </CListGroupItem>
          ))}
        </CListGroup>
      ) : (
        <p style={{ color: 'var(--jt-text-muted)', fontSize: '0.85rem' }}>No interviews yet.</p>
      )}

      {showForm ? (
        <div style={{ marginTop: '0.75rem' }}>
          <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <CFormInput
              type="date"
              size="sm"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              placeholder="Date"
            />
            <CFormSelect
              size="sm"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="">Interview Type...</option>
              {INTERVIEW_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </CFormSelect>
            <CFormTextarea
              size="sm"
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Notes..."
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <CButton color="warning" size="sm" onClick={handleSubmit} disabled={saving}>
              {saving ? 'Adding...' : 'Add'}
            </CButton>
            <CButton color="secondary" variant="outline" size="sm" onClick={() => setShowForm(false)}>
              Cancel
            </CButton>
          </div>
        </div>
      ) : (
        <CButton
          color="outline-warning"
          size="sm"
          onClick={() => setShowForm(true)}
        >
          + Add Interview
        </CButton>
      )}
    </div>
  );
}

export default InterviewSection;

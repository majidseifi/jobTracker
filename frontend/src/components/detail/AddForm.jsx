import React, { useState } from 'react';
import {
  CForm,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CFormCheck,
  CFormLabel,
  CButton,
} from '@coreui/react';
import { createApplication } from '../../utils/api';
import { STATUS_OPTIONS } from '../../utils/constants';

const PLATFORMS = [
  'Indeed', 'LinkedIn', 'ZipRecruiter', 'Google', 'Upwork',
  'Freelancer.com', 'SimplyHired', 'WellFound', 'Company',
];

function AddForm({ onSaved, onCancel }) {
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    companyName: '',
    title: '',
    platform: '',
    link: '',
    postingUrl: '',
    date: '',
    salary: '',
    city: '',
    status: 'Applied',
    appliedDate: today,
    remote: false,
    easyApply: false,
    rating: '',
    resumeVersion: '',
    jobDescription: '',
    coverLetter: '',
    reachOutMessage: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyName.trim() || !formData.title.trim()) {
      setError('Company name and title are required.');
      return;
    }
    try {
      setSaving(true);
      setError('');
      const payload = {
        ...formData,
        rating: formData.rating ? Number(formData.rating) : 0,
      };
      await createApplication(payload);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to create application');
    } finally {
      setSaving(false);
    }
  };

  return (
    <CForm className="add-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <CFormLabel>Company Name *</CFormLabel>
        <CFormInput
          value={formData.companyName}
          onChange={(e) => handleChange('companyName', e.target.value)}
        />
      </div>

      <div className="form-group">
        <CFormLabel>Job Title *</CFormLabel>
        <CFormInput
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <CFormLabel>Status</CFormLabel>
          <CFormSelect
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </CFormSelect>
        </div>
        <div className="form-group">
          <CFormLabel>Applied Date</CFormLabel>
          <CFormInput
            type="date"
            value={formData.appliedDate}
            onChange={(e) => handleChange('appliedDate', e.target.value)}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <CFormLabel>Platform</CFormLabel>
          <CFormSelect
            value={formData.platform}
            onChange={(e) => handleChange('platform', e.target.value)}
          >
            <option value="">Select...</option>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </CFormSelect>
        </div>
        <div className="form-group">
          <CFormLabel>City</CFormLabel>
          <CFormInput
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <CFormLabel>Salary</CFormLabel>
          <CFormInput
            value={formData.salary}
            onChange={(e) => handleChange('salary', e.target.value)}
            placeholder="e.g. 80000-120000 CAD"
          />
        </div>
        <div className="form-group">
          <CFormLabel>Rating (0-10)</CFormLabel>
          <CFormInput
            type="number"
            min="0"
            max="10"
            value={formData.rating}
            onChange={(e) => handleChange('rating', e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <CFormLabel>Job Link</CFormLabel>
        <CFormInput
          value={formData.link}
          onChange={(e) => handleChange('link', e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className="form-group">
        <CFormLabel>Posting URL</CFormLabel>
        <CFormInput
          value={formData.postingUrl}
          onChange={(e) => handleChange('postingUrl', e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <CFormLabel>Resume Version</CFormLabel>
          <CFormSelect
            value={formData.resumeVersion}
            onChange={(e) => handleChange('resumeVersion', e.target.value)}
          >
            <option value="">Select...</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </CFormSelect>
        </div>
        <div className="form-group">
          <CFormLabel>Date Posted</CFormLabel>
          <CFormInput
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
          />
        </div>
      </div>

      <div className="form-row" style={{ marginBottom: '1rem' }}>
        <CFormCheck
          label="Remote"
          checked={formData.remote}
          onChange={(e) => handleChange('remote', e.target.checked)}
        />
        <CFormCheck
          label="Easy Apply"
          checked={formData.easyApply}
          onChange={(e) => handleChange('easyApply', e.target.checked)}
        />
      </div>

      <div className="form-group">
        <CFormLabel>Job Description</CFormLabel>
        <CFormTextarea
          rows={4}
          value={formData.jobDescription}
          onChange={(e) => handleChange('jobDescription', e.target.value)}
        />
      </div>

      <div className="form-group">
        <CFormLabel>Cover Letter</CFormLabel>
        <CFormTextarea
          rows={4}
          value={formData.coverLetter}
          onChange={(e) => handleChange('coverLetter', e.target.value)}
        />
      </div>

      <div className="form-group">
        <CFormLabel>Reach Out Message</CFormLabel>
        <CFormTextarea
          rows={3}
          value={formData.reachOutMessage}
          onChange={(e) => handleChange('reachOutMessage', e.target.value)}
        />
      </div>

      <div className="form-group">
        <CFormLabel>Notes</CFormLabel>
        <CFormTextarea
          rows={3}
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
        />
      </div>

      {error && (
        <div style={{ color: 'var(--jt-danger)', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      <div className="form-actions">
        <CButton color="warning" type="submit" disabled={saving}>
          {saving ? 'Creating...' : 'Create Application'}
        </CButton>
        <CButton color="secondary" variant="outline" onClick={onCancel}>
          Cancel
        </CButton>
      </div>
    </CForm>
  );
}

export default AddForm;

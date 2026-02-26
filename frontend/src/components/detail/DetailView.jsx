import React, { useState, useEffect, useRef } from 'react';
import {
  CFormSelect,
  CButton,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilExternalLink } from '@coreui/icons';
import InterviewSection from './InterviewSection';
import { patchFields } from '../../utils/api';
import { STATUS_OPTIONS } from '../../utils/constants';
import { useToast } from '../../context/ToastContext';

function DetailView({ application, onStatusChange, onSaved }) {
  const { addToast } = useToast();
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState(application.notes || '');
  const [saving, setSaving] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [showAppliedModal, setShowAppliedModal] = useState(false);
  const [applyingSaving, setApplyingSaving] = useState(false);
  const waitingForFocus = useRef(false);

  useEffect(() => {
    const onFocus = () => {
      if (waitingForFocus.current) {
        waitingForFocus.current = false;
        setShowAppliedModal(true);
      }
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const handleOpenPosting = (url) => {
    waitingForFocus.current = true;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleConfirmApplied = async () => {
    try {
      setApplyingSaving(true);
      const today = new Date().toISOString().split('T')[0];
      await patchFields(application.id, { status: 'Applied', appliedDate: today });
      setShowAppliedModal(false);
      onSaved();
    } catch (err) {
      addToast('Failed to mark as applied', 'danger');
    } finally {
      setApplyingSaving(false);
    }
  };

  const handleCopy = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      addToast('Failed to copy to clipboard', 'danger');
    }
  };

  const handleSaveNotes = async () => {
    try {
      setSaving(true);
      await patchFields(application.id, { notes });
      setEditingNotes(false);
      onSaved();
    } catch (err) {
      addToast('Failed to save notes', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const statusOpt = STATUS_OPTIONS.find((s) => s.value === application.status);

  return (
    <div className="detail-view">
      {/* Header */}
      <div className="detail-header">
        <h2>{application.companyName}</h2>
        <p className="detail-title">{application.title}</p>
        {statusOpt && (
          <CBadge color={statusOpt.cssColor} className="mt-1">
            {statusOpt.label}
          </CBadge>
        )}
      </div>

      {/* Actions */}
      <div className="detail-actions">
        <CFormSelect
          size="sm"
          value={application.status}
          onChange={(e) => onStatusChange(application.id, e.target.value)}
          style={{ width: '160px' }}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </CFormSelect>
        {application.link && (
          <CButton
            color="outline-warning"
            size="sm"
            href={application.link}
            target="_blank"
            rel="noopener noreferrer"
            as="a"
          >
            <CIcon icon={cilExternalLink} size="sm" className="me-1" />
            Job Link
          </CButton>
        )}
        {application.postingUrl && (
          <CButton
            color="outline-warning"
            size="sm"
            onClick={() => handleOpenPosting(application.postingUrl)}
          >
            <CIcon icon={cilExternalLink} size="sm" className="me-1" />
            Posting
          </CButton>
        )}
      </div>

      {/* Key Info */}
      <div className="detail-section">
        <h4>Key Information</h4>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Platform</span>
            <span className="info-value">{application.platform || '-'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">City</span>
            <span className="info-value">{application.city || '-'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Salary</span>
            <span className="info-value">{application.salary || '-'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Rating</span>
            <span className="info-value">{application.rating > 0 ? `${application.rating}/10` : '-'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Resume Version</span>
            <span className="info-value">{application.resumeVersion || '-'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Remote</span>
            <span className="info-value">{application.remote ? 'Yes' : 'No'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Easy Apply</span>
            <span className="info-value">{application.easyApply ? 'Yes' : 'No'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Applied Date</span>
            <span className="info-value">{application.appliedDate || '-'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Date Posted</span>
            <span className="info-value">{application.date || '-'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Expired</span>
            <span className="info-value">{application.expired ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>

      {/* Job Description */}
      {application.jobDescription && (
        <div className="detail-section">
          <h4>Job Description</h4>
          <div
            className="detail-text-card copyable"
            onClick={() => handleCopy(application.jobDescription, 'jobDescription')}
          >
            {copiedField === 'jobDescription' && <span className="copied-toast">Copied!</span>}
            {application.jobDescription}
          </div>
        </div>
      )}

      {/* Cover Letter */}
      {application.coverLetter && (
        <div className="detail-section">
          <h4>Cover Letter</h4>
          <div
            className="detail-text-card copyable"
            onClick={() => handleCopy(application.coverLetter, 'coverLetter')}
          >
            {copiedField === 'coverLetter' && <span className="copied-toast">Copied!</span>}
            {application.coverLetter}
          </div>
        </div>
      )}

      {/* Reach Out Message */}
      {application.reachOutMessage && (
        <div className="detail-section">
          <h4>Reach Out Message</h4>
          <div
            className="detail-text-card copyable"
            onClick={() => handleCopy(application.reachOutMessage, 'reachOutMessage')}
          >
            {copiedField === 'reachOutMessage' && <span className="copied-toast">Copied!</span>}
            {application.reachOutMessage}
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="detail-section">
        <h4>
          Notes
          <CButton
            color="link"
            size="sm"
            className="ms-2"
            onClick={() => setEditingNotes(!editingNotes)}
            style={{ color: 'var(--jt-accent)', fontSize: '0.75rem' }}
          >
            {editingNotes ? 'Cancel' : 'Edit'}
          </CButton>
        </h4>
        {editingNotes ? (
          <div>
            <textarea
              className="notes-edit-area"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <CButton
              color="warning"
              size="sm"
              className="mt-2"
              onClick={handleSaveNotes}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Notes'}
            </CButton>
          </div>
        ) : (
          <div className="detail-text-card">
            {application.notes || 'No notes yet.'}
          </div>
        )}
      </div>

      {/* Interviews */}
      <div className="detail-section">
        <h4>Interviews</h4>
        <InterviewSection
          applicationId={application.id}
          interviews={application.interviews || []}
          onSaved={onSaved}
        />
      </div>

      {/* Applied confirmation modal */}
      <CModal visible={showAppliedModal} onClose={() => setShowAppliedModal(false)} alignment="center">
        <CModalHeader>
          <CModalTitle>Did you apply?</CModalTitle>
        </CModalHeader>
        <CModalBody style={{ color: 'var(--jt-text-secondary)' }}>
          Mark <strong>{application.companyName}</strong> — {application.title} as Applied?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="outline" size="sm" onClick={() => setShowAppliedModal(false)}>
            Not yet
          </CButton>
          <CButton color="warning" size="sm" onClick={handleConfirmApplied} disabled={applyingSaving}>
            {applyingSaving ? 'Saving...' : 'Yes, I applied'}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
}

export default DetailView;

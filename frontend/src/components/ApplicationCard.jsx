import React from 'react';
import { getDaysAgo } from '../utils/formatters';
import { STATUS_OPTIONS } from '../utils/constants';

function ApplicationCard({ application, onEdit, onDelete }) {
  const statusConfig = STATUS_OPTIONS.find(s => s.value === application.status);

  return (
    <div className="application-card">
      <div className="card-header">
        <h3>{application.companyName}</h3>
        <span
          className="status-badge"
          style={{ backgroundColor: statusConfig?.color }}
        >
          {statusConfig?.label}
        </span>
      </div>

      <div className="card-body">
        <p className="title">{application.title}</p>
        {(application.city || application.remote) && (
          <p className="city">
            {application.city}
            {application.city && application.remote && ' '}
            {application.remote && '(Remote)'}
          </p>
        )}
        {application.platform && <p className="platform">via {application.platform}</p>}
        <p className="date">Applied {getDaysAgo(application.appliedDate)}</p>
        {application.salary && <p className="salary">{application.salary}</p>}
        {application.rating > 0 && <p className="rating">Match: {application.rating}/10</p>}

        {application.interviews && application.interviews.length > 0 && (
          <p className="interviews">
            {application.interviews.length} interview(s)
          </p>
        )}

        {application.notes && (
          <p className="notes">
            {application.notes.length > 100
              ? `${application.notes.substring(0, 100)}...`
              : application.notes
            }
          </p>
        )}
      </div>

      <div className="card-actions">
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete} className="delete-btn">Delete</button>
        {application.link && (
          <a href={application.link} target="_blank" rel="noopener noreferrer">
            View Job
          </a>
        )}
      </div>
    </div>
  );
}

export default ApplicationCard;

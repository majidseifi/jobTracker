import React, { useState, useEffect } from 'react';
import { createApplication, updateApplication } from '../utils/api';
import { STATUS_OPTIONS } from '../utils/constants';

function ApplicationForm({ application, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    companyName: '',
    title: '',
    platform: '',
    link: '',
    date: '',
    rating: 0,
    resumeVersion: '',
    jobDescription: '',
    coverLetter: '',
    salary: '',
    city: '',
    expired: false,
    remote: false,
    status: 'Applied',
    appliedDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (application) {
      setFormData({ ...application });
    }
  }, [application]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (application) {
        // Update existing
        await updateApplication(application.id, formData);
      } else {
        // Create new
        await createApplication(formData);
      }
      onSave(); // Call parent callback
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to save application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="application-form">
      <div className='form-section'>
        <h3>Required Information</h3>
        {/* Company Name */}
        <label>
          Company Name *
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
          />
        </label>

        {/* Job Title */}
        <label>
          Job Title *
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>

        {/* Job Status */}
        <label>
          Job Status *
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            {STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>

        {/* Application Date */}
        <label>
          Application Date *
          <input
            type="date"
            name="appliedDate"
            value={formData.appliedDate}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <div className='form-section'>
        <h3>Job Details</h3>
        {/* Platform */}
        <label>
          Platform
          <select name='platform' value={formData.platform} onChange={handleChange}>
            <option value=''>Select Platform</option>
            <option value='LinkedIn'>LinkedIn</option>
            <option value='Indeed'>Indeed</option>
            <option value='ZipRecruiter'>ZipRecruiter</option>
            <option value='Google'>Google</option>
            <option value='Upwork'>Upwork</option>
            <option value='Freelancer.com'>Freelancer.com</option>
            <option value='SimplyHired'>SimplyHired</option>
            <option value='WellFound'>WellFound</option>
            <option value='Company'>Company</option>
          </select>
        </label>
        {/* Job Link */}
        <label>
          Job Link
          <input
            type="url"
            name="link"
            value={formData.link}
            onChange={handleChange}
          />
        </label>
        {/* Location */}
        <label>
          City
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </label>
        {/* Remote */}
        <label>
          <input
            type="checkbox"
            name="remote"
            checked={formData.remote}
            onChange={handleChange}
          />
          Remote
        </label>

        {/* Job Posting Date */}
        <label>
          Job Posting Date
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </label>

        {/* Rating */}
        <label>
          Rating (0-10)
          <input
            type="number"
            name="rating"
            min="0"
            max="10"
            value={formData.rating}
            onChange={handleChange}
          />
        </label>

        {/* Expired */}
        <label>
          <input
            type="checkbox"
            name="expired"
            checked={formData.expired}
            onChange={handleChange}
          />
          Job Expired
        </label>
      </div>

      <div className="form-section">
        <h3>Additional Information</h3>

        {/* Resume Version */}
        <label>
          Resume Version
          <select name="resumeVersion" value={formData.resumeVersion} onChange={handleChange}>
            <option value="">Select version...</option>
            <option value="1">Version 1</option>
            <option value="2">Version 2</option>
            <option value="3">Version 3</option>
            <option value="4">Version 4</option>
          </select>
        </label>

        {/* Salary */}
        <label>
          Salary Range
          <input
            type="text"
            name="salary"
            placeholder="e.g., 100000-120000 CAD"
            value={formData.salary}
            onChange={handleChange}
          />
        </label>

        {/* Job Description */}
        <label>
          Job Description
          <textarea
            name="jobDescription"
            rows="5"
            value={formData.jobDescription}
            onChange={handleChange}
          />
        </label>

        {/* Cover Letter */}
        <label>
          Cover Letter
          <textarea
            name="coverLetter"
            rows="5"
            value={formData.coverLetter}
            onChange={handleChange}
          />
        </label>

        {/* Notes */}
        <label>
          Notes
          <textarea
            name="notes"
            rows="3"
            placeholder="Any additional notes..."
            value={formData.notes}
            onChange={handleChange}
          />
        </label>
      </div>

      {error && (
        <div className="error-message" style={{color: 'red', padding: '1rem', marginTop: '1rem'}}>
          {error}
        </div>
      )}

      <div className="form-actions">
        <button type="submit" className="button" disabled={loading}>
          {loading ? 'Saving...' : (application ? 'Update Application' : 'Create Application')}
        </button>
        <button type="button" className="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default ApplicationForm;
import React, { useState } from 'react';
import ApplicationList from '../components/ApplicationList';
import ApplicationForm from '../components/ApplicationForm';

function ApplicationsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (app) => {
    setEditingApp(app);
    setShowForm(true);
  };

  const handleSave = () => {
    setShowForm(false);
    setEditingApp(null);
    setRefreshKey(prev => prev + 1); // Trigger list refresh
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingApp(null);
  };

  return (
    <div className="applications-page">
      <div className="page-header">
        <h1>My Applications</h1>
        <button onClick={() => setShowForm(true)}>
          + Add Application
        </button>
      </div>

      {showForm ? (
        <ApplicationForm
          application={editingApp}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <ApplicationList key={refreshKey} onEdit={handleEdit} />
      )}
    </div>
  );
}

export default ApplicationsPage;

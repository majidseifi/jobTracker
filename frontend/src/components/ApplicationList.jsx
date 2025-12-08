import React, { useState, useEffect, useCallback } from 'react';
import { getAllApplications, deleteApplication } from '../utils/api';
import ApplicationCard from './ApplicationCard';
import FilterBar from './FilterBar';

function ApplicationList({ onEdit }) {
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [filters, setFilters] = useState({ search: '', status: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch applications on mount
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
        setLoading(true);
        const response = await getAllApplications();
        setApplications(response.data);
        setError(null);
    } catch (err) {
        setError('Failed to load applications');
    } finally {
        setLoading(false);
    }
  };

  // Wrap applyFilters in useCallback to memoize it
  const applyFilters = useCallback(() => {
    let filtered = [...applications];

    // Filter by status if selected
    if (filters.status) {
      filtered = filtered.filter(app => app.status === filters.status);
    }

    // Filter by search text (companyName or title)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(app =>
        app.companyName.toLowerCase().includes(searchLower) ||
        app.title.toLowerCase().includes(searchLower)
      );
    }

    setFilteredApps(filtered);
  }, [applications, filters]);

  // Filter applications when filters change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return;

    try {
      await deleteApplication(id);
      fetchApplications(); // Refresh list
    } catch (err) {
      alert('Failed to delete application');
    }
  };

  if (loading) return <div>Loading applications...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="application-list">
      <FilterBar filters={filters} onFilterChange={setFilters} />

      {filteredApps.length === 0 ? (
        <div className="empty-state">
          <p>No applications found. Add your first one!</p>
        </div>
      ) : (
        <div className="applications-grid">
          {filteredApps.map(app => (
            <ApplicationCard
              key={app.id}
              application={app}
              onEdit={() => onEdit(app)}
              onDelete={() => handleDelete(app.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default ApplicationList;

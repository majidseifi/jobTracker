import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  CButton,
  CFormInput,
  CFormSelect,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CPagination,
  CPaginationItem,
} from '@coreui/react';
import ApplicationTable from '../components/applications/ApplicationTable';
import DetailPanel from '../components/detail/DetailPanel';
import CIcon from '@coreui/icons-react';
import { cilReload } from '@coreui/icons';
import {
  getAllApplications,
  updateStatus,
  bulkUpdateStatus,
  bulkDelete,
  refreshCache,
} from '../utils/api';
import { STATUS_OPTIONS } from '../utils/constants';
import './ApplicationsPage.css';

const PAGE_SIZE = 25;

function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('To-Do');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [selectedIds, setSelectedIds] = useState([]);
  const [panelMode, setPanelMode] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllApplications();
      setApplications(response.data);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await refreshCache();
      const response = await getAllApplications();
      setApplications(response.data);
    } catch (err) {
      console.error('Failed to refresh:', err);
    } finally {
      setRefreshing(false);
    }
  };

  // Reset to page 1 when filters/sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortConfig]);

  const filteredAndSorted = useMemo(() => {
    let result = [...applications];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (app) =>
          (app.companyName || '').toLowerCase().includes(term) ||
          (app.title || '').toLowerCase().includes(term) ||
          (app.city || '').toLowerCase().includes(term) ||
          (app.platform || '').toLowerCase().includes(term)
      );
    }

    if (statusFilter) {
      result = result.filter((app) => app.status === statusFilter);
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        let aVal = a[sortConfig.key] ?? '';
        let bVal = b[sortConfig.key] ?? '';
        if (sortConfig.key === 'rating') {
          aVal = Number(aVal) || 0;
          bVal = Number(bVal) || 0;
        } else {
          aVal = String(aVal).toLowerCase();
          bVal = String(bVal).toLowerCase();
        }
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [applications, searchTerm, statusFilter, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedApps = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredAndSorted.slice(start, start + PAGE_SIZE);
  }, [filteredAndSorted, safePage]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked) => {
    setSelectedIds(checked ? paginatedApps.map((a) => a.id) : []);
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateStatus(id, status);
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status } : app))
      );
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp((prev) => ({ ...prev, status }));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleRowClick = (app) => {
    setSelectedApp(app);
    setPanelMode('view');
  };

  const handleAddNew = () => {
    setSelectedApp(null);
    setPanelMode('add');
  };

  const handlePanelClose = () => {
    setPanelMode(null);
    setSelectedApp(null);
  };

  const handleSaved = () => {
    handlePanelClose();
    fetchApplications();
  };

  const handleBulkStatus = async (status) => {
    if (selectedIds.length === 0) return;
    try {
      await bulkUpdateStatus(selectedIds, status);
      setSelectedIds([]);
      fetchApplications();
    } catch (err) {
      console.error('Bulk status update failed:', err);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedIds.length} application(s)?`)) return;
    try {
      await bulkDelete(selectedIds);
      setSelectedIds([]);
      fetchApplications();
    } catch (err) {
      console.error('Bulk delete failed:', err);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, safePage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return (
      <div className="pagination-wrapper">
        <CPagination size="sm">
          <CPaginationItem
            disabled={safePage === 1}
            onClick={() => setCurrentPage(1)}
          >
            &laquo;
          </CPaginationItem>
          <CPaginationItem
            disabled={safePage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            &lsaquo;
          </CPaginationItem>
          {start > 1 && (
            <CPaginationItem disabled>...</CPaginationItem>
          )}
          {pages.map((p) => (
            <CPaginationItem
              key={p}
              active={p === safePage}
              onClick={() => setCurrentPage(p)}
            >
              {p}
            </CPaginationItem>
          ))}
          {end < totalPages && (
            <CPaginationItem disabled>...</CPaginationItem>
          )}
          <CPaginationItem
            disabled={safePage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            &rsaquo;
          </CPaginationItem>
          <CPaginationItem
            disabled={safePage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
          >
            &raquo;
          </CPaginationItem>
        </CPagination>
        <span className="pagination-info">
          {(safePage - 1) * PAGE_SIZE + 1}
          &ndash;
          {Math.min(safePage * PAGE_SIZE, filteredAndSorted.length)}
          {' '}of {filteredAndSorted.length}
        </span>
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading applications...</div>;
  }

  return (
    <div className="applications-page">
      <div className="page-header">
        <h1>Applications</h1>
        <div className="page-header-actions">
          <CButton
            color="outline-secondary"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refresh from Google Sheets"
            className="refresh-btn"
          >
            <CIcon icon={cilReload} size="sm" className={refreshing ? 'spin' : ''} />
          </CButton>
          <CButton color="warning" onClick={handleAddNew}>
            + Add New
          </CButton>
        </div>
      </div>

      <div className="filter-bar">
        <CFormInput
          type="text"
          placeholder="Search company, title, city, platform..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="filter-search"
        />
        <CFormSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-status"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </CFormSelect>
        {selectedIds.length > 0 && (
          <CDropdown>
            <CDropdownToggle color="outline-warning" size="sm">
              Bulk ({selectedIds.length})
            </CDropdownToggle>
            <CDropdownMenu>
              {STATUS_OPTIONS.map((s) => (
                <CDropdownItem
                  key={s.value}
                  onClick={() => handleBulkStatus(s.value)}
                >
                  Set {s.label}
                </CDropdownItem>
              ))}
              <CDropdownItem
                className="text-danger"
                onClick={handleBulkDelete}
              >
                Delete Selected
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        )}
        <span className="filter-count">
          {filteredAndSorted.length} of {applications.length}
        </span>
      </div>

      {filteredAndSorted.length === 0 ? (
        <div className="empty-state">
          {statusFilter === 'To-Do' ? (
            <>
              <div className="all-done-icon">&#10003;</div>
              <p className="all-done-title">That's it!</p>
              <p className="all-done-sub">No jobs to apply for right now. Check back later.</p>
            </>
          ) : (
            <p>No applications found.</p>
          )}
        </div>
      ) : (
        <>
          <ApplicationTable
            applications={paginatedApps}
            selectedIds={selectedIds}
            onSelect={handleSelect}
            onSelectAll={handleSelectAll}
            onRowClick={handleRowClick}
            onStatusChange={handleStatusChange}
            sortConfig={sortConfig}
            onSort={handleSort}
          />
          {renderPagination()}
        </>
      )}

      <DetailPanel
        visible={panelMode !== null}
        mode={panelMode}
        application={selectedApp}
        onClose={handlePanelClose}
        onSaved={handleSaved}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}

export default ApplicationsPage;

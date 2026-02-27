import React from 'react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormCheck,
  CFormSelect,
  CBadge,
  CButton,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilExternalLink, cilArrowTop, cilArrowBottom } from '@coreui/icons';
import { STATUS_OPTIONS } from '../../utils/constants';
import { formatTimeAgo } from '../../utils/formatters';
import './ApplicationTable.css';

const columns = [
  { key: 'companyName', label: 'Company', sortable: true },
  { key: 'title', label: 'Title', sortable: true },
  { key: 'rating', label: 'Rating', sortable: true },
  { key: 'remote', label: 'Remote', sortable: false },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'appliedDate', label: 'Applied', sortable: true },
  { key: 'createdAt', label: 'Created', sortable: true },
  { key: 'actions', label: '', sortable: false },
];

function ApplicationTable({
  applications,
  selectedIds,
  onSelect,
  onSelectAll,
  onRowClick,
  onStatusChange,
  onOpenPosting,
  sortConfig,
  onSort,
  highlightedIndex = -1,
}) {
  const allSelected =
    applications.length > 0 && selectedIds.length === applications.length;

  const getRatingColor = (rating) => {
    if (rating >= 8) return 'success';
    if (rating >= 5) return 'info';
    if (rating > 0) return 'danger';
    return 'secondary';
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return (
      <CIcon
        icon={sortConfig.direction === 'asc' ? cilArrowTop : cilArrowBottom}
        size="sm"
        className="ms-1"
      />
    );
  };

  return (
    <div className="jt-table-wrapper">
      <CTable hover small className="jt-table">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell className="jt-checkbox-col">
              <CFormCheck
                checked={allSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
              />
            </CTableHeaderCell>
            {columns.map((col) => (
              <CTableHeaderCell
                key={col.key}
                className={col.sortable ? 'sortable' : ''}
                onClick={() => col.sortable && onSort(col.key)}
              >
                {col.label}
                {col.sortable && renderSortIcon(col.key)}
              </CTableHeaderCell>
            ))}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {applications.map((app, index) => {
            const isSelected = selectedIds.includes(app.id);
            const isHighlighted = index === highlightedIndex;

            return (
              <CTableRow
                key={app.id}
                className={`jt-table-row ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''}`}
                onClick={() => onRowClick(app)}
              >
                <CTableDataCell
                  className="jt-checkbox-col"
                  onClick={(e) => e.stopPropagation()}
                >
                  <CFormCheck
                    checked={isSelected}
                    onChange={() => onSelect(app.id)}
                  />
                </CTableDataCell>
                <CTableDataCell className="jt-company-cell">
                  <span className="company-name">{app.companyName}</span>
                  {app.easyApply && (
                    <CBadge color="info" size="sm" className="ms-2 easy-apply-badge">
                      Easy
                    </CBadge>
                  )}
                </CTableDataCell>
                <CTableDataCell className="jt-title-cell">
                  {app.title}
                </CTableDataCell>
                <CTableDataCell>
                  {app.rating > 0 ? (
                    <CBadge color={getRatingColor(app.rating)} shape="rounded-pill">
                      {app.rating}/10
                    </CBadge>
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </CTableDataCell>
                <CTableDataCell>
                  {app.remote && (
                    <CBadge color="success" shape="rounded-pill" size="sm">
                      Remote
                    </CBadge>
                  )}
                </CTableDataCell>
                <CTableDataCell onClick={(e) => e.stopPropagation()}>
                  <CFormSelect
                    size="sm"
                    value={app.status}
                    onChange={(e) => onStatusChange(app.id, e.target.value)}
                    className="jt-status-select"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </CFormSelect>
                </CTableDataCell>
                <CTableDataCell className="jt-date-cell">
                  {app.appliedDate || '-'}
                </CTableDataCell>
                <CTableDataCell className="jt-date-cell" title={app.createdAt}>
                  {formatTimeAgo(app.createdAt)}
                </CTableDataCell>
                <CTableDataCell onClick={(e) => e.stopPropagation()}>
                  {(app.link || app.postingUrl) && (
                    <CButton
                      color="link"
                      size="sm"
                      className="jt-link-btn"
                      onClick={() => onOpenPosting(app)}
                    >
                      <CIcon icon={cilExternalLink} size="sm" />
                    </CButton>
                  )}
                </CTableDataCell>
              </CTableRow>
            );
          })}
        </CTableBody>
      </CTable>
    </div>
  );
}

export default ApplicationTable;

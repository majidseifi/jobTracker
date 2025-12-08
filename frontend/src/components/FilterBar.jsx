import React from 'react';
import { STATUS_OPTIONS } from '../utils/constants';

function FilterBar({ filters, onFilterChange }) {
  return (
    <div className="filter-bar">
      {/* Search input for company/position */}
      <input
        type="text"
        placeholder="Search company or job title..."
        className='search-input'
        value={filters.search || ''}
        onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
      />

      {/* Status filter dropdown */}
      <select
        value={filters.status || ''}
        onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
      >
        <option value="">All Statuses</option>
        {STATUS_OPTIONS.map(status => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>
      {/* Clear filters button - only show when filters are active */}
      {(filters.search || filters.status) && (
        <button
          className='clear-filters-button'
          onClick={() => onFilterChange({ search: '', status: '' })}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

export default FilterBar;
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanCard from './KanbanCard';

function KanbanColumn({ status, applications, statusConfig }) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div className="kanban-column">
      <div
        className="column-header"
        style={{ borderTopColor: statusConfig.color }}
      >
        <h3>{statusConfig.label}</h3>
        <span className="count">{applications.length}</span>
      </div>

      <div ref={setNodeRef} className="column-content">
        <SortableContext
          items={applications.map(app => app.id)}
          strategy={verticalListSortingStrategy}
        >
          {applications.map(app => (
            <KanbanCard key={app.id} application={app} />
          ))}
        </SortableContext>

        {applications.length === 0 && (
          <div className="empty-column">
            <p>No applications</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default KanbanColumn;

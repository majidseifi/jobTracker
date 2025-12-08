import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getDaysAgo } from '../utils/formatters';

function KanbanCard({ application }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: application.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="kanban-card"
    >
      <h4>{application.companyName}</h4>
      <p className="job-title">{application.title}</p>
      {application.platform && (
        <p className="platform">{application.platform}</p>
      )}
      <p className="date">{getDaysAgo(application.appliedDate)}</p>
      {application.rating > 0 && (
        <div className="rating">Match: {application.rating}/10</div>
      )}
    </div>
  );
}

export default KanbanCard;

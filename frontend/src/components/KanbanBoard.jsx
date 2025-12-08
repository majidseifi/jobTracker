import React, { useState, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import { STATUS_OPTIONS } from '../utils/constants';
import { updateApplication } from '../utils/api';

function KanbanBoard({ applications, onUpdate }) {
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const applicationsByStatus = useMemo(() => {
    const grouped = {};
    STATUS_OPTIONS.forEach(status => {
      grouped[status.value] = [];
    });

    applications.forEach(app => {
      if (grouped[app.status]) {
        grouped[app.status].push(app);
      }
    });

    return grouped;
  }, [applications]);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeApp = applications.find(app => app.id === active.id);
    const newStatus = over.id;

    if (activeApp && activeApp.status !== newStatus) {
      try {
        await updateApplication(activeApp.id, { ...activeApp, status: newStatus });
        onUpdate();
      } catch (error) {
        console.error('Failed to update application status:', error);
        alert('Failed to update application status');
      }
    }
  };

  const activeApplication = activeId
    ? applications.find(app => app.id === activeId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="kanban-board">
        {STATUS_OPTIONS.map(statusConfig => (
          <KanbanColumn
            key={statusConfig.value}
            status={statusConfig.value}
            statusConfig={statusConfig}
            applications={applicationsByStatus[statusConfig.value]}
          />
        ))}
      </div>

      <DragOverlay>
        {activeApplication ? (
          <KanbanCard application={activeApplication} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default KanbanBoard;

import { useState, useEffect } from 'react';
import { getAllApplications } from '../utils/api';
import KanbanBoard from '../components/KanbanBoard';

function KanbanPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="page"><div>Loading...</div></div>;
  if (error) return <div className="page"><div>Error: {error}</div></div>;

  return (
    <div className="kanban-page">
      <div className="page-header">
        <h1>Kanban Board</h1>
        <p className="subtitle">Drag and drop to update application status</p>
      </div>

      <KanbanBoard applications={applications} onUpdate={fetchApplications} />
    </div>
  );
}

export default KanbanPage;

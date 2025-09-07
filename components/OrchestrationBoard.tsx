import React from 'react';
import { Task, TaskStatus, Agent } from '../types';
import { TASK_STATUSES } from '../constants';
import KanbanColumn from './KanbanColumn';

interface OrchestrationBoardProps {
  tasks: Task[];
  activeAgents: Record<string, Agent>;
  blockedTaskIds: string[];
  onSelectTask: (task: Task) => void;
}

const OrchestrationBoard: React.FC<OrchestrationBoardProps> = ({ tasks, activeAgents, blockedTaskIds, onSelectTask }) => {
  return (
    <div className="flex flex-col h-full bg-secondary/30 text-foreground p-4">
      <h2 className="text-xl font-bold mb-4 px-2">Orchestration Board</h2>
      <div className="flex-grow flex space-x-4 overflow-x-auto">
        {TASK_STATUSES.map(status => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasks.filter(task => task.status === status)}
            activeAgents={activeAgents}
            blockedTaskIds={blockedTaskIds}
            onSelectTask={onSelectTask}
          />
        ))}
      </div>
    </div>
  );
};

export default OrchestrationBoard;
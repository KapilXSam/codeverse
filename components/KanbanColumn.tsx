import React from 'react';
import { Task, TaskStatus, Agent } from '../types';
import TaskCard from './TaskCard';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  activeAgents: Record<string, Agent>;
  blockedTaskIds: string[];
  onSelectTask: (task: Task) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, tasks, activeAgents, blockedTaskIds, onSelectTask }) => {
  return (
    <div className="flex-shrink-0 w-80 bg-background rounded-lg p-2">
      <h3 className="font-bold text-xs mb-4 px-2 text-muted-foreground tracking-widest uppercase flex items-center justify-between">
        <span>{status}</span>
        <span className="font-mono text-xs bg-secondary py-0.5 px-2 rounded-full text-foreground">{tasks.length}</span>
      </h3>
      <div className="space-y-3 h-full overflow-y-auto pr-1">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            isActive={!!activeAgents[task.id]}
            isBlocked={blockedTaskIds.includes(task.id)}
            onSelectTask={onSelectTask}
          />
        ))}
        {tasks.length === 0 && (
            <div className="text-center text-muted-foreground pt-4 text-sm">No tasks in this column</div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
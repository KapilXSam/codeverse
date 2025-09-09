import React from 'react';
import { Task } from '../types';
import { LinkIcon, LockIcon } from './icons/Icons';

interface TaskCardProps {
  task: Task;
  isActive: boolean;
  isBlocked: boolean;
  onSelectTask: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, isActive, isBlocked, onSelectTask }) => {
  const hasDependencies = task.dependencies && task.dependencies.length > 0;
  
  const cardClasses = `
    p-4 rounded-lg shadow-md cursor-pointer transition-all border
    flex flex-col min-h-[100px]
    ${isBlocked 
      ? 'bg-card/30 text-muted-foreground/50 border-transparent cursor-not-allowed opacity-70' 
      : 'bg-card hover:border-primary/50 border-border'}
    ${isActive ? 'ring-2 ring-primary bg-primary/5 border-primary/50' : ''}
  `;

  return (
    <div className={cardClasses} onClick={() => !isBlocked && onSelectTask(task)}>
      <div className="flex-grow">
        <h4 className="font-bold text-md mb-1 text-card-foreground">{task.title}</h4>
        <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
      </div>
      
      <div className="flex items-center justify-between mt-3 text-xs pt-2 border-t border-border/50">
        <div>
            {task.agent && (
                <div className="font-semibold text-xs inline-flex items-center bg-secondary text-secondary-foreground py-0.5 px-2 rounded-full">
                  {task.agent}
                </div>
            )}
        </div>
        <div className="flex items-center space-x-3 text-muted-foreground">
            {hasDependencies && <LinkIcon className="h-4 w-4"><title>{`${task.dependencies?.length} dependencies`}</title></LinkIcon>}
            {isBlocked && <LockIcon className="h-4 w-4 text-yellow-500"><title>Blocked by dependencies</title></LockIcon>}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
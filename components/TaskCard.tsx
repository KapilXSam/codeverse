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
    ${isBlocked 
      ? 'bg-card/50 text-muted-foreground/60 cursor-not-allowed border-transparent opacity-70' 
      : 'bg-card hover:border-primary/50 border-border'}
    ${isActive ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
  `;

  return (
    <div className={cardClasses} onClick={() => onSelectTask(task)}>
      <h4 className="font-bold text-md mb-1 text-card-foreground">{task.title}</h4>
      <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
      
      <div className="flex items-center justify-between mt-3 text-xs">
        <div>
            {task.agent && (
                <div className="font-semibold inline-flex items-center bg-secondary text-secondary-foreground py-0.5 px-2.5 rounded-full">
                  {task.agent}
                </div>
            )}
        </div>
        <div className="flex items-center space-x-3 text-muted-foreground">
            {/* FIX: The `title` prop is not valid for SVG elements in React's TypeScript types. Replaced with a <title> child element for accessibility and to fix the type error. */}
            {hasDependencies && <LinkIcon className="h-4 w-4"><title>{`${task.dependencies?.length} dependencies`}</title></LinkIcon>}
            {/* FIX: The `title` prop is not valid for SVG elements in React's TypeScript types. Replaced with a <title> child element for accessibility and to fix the type error. */}
            {isBlocked && <LockIcon className="h-4 w-4 text-yellow-500"><title>Blocked by dependencies</title></LockIcon>}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
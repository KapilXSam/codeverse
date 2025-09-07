import React from 'react';
import { Task, TaskStatus, Agent } from '../types';
import { TASK_STATUSES } from '../constants';

interface TaskDetailsModalProps {
  task: Task;
  onClose: () => void;
  onUpdateTask: (updates: Partial<Task>) => void;
}

const AGENTS: Agent[] = ['Manager', 'Synthesizer', 'Guardian'];

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ task, onClose, onUpdateTask }) => {
  if (!task) return null;
  
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdateTask({ status: e.target.value as TaskStatus });
  };

  const handleAgentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onUpdateTask({ agent: value ? (value as Agent) : undefined });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg shadow-2xl p-8 w-full max-w-2xl text-card-foreground max-h-[80vh] flex flex-col border border-border">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h2 className="text-3xl font-bold">{task.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">ID: {task.id}</p>
            </div>
          <button onClick={onClose} className="text-2xl font-bold text-muted-foreground hover:text-foreground">&times;</button>
        </div>
        
        <div className="flex-grow overflow-y-auto pr-4 space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Status</label>
                    <select 
                        value={task.status} 
                        onChange={handleStatusChange}
                        className="w-full p-2 rounded bg-input border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    >
                        {TASK_STATUSES.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Assigned Agent</label>
                    <select
                        value={task.agent || ''}
                        onChange={handleAgentChange}
                        className="w-full p-2 rounded bg-input border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    >
                        <option value="">Automatic</option>
                        {AGENTS.map(agent => (
                            <option key={agent} value={agent}>{agent}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-foreground bg-secondary/50 p-3 rounded">{task.description}</p>
            </div>
            
            {task.dependencies && task.dependencies.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">Dependencies</h3>
                    <ul className="list-disc list-inside bg-secondary/50 p-3 rounded space-y-1">
                        {task.dependencies.map(dep => <li key={dep} className="text-muted-foreground"><span className="text-foreground">{dep}</span></li>)}
                    </ul>
                </div>
            )}
            
            <div>
                <h3 className="text-lg font-semibold mb-2">Agent Logs</h3>
                <div className="bg-background text-sm font-mono p-4 rounded-lg max-h-60 overflow-y-auto text-foreground">
                    {task.logs.length > 0 ? (
                        task.logs.map((log, index) => <div key={index} className="whitespace-pre-wrap">{log}</div>)
                    ) : (
                        <p className="text-muted-foreground">No logs for this task yet.</p>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
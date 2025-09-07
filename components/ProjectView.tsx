import React, { useState } from 'react';
import { Project, Task } from '../types';
import { useProjectOrchestrator } from '../hooks/useProjectOrchestrator';
import Header from './Header';
import OrchestrationBoard from './OrchestrationBoard';
import IdeView from './IdeView';
import { BackIcon, PlayIcon, StopIcon, GithubIcon } from './icons/Icons';
import TaskDetailsModal from './TaskDetailsModal';

interface ProjectViewProps {
  project: Project;
  onBack: () => void;
}

const ProjectView: React.FC<ProjectViewProps> = ({ project, onBack }) => {
  const orchestrator = useProjectOrchestrator(project);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  return (
    <div className="h-screen w-screen bg-background text-foreground flex flex-col overflow-hidden">
      <Header title={project.name}>
        <button onClick={onBack} className="flex items-center space-x-2 text-sm p-2 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <BackIcon className="h-5 w-5" />
            <span>Projects</span>
        </button>
        {orchestrator.githubRepoUrl && (
            <a href={orchestrator.githubRepoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-sm p-2 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                <GithubIcon className="h-5 w-5" />
                <span>Repository</span>
            </a>
        )}
        <div className="flex items-center space-x-2">
            {!orchestrator.isRunning ? (
                <button 
                  onClick={orchestrator.start} 
                  className="flex items-center bg-primary text-primary-foreground hover:opacity-90 px-4 py-2 rounded-md transition-all shadow-glow-primary"
                >
                    <PlayIcon className="h-5 w-5 mr-2" />
                    <span>Start Agents</span>
                </button>
            ) : (
                <button 
                  onClick={orchestrator.stop} 
                  className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-all"
                >
                    <StopIcon className="h-5 w-5 mr-2" />
                    <span>Stop Agents</span>
                </button>
            )}
        </div>
      </Header>
      
      <main className="flex-grow flex flex-row overflow-hidden">
          <div className="w-3/5 h-full overflow-hidden border-r border-border">
             <OrchestrationBoard 
                tasks={orchestrator.tasks} 
                activeAgents={orchestrator.activeAgents}
                blockedTaskIds={orchestrator.blockedTaskIds}
                onSelectTask={setSelectedTask}
             />
          </div>
          <div className="w-2/5 h-full overflow-hidden">
            <IdeView 
                files={orchestrator.files} 
                onFileChange={orchestrator.onFileChange} 
                terminalLogs={orchestrator.terminalLogs}
            />
          </div>
      </main>

      {selectedTask && (
        <TaskDetailsModal 
          task={selectedTask} 
          onClose={() => setSelectedTask(null)}
          onUpdateTask={(updates) => orchestrator.updateTask(selectedTask.id, updates)}
        />
      )}
    </div>
  );
};

export default ProjectView;
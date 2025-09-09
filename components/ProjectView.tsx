import React, { useState } from 'react';
import { Project, Task } from '../types';
import Header from './Header';
import Sidebar from './Sidebar';
import OrchestrationBoard from './OrchestrationBoard';
import IdeView from './IdeView';
import TaskDetailsModal from './TaskDetailsModal';
import useProjectOrchestrator from '../hooks/useProjectOrchestrator';

interface ProjectViewProps {
  project: Project;
  onBack: () => void;
}

const ProjectView: React.FC<ProjectViewProps> = ({ project, onBack }) => {
  const [viewMode, setViewMode] = useState<'orchestration' | 'ide'>('orchestration');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const {
    tasks,
    updateTask,
    activeAgents,
    blockedTaskIds,
    isRunning,
    startOrchestration,
    stopOrchestration,
    fileTree,
    updateFileContent,
    terminalOutput,
  } = useProjectOrchestrator(project);

  const handleUpdateTask = (updates: Partial<Task>) => {
    if (selectedTask) {
      updateTask(selectedTask.id, updates);
      setSelectedTask(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header title="Project View" projectName={project.name} onBack={onBack} />
      <div className="flex flex-grow overflow-hidden">
        <Sidebar
          viewMode={viewMode}
          onSetViewMode={setViewMode}
          isRunning={isRunning}
          onStart={startOrchestration}
          onStop={stopOrchestration}
        />
        <main className="flex-grow flex flex-col">
          {viewMode === 'orchestration' ? (
            <OrchestrationBoard
              tasks={tasks}
              activeAgents={activeAgents}
              blockedTaskIds={blockedTaskIds}
              onSelectTask={setSelectedTask}
            />
          ) : (
            <IdeView 
              files={fileTree} 
              onFileContentChange={updateFileContent} 
              terminalOutput={terminalOutput}
            />
          )}
        </main>
      </div>
      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdateTask={handleUpdateTask}
        />
      )}
    </div>
  );
};

export default ProjectView;

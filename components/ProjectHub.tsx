import React, { useState } from 'react';
import { Project } from '../types';
import Header from './Header';
import { GithubIcon, PlusIcon } from './icons/Icons';
import CreateProjectModal from './CreateProjectModal';

interface ProjectHubProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onCreateProject: (name: string, prompt: string) => Promise<Project>;
}

const ProjectHub: React.FC<ProjectHubProps> = ({ projects, onSelectProject, onCreateProject }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleProjectCreated = (project: Project) => {
    setIsCreateModalOpen(false);
    onSelectProject(project);
  };

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <Header title="CodeGenesis Weaver" />
        <main className="p-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {/* Create New Project */}
              <div className="bg-card border border-border rounded-lg p-6 flex flex-col items-start">
                <h3 className="text-xl font-bold text-foreground mb-2">Start from Scratch</h3>
                <p className="text-muted-foreground mb-4 flex-grow">Use an AI prompt to generate a new software development project plan.</p>
                <button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center justify-center w-full md:w-auto bg-primary text-primary-foreground hover:opacity-90 px-4 py-2 rounded-md transition-all shadow-glow-primary"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  <span>Create New Project</span>
                </button>
              </div>
              {/* Clone Repository */}
              <div className="bg-card border border-border rounded-lg p-6 flex flex-col items-start opacity-50 cursor-not-allowed">
                 <h3 className="text-xl font-bold text-foreground mb-2">Clone a Repository</h3>
                 <p className="text-muted-foreground mb-4 flex-grow">Import an existing project from a Git repository to continue your work. (Coming Soon)</p>
                 <div className="w-full flex items-center space-x-2">
                    <input 
                        type="text" 
                        placeholder="https://github.com/..."
                        disabled
                        className="flex-grow bg-input border border-border rounded-md px-3 py-2 text-sm focus:ring-primary focus:border-primary outline-none disabled:cursor-not-allowed"
                    />
                    <button disabled className="flex items-center bg-secondary text-secondary-foreground px-4 py-2 rounded-md transition-colors disabled:cursor-not-allowed">
                        <GithubIcon className="h-5 w-5 mr-2" />
                        <span>Clone</span>
                    </button>
                 </div>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-6 border-b border-border pb-3">Existing Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <div
                  key={project.id}
                  className="bg-card rounded-lg p-6 cursor-pointer border border-border hover:border-primary hover:bg-secondary transition-all flex flex-col"
                  onClick={() => onSelectProject(project)}
                >
                  <h3 className="text-xl font-bold text-primary mb-2">{project.name}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-3 flex-grow">{project.prompt}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      {isCreateModalOpen && (
        <CreateProjectModal 
          onClose={() => setIsCreateModalOpen(false)}
          onCreateProject={onCreateProject}
          onProjectCreated={handleProjectCreated}
        />
      )}
    </>
  );
};

export default ProjectHub;
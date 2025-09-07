import React from 'react';
import { Project } from '../types';
import Header from './Header';

interface ProjectHubProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

const ProjectHub: React.FC<ProjectHubProps> = ({ projects, onSelectProject }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header title="Project Hub" />
      <main className="p-8">
        <h2 className="text-3xl font-semibold mb-6">Select a Project</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div
              key={project.id}
              className="bg-card rounded-lg p-6 cursor-pointer border border-border hover:border-primary hover:bg-secondary transition-all"
              onClick={() => onSelectProject(project)}
            >
              <h3 className="text-xl font-bold text-primary mb-2">{project.name}</h3>
              <p className="text-muted-foreground">{project.prompt}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProjectHub;
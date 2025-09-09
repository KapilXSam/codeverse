import React, { useState } from 'react';
import ProjectHub from './components/ProjectHub';
import ProjectView from './components/ProjectView';
import { sampleProjects, initialFiles } from './constants';
import { Project, Task } from './types';
import { ThemeProvider } from './hooks/useTheme';
import { generateProjectPlan } from './services/geminiService';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(sampleProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleCreateProject = async (name: string, prompt: string): Promise<Project> => {
    const newTasks = await generateProjectPlan(name, prompt);
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name,
      prompt,
      tasks: newTasks,
      files: initialFiles,
    };
    setProjects(prev => [...prev, newProject]);
    return newProject;
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
  };

  if (selectedProject) {
    return (
      <ThemeProvider>
        <ProjectView project={selectedProject} onBack={() => setSelectedProject(null)} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <ProjectHub 
        projects={projects} 
        onSelectProject={handleSelectProject} 
        onCreateProject={handleCreateProject}
      />
    </ThemeProvider>
  );
};

export default App;
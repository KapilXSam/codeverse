import React, { useState } from 'react';
import ProjectHub from './components/ProjectHub';
import ProjectView from './components/ProjectView';
import { sampleProjects } from './constants';
import { Project } from './types';
import { ThemeProvider } from './hooks/useTheme';

const App: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (selectedProject) {
    return (
      <ThemeProvider>
        <ProjectView project={selectedProject} onBack={() => setSelectedProject(null)} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <ProjectHub projects={sampleProjects} onSelectProject={setSelectedProject} />
    </ThemeProvider>
  );
};

export default App;

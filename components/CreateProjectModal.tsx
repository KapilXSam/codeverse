import React, { useState } from 'react';
import { Project } from '../types';

interface CreateProjectModalProps {
  onClose: () => void;
  onCreateProject: (name: string, prompt: string) => Promise<Project>;
  onProjectCreated: (project: Project) => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onClose, onCreateProject, onProjectCreated }) => {
  const [projectName, setProjectName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim() || !prompt.trim()) {
      setError('Both project name and prompt are required.');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const newProject = await onCreateProject(projectName, prompt);
      onProjectCreated(newProject);
    } catch (err) {
      setError('Failed to create project plan. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-2xl p-8 w-full max-w-2xl text-card-foreground border border-border">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold">Create New Project</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary -mt-2 -mr-2 transition-colors">
            <span className="text-2xl font-bold text-muted-foreground hover:text-foreground">&times;</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-muted-foreground mb-2">Project Name</label>
            <input
              id="projectName"
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g., 'My Awesome App'"
              className="w-full p-2 rounded bg-input border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-muted-foreground mb-2">Project Prompt</label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={6}
              placeholder="Describe the project you want to build. Be as detailed as you like..."
              className="w-full p-2 rounded bg-input border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              disabled={isLoading}
            />
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end items-center pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-wait"
            >
              {isLoading ? 'Generating Plan...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
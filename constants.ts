import { TaskStatus, Project, FileNode } from './types';

export const TASK_STATUSES: TaskStatus[] = [
  TaskStatus.Backlog,
  TaskStatus.InProgress,
  TaskStatus.NeedsReview,
  TaskStatus.Done,
];

export const initialFiles: FileNode[] = [
    { 
      name: 'src', 
      path: '/src',
      children: [
        { name: 'App.tsx', path: '/src/App.tsx', content: 'console.log("Hello, World!");' },
        { name: 'index.tsx', path: '/src/index.tsx', content: '' },
      ] 
    },
    { name: 'package.json', path: '/package.json', content: '{ "name": "my-app" }' },
];

export const sampleProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'PhotoGallery App',
    prompt: "Build a photo gallery app using Next.js and Firebase Storage. Users should be able to upload images, view them in a responsive grid, and delete their own images. Use Tailwind CSS for styling.",
    tasks: [
      { id: 'task-1', title: 'Initialize Next.js project with Tailwind', description: 'Use create-next-app to scaffold the project.', status: TaskStatus.Done, logs: [], communications: [] },
      { id: 'task-2', title: 'Setup Firebase configuration', description: 'Create firebase.ts and add credentials.', status: TaskStatus.Done, logs: [], communications: [] },
      { id: 'task-3', title: 'Create Image Upload Component', description: 'Build a React component for uploading images.', status: TaskStatus.NeedsReview, logs: ['Code generated, awaiting review.'], agent: 'Guardian', dependencies: ['task-2'], communications: [
        { 
          id: 'msg-1', 
          timestamp: new Date(Date.now() - 5 * 60000).toISOString(), 
          from: 'Synthesizer', 
          to: 'Guardian', 
          content: 'Here is the initial implementation for the upload component. Please review the logic for handling file states.', 
          contentType: 'text' 
        },
        { 
          id: 'msg-2', 
          timestamp: new Date(Date.now() - 4 * 60000).toISOString(), 
          from: 'Synthesizer', 
          to: 'Guardian', 
          content: `import React, { useState } from 'react';\n\nconst ImageUpload = () => {\n  const [image, setImage] = useState(null);\n  // ... more code\n}`, 
          contentType: 'code'
        }
      ] },
      { id: 'task-4', title: 'Develop responsive image grid', description: 'Display uploaded images in a grid.', status: TaskStatus.Backlog, logs: [], dependencies: ['task-3'], communications: [] },
    ],
    files: initialFiles,
  }
];
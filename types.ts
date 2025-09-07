export enum TaskStatus {
  Backlog = 'Backlog',
  InProgress = 'In Progress',
  NeedsReview = 'Needs Review / Debugging',
  Done = 'Done',
}

export type Agent = 'Manager' | 'Synthesizer' | 'Guardian';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  agent?: Agent;
  logs: string[];
  dependencies?: string[];
}

export interface FileNode {
  name: string;
  path: string;
  content?: string;
  children?: FileNode[];
}

export interface Project {
  id:string;
  name: string;
  prompt: string;
  tasks: Task[];
  files: FileNode[];
}
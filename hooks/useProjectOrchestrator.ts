import { useState, useCallback, useEffect } from 'react';
import { Project, Task, FileNode, Agent, TaskStatus } from '../types';

export const useProjectOrchestrator = (initialProject: Project) => {
  const [tasks, setTasks] = useState<Task[]>(initialProject.tasks);
  const [files, setFiles] = useState<FileNode[]>(initialProject.files);
  const [terminalLogs, setTerminalLogs] = useState<string[]>(['Orchestrator initialized. Ready to start.']);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeAgents, setActiveAgents] = useState<Record<string, Agent>>({});
  const [blockedTaskIds, setBlockedTaskIds] = useState<string[]>([]);
  const [githubRepoUrl, setGithubRepoUrl] = useState<string | null>(null);

  const updateFileContent = (nodes: FileNode[], path: string, content: string): FileNode[] => {
    return nodes.map(node => {
      if (node.path === path) {
        return { ...node, content };
      }
      if (node.children) {
        // FIX: Corrected typo in recursive function call.
        return { ...node, children: updateFileContent(node.children, path, content) };
      }
      return node;
    });
  };

  const onFileChange = useCallback((path: string, content: string) => {
    setFiles(currentFiles => updateFileContent(currentFiles, path, content));
    addTerminalLog(`[IDE] File updated: ${path}`);
  }, []);
  
  const addTerminalLog = useCallback((log: string) => {
      const timestamp = new Date().toLocaleTimeString();
      setTerminalLogs(prev => [...prev, `[${timestamp}] ${log}`]);
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks(currentTasks =>
      currentTasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
    if(updates.status) {
        const taskTitle = tasks.find(t=>t.id===taskId)?.title;
        if (taskTitle) {
          addTerminalLog(`[Orchestrator] Task '${taskTitle}' status updated to ${updates.status}.`);
        }
    }
  }, [tasks, addTerminalLog]);

  const initializeGithubRepository = useCallback(async () => {
    addTerminalLog('[GitHub] Creating repository...');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    
    const repoName = initialProject.name.toLowerCase().replace(/\s+/g, '-');
    const url = `https://github.com/codeprojects/${repoName}`;
    setGithubRepoUrl(url);
    addTerminalLog(`[GitHub] Repository created successfully at ${url}`);

    addTerminalLog('[GitHub] Performing initial commit...');
    await new Promise(resolve => setTimeout(resolve, 500));
    addTerminalLog('[GitHub] Initial commit pushed to main branch.');
  }, [initialProject.name, addTerminalLog]);

  const start = useCallback(async () => {
    if (!githubRepoUrl) {
      await initializeGithubRepository();
    }
    setIsRunning(true);
    addTerminalLog('[Orchestrator] Starting agents...');
  }, [githubRepoUrl, initializeGithubRepository, addTerminalLog]);

  const stop = useCallback(() => {
    setIsRunning(false);
    setActiveAgents({});
    addTerminalLog('[Orchestrator] Stopping agents...');
  }, [addTerminalLog]);

  useEffect(() => {
    const doneTaskIds = new Set(tasks.filter(t => t.status === TaskStatus.Done).map(t => t.id));
    const newBlockedTaskIds = tasks
      .filter(t => t.dependencies && t.dependencies.some(depId => !doneTaskIds.has(depId)))
      .map(t => t.id);
    setBlockedTaskIds(newBlockedTaskIds);
  }, [tasks]);

  useEffect(() => {
    if (!isRunning) {
        setActiveAgents({});
        return;
    }

    const interval = setInterval(() => {
        if (Object.keys(activeAgents).length > 0) return;

        let taskToProcess: Task | undefined;

        taskToProcess = tasks.find(t => t.status === TaskStatus.NeedsReview && !blockedTaskIds.includes(t.id));
        if (taskToProcess) {
            const agent = taskToProcess.agent || 'Guardian';
            setActiveAgents({ [taskToProcess.id]: agent });
            addTerminalLog(`[${agent}] Reviewing '${taskToProcess.title}'.`);
            
            setTimeout(() => {
                if (isRunning) {
                    updateTask(taskToProcess!.id, { status: TaskStatus.Done, logs: [...taskToProcess!.logs, `Review passed.`] });
                    setActiveAgents({});
                }
            }, 3000);
            return;
        }

        taskToProcess = tasks.find(t => t.status === TaskStatus.Backlog && !blockedTaskIds.includes(t.id));
        if (taskToProcess) {
            const agent = taskToProcess.agent || 'Synthesizer';
            
            updateTask(taskToProcess.id, { status: TaskStatus.InProgress, agent });
            setActiveAgents({ [taskToProcess.id]: agent });
            addTerminalLog(`[${agent}] Started work on '${taskToProcess.title}'.`);

            setTimeout(() => {
                if (isRunning) {
                    updateTask(taskToProcess!.id, { status: TaskStatus.NeedsReview, logs: [...taskToProcess!.logs, `Code generated, awaiting review.`] });
                    setActiveAgents({});
                }
            }, 4000);
            return;
        }
    }, 2000);

    return () => clearInterval(interval);

  }, [isRunning, tasks, blockedTaskIds, updateTask, activeAgents, addTerminalLog]);

  return {
    tasks,
    files,
    terminalLogs,
    isRunning,
    activeAgents,
    blockedTaskIds,
    githubRepoUrl,
    start,
    stop,
    onFileChange,
    updateTask,
  };
};

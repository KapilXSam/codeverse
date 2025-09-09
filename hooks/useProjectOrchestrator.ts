import { useState, useEffect, useCallback, useMemo } from 'react';
import { Project, Task, TaskStatus, Agent, FileNode } from '../types';

// A simplified simulation of the project orchestration logic.
// In a real application, this would involve complex interactions with AI agents.
const useProjectOrchestrator = (project: Project) => {
  const [tasks, setTasks] = useState<Task[]>(project.tasks);
  const [fileTree, setFileTree] = useState<FileNode[]>(project.files);
  const [isRunning, setIsRunning] = useState(false);
  const [activeAgents, setActiveAgents] = useState<Record<string, Agent>>({});
  const [terminalOutput, setTerminalOutput] = useState<string[]>(['Welcome to the project terminal.']);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === taskId ? { ...task, ...updates } : task))
    );
  }, []);

  const addLog = useCallback((taskId: string, log: string) => {
    setTasks(prevTasks =>
        prevTasks.map(task => 
            task.id === taskId 
            ? { ...task, logs: [...task.logs, log] } 
            : task
        )
    );
  }, []);

  const updateFileContent = useCallback((path: string, content: string) => {
    const updateNode = (nodes: FileNode[]): FileNode[] => {
        return nodes.map(node => {
            if (node.path === path) {
                return { ...node, content };
            }
            if (node.children) {
                return { ...node, children: updateNode(node.children) };
            }
            return node;
        });
    };
    setFileTree(prevTree => updateNode(prevTree));
  }, []);

  const completedTaskIds = useMemo(() => 
    tasks.filter(t => t.status === TaskStatus.Done).map(t => t.id),
  [tasks]);

  const blockedTaskIds = useMemo(() =>
    tasks
      .filter(task =>
        task.dependencies &&
        task.dependencies.length > 0 &&
        !task.dependencies.every(depId => completedTaskIds.includes(depId))
      )
      .map(task => task.id),
  [tasks, completedTaskIds]);

  // Main orchestration loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const availableTasks = tasks.filter(
        task => task.status === TaskStatus.Backlog && !blockedTaskIds.includes(task.id) && !activeAgents[task.id]
      );

      if (availableTasks.length > 0) {
        // Pick a random task to "work on"
        const taskToStart = availableTasks[Math.floor(Math.random() * availableTasks.length)];
        
        // Assign a random agent for simulation
        const agent: Agent = ['Synthesizer', 'Guardian'][Math.floor(Math.random() * 2)] as Agent;
        
        setActiveAgents(prev => ({ ...prev, [taskToStart.id]: agent }));
        updateTask(taskToStart.id, { status: TaskStatus.InProgress, agent });
        addLog(taskToStart.id, `Agent ${agent} started working on task.`);
        setTerminalOutput(prev => [...prev, `[${agent}] Started: ${taskToStart.title}`]);
        
        // Simulate task completion
        setTimeout(() => {
          updateTask(taskToStart.id, { status: TaskStatus.Done });
          setActiveAgents(prev => {
            const newAgents = { ...prev };
            delete newAgents[taskToStart.id];
            return newAgents;
          });
          addLog(taskToStart.id, `Agent ${agent} completed task.`);
          setTerminalOutput(prev => [...prev, `[${agent}] Completed: ${taskToStart.title}`]);
        }, 5000 + Math.random() * 5000);
      }
    }, 2000); // Check for new tasks every 2 seconds

    return () => clearInterval(interval);
  }, [isRunning, tasks, blockedTaskIds, activeAgents, updateTask, addLog]);

  const startOrchestration = () => setIsRunning(true);
  const stopOrchestration = () => setIsRunning(false);

  return {
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
  };
};

export default useProjectOrchestrator;



import { GoogleGenAI, Type } from "@google/genai";
import { Task, TaskStatus } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Using mock data.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateProjectPlan = async (projectName: string, prompt: string): Promise<Task[]> => {
  if (!API_KEY) {
    // Return mock data if API key is not available
    return new Promise(resolve => setTimeout(() => {
        resolve([
            { id: 'mock-task-1', title: `Initialize ${projectName}`, description: 'Setup project structure, dependencies, and basic configuration.', status: TaskStatus.Backlog, logs: [] },
            { id: 'mock-task-2', title: 'Create main application component', description: 'Develop the root component for the application UI.', status: TaskStatus.Backlog, logs: [] },
            { id: 'mock-task-3', title: 'Implement core feature: User Authentication', description: 'Add user sign-up and login functionality.', status: TaskStatus.Backlog, logs: [] },
            { id: 'mock-task-4', title: 'Deploy to staging environment', description: 'Configure and execute initial deployment.', status: TaskStatus.Backlog, logs: [] },
        ]);
    }, 1500));
  }

  const userPrompt = `
    Based on the following user request, generate a detailed, step-by-step project plan.
    The plan should be a list of granular tasks for a team of AI software development agents.
    
    Project Name: "${projectName}"
    User Prompt: "${prompt}"

    Each task should have a concise title and a brief description of what needs to be done.
    The first task should always be about initializing the project.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tasks: {
              type: Type.ARRAY,
              description: "The list of development tasks.",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                    description: "A short, concise title for the task.",
                  },
                  description: {
                    type: Type.STRING,
                    description: "A brief one-sentence description of the task.",
                  },
                },
                required: ["title", "description"],
              },
            },
          },
          required: ["tasks"],
        },
      },
    });
    // FIX: Trim whitespace from the response text before parsing JSON.
    const jsonResponse = JSON.parse(response.text.trim());
    
    if (!jsonResponse.tasks || !Array.isArray(jsonResponse.tasks)) {
        throw new Error("Invalid response format from Gemini API.");
    }

    return jsonResponse.tasks.map((task: { title: string; description: string }, index: number) => ({
      id: `task-${Date.now()}-${index}`,
      title: task.title,
      description: task.description,
      status: TaskStatus.Backlog,
      logs: [],
    }));

  } catch (error) {
    console.error("Error generating project plan with Gemini:", error);
    // Fallback to mock data in case of an API error
    return [
      { id: 'err-task-1', title: 'Error generating plan', description: 'Could not connect to AI. Please try again.', status: TaskStatus.Backlog, logs: [] },
    ];
  }
};
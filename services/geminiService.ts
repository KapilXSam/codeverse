import { GoogleGenAI, Type } from "@google/genai";
import { Task, TaskStatus } from '../types';

// FIX: Initialize GoogleGenAI with a named apiKey object.
const ai = new GoogleGenAI({apiKey: process.env.API_KEY!});

export const generateProjectPlan = async (projectName: string, projectDescription: string): Promise<Task[]> => {
  // FIX: Use gemini-2.5-flash model as per guidelines.
  const model = "gemini-2.5-flash";

  const prompt = `
    You are an expert software project manager.
    Based on the project name "${projectName}" and the description "${projectDescription}", break down the project into a series of tasks.
    For each task, provide a unique ID (e.g., "task-1", "task-2"), a title, a short description, and a list of dependency IDs if any.
    The task IDs should be sequential. A task with ID "task-n" can only depend on tasks with IDs "task-1" to "task-(n-1)".
    Output the plan as a JSON array of tasks.
  `;

  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: {
          type: Type.STRING,
          description: 'A unique identifier for the task, e.g., "task-1".'
        },
        title: {
          type: Type.STRING,
          description: 'A short, descriptive title for the task.'
        },
        description: {
          type: Type.STRING,
          description: 'A longer description of what the task entails.'
        },
        dependencies: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          },
          description: 'An array of task IDs that this task depends on.'
        }
      },
      required: ['id', 'title', 'description']
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    // FIX: Access the text property directly to get the JSON string.
    const jsonResponse = response.text;
    const parsedTasks = JSON.parse(jsonResponse);
    
    if (!Array.isArray(parsedTasks)) {
      console.error("AI response is not an array of tasks:", parsedTasks);
      throw new Error("AI response is not in the expected format.");
    }

    const tasks: Task[] = parsedTasks.map(t => ({
      ...t,
      status: TaskStatus.Backlog,
      logs: [],
      communications: [],
      agent: undefined, // Agent will be assigned by the orchestrator
      dependencies: t.dependencies || []
    }));

    return tasks;

  } catch (error) {
    console.error("Error generating project plan:", error);
    throw new Error("Failed to generate project plan with Gemini API.");
  }
};

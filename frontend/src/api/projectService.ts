import axiosClient from "./axiosClient";

export enum PostType {
  PROJECT = "PROJECT",
  STORY = "STORY",
}

export interface ProjectResponseDTO {
  id: number;
  founderId: number;
  title: string;
  description: string;
  technologyStack: string;
  postType: PostType;
  totalOpenings: number;
  filledOpenings: number;
  isActive: boolean;
  createdAt: string; // LocalDateTime comes as an ISO string in JSON
  updatedAt: string;
}

export const projectService = {
  // POST /api/projects
  // The founderId is injected by the Gateway
  createProject: async (projectData: any): Promise<ProjectResponseDTO> => {
    const response = await axiosClient.post("/api/projects", projectData);
    return response.data;
  },

  // POST /api/projects/stories
  createStory: async (storyData: any): Promise<ProjectResponseDTO> => {
    const response = await axiosClient.post("/api/projects/stories", storyData);
    return response.data;
  },

  // GET /api/projects/feed
  getStoryFeed: async (): Promise<ProjectResponseDTO[]> => {
    const response = await axiosClient.get("/api/projects/feed");
    return response.data;
  },

  // GET /api/projects/openings
  getProjectOpenings: async (): Promise<ProjectResponseDTO[]> => {
    const response = await axiosClient.get("/api/projects/openings");
    return response.data;
  },

  // GET /api/projects/{id}
  getProjectById: async (id: number): Promise<ProjectResponseDTO> => {
    const response = await axiosClient.get(`/api/projects/${id}`);
    return response.data;
  },

  // DELETE /api/projects/{id}
  // The Gateway ensures only the owner (matching founderId) can delete
  deleteProject: async (id: number): Promise<string> => {
    const response = await axiosClient.delete(`/api/projects/${id}`);
    return response.data;
  },
};

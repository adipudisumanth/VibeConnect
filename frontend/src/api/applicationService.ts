import axiosClient from "./axiosClient";

export enum ApplicationStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export interface ApplicationDTO {
  applicationId?: number;
  projectId: number;
  userId: number;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
}

export const applicationService = {
  // @PostMapping
  createApplication: async (data: Partial<ApplicationDTO>): Promise<string> => {
    const response = await axiosClient.post("/api/applications", data);
    return response.data;
  },

  // @GetMapping("/project/{projectId}")
  getApplicationsByProject: async (
    projectId: number,
  ): Promise<ApplicationDTO[]> => {
    const response = await axiosClient.get(
      `/api/applications/project/${projectId}`,
    );
    return response.data;
  },

  // @GetMapping("/user/{userId}")
  getApplicationsByUser: async (userId: number): Promise<ApplicationDTO[]> => {
    const response = await axiosClient.get(`/api/applications/user/${userId}`);
    return response.data;
  },

  // @PutMapping("/{applicationId}/status")
  // Note: status is passed as a @RequestParam in your backend
  updateStatus: async (
    applicationId: number,
    status: ApplicationStatus,
  ): Promise<string> => {
    const response = await axiosClient.put(
      `/api/applications/${applicationId}/status`,
      null,
      {
        params: { status },
      },
    );
    return response.data;
  },
};

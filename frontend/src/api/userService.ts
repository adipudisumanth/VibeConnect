import axiosClient from "./axiosClient";

export interface UserResponseDTO {
  id: number;
  email: string;
  fullName: string;
  role: string;
  skillsAndVibes: string;
}

export interface AuthResponse {
  token: string;
  user: UserResponseDTO;
}

export const userService = {
  // @PostMapping("/register")
  register: async (data: any): Promise<AuthResponse> => {
    const response = await axiosClient.post("/api/users/register", data);
    return response.data;
  },

  // @PostMapping("/login")
  login: async (data: any): Promise<AuthResponse> => {
    const response = await axiosClient.post("/api/users/login", data);
    return response.data;
  },

  // @GetMapping("/{id}")
  getProfile: async (id: number): Promise<UserResponseDTO> => {
    const response = await axiosClient.get(`/api/users/${id}`);
    return response.data;
  },

  // @PutMapping("/{id}")
  updateProfile: async (id: number, data: any): Promise<UserResponseDTO> => {
    const response = await axiosClient.put(`/api/users/${id}`, data);
    return response.data;
  },

  // @GetMapping("/role/{role}")
  getUsersByRole: async (role: string): Promise<UserResponseDTO[]> => {
    const response = await axiosClient.get(`/api/users/role/${role}`);
    return response.data;
  },

  forgotPassword: async (email: string): Promise<string> => {
    return await axiosClient.post("/api/users/forgot-password", { email });
  },

  resetPassword: async (data: { email: string, otp: string, newPassword: string }): Promise<string> => {
    return await axiosClient.post("/api/users/reset-password", data);
  }

};

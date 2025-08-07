const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface SignInRequest {
  phone: string;
  password: string;
}

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  userType: 'candidate' | 'recruiter';
  company?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    phone: string;
    userType: 'candidate' | 'recruiter';
    status: string;
    adminRole?: 'admin' | 'super_admin';
    profile?: {
      firstName: string;
      lastName: string;
    };
    company?: {
      name: string;
    };
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          message: 'Une erreur est survenue',
          statusCode: response.status,
        }));
        
        throw new Error(errorData.message || `Erreur ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erreur de connexion au serveur');
    }
  }

  async signIn(data: SignInRequest): Promise<AuthResponse> {
    // Format phone number for backend (remove spaces)
    const formattedData = {
      ...data,
      phone: data.phone.replace(/\s/g, ''),
    };
    
    return this.request<AuthResponse>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(formattedData),
    });
  }

  async signUp(data: SignUpRequest): Promise<AuthResponse> {
    // Format phone number for backend (remove spaces)
    const formattedData = {
      ...data,
      phone: data.phone.replace(/\s/g, ''),
    };
    
    return this.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(formattedData),
    });
  }

  async getProfile(): Promise<any> {
    return this.request('/auth/profile');
  }

  async refreshToken(): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/refresh', {
      method: 'POST',
    });
  }

  // Profile endpoints
  async getUserProfile(): Promise<any> {
    return this.request('/profiles/me');
  }

  async updateUserProfile(data: any): Promise<any> {
    return this.request('/profiles/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Skills endpoints
  async getAllSkills(): Promise<any> {
    return this.request('/skills');
  }

  async getUserSkills(): Promise<any> {
    return this.request('/users/me/skills');
  }

  async addUserSkill(skillData: any): Promise<any> {
    return this.request('/users/me/skills', {
      method: 'POST',
      body: JSON.stringify(skillData),
    });
  }

  async updateUserSkill(skillId: string, skillData: any): Promise<any> {
    return this.request(`/users/me/skills/${skillId}`, {
      method: 'PUT',
      body: JSON.stringify(skillData),
    });
  }

  async removeUserSkill(skillId: string): Promise<any> {
    return this.request(`/users/me/skills/${skillId}`, {
      method: 'DELETE',
    });
  }

  // Experience endpoints
  async getUserExperiences(): Promise<any> {
    return this.request('/users/me/experiences');
  }

  async addUserExperience(experienceData: any): Promise<any> {
    return this.request('/users/me/experiences', {
      method: 'POST',
      body: JSON.stringify(experienceData),
    });
  }

  async updateUserExperience(id: string, experienceData: any): Promise<any> {
    return this.request(`/users/me/experiences/${id}`, {
      method: 'PUT',
      body: JSON.stringify(experienceData),
    });
  }

  async deleteUserExperience(id: string): Promise<any> {
    return this.request(`/users/me/experiences/${id}`, {
      method: 'DELETE',
    });
  }

  // Education endpoints
  async getUserEducation(): Promise<any> {
    return this.request('/users/me/education');
  }

  async addUserEducation(educationData: any): Promise<any> {
    return this.request('/users/me/education', {
      method: 'POST',
      body: JSON.stringify(educationData),
    });
  }

  async updateUserEducation(id: string, educationData: any): Promise<any> {
    return this.request(`/users/me/education/${id}`, {
      method: 'PUT',
      body: JSON.stringify(educationData),
    });
  }

  async deleteUserEducation(id: string): Promise<any> {
    return this.request(`/users/me/education/${id}`, {
      method: 'DELETE',
    });
  }

  // Job offers endpoints
  async getJobOffers(filters?: any): Promise<any> {
    const queryString = filters ? new URLSearchParams(filters).toString() : '';
    return this.request(`/jobs${queryString ? `?${queryString}` : ''}`);
  }

  async getJobOffer(id: string): Promise<any> {
    return this.request(`/jobs/${id}`);
  }

  async getMyJobOffers(filters?: any): Promise<any> {
    const queryString = filters ? new URLSearchParams(filters).toString() : '';
    return this.request(`/jobs/my-jobs${queryString ? `?${queryString}` : ''}`);
  }

  async createJobOffer(jobData: any): Promise<any> {
    return this.request('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  async updateJobOffer(id: string, jobData: any): Promise<any> {
    return this.request(`/jobs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(jobData),
    });
  }

  async deleteJobOffer(id: string): Promise<any> {
    return this.request(`/jobs/${id}`, {
      method: 'DELETE',
    });
  }

  // Applications endpoints
  async getUserApplications(): Promise<any> {
    return this.request('/applications/me');
  }

  async applyToJob(jobId: string, applicationData: any): Promise<any> {
    return this.request('/applications', {
      method: 'POST',
      body: JSON.stringify({ jobOfferId: jobId, ...applicationData }),
    });
  }

  async getApplication(id: string): Promise<any> {
    return this.request(`/applications/${id}`);
  }

  // Documents endpoints
  async uploadDocument(file: File, type: string = 'cv'): Promise<any> {
    console.log('=== CLIENT UPLOAD START ===');
    console.log('File to upload:', {
      name: file.name,
      size: file.size,
      type: file.type
    });
    console.log('Upload type:', type);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const token = localStorage.getItem('auth_token');
    console.log('Auth token present:', !!token);
    console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
    
    try {
      console.log('Sending request to:', `${this.baseURL}/documents/upload`);
      
      const response = await fetch(`${this.baseURL}/documents/upload`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          // Don't set Content-Type, let browser set it for FormData
        },
        body: formData,
      });

      console.log('Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('=== CLIENT UPLOAD ERROR ===');
        console.error('Response status:', response.status);
        console.error('Response text:', errorText);
        throw new Error(`Erreur lors de l'upload: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('=== CLIENT UPLOAD SUCCESS ===');
      console.log('Upload result:', result);
      return result;
    } catch (error) {
      console.error('=== CLIENT UPLOAD CATCH ERROR ===');
      console.error('Upload error:', error);
      throw error;
    }
  }

  async uploadProfilePhoto(file: File): Promise<any> {
    return this.uploadDocument(file, 'avatar');
  }

  async getUserDocuments(): Promise<any> {
    return this.request('/documents/me');
  }

  async deleteDocument(id: string): Promise<any> {
    return this.request(`/documents/${id}`, {
      method: 'DELETE',
    });
  }

  // Analytics/Stats endpoints
  async getUserStats(): Promise<any> {
    return this.request('/analytics/me/stats');
  }

  async getProfileViews(): Promise<any> {
    return this.request('/analytics/me/profile-views');
  }

  // Recruiter-specific endpoints
  async searchCandidates(filters: any = {}): Promise<any> {
    const queryString = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => queryString.append(key, v.toString()));
        } else {
          queryString.append(key, value.toString());
        }
      }
    });

    return this.request(`/candidates/search${queryString.toString() ? `?${queryString.toString()}` : ''}`);
  }

  async getBookmarkedCandidates(): Promise<any> {
    return this.request('/candidates/bookmarked');
  }

  async toggleCandidateBookmark(candidateId: string): Promise<any> {
    return this.request(`/candidates/${candidateId}/bookmark`, {
      method: 'POST',
    });
  }

  async getRecruiterStats(): Promise<any> {
    return this.request('/recruiters/me/stats');
  }

  async getCandidateProfile(candidateId: string): Promise<any> {
    return this.request(`/candidates/${candidateId}`);
  }

  // Admin job management endpoints
  async getAdminJobs(filters: any = {}): Promise<any> {
    const queryString = filters ? new URLSearchParams(filters).toString() : '';
    return this.request(`/admin/jobs${queryString ? `?${queryString}` : ''}`);
  }

  async getRecruiterJobs(filters: any = {}): Promise<any> {
    const queryString = filters ? new URLSearchParams(filters).toString() : '';
    return this.request(`/admin/jobs${queryString ? `?${queryString}` : ''}`);
  }

  async createAdminJob(jobData: any): Promise<any> {
    return this.request('/admin/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  async updateAdminJob(id: string, jobData: any): Promise<any> {
    return this.request(`/admin/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
  }

  async deleteAdminJob(id: string): Promise<any> {
    return this.request(`/admin/jobs/${id}`, {
      method: 'DELETE',
    });
  }

  async updateRecruiterJob(id: string, jobData: any): Promise<any> {
    return this.request(`/admin/recruiter-jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
  }
}

export const apiClient = new ApiClient();

// Auth utilities
export const authUtils = {
  setToken: (token: string) => {
    localStorage.setItem('auth_token', token);
  },
  
  getToken: (): string | null => {
    return localStorage.getItem('auth_token');
  },
  
  removeToken: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  },
  
  setUser: (user: any) => {
    localStorage.setItem('user_data', JSON.stringify(user));
  },
  
  getUser: () => {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },
  
  isAuthenticated: (): boolean => {
    return !!authUtils.getToken();
  },
  
  logout: () => {
    authUtils.removeToken();
    window.location.href = '/auth/signin';
  }
};
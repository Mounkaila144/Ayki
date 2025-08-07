const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export interface AdminDashboardStats {
  totalCandidates: number;
  totalRecruiters: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsersThisMonth: number;
  recentLogins: number;
  totalJobOffers: number;
  totalApplications: number;
  applicationsThisMonth: number;
  scheduledInterviews: number;
  candidateProfileCompletion: number;
  recruiterProfileCompletion: number;
}

export interface AdminUserFilter {
  userType?: 'candidate' | 'recruiter';
  status?: 'active' | 'inactive' | 'suspended' | 'pending';
  search?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  company?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
}

export interface AdminPagination {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface AdminUser {
  id: string;
  phone: string;
  userType: 'candidate' | 'recruiter';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  adminRole?: 'admin' | 'super_admin';
  lastLoginAt?: string;
  emailVerifiedAt?: string;
  phoneVerifiedAt?: string;
  createdAt: string;
  updatedAt: string;
  profile?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    title?: string;
    location?: string;
    summary?: string;
    avatar?: string;
    profileCompletion: number;
    profileViews: number;
    rating: number;
  };
  company?: {
    id: string;
    name: string;
    description?: string;
    industry?: string;
    size?: string;
    website?: string;
    logo?: string;
  };
  experiences?: any[];
  educations?: any[];
  skills?: any[];
  documents?: any[];
  applications?: any[];
  jobOffers?: any[];
}

export interface AdminUsersResponse {
  data: AdminUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminUpdateUserStatus {
  status: 'active' | 'inactive' | 'suspended' | 'pending';
}

class AdminApiClient {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erreur réseau' }));
      throw new Error(error.message || `Erreur HTTP ${response.status}`);
    }
    return response.json();
  }

  async getDashboardStats(): Promise<AdminDashboardStats> {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<AdminDashboardStats>(response);
  }

  async getCandidates(
    filters: AdminUserFilter = {},
    pagination: AdminPagination = {}
  ): Promise<AdminUsersResponse> {
    const params = new URLSearchParams();
    
    Object.entries({ ...filters, ...pagination }).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/admin/candidates?${params}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<AdminUsersResponse>(response);
  }

  async getRecruiters(
    filters: AdminUserFilter = {},
    pagination: AdminPagination = {}
  ): Promise<AdminUsersResponse> {
    const params = new URLSearchParams();
    
    Object.entries({ ...filters, ...pagination }).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/admin/recruiters?${params}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<AdminUsersResponse>(response);
  }

  async getUserById(id: string): Promise<AdminUser> {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<AdminUser>(response);
  }

  async updateUserStatus(id: string, status: AdminUpdateUserStatus): Promise<AdminUser> {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}/status`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(status),
    });
    return this.handleResponse<AdminUser>(response);
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<{ message: string }>(response);
  }
}

export const adminApiClient = new AdminApiClient();

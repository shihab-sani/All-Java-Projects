const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface ApiError {
  message: string;
  status: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(token?: string): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async request<T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
      body?: unknown;
      token?: string;
    } = {}
  ): Promise<T> {
    const { method = 'GET', body, token } = options;
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        method,
        headers: this.getHeaders(token),
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const error: ApiError = {
          message: `HTTP ${response.status}`,
          status: response.status,
        };
        throw error;
      }

      if (response.status === 204) {
        return null as T;
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  }

  async register(data: unknown) {
    return this.request('/auth/register', {
      method: 'POST',
      body: data,
    });
  }

  async validateToken(token: string) {
    return this.request('/auth/validate', {
      method: 'POST',
      token,
    });
  }

  // Worker endpoints
  async getWorkersByCategory(category: string, token?: string) {
    return this.request(`/workers/category/${category}`, { token });
  }

  async getWorkersByCity(city: string, token?: string) {
    return this.request(`/workers/city/${city}`, { token });
  }

  async getNearbyWorkers(serviceCategory: string, city: string, token?: string) {
    return this.request(
      `/workers/nearby?serviceCategory=${serviceCategory}&city=${city}`,
      { token }
    );
  }

  async searchWorkers(
    serviceCategory?: string,
    latitude?: number,
    longitude?: number,
    radiusKm: number = 10,
    token?: string
  ) {
    const params = new URLSearchParams();
    if (serviceCategory) params.append('serviceCategory', serviceCategory);
    if (latitude) params.append('latitude', latitude.toString());
    if (longitude) params.append('longitude', longitude.toString());
    params.append('radiusKm', radiusKm.toString());

    return this.request(`/workers/search?${params.toString()}`, { token });
  }

  async getWorkerProfile(workerId: number, token?: string) {
    return this.request(`/workers/${workerId}`, { token });
  }

  async getVerifiedWorkers(token?: string) {
    return this.request('/workers/verified', { token });
  }

  async updateWorkerAvailability(workerId: number, isAvailable: boolean, token?: string) {
    return this.request(`/workers/${workerId}/availability?isAvailable=${isAvailable}`, {
      method: 'PUT',
      token,
    });
  }

  async updateWorkerHourlyRate(workerId: number, hourlyRate: number, token?: string) {
    return this.request(`/workers/${workerId}/hourly-rate?hourlyRate=${hourlyRate}`, {
      method: 'PUT',
      token,
    });
  }

  // Booking endpoints
  async createBooking(
    customerId: number,
    workerId: number,
    serviceCategory: string,
    jobDescription: string,
    hourlyRate: number,
    estimatedHours: number,
    scheduledDate: string,
    token?: string
  ) {
    const params = new URLSearchParams({
      customerId: customerId.toString(),
      workerId: workerId.toString(),
      serviceCategory,
      jobDescription,
      hourlyRate: hourlyRate.toString(),
      estimatedHours: estimatedHours.toString(),
      scheduledDate,
    });

    return this.request(`/bookings?${params.toString()}`, {
      method: 'POST',
      token,
    });
  }

  async getBookingDetails(bookingId: number, token?: string) {
    return this.request(`/bookings/${bookingId}`, { token });
  }

  async getCustomerBookings(customerId: number, token?: string) {
    return this.request(`/bookings/customer/${customerId}`, { token });
  }

  async getWorkerBookings(workerId: number, token?: string) {
    return this.request(`/bookings/worker/${workerId}`, { token });
  }

  async acceptBooking(bookingId: number, token?: string) {
    return this.request(`/bookings/${bookingId}/accept`, {
      method: 'PUT',
      token,
    });
  }

  async startBooking(bookingId: number, token?: string) {
    return this.request(`/bookings/${bookingId}/start`, {
      method: 'PUT',
      token,
    });
  }

  async completeBooking(bookingId: number, actualHours: number, token?: string) {
    return this.request(`/bookings/${bookingId}/complete?actualHours=${actualHours}`, {
      method: 'PUT',
      token,
    });
  }

  async cancelBooking(bookingId: number, token?: string) {
    return this.request(`/bookings/${bookingId}/cancel`, {
      method: 'PUT',
      token,
    });
  }

  async addReview(
    bookingId: number,
    reviewerId: number,
    rating: number,
    review: string,
    token?: string
  ) {
    const params = new URLSearchParams({
      reviewerId: reviewerId.toString(),
      rating: rating.toString(),
      review,
    });

    return this.request(`/bookings/${bookingId}/review?${params.toString()}`, {
      method: 'POST',
      token,
    });
  }

  async markAsPaid(bookingId: number, token?: string) {
    return this.request(`/bookings/${bookingId}/pay`, {
      method: 'PUT',
      token,
    });
  }
}

export const apiClient = new ApiClient();

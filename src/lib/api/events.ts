import { api } from "./base";
import type {
  BackendEvent,
  BackendEventRegistration,
  EventCreateRequest,
  EventRegisterRequest,
} from "../../types/api";

// Events API endpoints
export const eventsAPI = {
  // Get all events (public)
  getAll: async (): Promise<BackendEvent[]> => {
    return api.get<BackendEvent[]>("/events");
  },

  // Search events (public)
  search: async (params: {
    keyword?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<BackendEvent[]> => {
    const queryParams = new URLSearchParams();
    if (params.keyword) queryParams.append("keyword", params.keyword);
    if (params.location) queryParams.append("location", params.location);
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);
    return api.get<BackendEvent[]>(`/events/search?${queryParams.toString()}`);
  },

  // Get filtered events (authenticated - college context)
  getFiltered: async (params?: {
    by?: string;
    upcoming?: boolean;
  }): Promise<BackendEvent[] | { total: number; events: BackendEvent[] }> => {
    const queryParams = new URLSearchParams();
    if (params?.by) queryParams.append("by", params.by);
    if (params?.upcoming !== undefined)
      queryParams.append("upcoming", params.upcoming.toString());
    return api.get<BackendEvent[] | { total: number; events: BackendEvent[] }>(
      `/events/filter?${queryParams.toString()}`
    );
  },

  // Get event by ID (public)
  getById: async (id: string): Promise<BackendEvent> => {
    return api.get<BackendEvent>(`/events/${id}`);
  },

  // Create event (authenticated - verified alumni/college)
  create: async (data: EventCreateRequest): Promise<BackendEvent> => {
    return api.post<BackendEvent>("/events", data);
  },

  // Update event (authenticated - organizer only)
  update: async (
    id: string,
    data: Partial<EventCreateRequest>
  ): Promise<{
    message: string;
    event: BackendEvent;
  }> => {
    return api.put<{
      message: string;
      event: BackendEvent;
    }>(`/events/${id}`, data);
  },

  // Delete event (authenticated - organizer only)
  delete: async (id: string): Promise<{ message: string }> => {
    return api.delete<{ message: string }>(`/events/${id}`);
  },

  // Get my organized events (authenticated)
  getMyOrganized: async (): Promise<BackendEvent[]> => {
    return api.get<BackendEvent[]>("/events/my/organized");
  },

  // Register for event (authenticated - verified student only)
  register: async (
    data: EventRegisterRequest
  ): Promise<{
    message: string;
    registration: BackendEventRegistration;
  }> => {
    return api.post<{
      message: string;
      registration: BackendEventRegistration;
    }>("/events/register", data);
  },

  // Get my registrations (authenticated - student only)
  getMyRegistrations: async (): Promise<BackendEventRegistration[]> => {
    return api.get<BackendEventRegistration[]>("/events/my/registrations");
  },

  // Get event registrations (authenticated - organizer only)
  getEventRegistrations: async (
    eventId: string
  ): Promise<BackendEventRegistration[]> => {
    return api.get<BackendEventRegistration[]>(
      `/events/${eventId}/registrations`
    );
  },

  // Update registration status (authenticated - organizer only)
  updateRegistrationStatus: async (
    registrationId: string,
    status: string
  ): Promise<{
    message: string;
    registration: BackendEventRegistration;
  }> => {
    return api.put<{
      message: string;
      registration: BackendEventRegistration;
    }>(`/events/registrations/${registrationId}/status`, { status });
  },

  // Cancel registration (authenticated - student only)
  cancelRegistration: async (
    registrationId: string
  ): Promise<{ message: string }> => {
    return api.delete<{ message: string }>(
      `/events/registrations/${registrationId}`
    );
  },
};

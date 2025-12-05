import { api } from "./base";
import type {
  BackendCampaign,
  BackendContribution,
  CampaignCreateRequest,
} from "../../types/api";

// Campaigns API endpoints
export const campaignsAPI = {
  // Get all campaigns (public)
  getAll: async (): Promise<BackendCampaign[]> => {
    return api.get<BackendCampaign[]>("/campaigns");
  },

  // Get active campaigns (public)
  getActive: async (): Promise<BackendCampaign[]> => {
    return api.get<BackendCampaign[]>(
      "/campaigns/active"
    );
  },

  // Get campaign by ID (public)
  getById: async (
    id: string
  ): Promise<BackendCampaign> => {
    return api.get<BackendCampaign>(`/campaigns/${id}`);
  },

  // Create campaign (authenticated - college only)
  create: async (
    data: CampaignCreateRequest
  ): Promise<{
    message: string;
    campaign: BackendCampaign;
  }> => {
    return api.post<{
      message: string;
      campaign: BackendCampaign;
    }>("/campaigns", data);
  },

  // Update campaign (authenticated - college owner only)
  update: async (
    id: string,
    data: Partial<CampaignCreateRequest>
  ): Promise<{
    message: string;
    campaign: BackendCampaign;
  }> => {
    return api.put<{
      message: string;
      campaign: BackendCampaign;
    }>(`/campaigns/${id}`, data);
  },

  // Delete campaign (authenticated - college owner only)
  delete: async (id: string): Promise<{ message: string }> => {
    return api.delete<{ message: string }>(`/campaigns/${id}`);
  },

  // Get my campaigns (authenticated - college only)
  getMyCampaigns: async (): Promise<BackendCampaign[]> => {
    return api.get<BackendCampaign[]>(
      "/campaigns/my/campaigns"
    );
  },

  // Get campaign statistics (authenticated - college owner only)
  getCampaignStats: async (
    campaignId: string
  ): Promise<{
    totalRaised: number;
    totalVolunteeringHours: number;
    countFinancialContributors: number;
    countVolunteeringContributors: number;
  }> => {
    return api.get<{
      totalRaised: number;
      totalVolunteeringHours: number;
      countFinancialContributors: number;
      countVolunteeringContributors: number;
    }>(`/campaigns/${campaignId}/stats`);
  },

  // Get campaign contributions (authenticated - college owner only)
  getCampaignContributions: async (
    campaignId: string
  ): Promise<BackendContribution[]> => {
    return api.get<BackendContribution[]>(
      `/campaigns/${campaignId}/contributions`
    );
  },

  // Contribute financially (authenticated - verified alumni/student)
  contributeFinancial: async (data: {
    campaignId: string;
    amount: number;
    paymentMethod: string;
  }): Promise<{
    message: string;
    contribution: BackendContribution;
  }> => {
    return api.post<{
      message: string;
      contribution: BackendContribution;
    }>("/campaigns/contribute/financial", data);
  },

  // Contribute volunteer hours (authenticated - verified alumni/student)
  contributeVolunteer: async (data: {
    campaignId: string;
    hours: number;
    date: string;
  }): Promise<{
    message: string;
    contribution: BackendContribution;
  }> => {
    return api.post<{
      message: string;
      contribution: BackendContribution;
    }>("/campaigns/contribute/volunteer", data);
  },

  // Get my contributions (authenticated)
  getMyContributions: async (): Promise<BackendContribution[]> => {
    return api.get<BackendContribution[]>(
      "/campaigns/my/contributions"
    );
  },
};


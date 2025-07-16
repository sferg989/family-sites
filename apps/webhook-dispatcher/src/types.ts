export interface Environment {
  readonly GITHUB_TOKEN: string;
  readonly GITHUB_REPO: string;
  readonly GITHUB_API_URL: string;
}

export interface HygraphWebhookPayload {
  readonly operation: string;
  readonly data: {
    readonly id: string;
    readonly __typename: string;
    readonly stage: string;
  };
}

export interface GitHubDispatchPayload {
  readonly event_type: string;
  readonly client_payload?: Record<string, unknown>;
}

export interface GitHubApiResponse {
  readonly status: number;
  readonly statusText: string;
} 
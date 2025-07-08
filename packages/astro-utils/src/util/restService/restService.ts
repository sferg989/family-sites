import { type ResponseOf, Methods } from './restTypes';

type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

export const defaultHeaders: Record<string, string> = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
};

export interface IRestService {
  Get<T>(
    uri: string,
    additionalHeaders?: Record<string, string>,
    defaultHeaderOverrides?: Record<string, string>
  ): Promise<ResponseOf<T>>;

  Post<T>(
    uri: string,
    body: string,
    additionalHeaders?: Record<string, string>,
    defaultHeaderOverrides?: Record<string, string>
  ): Promise<ResponseOf<T>>;

  Patch<T>(
    uri: string,
    body: string,
    additionalHeaders?: Record<string, string>,
  ): Promise<ResponseOf<T>>;

  Put<T>(
    uri: string,
    body: string,
    additionalHeaders?: Record<string, string>,
  ): Promise<ResponseOf<T>>;

  Delete<T>(
    uri: string,
    additionalHeaders?: Record<string, string>,
  ): Promise<ResponseOf<T>>;
}

export class RestService implements IRestService {
  private static instance: IRestService | null = null;

  public static Instance(fetchRef: Fetch = global.fetch.bind(globalThis)): IRestService {
    return this.instance || (this.instance = new RestService(fetchRef));
  }

  public static Destroy() {
    this.instance = null;
  }

  private constructor(private fetchRef: Fetch) {}

  public async Get<T>(
    uri: string,
    additionalHeaders?: Record<string, string>,
    defaultHeaderOverrides?: Record<string, string>
  ): Promise<ResponseOf<T>> {
    return await this.getRequestResponse(
      uri,
      Methods.Get,
      undefined,
      additionalHeaders,
      defaultHeaderOverrides
    );
  }

  public async Post<T>(
    uri: string,
    body: string,
    additionalHeaders?: Record<string, string>,
    defaultHeaderOverrides?: Record<string, string>
  ): Promise<ResponseOf<T>> {
    return await this.getRequestResponse(
      uri,
      Methods.Post,
      body,
      additionalHeaders,
      defaultHeaderOverrides
    );
  }

  public async Patch<T>(
    uri: string,
    body: string,
    additionalHeaders?: Record<string, string>
  ): Promise<ResponseOf<T>> {
    return await this.getRequestResponse(
      uri,
      Methods.Patch,
      body,
      additionalHeaders
    );
  }

  public async Put<T>(
    uri: string,
    body: string,
    additionalHeaders?: Record<string, string>
  ): Promise<ResponseOf<T>> {
    return await this.getRequestResponse(
      uri,
      Methods.Put,
      body,
      additionalHeaders
    );
  }

  public async Delete<T>(
    uri: string,
    additionalHeaders?: Record<string, string>
  ): Promise<ResponseOf<T>> {
    return await this.getRequestResponse(
      uri,
      Methods.Delete,
      undefined,
      additionalHeaders
    );
  }

  private async getRequestResponse<T>(
    uri: string,
    method: Methods,
    body?: string,
    additionalHeaders?: Record<string, string>,
    defaultHeaderOverrides?: Record<string, string>
  ): Promise<ResponseOf<T>> {
    const response = await this.fetchRef(uri, {
      method: method,
      headers: { ...(defaultHeaderOverrides || defaultHeaders), ...additionalHeaders },
      ...(body !== undefined && { body })
    });

    if (response.ok) {
      return {
        body: response.status !== 204 && response.body
          ? await response.json().catch(() => null)
          : null,
        status: response.status,
        ok: response.ok
      };
    } else {
      return { body: {} as T, status: response.status, ok: false };
    }
  }
}

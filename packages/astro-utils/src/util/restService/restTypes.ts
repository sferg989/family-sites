

export enum Methods {
  Get = 'GET',
  Post = 'POST',
  Patch = 'PATCH',
  Put = 'PUT',
  Delete = 'DELETE'
}

export type ResponseOf<T> = {
  body: T
  status: number
  ok: boolean
  errors?: Error[]
};

export type ApiDataResponse<T> = {
  type: string;
  id: string;
  attributes: T;
};

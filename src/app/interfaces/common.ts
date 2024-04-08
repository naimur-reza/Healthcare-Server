export interface IAuth {
  email: string;
  role: string;
}

export interface IOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}

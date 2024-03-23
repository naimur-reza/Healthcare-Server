export interface IParams {
  name?: string;
  email?: string;
  searchTerm?: string;
}

export interface IOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}

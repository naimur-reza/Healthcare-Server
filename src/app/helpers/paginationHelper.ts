export interface IOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}

export const calculatePagination = (options: IOptions) => {
  const page: number = Number(options.page) || 1;
  const limit: number = Number(options.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy: string = options.sortBy || "createdAt";
  const sortOrder: string = options.sortOrder || "asc";

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};
